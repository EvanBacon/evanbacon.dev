import { useEffect, useRef, useState } from "react";
import {
  Canvas,
  extend,
  useFrame,
  useThree,
  type ThreeToJSXElements,
} from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import * as THREE from "three/webgpu";
import {
  attribute,
  positionLocal,
  saturate,
  uniform,
  vec3,
  type ShaderNodeObject,
} from "three/tsl";
import { LDrawLoader } from "three/examples/jsm/loaders/LDrawLoader.js";
import { LDrawConditionalLineMaterial as LDrawConditionalLineNodeMaterial } from "three/examples/jsm/materials/LDrawConditionalLineNodeMaterial.js";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

declare module "@react-three/fiber" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface ThreeElements extends ThreeToJSXElements<typeof THREE> {}
}

extend(THREE as unknown as Record<string, unknown>);

// The workshop view always loads the Batman build — the article rejoins
// this view at chapter VIII, and the rest of the collection isn't shipped
// yet. Hard-coding it dodges a /api/models round-trip.
const MODEL_FILE = "Batman.ldr";

// Build-wave animation tuning (seconds). Bottom-up sweep climbs through
// every brick; each individual brick fades + drops in over `BRICK_DURATION`
// once the wave reaches it.
const SWEEP_DURATION = 1.6;
const BRICK_DURATION = 0.35;
const BUILD_TOTAL = SWEEP_DURATION + BRICK_DURATION;

type TimeUniform = ReturnType<typeof uniform>;

interface BuildAnim {
  time: TimeUniform;
  total: number;
  startedAt: number | null;
}

interface LayerData {
  index: number;
  centerX: number;
  centerY: number;
  centerZ: number;
  brickCount: number;
  group: THREE.Group;
  meshGroup: THREE.Group;
  lineGroup: THREE.Group;
}

interface LoadedModel {
  name: string;
  group: THREE.Group;
  size: number;
  groundY: number;
  drawCalls: number;
  brickCount: number;
  build: BuildAnim;
  layers: LayerData[];
}

// ---- Shared LDrawLoader so the parts cache survives across navigations --
let loaderPromise: Promise<LDrawLoader> | null = null;
function getLoader(): Promise<LDrawLoader> {
  if (loaderPromise) return loaderPromise;
  const loader = new LDrawLoader();
  loader.setPartsLibraryPath("https://lego-ldraw-cdn.baconbrix.workers.dev/");
  loader.setConditionalLineMaterial(LDrawConditionalLineNodeMaterial);
  loader.smoothNormals = false;
  loaderPromise = loader.preloadMaterials("https://lego-ldraw-cdn.baconbrix.workers.dev/LDConfig.ldr").then(() => loader);
  return loaderPromise;
}

// ---- Geometry pipeline --------------------------------------------------

/**
 * Wires LDraw's standard materials onto MeshStandardNodeMaterial and
 * attaches a TSL position node that "pops" each brick in from above:
 *
 *   - Before its buildTime, the brick is at scale 0 (collapsed to a single
 *     point — no rendered fragments, no shadow leak).
 *   - It scales up from its own centroid AND drops from `dropHeight` into
 *     place over BRICK_DURATION.
 *
 * Scaling-from-zero avoids needing transparency, so opaque bricks stay
 * fully opaque (no z-sort artefacts) while LDraw's actual trans pieces
 * keep their original alpha.
 */
function buildPlasticMaterials(
  group: THREE.Object3D,
  dropHeight: number,
): TimeUniform {
  const time = uniform(0);
  const buildTime = attribute("buildTime", "float");
  const centroid = attribute("brickCentroid", "vec3");
  const localProgress = saturate(
    time.sub(buildTime).div(BRICK_DURATION),
  ) as ShaderNodeObject<THREE.Node>;
  const scale = localProgress;
  const drop = localProgress.oneMinus().mul(dropHeight);
  const offsetFromCentroid = positionLocal.sub(centroid).mul(scale);
  const positionAnimated = centroid.add(offsetFromCentroid).add(vec3(0, drop, 0));

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
    const phys = new THREE.MeshStandardNodeMaterial({
      color: std.color?.clone(),
      transparent: isTransparent,
      opacity: std.opacity ?? 1,
      side: std.side,
      vertexColors: std.vertexColors,
      metalness: 0,
      roughness: isTransparent ? 0.2 : 0.45,
      envMapIntensity: 1.0,
      depthWrite: !isTransparent,
    });

    phys.positionNode = positionAnimated;

    cache.set(m, phys);
    return phys;
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

  return time;
}

