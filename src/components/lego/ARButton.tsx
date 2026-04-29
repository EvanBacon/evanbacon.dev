import { useState } from "react";

// Inline SVG (cube icon) → data URL. Becomes the button's visible badge in
// every state so the affordance reads consistently while loading / on
// non-iOS / live. Stroke is baked white because <img>-loaded SVGs don't
// inherit the host page's text color; hover variants flip with `filter:
// invert(1)` in the consuming stylesheet.
const AR_ICON =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.5l9 5.2v8.6L12 21.5 3 16.3V7.7L12 2.5z"/><path d="M3 7.7l9 5.2 9-5.2"/><path d="M12 12.9V21.5"/></svg>',
  );

/**
 * AR Quick Look is iOS-only. On iPhone / iPad we render `<a rel="ar"><img></a>`
 * — the exact DOM shape Safari needs to intercept the tap and open the .usdz
 * fullscreen in AR. On any other platform (or while the model is still
 * loading) we render a visually-identical `<span>` pill, but disabled and with
 * a tooltip — better than letting the click fall through to a download that
 * desktop users can't actually open in AR.
 *
 * iPad on iPadOS 13+ user-agents masquerade as "Macintosh"; we sniff
 * `navigator.maxTouchPoints > 1` to tell a real Mac from an iPad.
 */
export function ARButton({
  href,
  loading,
  label,
  className = "splash-ar",
}: {
  href: string;
  loading: boolean;
  /** Accessible label, e.g. "View Batman in AR". Defaults to generic. */
  label?: string;
  /** Base class — the component appends `${className}--ios-only` /
   *  `${className}--disabled` modifiers and applies `${className}__poster`
   *  to the poster `<img>`. Defaults to the splash palette; the article's
   *  white-themed outro passes `"article-ar"` to opt into a paper variant. */
  className?: string;
}) {
  const [isIOS] = useState(() => {
    if (typeof navigator === "undefined") return false;
    const ua = navigator.userAgent;
    const iPadMasqueradingAsMac =
      ua.includes("Macintosh") && navigator.maxTouchPoints > 1;
    return /iPad|iPhone|iPod/.test(ua) || iPadMasqueradingAsMac;
  });

  const posterClass = `${className}__poster`;
  const aria = label ?? "View in AR";

  if (!isIOS) {
    return (
      <span
        className={`${className} ${className}--ios-only`}
        title="AR Quick Look is iOS-only — open this page on iPhone or iPad to view in AR"
      >
        <img className={posterClass} src={AR_ICON} alt="" aria-hidden />
      </span>
    );
  }
  if (loading) {
    return (
      <span className={`${className} ${className}--disabled`} aria-hidden>
        <img className={posterClass} src={AR_ICON} alt="" aria-hidden />
      </span>
    );
  }
  return (
    <a className={className} rel="ar" href={href} aria-label={aria}>
      <img className={posterClass} src={AR_ICON} alt={aria} />
    </a>
  );
}
