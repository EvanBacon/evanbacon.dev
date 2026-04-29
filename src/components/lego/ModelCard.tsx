import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  Canvas,
  extend,
  useFrame,
  useThree,
  type ThreeToJSXElements,
} from "@react-three/fiber";
import { Link } from "expo-router";
import { easing } from "maath";
import * as THREE from "three/webgpu";
import { loadOptimizedModel, type OptimizedModel } from "./loadModel";
import { ARButton } from "./ARButton";

declare module "@react-three/fiber" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface ThreeElements extends ThreeToJSXElements<typeof THREE> {}
}

extend(THREE as unknown as Record<string, unknown>);

export interface ModelCardProps {
  /** LDR filename inside `/lego/models/`. */
  modelFile: string;
  /** Display title (rendered upper-cased). */
  title: string;
  /** Optional italic subtitle below the title. Hero only. */
  subtitle?: string;
  /** Path to the matching .usdz under `/lego/ar/`. */
  arHref: string;
  /** Hero gets the full-bleed treatment; standard is the smaller side card. */
  variant?: "hero" | "standard";
  /** Optional primary CTA destination — usually only the hero wires this up. */
  primaryHref?: string;
  /** Label for the primary CTA. */
  primaryLabel?: string;
  /** Camera framing — defaults are tuned for a head-and-torso shot at h=8. */
  targetHeight?: number;
  cameraPosition?: [number, number, number];
  cameraFov?: number;
  /** World-Y that the camera should aim at. Defaults to mid-figure
   *  (`targetHeight * 0.5`) so the whole figure sits centred in the card. */
  lookY?: number;
  /** 0..1 scroll progress used to drive vertical model parallax inside the
   *  card. The card itself doesn't move — only the model + light shift. */
  parallax?: number;
}

/**
 * One self-contained model card: WebGPU canvas + cinematic lighting + an
 * HTML overlay. Used for the splash hero (Batman) and the smaller side
 * cards (Captain America, Spartan Helmet). Variant controls which overlay
 * elements render — hero gets the subtitle + primary CTA, standard
 * collapses to a minimal title + AR pill.
 */
export default function ModelCard({
  modelFile,
  title,
  subtitle,
  arHref,
  variant = "standard",
  primaryHref,
  primaryLabel = "Explore the build",
  targetHeight = 8,
  cameraPosition = [0, 4, 14],
  cameraFov = 28,
  lookY,
  parallax = 0,
}: ModelCardProps) {
  const [model, setModel] = useState<OptimizedModel | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadOptimizedModel(modelFile, targetHeight)
      .then((m) => !cancelled && setModel(m))
      .catch((e) => !cancelled && setError(String(e)));
    return () => {
      cancelled = true;
    };
  }, [modelFile, targetHeight]);

  return (
    <div
      className={`model-card model-card--${variant} group relative h-full overflow-hidden rounded-[22px] border border-white/[0.07] bg-[radial-gradient(ellipse_80%_60%_at_50%_110%,rgba(80,70,90,0.55)_0%,rgba(0,0,0,1)_60%),radial-gradient(ellipse_100%_80%_at_50%_0%,rgba(40,50,80,0.3)_0%,rgba(0,0,0,1)_65%),#050507] shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_30px_80px_rgba(0,0,0,0.6)] transition-[transform,box-shadow,border-color] duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-white/[0.12] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_36px_96px_rgba(0,0,0,0.72)]`}
    >
      <div className="model-card__canvas absolute inset-0 z-0 [&_canvas]:opacity-0 [&_canvas]:[animation:splash-fade_1.4s_ease_0.15s_forwards]">
        <Canvas
          shadows
          camera={{ position: cameraPosition, fov: cameraFov, near: 0.3, far: 200 }}
          gl={async (props) => {
            const renderer = new THREE.WebGPURenderer({
              ...(props as THREE.WebGPURendererParameters),
              antialias: true,
              alpha: true,
            });
            await renderer.init();
            renderer.setClearColor(0x000000, 0);
            renderer.toneMapping = THREE.ACESFilmicToneMapping;
            renderer.toneMappingExposure = 1.25;
            renderer.outputColorSpace = THREE.SRGBColorSpace;
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            return renderer;
          }}
        >
          <FixWebGPUInitialResize />

          <fog attach="fog" args={["#050507", 18, 48]} />

          <pointLight position={[10, 0, -8]} intensity={90} color="#3b5b9d" decay={2} />
          <pointLight position={[-10, 0, -8]} intensity={90} color="#9d3b4d" decay={2} />
          <ambientLight intensity={0.22} color="#5a5a68" />

          {model && (
            <ModelStage
              model={model}
              targetHeight={targetHeight}
              lookY={lookY ?? targetHeight * 0.55}
              parallax={parallax}
            />
          )}
        </Canvas>
      </div>

      <Overlay
        variant={variant}
        loading={!model && !error}
        error={error}
        title={title}
        subtitle={subtitle}
        brickCount={model?.brickCount ?? 0}
        primaryHref={primaryHref}
        primaryLabel={primaryLabel}
        arHref={arHref}
        arLabel={`View ${title} in AR`}
      />
    </div>
  );
}

