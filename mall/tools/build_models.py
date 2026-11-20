#!/usr/bin/env python3
"""Download Poly Haven models (CC0) and pack them for the mall engine.

Writes:
  models/geometry.bin   every mesh: float32 vertices [px,py,pz, nx,ny,nz, u,v, layer] then uint32 indices
  models/tex/L<n>_a.webp albedo (+alpha) for texture layer n, models/tex/L<n>_n.jpg normal.xy + roughness
  js/models.js          MODELS = {name: {v0, vn, i0, in, bb:[x0,y0,z0,x1,y1,z1]}}, MODEL_LAYERS = n

Usage: python3 tools/build_models.py            (from the mall/ folder)
Add a model by putting its Poly Haven id in PROPS below (keep it under ~30k triangles; big ones pick a LOD).
Cards and trunks for foliage are generated here too (FOLIAGE).
"""
import json, os, struct, sys, urllib.request, io, math
import numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CACHE = os.environ.get('PH_CACHE', '/tmp/ph_cache')
TEX = 512
os.makedirs(CACHE, exist_ok=True)
os.makedirs(os.path.join(ROOT, 'models', 'tex'), exist_ok=True)

# Poly Haven model id -> triangle budget (the lightest LOD under budget is used)
PROPS = {
 'WoodenChair_01':25e3, 'ArmChair_01':25e3, 'Sofa_01':30e3, 'Ottoman_01':20e3, 'CoffeeTable_01':20e3,
 'WoodenTable_02':20e3, 'bar_chair_round_01':20e3, 'modern_coffee_table_01':20e3,
 'Barrel_01':10e3, 'barrel_03':15e3, 'wooden_crate_01':10e3,
 'planter_pot_clay':10e3, 'ceramic_vase_02':10e3, 
 'Chandelier_01':30e3, 'hanging_industrial_lamp':15e3,
 'steel_frame_shelves_01':20e3, 'steel_frame_shelves_02':20e3, 'Shelf_01':15e3, 'wooden_bookshelf_worn':25e3,
 'CashRegister_01':15e3, 'CoffeeCart_01':30e3, 'WetFloorSign_01':5e3, 'Television_01':15e3, 'boombox':15e3,
 'metal_trash_can':10e3, 'lifebuoy':10e3, 
 'food_apple_01':5e3, 'croissant':10e3, 'carrot_cake':10e3, 'lemon':5e3, 
 'Ukulele_01':15e3,
 'bronze_whale_statue':30e3, 'bronze_shark_statue':30e3, 
 'fern_02':10e3, 'moss_01':15e3,
}
# foliage cards: (name, poly haven id, texture key prefix, card width, card height, uv crop u0,v0,u1,v1)
FOLIAGE = [
 ('card_fir', 'fir_tree_01', 'twig', 2.2, 2.2, (.16, 0, 1, .76)),
 ('card_pine', 'pine_tree_01', 'twig', 1.2, 2.4, (.0, 0, .23, .47)),
 ('card_broad', 'island_tree_01', 'leaves', 1.6, 1.6, (0, 0, 1, 1)),
 ('card_jacaranda', 'jacaranda_tree', 'leaves', 2.0, 2.0, (0, 0, 1, 1)),
 ('card_shrub', 'shrub_01', '', 1.2, 1.2, (0, 0, 1, .8)),
 ('card_fern', 'fern_02', '', 1.2, 1.2, (0, 0, 1, 1)),
 ('card_grass', 'grass_medium_01', '', 1.6, .5, (0, .74, 1, 1)),
]
BARK = [('trunk_fir', 'fir_tree_01', 'bark'), ('trunk_broad', 'island_tree_01', '')]

def get(url, name=None):
    path = os.path.join(CACHE, name or url.split('/')[-1])
    if not os.path.exists(path):
        req = urllib.request.Request(url, headers={'User-Agent': 'mall-model-builder'})
        with urllib.request.urlopen(req) as r, open(path, 'wb') as f: f.write(r.read())
    return path

def files(asset): return json.load(open(get(f'https://api.polyhaven.com/files/{asset}', f'{asset}.files.json')))

