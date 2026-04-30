import * as THREE from "three/webgpu";
import { LDrawLoader } from "three/examples/jsm/loaders/LDrawLoader.js";
import { LDrawConditionalLineMaterial as LDrawConditionalLineNodeMaterial } from "three/examples/jsm/materials/LDrawConditionalLineNodeMaterial.js";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

export interface OptimizedModel {
  group: THREE.Group;
  size: number;
  height: number;
  drawCalls: number;
  brickCount: number;
}

// Module-scoped so the LDraw parts cache survives across views (splash →
// article → build). Exported so the build view shares the same loader
// instance — otherwise each route would refetch the parts library.
let loaderPromise: Promise<LDrawLoader> | null = null;
export function getLDrawLoader(): Promise<LDrawLoader> {
  if (loaderPromise) return loaderPromise;
  const loader = new LDrawLoader();
  loader.setPartsLibraryPath("https://lego-ldraw-cdn.baconbrix.workers.dev/");
  loader.setConditionalLineMaterial(LDrawConditionalLineNodeMaterial);
  loader.smoothNormals = false;
  loaderPromise = loader.preloadMaterials("https://lego-ldraw-cdn.baconbrix.workers.dev/LDConfig.ldr").then(() => loader);
  return loaderPromise;
}

// Cache the top-level .ldr file text per filename. The article view fetches
// it on entry; the build view reuses the cached text instead of round-tripping
// again. Sub-parts are cached internally by LDrawLoader.
const modelTextCache = new Map<string, Promise<string>>();
export function fetchModelText(filename: string): Promise<string> {
  const hit = modelTextCache.get(filename);
  if (hit) return hit;
  const p = fetch(`/lego/models/${encodeURIComponent(filename)}`).then((res) => {
    if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${filename}`);
    return res.text();
  });
  p.catch(() => modelTextCache.delete(filename));
  modelTextCache.set(filename, p);
  return p;
}

/**
 * Splash/article load path: merge every brick by material so the whole
 * model lands in a handful of draw calls. No per-layer split, no build-wave
 * shader — just a static optimized group.
 *
 * `targetHeight` rescales the model so downstream camera/light/annotation
 * tuning happens in unitless space rather than raw LDU.
 */
export async function loadOptimizedModel(
  filename: string,
  targetHeight: number,
): Promise<OptimizedModel> {
  const text = await fetchModelText(filename);

  const loader = await getLDrawLoader();
  const raw = await new Promise<THREE.Group>((resolve, reject) => {
    loader.parse(
      text,
      (g: THREE.Group) => resolve(g),
      (err: unknown) => reject(err),
    );
  });

  raw.updateMatrixWorld(true);

  let brickCount = 0;
  raw.traverse((o) => {
    if ((o as THREE.Mesh).isMesh) brickCount++;
  });

  upgradeMaterials(raw);

  const buckets = new Map<THREE.Material, THREE.BufferGeometry[]>();
  const oldMeshes: THREE.Mesh[] = [];
  raw.traverse((o) => {
    if ((o as THREE.Mesh).isMesh) oldMeshes.push(o as THREE.Mesh);
  });
  for (const mesh of oldMeshes) {
    const mat = (Array.isArray(mesh.material) ? mesh.material[0] : mesh.material) as
      | THREE.Material
      | undefined;
    if (!mat) continue;
    const g = mesh.geometry.clone();
    g.applyMatrix4(mesh.matrixWorld);
    let arr = buckets.get(mat);
    if (!arr) {
      arr = [];
      buckets.set(mat, arr);
    }
    arr.push(g);
  }

  const merged = new THREE.Group();
  for (const [mat, geoms] of buckets) {
    const m = mergeGeometries(geoms, false);
    if (!m) continue;
    m.computeBoundingBox();
    m.computeBoundingSphere();
    const mesh = new THREE.Mesh(m, mat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    merged.add(mesh);
    geoms.forEach((g) => g.dispose());
  }
  for (const mesh of oldMeshes) mesh.geometry.dispose();

  const box = new THREE.Box3().setFromObject(merged);
  const center = new THREE.Vector3();
  box.getCenter(center);
  for (const child of merged.children) {
    child.position.x -= center.x;
    child.position.z -= center.z;
    child.position.y -= box.min.y;
    child.updateMatrix();
  }

  const rawSize = new THREE.Vector3();
  box.getSize(rawSize);
  const scale = targetHeight / Math.max(rawSize.y, 1);
  merged.scale.setScalar(scale);
  merged.updateMatrixWorld(true);

  const finalBox = new THREE.Box3().setFromObject(merged);
  const finalSize = new THREE.Vector3();
  finalBox.getSize(finalSize);

  let drawCalls = 0;
  merged.traverse((o) => {
    if ((o as THREE.Mesh).isMesh) drawCalls++;
  });

  return {
    group: merged,
    size: Math.max(finalSize.x, finalSize.y, finalSize.z),
    height: finalSize.y,
    drawCalls,
    brickCount,
  };
}

/**
 * Swap LDraw's MeshStandardMaterial for MeshStandardNodeMaterial so it lights
 * correctly under the WebGPU node pipeline. We deliberately avoid the
 * Physical/clearcoat variant — its clearcoat normals misbehave on merged
 * brick meshes and end up showing through opaque surfaces.
 */
function upgradeMaterials(group: THREE.Object3D) {
  const cache = new Map<THREE.Material, THREE.Material>();
  const upgrade = (m: THREE.Material): THREE.Material => {
    const cached = cache.get(m);
    if (cached) return cached;
    const std = m as THREE.MeshStandardMaterial;
    if (!("roughness" in std)) {
      cache.set(m, m);
      return m;
    }
    const isTransparent = std.transparent === true || (std.opacity ?? 1) < 1;
    const node = new THREE.MeshStandardNodeMaterial({
      color: std.color?.clone(),
      transparent: isTransparent,
      opacity: std.opacity ?? 1,
      side: std.side,
      vertexColors: std.vertexColors,
      metalness: 0,
      roughness: isTransparent ? 0.18 : 0.42,
      envMapIntensity: 1.0,
      depthWrite: !isTransparent,
    });
    cache.set(m, node);
    return node;
  };
  group.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (!mesh.isMesh) return;
    if (Array.isArray(mesh.material)) {
      mesh.material = mesh.material.map(upgrade);
    } else if (mesh.material) {
      mesh.material = upgrade(mesh.material);
    }
  });
}

export function disposeOptimizedModel(model: OptimizedModel) {
  const mats = new Set<THREE.Material>();
  model.group.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (!mesh.isMesh) return;
    mesh.geometry?.dispose();
    const arr = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    for (const m of arr) if (m) mats.add(m);
  });
  for (const m of mats) m.dispose();
}