/**
 * R3F's first size measurement runs before our async `gl` creator resolves
 * (WebGPU's `await renderer.init()`), so the initial `gl.setSize(...)` lands
 * on a renderer that doesn't exist yet. Re-apply size + camera aspect once
 * the renderer is real, and on every resize as a defensive measure.
 */
function FixWebGPUInitialResize() {
  const gl = useThree((s) => s.gl);
  const camera = useThree((s) => s.camera);
  const width = useThree((s) => s.size.width);
  const height = useThree((s) => s.size.height);
  useEffect(() => {
    if (!gl || !width || !height) return;
    gl.setSize(width, height);
    if ((camera as THREE.PerspectiveCamera).isPerspectiveCamera) {
      const cam = camera as THREE.PerspectiveCamera;
      cam.aspect = width / height;
      cam.updateProjectionMatrix();
    }
  }, [gl, camera, width, height]);
  return null;
}

function ModelStage({
  model,
  targetHeight: h,
  lookY,
  parallax,
}: {
  model: OptimizedModel;
  targetHeight: number;
  lookY: number;
  parallax: number;
}) {
  const lightRef = useRef<THREE.SpotLight>(null!);
  const camera = useThree((s) => s.camera);
  const basePos = useRef(new THREE.Vector3());
  const lookTarget = useRef(new THREE.Vector3(0, lookY, 2));

  useEffect(() => {
    basePos.current.copy(camera.position);
    camera.lookAt(lookTarget.current);
    camera.updateProjectionMatrix();
  }, [camera]);

  // Cursor parallax + scroll parallax both ride on the camera. Pointer
  // drives a small lateral drift; scroll lifts the framing so the model
  // rises into view as the user scrolls down. Magnitudes are deliberately
  // small (a few percent of model height) so the motion is felt, not seen.
  useFrame((state, delta) => {
    const { x: px, y: py } = state.pointer;
    // `parallax` is 0..1 with 0.5 ≈ "card centred". Re-centre to -0.5..0.5.
    const sp = (parallax - 0.5) * 2;
    if (lightRef.current) {
      easing.damp3(
        lightRef.current.position,
        [px * h * 1.2, h * 1.4 + py * h * 0.2, h * 1.1],
        0.25,
        delta,
      );
    }
    easing.damp3(
      camera.position,
      [
        basePos.current.x + px * 0.35,
        basePos.current.y - py * 0.2 + sp * h * 0.18,
        basePos.current.z,
      ],
      0.35,
      delta,
    );
    camera.lookAt(lookTarget.current);
  });

  return (
    <>
      <group position={[-h * 0.1, 0, 0]}>
        <primitive object={model.group} />
      </group>

      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[h * 8, h * 8]} />
        <shadowNodeMaterial color="#000000" opacity={0.5} transparent />
      </mesh>

      <spotLight
        ref={lightRef}
        angle={0.6}
        penumbra={0.85}
        intensity={520}
        decay={2}
        distance={h * 8}
        color="#fff4dd"
        castShadow
        shadow-mapSize-width={512}
        shadow-mapSize-height={512}
        shadow-bias={-0.0015}
        shadow-radius={16}
      />
    </>
  );
}

