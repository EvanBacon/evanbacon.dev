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
    <div className="blog">
      {backHref && (
        <Link href={backHref as never} className="article-back">
          ← Splash
        </Link>
      )}

      <div className="blog-shell">
        <aside className="blog-stage">
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

        <main className="blog-body">
          {config.kicker && <p className="blog-kicker">{config.kicker}</p>}
          <h1 className="blog-title">{config.title}</h1>
          <p className="blog-lede">{config.subtitle}</p>
          <div className="blog-rule" />

          {config.sections.map((s, i) => (
            <section key={i} className="blog-section">
              {s.eyebrow && <p className="blog-section__eyebrow">{s.eyebrow}</p>}
              <h2 className="blog-section__heading">{s.heading}</h2>
              {s.paragraphs.map((p, j) => (
                <p key={j} className="blog-section__p">
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