/**
 * Cluster bricks into instruction layers by their `centerY`. Voxelized
 * Rubrick models have a discrete set of Y heights with regular gaps; we
 * use the median non-zero gap as the cluster threshold so bricks at the
 * same Y become one layer and a jump to the next height starts a new one.
 */
function detectLayers(centerYs: number[]): { layerIdx: number[]; layerCount: number } {
  const n = centerYs.length;
  if (n === 0) return { layerIdx: [], layerCount: 0 };

  const order = Array.from({ length: n }, (_, i) => i);
  order.sort((a, b) => centerYs[a]! - centerYs[b]!);

  const gaps: number[] = [];
  for (let k = 1; k < n; k++) {
    const g = centerYs[order[k]!]! - centerYs[order[k - 1]!]!;
    if (g > 1e-3) gaps.push(g);
  }
  let threshold = 0.5;
  if (gaps.length) {
    gaps.sort((a, b) => a - b);
    const median = gaps[Math.floor(gaps.length / 2)]!;
    threshold = Math.max(median * 0.5, 0.5);
  }

  const layerIdx = new Array<number>(n);
  let cur = -1;
  let prevY = -Infinity;
  for (let k = 0; k < n; k++) {
    const i = order[k]!;
    const y = centerYs[i]!;
    if (y - prevY > threshold) cur++;
    layerIdx[i] = cur;
    prevY = y;
  }
  return { layerIdx, layerCount: cur + 1 };
}

/**
 * Bake every brick's world matrix into its geometry, cluster bricks into
 * instruction layers (bottom-up), then merge by (layer, material) so each
 * layer is its own toggleable sub-group with one draw call per material.
 */