layers = []   # list of (albedo RGBA image, nr RGB image)
def add_layer(diff, alpha=None, nor=None, rough=None, arm=None, tint=None):
    a = Image.open(diff).convert('RGB').resize((TEX, TEX), Image.LANCZOS)
    A = Image.open(alpha).convert('L').resize((TEX, TEX), Image.LANCZOS) if alpha else Image.new('L', (TEX, TEX), 255)
    rgba = Image.merge('RGBA', (*a.split(), A))
    if nor: n = Image.open(nor).convert('RGB').resize((TEX, TEX), Image.LANCZOS)
    else: n = Image.new('RGB', (TEX, TEX), (128, 128, 255))
    if arm: r = Image.open(arm).convert('RGB').resize((TEX, TEX), Image.LANCZOS).split()[1]
    elif rough: r = Image.open(rough).convert('L').resize((TEX, TEX), Image.LANCZOS)
    else: r = Image.new('L', (TEX, TEX), 200)
    nr = Image.merge('RGB', (n.split()[0], n.split()[1], r))
    layers.append((rgba, nr)); return len(layers) - 1

def tex_url(info, key, kind):
    k = f'{key}_{kind}' if key else {'diff': 'Diffuse', 'alpha': 'Alpha', 'rough': 'Rough'}.get(kind, kind)
    if k in info: return info[k]['1k']['jpg']['url']
    return None

V, I, MODELS = [], [], {}
def add_mesh(name, verts, idx):
    v = np.asarray(verts, np.float32).reshape(-1, 9); ix = np.asarray(idx, np.uint32)
    v0 = sum(len(x) for x in V) // 9; i0 = sum(len(x) for x in I)
    V.append(v.ravel()); I.append(ix)
    bb = [float(x) for x in (*v[:, :3].min(0), *v[:, :3].max(0))]
    MODELS[name] = {'v0': v0, 'vn': len(v), 'i0': i0, 'in': len(ix), 'bb': [round(x, 3) for x in bb]}
    print(f'  {name:28s} {len(ix)//3:7d} tris')

ACC_N = {'SCALAR': 1, 'VEC2': 2, 'VEC3': 3, 'VEC4': 4, 'MAT4': 16}
ACC_T = {5126: 'f4', 5125: 'u4', 5123: 'u2', 5121: 'u1'}
def accessor(g, bins, i):
    a = g['accessors'][i]; bv = g['bufferViews'][a['bufferView']]
    n = ACC_N[a['type']]; dt = np.dtype(ACC_T[a['componentType']]).newbyteorder('<')
    off = bv.get('byteOffset', 0) + a.get('byteOffset', 0); stride = bv.get('byteStride', 0) or n * dt.itemsize
    buf = bins[bv['buffer']]
    arr = np.ndarray((a['count'], n), dtype=dt, buffer=buf, offset=off, strides=(stride, dt.itemsize))
    return np.array(arr, dtype=np.float32 if dt.kind == 'f' else np.uint32)

def trs(node):
    if 'matrix' in node: return np.array(node['matrix'], np.float64).reshape(4, 4).T
    M = np.eye(4)
    if 'scale' in node: M = np.diag([*node['scale'], 1]) @ M
    if 'rotation' in node:
        x, y, z, w = node['rotation']
        R = np.array([[1-2*(y*y+z*z), 2*(x*y-z*w), 2*(x*z+y*w)], [2*(x*y+z*w), 1-2*(x*x+z*z), 2*(y*z-x*w)], [2*(x*z-y*w), 2*(y*z+x*w), 1-2*(x*x+y*y)]])
        Rm = np.eye(4); Rm[:3, :3] = R; M = Rm @ M
    if 'translation' in node: T = np.eye(4); T[:3, 3] = node['translation']; M = T @ M
    return M

