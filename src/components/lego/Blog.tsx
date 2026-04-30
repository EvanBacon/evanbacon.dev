import { useEffect, useState } from "react";
import { Link } from "expo-router";
import ModelCard from "./ModelCard";

export interface BlogSection {
  /** Optional small caps eyebrow above the heading. */
  eyebrow?: string;
  heading: string;
  /** Paragraphs of body copy. Plain strings — wrap with line breaks if needed. */
  paragraphs: string[];
}

export interface BlogConfig {
  modelFile: string;
  arHref: string;
  /** Hero title (rendered upper-cased + spaced like the splash). */
  title: string;
  /** Paper-thin subtitle under the title. */
  subtitle: string;
  /** Tag in the eyebrow above the title (e.g. "ISSUE 02 · CAPTAIN AMERICA"). */
  kicker?: string;
  /** Per-model camera framing — same shape as ModelCard's. */
  cameraPosition?: [number, number, number];
  cameraFov?: number;
  lookY?: number;
  /** Body sections. Rendered in order, each as a heading + paragraphs. */
  sections: BlogSection[];
}

/**
 * Long-form, single-model "blog post" view.
 *
 * Layout:
 *   [ sticky model viewer ]  [ scrollable column of sections ]
 *
 * Driven entirely by `config` so the same component renders an article for
 * any of the figures on the splash. Batman has its own bespoke Article
 * component (with full chapter-by-chapter camera choreography); this is the
 * lighter alternative for the other figures.
 */
export default function Blog({
  config,
  backHref,
}: {
  config: BlogConfig;
  backHref?: string;
}) {
  // Forwarded to the model card's internal parallax — same scroll progress
  // shape as `Splash` so the figure drifts up/down as the reader moves
  // through the article.
  const [scroll, setScroll] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const range = Math.max(1, document.body.scrollHeight - window.innerHeight);
      setScroll(Math.max(0, Math.min(1, window.scrollY / range)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="relative min-h-screen animate-article-enter overflow-x-hidden bg-[radial-gradient(ellipse_100%_60%_at_50%_110%,rgba(80,70,90,0.35)_0%,rgba(0,0,0,1)_70%),#050507] text-white/[0.92]">
      {backHref && (
        <Link
          href={backHref as never}
          className="fixed left-6 top-6 z-20 inline-flex animate-article-back-in cursor-pointer items-center gap-2.5 rounded-full border border-white/[0.08] bg-[rgba(20,20,24,0.75)] py-[9px] pl-[14px] pr-4 font-['JetBrains_Mono',ui-monospace,monospace] text-[11px] uppercase tracking-[0.18em] text-white/85 backdrop-blur-[14px] transition-[background-color,color,border-color] duration-200 ease-out hover:border-white/95 hover:bg-white/95 hover:text-[#050507] max-[720px]:left-4 max-[720px]:top-4 max-[720px]:gap-2 max-[720px]:py-[7px] max-[720px]:pl-2.5 max-[720px]:pr-3 max-[720px]:text-[10px] max-[720px]:tracking-[0.16em]"
        >
          ← Splash
        </Link>
      )}

      <div className="relative mx-auto grid max-w-[1280px] grid-cols-2 items-start gap-12 p-[96px_56px] max-[900px]:grid-cols-1 max-[900px]:gap-7 max-[900px]:p-[72px_20px]">
        <aside className="sticky top-14 h-[calc(100vh-112px)] min-h-[480px] max-[900px]:relative max-[900px]:top-auto max-[900px]:h-[64vh] max-[900px]:min-h-[360px]">
          {/* Re-uses the splash card chrome for visual consistency. The hero
              variant gives us the title overlay; we hide the CTA since the
              user is already inside the post. */}
          <ModelCard
            modelFile={config.modelFile}
            title={config.title}
            subtitle={config.subtitle}
            arHref={config.arHref}
            variant="hero"
            cameraPosition={config.cameraPosition}
            cameraFov={config.cameraFov}
            lookY={config.lookY}
            parallax={scroll}
          />
        </aside>

        <main className="px-1 pt-2">
          {config.kicker && (
            <p className="mb-6 font-['JetBrains_Mono',ui-monospace,monospace] text-[11px] uppercase tracking-[0.4em] text-white/55">
              {config.kicker}
            </p>
          )}
          <h1 className="mb-[18px] font-['Cinzel',serif] text-[clamp(40px,5.4vw,72px)] font-light leading-none tracking-[0.04em] text-[#f5f5f5]">
            {config.title}
          </h1>
          <p className="font-['Inter',sans-serif] text-[20px] font-light leading-[1.45] text-white/[0.78]">
            {config.subtitle}
          </p>
          <div className="mt-10 mb-9 h-px bg-white/[0.12]" />

          {config.sections.map((s, i) => (
            <section key={i} className={i > 0 ? "mt-12" : undefined}>
              {s.eyebrow && (
                <p className="mb-3 font-['JetBrains_Mono',ui-monospace,monospace] text-[10px] uppercase tracking-[0.36em] text-[#f5b400]">
                  {s.eyebrow}
                </p>
              )}
              <h2 className="mb-[18px] font-['Cinzel',serif] text-[clamp(22px,2.4vw,30px)] font-normal leading-[1.2] tracking-[0.04em] text-[#f5f5f5]">
                {s.heading}
              </h2>
              {s.paragraphs.map((p, j) => (
                <p
                  key={j}
                  className="mb-4 font-['Inter',sans-serif] text-[17px] font-light leading-[1.65] text-white/[0.78]"
                >
                  {p}
                </p>
              ))}
            </section>
          ))}
        </main>
      </div>
    </div>
  );
}