function mergeByMaterialAndLayer(group: THREE.Group): { merged: THREE.Group; layers: LayerData[] } {
  group.updateMatrixWorld(true);

  type MeshEntry = {
    mat: THREE.Material;
    geom: THREE.BufferGeometry;
    centerX: number;
    centerY: number;
    centerZ: number;
  };
  type LineEntry = { ls: THREE.LineSegments; centerY: number };
  const meshEntries: MeshEntry[] = [];
  const lineEntries: LineEntry[] = [];

  const oldMeshes: THREE.Mesh[] = [];
  group.traverse((o) => {
    const obj = o as THREE.Object3D & { isMesh?: boolean };
    if (obj.isMesh) oldMeshes.push(o as THREE.Mesh);
  });

  // For each brick, collect its mesh AND its sibling LineSegments under the
  // same parent, sharing the mesh's centerY so the lines always cluster onto
  // the same layer as their brick. (LDraw's edge geometry covers only the
  // top edges of a brick, so its bbox sits offset from the brick's center —
  // clustering lines on their own bbox produces phantom line-only layers.)
  const seenLines = new Set<THREE.LineSegments>();
  for (const mesh of oldMeshes) {
    const mat = (Array.isArray(mesh.material) ? mesh.material[0] : mesh.material) as THREE.Material;
    if (!mat) continue;
    const geom = mesh.geometry.clone();
    geom.applyMatrix4(mesh.matrixWorld);
    geom.computeBoundingBox();
    const bb = geom.boundingBox!;
    const centerX = (bb.min.x + bb.max.x) / 2;
    const centerY = (bb.min.y + bb.max.y) / 2;
    const centerZ = (bb.min.z + bb.max.z) / 2;
    meshEntries.push({ mat, geom, centerX, centerY, centerZ });

    if (mesh.parent) {
      for (const sib of mesh.parent.children) {
        const ls = sib as THREE.Object3D & { isLineSegments?: boolean; isLine?: boolean };
        if (!(ls.isLineSegments || ls.isLine)) continue;
        if (seenLines.has(sib as THREE.LineSegments)) continue;
        seenLines.add(sib as THREE.LineSegments);
        lineEntries.push({ ls: sib as THREE.LineSegments, centerY });
      }
    }
  }

  const allCenterYs = [
    ...meshEntries.map((e) => e.centerY),
    ...lineEntries.map((e) => e.centerY),
  ];
  const { layerIdx, layerCount } = detectLayers(allCenterYs);
  const meshLayerIdx = layerIdx.slice(0, meshEntries.length);
  const lineLayerIdx = layerIdx.slice(meshEntries.length);

  const meshOrder = meshEntries
    .map((_, i) => i)
    .sort((a, b) => meshEntries[a]!.centerY - meshEntries[b]!.centerY);
  const total = Math.max(1, meshEntries.length - 1);
  for (let k = 0; k < meshOrder.length; k++) {
    const i = meshOrder[k]!;
    const e = meshEntries[i]!;
    const t = (k / total) * SWEEP_DURATION;
    const vertCount = e.geom.attributes.position!.count;

    const buildTimes = new Float32Array(vertCount).fill(t);
    e.geom.setAttribute("buildTime", new THREE.BufferAttribute(buildTimes, 1));

    const bb = e.geom.boundingBox!;
    const cx = (bb.min.x + bb.max.x) * 0.5;
    const cy = (bb.min.y + bb.max.y) * 0.5;
    const cz = (bb.min.z + bb.max.z) * 0.5;
    const centroids = new Float32Array(vertCount * 3);
    for (let v = 0; v < vertCount; v++) {
      centroids[v * 3] = cx;
      centroids[v * 3 + 1] = cy;
      centroids[v * 3 + 2] = cz;
    }
    e.geom.setAttribute("brickCentroid", new THREE.BufferAttribute(centroids, 3));
  }

  const layerMeshBuckets: Map<THREE.Material, THREE.BufferGeometry[]>[] = Array.from(
    { length: layerCount },
    () => new Map(),
  );
  const layerSumX = new Array<number>(layerCount).fill(0);
  const layerSumY = new Array<number>(layerCount).fill(0);
  const layerSumZ = new Array<number>(layerCount).fill(0);
  const layerCounts = new Array<number>(layerCount).fill(0);

  for (let i = 0; i < meshEntries.length; i++) {
    const e = meshEntries[i]!;
    const li = meshLayerIdx[i]!;
    let arr = layerMeshBuckets[li]!.get(e.mat);
    if (!arr) {
      arr = [];
      layerMeshBuckets[li]!.set(e.mat, arr);
    }
    arr.push(e.geom);
    layerSumX[li]! += e.centerX;
    layerSumY[li]! += e.centerY;
    layerSumZ[li]! += e.centerZ;
    layerCounts[li]!++;
  }

  const layerLineLists: THREE.LineSegments[][] = Array.from({ length: layerCount }, () => []);
  for (let i = 0; i < lineEntries.length; i++) {
    layerLineLists[lineLayerIdx[i]!]!.push(lineEntries[i]!.ls);
  }

  const merged = new THREE.Group();
  const layers: LayerData[] = [];

  for (let li = 0; li < layerCount; li++) {
    const layerGroup = new THREE.Group();
    layerGroup.name = `layer-${li}`;

    const meshGroup = new THREE.Group();
    meshGroup.name = "meshes";
    for (const [mat, geoms] of layerMeshBuckets[li]!) {
      const m = mergeGeometries(geoms, false);
      if (!m) continue;
      m.computeBoundingBox();
      m.computeBoundingSphere();
      const mesh = new THREE.Mesh(m, mat);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      meshGroup.add(mesh);
      geoms.forEach((g) => g.dispose());
    }

    const lineGroup = new THREE.Group();
    lineGroup.name = "lines";
    lineGroup.visible = false;
    for (const ls of layerLineLists[li]!) {
      ls.parent?.remove(ls);
      ls.matrixAutoUpdate = false;
      ls.matrix.copy(ls.matrixWorld);
      ls.castShadow = false;
      ls.receiveShadow = false;
      lineGroup.add(ls);
    }

    layerGroup.add(meshGroup);
    layerGroup.add(lineGroup);
    merged.add(layerGroup);

    const n = layerCounts[li]!;
    layers.push({
      index: li,
      centerX: n ? layerSumX[li]! / n : 0,
      centerY: n ? layerSumY[li]! / n : 0,
      centerZ: n ? layerSumZ[li]! / n : 0,
      brickCount: n,
      group: layerGroup,
      meshGroup,
      lineGroup,
    });
  }

  for (const mesh of oldMeshes) mesh.geometry.dispose();
  merged.matrixAutoUpdate = false;
  merged.updateMatrix();
  return { merged, layers };
}