def import_model(asset, budget):
    info = files(asset); g1 = info['gltf']['1k']['gltf']
    gpath = get(g1['url'], f'{asset}.gltf'); g = json.load(open(gpath))
    bins = [open(get(info['gltf']['1k']['gltf']['include'][b['uri']]['url'], f'{asset}_{os.path.basename(b["uri"])}'), 'rb').read() for b in g['buffers']]
    # material -> texture layer
    mat_layer = {}
    def layer_for(mi):
        if mi in mat_layer: return mat_layer[mi]
        m = g['materials'][mi]; pbr = m.get('pbrMetallicRoughness', {})
        def img(ti):
            uri = g['images'][g['textures'][ti]['source']]['uri']
            return get(g1['include'][uri]['url'], f'{asset}_{os.path.basename(uri)}')
        diff = img(pbr['baseColorTexture']['index']) if 'baseColorTexture' in pbr else None
        nor = img(m['normalTexture']['index']) if 'normalTexture' in m else None
        arm = img(pbr['metallicRoughnessTexture']['index']) if 'metallicRoughnessTexture' in pbr else None
        if diff is None:
            c = pbr.get('baseColorFactor', [.7, .7, .7, 1]); p = os.path.join(CACHE, f'{asset}_m{mi}_col.png')
            Image.new('RGB', (8, 8), tuple(int(255 * x ** (1 / 2.2)) for x in c[:3])).save(p); diff = p
        mat_layer[mi] = add_layer(diff, nor=nor, arm=arm); return mat_layer[mi]
    # collect primitives per LOD group
    prims = []
    def walk(ni, M):
        n = g['nodes'][ni]; M2 = M @ trs(n)
        if 'mesh' in n:
            for p in g['meshes'][n['mesh']]['primitives']: prims.append((n.get('name', ''), p, M2))
        for c in n.get('children', []): walk(c, M2)
    for r in g['scenes'][g.get('scene', 0)]['nodes']: walk(r, np.eye(4))
    def lod_of(name):
        u = name.upper()
        return int(u.split('LOD')[-1][:1]) if 'LOD' in u and u.split('LOD')[-1][:1].isdigit() else 0
    lods = sorted(set(lod_of(n) for n, _, _ in prims))
    def tris(l): return sum(g['accessors'][p['indices']]['count'] // 3 for n, p, _ in prims if lod_of(n) == l)
    chosen = next((l for l in lods if tris(l) <= budget), lods[-1])
    if tris(chosen) > budget * 1.25: raise ValueError(f'{tris(chosen)} triangles is over budget')
    verts, idx = [], []
    for n, p, M in prims:
        if lod_of(n) != chosen: continue
        pos = accessor(g, bins, p['attributes']['POSITION'])
        nor = accessor(g, bins, p['attributes']['NORMAL']) if 'NORMAL' in p['attributes'] else np.tile([0, 1, 0], (len(pos), 1))
        uv = accessor(g, bins, p['attributes']['TEXCOORD_0']) if 'TEXCOORD_0' in p['attributes'] else np.zeros((len(pos), 2))
        P = (np.c_[pos, np.ones(len(pos))] @ M.T)[:, :3]; N = nor @ np.linalg.inv(M[:3, :3])
        N /= np.maximum(np.linalg.norm(N, axis=1, keepdims=True), 1e-6)
        lay = layer_for(p.get('material', 0)) if 'materials' in g else 0
        base = len(verts)
        verts.extend(np.c_[P, N, uv, np.full(len(P), lay)].tolist())
        ix = accessor(g, bins, p['indices']).ravel() if 'indices' in p else np.arange(len(P))
        idx.extend((ix + base).tolist())
    v = np.array(verts, np.float32)
    v[:, 0] -= (v[:, 0].min() + v[:, 0].max()) / 2; v[:, 2] -= (v[:, 2].min() + v[:, 2].max()) / 2; v[:, 1] -= v[:, 1].min()
    add_mesh(asset, v, idx)

def card(name, w, h, lay, crop=(0, 0, 1, 1)):
    U = lambda u: crop[0] + (crop[2] - crop[0]) * u; W = lambda v: crop[1] + (crop[3] - crop[1]) * v
    # two crossed quads, double-sided by the shader; pivot at the card's base
    v, ix = [], []
    for k, a in enumerate([0, math.pi / 2]):
        c, s = math.cos(a), math.sin(a); b = len(v)
        for (x, y, uu, vv) in [(-w / 2, 0, 0, 1), (w / 2, 0, 1, 1), (w / 2, h, 1, 0), (-w / 2, h, 0, 0)]:
            v.append([x * c, y, x * s, -s, 0, c, U(uu), W(vv), lay])
        ix += [b, b + 1, b + 2, b, b + 2, b + 3]
    add_mesh(name, v, ix)

def flat_card(name, w, h, lay, crop=(0, 0, 1, 1)):
    u0, v0, u1, v1 = crop
    v = [[-w/2, 0, 0, 0, 0, 1, u0, v1, lay], [w/2, 0, 0, 0, 0, 1, u1, v1, lay], [w/2, h, 0, 0, 0, 1, u1, v0, lay], [-w/2, h, 0, 0, 0, 1, u0, v0, lay]]
    add_mesh(name, v, [0, 1, 2, 0, 2, 3])

def cylinder(name, r0, r1, h, seg, lay, rep=2):
    v, ix = [], []
    rings = 6
    for j in range(rings + 1):
        t = j / rings; r = r0 + (r1 - r0) * t
        for i in range(seg + 1):
            a = i / seg * 2 * math.pi; c, s = math.cos(a), math.sin(a)
            v.append([r * c, h * t, r * s, c, (r0 - r1) / h, s, i / seg * rep, t * h / (2 * math.pi * r0 / rep), lay])
    for j in range(rings):
        for i in range(seg):
            a = j * (seg + 1) + i; b = a + seg + 1; ix += [a, b, a + 1, a + 1, b, b + 1]
    add_mesh(name, v, ix)

def main():
    print('foliage')
    for name, asset, key, w, h, crop in FOLIAGE:
        info = files(asset)
        diff = get(tex_url(info, key, 'diff'), f'{asset}_{key}_diff.jpg')
        al = tex_url(info, key, 'alpha'); alpha = get(al, f'{asset}_{key}_alpha.jpg') if al else None
        if alpha is None:  # leaves photographed on black: key the background out
            im = np.asarray(Image.open(diff).convert('RGB')).astype(np.float32)
            m = np.clip((im.max(2) - 18) * 6, 0, 255).astype(np.uint8); alpha = os.path.join(CACHE, f'{asset}_{key}_keyed.png'); Image.fromarray(m).save(alpha)
        nor = tex_url(info, key, 'nor_gl'); arm = tex_url(info, key, 'arm')
        lay = add_layer(diff, alpha=alpha, nor=get(nor, f'{asset}_{key}_nor.jpg') if nor else None, arm=get(arm, f'{asset}_{key}_arm.jpg') if arm else None)
        card(name, w, h, lay, crop); flat_card(name + '_flat', w, h, lay, crop)
    for name, asset, key in BARK:
        info = files(asset)
        lay = add_layer(get(tex_url(info, key, 'diff'), f'{asset}_{key}_bdiff.jpg'), nor=get(tex_url(info, key, 'nor_gl'), f'{asset}_{key}_bnor.jpg'), arm=get(tex_url(info, key, 'arm'), f'{asset}_{key}_barm.jpg'))
        cylinder(name, 1, .55, 1, 12, lay)
    print('props')
    for asset, budget in PROPS.items():
        try: import_model(asset, budget)
        except Exception as e: print(f'  {asset:28s} SKIPPED ({e})')
    out = os.path.join(ROOT, 'models')
    vb = np.concatenate(V).astype(np.float32).tobytes(); ib = np.concatenate(I).astype(np.uint32).tobytes()
    with open(os.path.join(out, 'geometry.bin'), 'wb') as f: f.write(vb); f.write(ib)
    for n, (a, nr) in enumerate(layers):
        a.save(os.path.join(out, 'tex', f'L{n}_a.webp'), quality=88, method=5); nr.save(os.path.join(out, 'tex', f'L{n}_n.jpg'), quality=88)
    meta = {'vbytes': len(vb), 'ibytes': len(ib), 'layers': len(layers), 'models': MODELS}
    with open(os.path.join(ROOT, 'js', 'models.js'), 'w') as f:
        f.write('// generated by tools/build_models.py from Poly Haven (CC0) models\nconst MODELS=' + json.dumps(meta, separators=(',', ':')) + ';\n')
    print(f'{len(MODELS)} meshes, {len(layers)} texture layers, geometry {len(vb)+len(ib)} bytes')

if __name__ == '__main__': main()