function Overlay({
  variant,
  loading,
  error,
  title,
  subtitle,
  brickCount,
  primaryHref,
  primaryLabel,
  arHref,
  arLabel,
}: {
  variant: "hero" | "standard";
  loading: boolean;
  error: string | null;
  title: string;
  subtitle?: string;
  brickCount: number;
  primaryHref?: string;
  primaryLabel: string;
  arHref: string;
  arLabel: string;
}) {
  const stat: ReactNode = loading ? (
    <span className="splash-stat__pulse animate-[stat-pulse_1.6s_ease-in-out_infinite]">
      Loading bricks…
    </span>
  ) : error ? (
    <span className="splash-stat__err text-[#d97777]">{error}</span>
  ) : (
    <>
      <strong className="font-medium text-[#f5b400]">
        {brickCount.toLocaleString()}
      </strong>{" "}
      bricks
    </>
  );

  const overlayPadding =
    variant === "hero" ? "p-[36px_36px_38px]" : "p-[18px_18px_20px]";
  const footGap = variant === "hero" ? "gap-[18px]" : "gap-[14px]";

  return (
    <div
      className={`model-card__overlay pointer-events-none absolute inset-0 z-[2] flex flex-col justify-end ${overlayPadding}`}
    >
      <footer className={`model-card__foot flex flex-col items-center ${footGap}`}>
        <h1 className="splash-title model-card__title m-0 text-center font-['Cinzel','Trajan_Pro',Georgia,serif] text-[clamp(34px,4.8vw,64px)] font-light leading-[0.92] tracking-[0.42em] pl-[0.42em] text-[#f5f5f5] [text-shadow:0_6px_26px_rgba(0,0,0,0.85)]">
          {title.toUpperCase()}
        </h1>
        {variant === "hero" && subtitle && (
          <h2 className="splash-subtitle m-0 mt-2 text-center font-['Cinzel',serif] text-[14px] font-light italic tracking-[0.32em] text-white/60">
            {subtitle}
          </h2>
        )}
        <div className="splash-stat model-card__stat font-['JetBrains_Mono',ui-monospace,monospace] text-[11px] uppercase tracking-[0.18em] text-white/55">
          {stat}
        </div>
        <div className="splash-ctas model-card__ctas inline-flex flex-wrap items-center justify-center gap-[14px]">
          {primaryHref && (
            <Link
              href={primaryHref as never}
              className="splash-cta group/cta pointer-events-auto inline-flex cursor-pointer items-center gap-4 border border-white/45 bg-transparent px-[38px] py-4 font-['JetBrains_Mono',ui-monospace,monospace] text-[11.5px] font-medium uppercase tracking-[0.36em] text-white transition-[background-color,color,letter-spacing,border-color] duration-[250ms] ease-[ease] hover:border-white hover:bg-white hover:tracking-[0.42em] hover:text-[#050507] disabled:cursor-not-allowed disabled:opacity-40"
              aria-disabled={loading || !!error}
            >
              {primaryLabel}
              <span className="splash-cta__arrow font-['Inter',sans-serif] text-[14px] font-light tracking-normal transition-transform duration-[250ms] ease-[ease] group-hover/cta:translate-x-1">
                →
              </span>
            </Link>
          )}
          <ARButton
            href={arHref}
            loading={loading || !!error}
            label={arLabel}
          />
        </div>
      </footer>
    </div>
  );
}