/**
 * Show layers 0..focused, hide the rest, and turn on the focused layer's
 * line overlay (LDraw edge + conditional lines) for the LEGO-instructions
 * feel. focused = -1 (or focused >= layerCount) means "show the finished
 * model" — every layer visible, no overlay.
 */
function applyLayerFocus(model: LoadedModel, focused: number) {
  const final = focused < 0 || focused >= model.layers.length;
  for (let i = 0; i < model.layers.length; i++) {
    const layer = model.layers[i]!;
    layer.group.visible = final || i <= focused;
    layer.lineGroup.visible = !final && i === focused;
  }
}

function disposeModel(model: LoadedModel) {
  const mats = new Set<THREE.Material>();
  model.group.traverse((o) => {
    const obj = o as THREE.Object3D & {
      isMesh?: boolean;
      isLineSegments?: boolean;
      isLine?: boolean;
      geometry?: THREE.BufferGeometry;
      material?: THREE.Material | THREE.Material[];
    };
    if (!(obj.isMesh || obj.isLineSegments || obj.isLine)) return;
    obj.geometry?.dispose();
    const arr = Array.isArray(obj.material) ? obj.material : obj.material ? [obj.material] : [];
    for (const m of arr) if (m) mats.add(m);
  });
  for (const m of mats) m.dispose();
}

