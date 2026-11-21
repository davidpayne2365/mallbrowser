// Run after tools/build_models.py:   cd tools && npm install && node build_lods.mjs
// 1. Caps each prop's full-detail mesh at CAP triangles (shop props are small on screen; this keeps the download small).
// 2. Adds lighter versions (levels of detail) of every model, which the engine draws when it is far away.
// 3. Drops vertices nothing uses any more and rewrites models/geometry.bin and js/models.js.
//    Vertices are packed into 16 bytes: position + texture layer as float16x4, normal as snorm8x4, uv as float16x2.
// Running it again is safe: it always starts from the full-detail mesh it finds.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { MeshoptSimplifier } from 'meshoptimizer';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const JS = path.join(ROOT, 'js', 'models.js'), BIN = path.join(ROOT, 'models', 'geometry.bin');
const CAP = 4000;                                   // triangles, full detail
const LEVELS = [[0.25, 0.01], [0.06, 0.04]];        // [share of triangles, largest error relative to the model's size]
const MIN_TRIS = 300;

await MeshoptSimplifier.ready;
const src = fs.readFileSync(JS, 'utf8');
const head = src.slice(0, src.indexOf('const MODELS='));
const meta = JSON.parse(src.slice(src.indexOf('{'), src.lastIndexOf('}') + 1));
const bin = fs.readFileSync(BIN);
// float16 helpers
const f32 = new Float32Array(1), u32 = new Uint32Array(f32.buffer);
const toHalf = v => { f32[0] = v; const x = u32[0], s = (x >>> 16) & 0x8000; let e = ((x >>> 23) & 0xff) - 112, m = x & 0x7fffff;
  if (e <= 0) return s; if (e >= 31) return s | 0x7c00; const r = (m >>> 13) + ((m >>> 12) & 1); return r >= 1024 ? s | ((e + 1) << 10) : s | (e << 10) | r; };
const fromHalf = h => { const s = h & 0x8000 ? -1 : 1, e = (h >>> 10) & 31, m = h & 1023; return e ? s * Math.pow(2, e - 15) * (1 + m / 1024) : s * Math.pow(2, -14) * (m / 1024); };
const raw = bin.buffer.slice(bin.byteOffset, bin.byteOffset + meta.vbytes);
let verts;
if (meta.packed) { // unpack a file this tool wrote before
  const n = meta.vbytes / 16, h = new Uint16Array(raw), b = new Int8Array(raw); verts = new Float32Array(n * 9);
  for (let i = 0; i < n; i++) { const o = i * 9, q = i * 8; verts[o] = fromHalf(h[q]); verts[o + 1] = fromHalf(h[q + 1]); verts[o + 2] = fromHalf(h[q + 2]); verts[o + 8] = fromHalf(h[q + 3]);
    for (let k = 0; k < 3; k++) verts[o + 3 + k] = b[i * 16 + 8 + k] / 127; verts[o + 6] = fromHalf(h[q + 6]); verts[o + 7] = fromHalf(h[q + 7]); }
} else verts = new Float32Array(raw);
const idx = new Uint32Array(bin.buffer.slice(bin.byteOffset + meta.vbytes, bin.byteOffset + meta.vbytes + (meta.ibase ?? meta.ibytes)));
const simplify = (ind, pos, tris, err) => MeshoptSimplifier.simplify(ind, pos, 9, Math.max(36, Math.floor(tris) * 3), err, [])[0];
const outV = [], outI = [];
let vAt = 0, iAt = 0, before = 0, after = 0;
for (const [name, m] of Object.entries(meta.models)) {
  const pos = verts.subarray(m.v0 * 9, (m.v0 + m.vn) * 9);
  let base = idx.slice(m.i0, m.i0 + m.in);
  const card = name.startsWith('card_');
  // small things get fewer triangles: under 35 cm across 1200, under 1 m 2500, otherwise CAP
  const b = m.bb, size = Math.hypot(b[3] - b[0], b[4] - b[1], b[5] - b[2]), cap = size < .35 ? 1200 : size < 1 ? 2500 : CAP;
  if (!card && base.length / 3 > cap) {
    for (const err of [0.005, 0.01, 0.02, 0.04, 0.08, 0.15]) { const s = simplify(base, pos, cap, err); if (s.length / 3 <= cap * 1.1) { base = s; break; } if (err === 0.15) base = s; }
    // meshes made of many separate pieces can refuse to simplify; fall back to the coarser 'sloppy' method
    if (base.length / 3 > cap * 1.5 && MeshoptSimplifier.simplifySloppy) base = MeshoptSimplifier.simplifySloppy(base, pos, 9, cap * 3, 0.02)[0] ?? base;
  }
  const levels = [base];
  if (!card && base.length / 3 >= MIN_TRIS) {
    let prev = base.length;
    for (const [ratio, err] of LEVELS) { const s = simplify(base, pos, base.length / 3 * ratio, err); if (s.length < prev * 0.8) { levels.push(s); prev = s.length; } }
  }
  // keep only the vertices these meshes use, renumbered from 0
  const map = new Int32Array(m.vn).fill(-1); let n = 0;
  for (const L of levels) for (const v of L) if (map[v] < 0) map[v] = n++;
  const nv = new Float32Array(n * 9);
  for (let v = 0; v < m.vn; v++) if (map[v] >= 0) nv.set(pos.subarray(v * 9, v * 9 + 9), map[v] * 9);
  outV.push(nv);
  const ranges = levels.map(L => { const r = new Uint32Array(L.length); for (let k = 0; k < L.length; k++) r[k] = map[L[k]]; outI.push(r); const g = { i0: iAt, in: r.length }; iAt += r.length; return g; });
  before += m.in / 3; after += ranges[0].in / 3;
  console.log(name.padEnd(28), String(m.in / 3).padStart(6), '->', ranges.map(g => g.in / 3).join(' -> '));
  m.v0 = vAt; m.vn = n; vAt += n; m.i0 = ranges[0].i0; m.in = ranges[0].in;
  if (ranges.length > 1) m.lod = ranges.slice(1); else delete m.lod;
}
const all = Float32Array.from(outV.flatMap(a => Array.from(a))), nV = all.length / 9, pk = new ArrayBuffer(nV * 16), ph = new Uint16Array(pk), pb = new Int8Array(pk);
for (let i = 0; i < nV; i++) { const o = i * 9, q = i * 8; ph[q] = toHalf(all[o]); ph[q + 1] = toHalf(all[o + 1]); ph[q + 2] = toHalf(all[o + 2]); ph[q + 3] = toHalf(all[o + 8]);
  for (let k = 0; k < 3; k++) pb[i * 16 + 8 + k] = Math.round(Math.max(-1, Math.min(1, all[o + 3 + k])) * 127); pb[i * 16 + 11] = 0; ph[q + 6] = toHalf(all[o + 6]); ph[q + 7] = toHalf(all[o + 7]); }
const V = Buffer.from(pk), I = Buffer.concat(outI.map(a => Buffer.from(a.buffer)));
fs.writeFileSync(BIN, Buffer.concat([V, I]));
meta.vbytes = V.length; meta.ibytes = I.length; meta.packed = 1; delete meta.ibase;
fs.writeFileSync(JS, head + 'const MODELS=' + JSON.stringify(meta) + ';\n');
console.log(`full detail: ${Math.round(before)} -> ${Math.round(after)} triangles; geometry.bin ${((V.length + I.length) / 1e6).toFixed(1)} MB`);
