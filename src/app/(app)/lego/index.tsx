import { useEffect, useRef, useState } from "react";
import ModelCard from "@/components/lego/ModelCard";
import PageHeader from "@/components/PageHeader";

const SLUGS: Record<SplashTarget, string> = {
  batman: 'batman',
  captainAmerica: 'captain-america',
  masterChief: 'master-chief',
};




/** Stable identifier for "which figure did the user pick?" keeps the
 *  splash decoupled from the route table in `frontend.tsx`. */
export type SplashTarget = "batman" | "captainAmerica" | "masterChief";

interface CardConfig {
  modelFile: string;
  title: string;
  subtitle?: string;
  arHref: string;
  /** Which blog/article opens when the card's CTA fires. */
  target: SplashTarget;
  /** Per-figure framing — the smaller side cards pull the camera back
   *  slightly so the figure reads in a tighter aspect ratio. */
  cameraPosition?: [number, number, number];
  cameraFov?: number;
  /** World-Y the camera looks at. Lower = sees more of the legs. */
  lookY?: number;
  /** Multiplier for scroll → parallax. Different per card so the column
   *  parallaxes at different rates, giving the page real depth. */
  parallaxFactor?: number;
}

const HERO: CardConfig = {
  modelFile: "Batman.ldr",
  title: "Batman",
  subtitle: "A study in shadow & studs",
  arHref: "/lego/ar/Batman.usdz",
  target: "batman",
  // Hero card is roughly square (wider than tall), so we pull the camera
  // back enough that the full figure plus headroom fits, with the look
  // target on the upper torso to keep Batman's eyes near the top half.
  cameraPosition: [0, 4.2, 16],
  cameraFov: 28,
  lookY: 5.4,
  parallaxFactor: 0.35,
};

const SIDE_CARDS: CardConfig[] = [
  {
    modelFile: "Captain America.ldr",
    title: "Captain America",
    arHref: "/lego/ar/Captain America.usdz",
    target: "captainAmerica",
    // Side cards span a range of aspect ratios across breakpoints
    // (landscape on desktop, portrait on phone). Camera is tuned for the
    // worst case (tall portrait) so the full figure fits at every width.
    cameraPosition: [0, 4.0, 30],
    cameraFov: 18,
    lookY: 4.0,
    parallaxFactor: 0.55,
  },
  {
    modelFile: "Master Chief Ground.ldr",
    title: "Master Chief",
    arHref: "/lego/ar/Master Chief Ground.usdz",
    target: "masterChief",
    // Same portrait-friendly framing; aim slightly higher because the
    // ground base steals about a quarter of the model's normalised height.
    cameraPosition: [0, 4.6, 30],
    cameraFov: 18,
    lookY: 4.4,
    parallaxFactor: 0.7,
  },
];

export default function LegoMainRoute() {
  const stageRef = useRef<HTMLDivElement>(null);
  // 0 at top of stage, 1 once the stage has scrolled fully past the viewport.
  // Each card multiplies this by its own factor for differential parallax.
  const [scroll, setScroll] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = stageRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      // Stage is taller than the viewport; the inner grid is sticky. As the
      // user scrolls through the stage the grid stays pinned and `progress`
      // walks 0 → 1, which we forward to each card's model parallax.
      const range = Math.max(1, rect.height - window.innerHeight);
      const progress = -rect.top / range;
      setScroll(Math.max(0, Math.min(1, progress)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-[radial-gradient(ellipse_100%_60%_at_50%_110%,rgba(80,70,90,0.45)_0%,rgba(0,0,0,1)_70%),radial-gradient(ellipse_100%_80%_at_50%_0%,rgba(40,50,80,0.28)_0%,rgba(0,0,0,1)_70%),#050507] text-white">
      <div ref={stageRef} className="relative">
        <div className="sticky top-0 box-border flex h-screen flex-col p-7 max-[900px]:relative max-[900px]:top-auto max-[900px]:h-auto max-[900px]:p-[16px_16px_20px] max-[560px]:p-[12px_12px_16px]">
          <div className="px-0 pb-4 max-[900px]:px-2 max-[560px]:px-1 max-[900px]:pt-2">
            <PageHeader>Lego</PageHeader>
          </div>
          <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1.85fr)_minmax(0,1fr)] gap-[22px] max-[900px]:flex-none max-[900px]:grid-cols-1 max-[900px]:gap-4 max-[560px]:grid-cols-1 max-[560px]:gap-3">
          <div className="relative min-h-0 max-[900px]:h-[70vh] max-[900px]:min-h-[460px] max-[560px]:h-[64vh] max-[560px]:min-h-[420px]">
            <ModelCard
              modelFile={HERO.modelFile}
              title={HERO.title}
              subtitle={HERO.subtitle}
              arHref={HERO.arHref}
              variant="hero"
              primaryHref={`/lego/${SLUGS[HERO.target]}`}
              primaryLabel="Explore the build"
              cameraPosition={HERO.cameraPosition}
              cameraFov={HERO.cameraFov}
              lookY={HERO.lookY}
              parallax={scroll * (HERO.parallaxFactor ?? 0.4)}
            />
          </div>
          <div className="grid min-h-0 grid-rows-[1fr_1fr] gap-[22px] max-[900px]:grid-cols-1 max-[900px]:grid-rows-[auto] max-[900px]:gap-4 max-[560px]:gap-3">
            {SIDE_CARDS.map((c) => (
              <div
                key={c.modelFile}
                className="relative min-h-0 max-[900px]:h-[52vh] max-[900px]:min-h-[320px]"
              >
                <ModelCard
                  modelFile={c.modelFile}
                  title={c.title}
                  arHref={c.arHref}
                  variant="standard"
                  primaryHref={`/lego/${SLUGS[c.target]}`}
                  primaryLabel="Read"
                  cameraPosition={c.cameraPosition}
                  cameraFov={c.cameraFov}
                  lookY={c.lookY}
                  parallax={scroll * (c.parallaxFactor ?? 0.5)}
                />
              </div>
            ))}
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