async function loadModel(filename: string): Promise<LoadedModel> {
  const res = await fetch(`/lego/models/${encodeURIComponent(filename)}`);
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${filename}`);
  const text = await res.text();

  const loader = await getLoader();
  const raw = await new Promise<THREE.Group>((resolve, reject) => {
    loader.parse(
      text,
      (g: THREE.Group) => resolve(g),
      (err: unknown) => reject(err),
    );
  });

  raw.updateMatrixWorld(true);
  const probe = new THREE.Box3().setFromObject(raw);
  const probeSize = new THREE.Vector3();
  probe.getSize(probeSize);
  const dropHeight = Math.max(probeSize.y * 0.6, 200);

  const time = buildPlasticMaterials(raw, dropHeight);
  const brickCount = countMeshes(raw);
  const { merged: group, layers } = mergeByMaterialAndLayer(raw);

  const box = new THREE.Box3().setFromObject(group);
  const center = new THREE.Vector3();
  box.getCenter(center);
  for (const child of group.children) {
    child.position.x -= center.x;
    child.position.z -= center.z;
    child.position.y -= box.min.y;
    child.updateMatrix();
  }

  for (const layer of layers) {
    layer.centerX -= center.x;
    layer.centerY -= box.min.y;
    layer.centerZ -= center.z;
  }

  const size = new THREE.Vector3();
  box.getSize(size);
  const maxDim = Math.max(size.x, size.y, size.z);

  let drawCalls = 0;
  for (const layer of layers) {
    drawCalls += layer.meshGroup.children.length + layer.lineGroup.children.length;
  }

  return {
    name: filename,
    group,
    size: maxDim,
    groundY: 0,
    drawCalls,
    brickCount,
    build: { time, total: BUILD_TOTAL, startedAt: null },
    layers,
  };
}

// ---- React tree ---------------------------------------------------------

export default function BuildView() {
  const [model, setModel] = useState<LoadedModel | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [focusedLayer, setFocusedLayer] = useState(0);

  useEffect(() => {
    let cancelled = false;
    loadModel(MODEL_FILE)
      .then((m) => {
        if (cancelled) {
          disposeModel(m);
          return;
        }
        setModel(m);
        // Default focus to the synthetic "Complete" step so the workshop
        // opens onto the finished figure with no highlight; the user can
        // start the build via the launcher when they're ready.
        setFocusedLayer(m.layers.length);
      })
      .catch((e) => !cancelled && setError(String(e)));
    return () => {
      cancelled = true;
      setModel((m) => {
        if (m) disposeModel(m);
        return null;
      });
    };
  }, []);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        minHeight: "calc(100vh - 4rem)",
        background: "#ffffff",
      }}
    >

      {error && (
        <div
          style={{
            position: "absolute",
            top: 12,
            left: "50%",
            transform: "translateX(-50%)",
            color: "#a33",
            zIndex: 10,
            fontFamily: "ui-monospace, Menlo, monospace",
            fontSize: 12,
          }}
        >
          Error: {error}
        </div>
      )}

      {!model && !error && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "#888",
            fontFamily: "ui-monospace, Menlo, monospace",
            fontSize: 12,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          Loading bricks…
        </div>
      )}

      {model && (
        <InstructionsPanel
          model={model}
          focused={focusedLayer}
          onFocus={setFocusedLayer}
        />
      )}

      <Viewer model={model} focusedLayer={focusedLayer} />
    </div>
  );
}

// ---- Instructions panel -------------------------------------------------

function InstructionsPanel({
  model,
  focused,
  onFocus,
}: {
  model: LoadedModel;
  focused: number;
  onFocus: (idx: number) => void;
}) {
  // We render an extra "Complete" step after the last layer that shows the
  // finished model with no highlight. So the focusable range is [0, total].
  const layerCount = model.layers.length;
  const total = layerCount + 1;
  const listRef = useRef<HTMLDivElement>(null);
  const clamped = Math.max(0, Math.min(total - 1, focused));
  const isFinal = clamped === layerCount;

  // Panel starts collapsed — just a small launcher — until the user starts
  // the build.
  const [expanded, setExpanded] = useState(false);

  // Auto-scroll the active step into view whenever focus moves.
  useEffect(() => {
    if (!expanded) return;
    const el = listRef.current?.querySelector<HTMLElement>(
      `[data-step="${clamped}"]`,
    );
    el?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [clamped, expanded]);

  // Keyboard nav: ArrowUp / ArrowDown step through layers.
  useEffect(() => {
    if (!expanded) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "ArrowUp") {
        onFocus(Math.min(total - 1, clamped + 1));
        e.preventDefault();
      } else if (e.key === "ArrowDown") {
        onFocus(Math.max(0, clamped - 1));
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [clamped, onFocus, total, expanded]);

  if (!expanded) {
    return (
      <button
        className="lego-panel lego-launcher"
        onClick={() => {
          setExpanded(true);
          onFocus(0);
        }}
        style={{ position: "absolute", top: 24, right: 24, zIndex: 10 }}
      >
        <span className="lego-launcher__play">▶</span>
        <span>Start build</span>
        <span className="lego-launcher__count">{total} steps</span>
      </button>
    );
  }

  const progress = total > 1 ? (clamped / (total - 1)) * 100 : 100;

  return (
    <div
      className="lego-panel lego-panel-card"
      style={{
        position: "absolute",
        top: 24,
        right: 24,
        bottom: 24,
        width: 280,
        zIndex: 10,
        padding: 14,
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <span className="lego-eyebrow">Instructions</span>
          <span className="lego-step-count">
            Step <strong className="lego-mono">{clamped + 1}</strong>
            <span style={{ color: "#aaa" }}> / </span>
            <span className="lego-mono">{total}</span>
          </span>
        </div>
        <button
          className="lego-close"
          onClick={() => setExpanded(false)}
          aria-label="Collapse instructions"
        >
          ✕
        </button>
      </div>

      <input
        type="range"
        className="lego-slider"
        min={0}
        max={total - 1}
        value={clamped}
        onChange={(e) => onFocus(Number(e.target.value))}
        aria-label="Scrub through build steps"
        style={{ ["--progress" as string]: `${progress}%` } as React.CSSProperties}
      />

      <div className="lego-stats">
        {isFinal ? (
          <>
            <strong className="lego-mono">{model.brickCount.toLocaleString()}</strong> bricks ·
            finished model
          </>
        ) : (
          <>
            <strong className="lego-mono">
              {(model.layers[clamped]?.brickCount ?? 0).toLocaleString()}
            </strong>{" "}
            bricks in this layer
          </>
        )}
      </div>

      <div ref={listRef} className="lego-list">
        {model.layers.map((layer, i) => {
          const isActive = i === clamped;
          const isBuilt = i <= clamped || isFinal;
          const cls = ["lego-step"];
          if (isBuilt) cls.push("lego-step--built");
          if (isActive) cls.push("lego-step--active");
          return (
            <button
              key={i}
              data-step={i}
              className={cls.join(" ")}
              onClick={() => onFocus(i)}
            >
              <span className="lego-step__num">{i + 1}</span>
              <span className="lego-step__label">Step {i + 1}</span>
              <span className="lego-step__count">
                {layer.brickCount.toLocaleString()} {layer.brickCount === 1 ? "brick" : "bricks"}
              </span>
            </button>
          );
        })}
        <button
          data-step={layerCount}
          className={
            "lego-step lego-step--complete" + (isFinal ? " lego-step--complete-active" : "")
          }
          onClick={() => onFocus(layerCount)}
        >
          <span className="lego-step__num">{layerCount + 1}</span>
          <span className="lego-step__label">Complete</span>
          <span className="lego-step__count">{model.brickCount.toLocaleString()} total</span>
        </button>
      </div>

      <div className="lego-controls">
        <button
          className="lego-btn"
          onClick={() => onFocus(Math.max(0, clamped - 1))}
          disabled={clamped === 0}
        >
          ‹ Prev
        </button>
        <button
          className="lego-btn"
          onClick={() => onFocus(Math.min(total - 1, clamped + 1))}
          disabled={clamped === total - 1}
        >
          Next ›
        </button>
      </div>
    </div>
  );
}

// ---- Three scene --------------------------------------------------------

function Viewer({ model, focusedLayer }: { model: LoadedModel | null; focusedLayer: number }) {
  // Light/shadow frustum sized for whatever model we've seen. Batman is the
  // only model this view loads, but the ratchet stays so future swaps don't
  // shrink the shadow camera below what already had to fit.
  const sizeRef = useRef(2000);
  if (model && model.size > sizeRef.current) sizeRef.current = model.size;
  const size = sizeRef.current;

  const dist = size * 1.8;
  const groundSize = size * 30;
  const ctrlSize = model?.size ?? size;

  return (
    <Canvas
      shadows="soft"
      camera={{
        // Front-on entry — picks up where chapter VIII leaves the figure
        // (centred, looking straight at the bat-emblem). OrbitControls take
        // over from here so the user can swing around freely.
        position: [0, dist * 0.45, dist],
        fov: 32,
        near: size * 0.05,
        far: size * 8,
      }}
      gl={async (props) => {
        const renderer = new THREE.WebGPURenderer({
          ...(props as THREE.WebGPURendererParameters),
          antialias: true,
          alpha: true,
        });
        await renderer.init();
        renderer.setClearColor(0xffffff, 0);
        renderer.toneMapping = THREE.NoToneMapping;
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        return renderer;
      }}
    >
      <Environment preset="warehouse" environmentIntensity={1.3} background={false} />

      <ambientLight intensity={1.0} color="#ffffff" />
      <directionalLight
        position={[size * 0.8, size * 2.4, size * 0.6]}
        intensity={1.4}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        shadow-radius={6}
        shadow-bias={-0.0001}
        shadow-normalBias={0.05}
        shadow-camera-left={-size * 2.2}
        shadow-camera-right={size * 2.2}
        shadow-camera-top={size * 2.2}
        shadow-camera-bottom={-size * 2.2}
        shadow-camera-near={1}
        shadow-camera-far={size * 8}
      />
      <directionalLight
        position={[-size * 1.5, size * 0.8, -size * 0.5]}
        intensity={0.9}
        color="#ffffff"
      />
      <directionalLight
        position={[0, size * 0.6, -size * 1.5]}
        intensity={0.7}
        color="#ffffff"
      />

      <mesh
        position={[0, 0, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[groundSize, groundSize]} />
        <shadowNodeMaterial color="#000000" opacity={0.35} transparent />
      </mesh>

      {model && <ModelHost model={model} focusedLayer={focusedLayer} />}

      <OrbitControls
        makeDefault
        enableDamping
        target={[0, size * 0.5, 0]}
        minDistance={ctrlSize * 0.3}
        maxDistance={ctrlSize * 8}
      />
      <CameraRig model={model} focusedLayer={focusedLayer} />
    </Canvas>
  );
}

/** Whole-model framing — front-on, not the studio 3/4 we used elsewhere,
 *  so the entry from chapter VIII is visually continuous (same pose, just
 *  in a new viewport with controls live). */
function idealPoseFor(m: LoadedModel) {
  const dist = m.size * 1.8;
  return {
    position: new THREE.Vector3(0, m.size * 0.55, dist),
    target: new THREE.Vector3(0, m.size * 0.5, 0),
  };
}

/** Per-layer pose — same front-on azimuth, but tighter and tilted toward
 *  bird's-eye so the focused layer reads as a clear top-down slice (LEGO
 *  instruction style). The orbit target sits ON the focused layer's actual
 *  centroid so the layer is what's centred in frame. `focused = layerCount`
 *  (the synthetic "Complete" step) falls back to the full-model framing. */
function poseForLayer(m: LoadedModel, focused: number) {
  if (focused < 0 || focused >= m.layers.length) return idealPoseFor(m);
  const dist = m.size * 0.85;
  const layer = m.layers[focused]!;
  const target = new THREE.Vector3(layer.centerX, layer.centerY, layer.centerZ);
  return {
    position: target.clone().add(new THREE.Vector3(0, dist * 0.85, dist)),
    target,
  };
}

/**
 * Lerps the camera position + orbit target whenever the model OR the focused
 * layer changes. Cancels itself if the user grabs the controls mid-flight so
 * we don't fight their input.
 */
function CameraRig({ model, focusedLayer }: { model: LoadedModel | null; focusedLayer: number }) {
  const camera = useThree((s) => s.camera);
  const controls = useThree((s) => s.controls) as
    | (THREE.EventDispatcher & { target: THREE.Vector3; update: () => void })
    | null;

  const lerpRef = useRef<{
    fromPos: THREE.Vector3;
    toPos: THREE.Vector3;
    fromTarget: THREE.Vector3;
    toTarget: THREE.Vector3;
    startTime: number;
    duration: number;
  } | null>(null);

  useEffect(() => {
    if (!model || !controls) return;
    const ideal = poseForLayer(model, focusedLayer);
    lerpRef.current = {
      fromPos: camera.position.clone(),
      toPos: ideal.position,
      fromTarget: controls.target.clone(),
      toTarget: ideal.target,
      startTime: performance.now() / 1000,
      duration: 0.7,
    };
  }, [model, focusedLayer, camera, controls]);

  useEffect(() => {
    if (!controls) return;
    const cancel = () => {
      lerpRef.current = null;
    };
    controls.addEventListener("start", cancel);
    return () => controls.removeEventListener("start", cancel);
  }, [controls]);

  useFrame(() => {
    const l = lerpRef.current;
    if (!l || !controls) return;
    const elapsed = performance.now() / 1000 - l.startTime;
    const t = Math.min(1, elapsed / l.duration);
    // Smoothstep ease-in-out.
    const eased = t * t * (3 - 2 * t);
    camera.position.lerpVectors(l.fromPos, l.toPos, eased);
    controls.target.lerpVectors(l.fromTarget, l.toTarget, eased);
    controls.update();
    if (t >= 1) lerpRef.current = null;
  });

  return null;
}

/**
 * Mounts the model and ticks its build-in animation. Resets on model swap
 * so the bricks always rain in fresh when the workshop opens.
 */
function ModelHost({ model, focusedLayer }: { model: LoadedModel; focusedLayer: number }) {
  useEffect(() => {
    model.build.startedAt = null;
    (model.build.time as { value: number }).value = 0;
  }, [model]);

  useEffect(() => {
    applyLayerFocus(model, focusedLayer);
  }, [model, focusedLayer]);

  useFrame(({ clock }) => {
    const b = model.build;
    if (b.startedAt === null) b.startedAt = clock.getElapsedTime();
    const t = clock.getElapsedTime() - b.startedAt;
    if (t >= b.total) {
      (b.time as { value: number }).value = b.total;
      return;
    }
    (b.time as { value: number }).value = t;
  });

  return <primitive object={model.group} />;
}

function countMeshes(obj: THREE.Object3D): number {
  let n = 0;
  obj.traverse((o) => {
    if ((o as THREE.Mesh).isMesh) n++;
  });
  return n;
}
