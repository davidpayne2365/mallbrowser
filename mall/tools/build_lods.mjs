// Adds lighter versions (levels of detail) of every heavy model to models/geometry.bin, for drawing far away.
// The simplified meshes reuse the original vertices, so only extra index data is appended.
// Run after tools/build_models.py:   cd tools && npm install && node build_lods.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { MeshoptSimplifier } from 'meshoptimizer';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const JS = path.join(ROOT, 'js', 'models.js'), BIN = path.join(ROOT, 'models', 'geometry.bin');
// [share of triangles to aim for, largest allowed error relative to the model's size]
const LEVELS = [[0.25, 0.01], [0.06, 0.04]];
const MIN_TRIS = 300;

await MeshoptSimplifier.ready;
const src = fs.readFileSync(JS, 'utf8');
const head = src.slice(0, src.indexOf('const MODELS='));
const meta = JSON.parse(src.slice(src.indexOf('{'), src.lastIndexOf('}') + 1));
const bin = fs.readFileSync(BIN);
const ibase = meta.ibase ?? meta.ibytes;            // run twice and it starts from the original indices again
const verts = new Float32Array(bin.buffer, bin.byteOffset, meta.vbytes / 4);
const idx = new Uint32Array(bin.buffer.slice(bin.byteOffset + meta.vbytes, bin.byteOffset + meta.vbytes + ibase));
const extra = [];
let at = ibase / 4, before = 0, after = 0;
for (const [name, m] of Object.entries(meta.models)) {
  delete m.lod;
  if (m.in / 3 < MIN_TRIS) continue;
  const pos = verts.subarray(m.v0 * 9, (m.v0 + m.vn) * 9);
  const ind = idx.subarray(m.i0, m.i0 + m.in);
  m.lod = [];
  let prev = m.in;
  for (const [ratio, err] of LEVELS) {
    const target = Math.max(36, Math.floor(m.in * ratio / 3) * 3);
    const [out] = MeshoptSimplifier.simplify(ind, pos, 9, target, err, []);
    if (out.length >= prev * 0.8) continue;          // not worth a level
    m.lod.push({ i0: at, in: out.length });
    extra.push(out); at += out.length; prev = out.length;
  }
  before += m.in / 3; after += (m.lod.at(-1)?.in ?? m.in) / 3;
  console.log(name.padEnd(26), m.in / 3, '->', m.lod.map(l => l.in / 3).join(' -> '));
}
const ex = new Uint32Array(at - ibase / 4); let o = 0; for (const e of extra) { ex.set(e, o); o += e.length; }
fs.writeFileSync(BIN, Buffer.concat([bin.subarray(0, meta.vbytes), Buffer.from(idx.buffer), Buffer.from(ex.buffer)]));
meta.ibase = ibase; meta.ibytes = ibase + ex.byteLength;
fs.writeFileSync(JS, head + 'const MODELS=' + JSON.stringify(meta) + ';\n');
console.log(`farthest level keeps ${Math.round(after)} of ${Math.round(before)} triangles; added ${ex.byteLength} bytes`);
