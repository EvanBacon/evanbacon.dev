import {
  createRef,
  useEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from "react";
import {
  Canvas,
  extend,
  useFrame,
  useThree,
  type ThreeToJSXElements,
} from "@react-three/fiber";
import { Link } from "expo-router";
import {
  layoutNextLineRange,
  materializeLineRange,
  prepareWithSegments,
  type LayoutCursor,
} from "@chenglou/pretext";
import * as THREE from "three/webgpu";
import { loadOptimizedModel, type OptimizedModel } from "./loadModel";
import { ARButton } from "./ARButton";

declare module "@react-three/fiber" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface ThreeElements extends ThreeToJSXElements<typeof THREE> {}
}

extend(THREE as unknown as Record<string, unknown>);

const TARGET_HEIGHT = 8;
const CAMERA_FOV = 28;

const BODY_FONT = "400 17px Inter";
const BODY_LINE_HEIGHT = 28;
const PARAGRAPH_GAP = 14;

// ---- Camera keyframes — author here ------------------------------------
//
// Each chapter is one viewport-tall scroll section: a heading + paragraphs
// + a camera pose for the model. They run in array order. The camera lerps
// to each chapter's pose as you scroll into it.
//
// Poses are described in **orbit** terms rather than raw [x, y, z] — much
// easier to author for shots that swing around the model:
//
//   azimuth   degrees, 0=front, 90=right side, 180=back, -90=left side
//   radius    distance from camera to the orbit pivot — smaller = tighter
//   cameraY   camera height (world Y). Above targetY → tilts down.
//   targetY   the look-at Y (use a MODEL_*_Y landmark to centre on a
//             feature of the figure)
//   pivotX    optional. Shifts camera + target together along world X.
//             Negative biases Batman toward the right of the viewport.
//
// Azimuth lerps along the **shortest arc**, so jumping from front (0°) to
// back (180°) auto-rotates around one side. If you want a specific path
// (always around the right, say), drop in an intermediate keyframe.
//
// Model landmarks (world Y, after the loader normalises the figure to
// TARGET_HEIGHT). Use these in `targetY` to centre the camera on a feature.

const MODEL_HEAD_Y = 7.4; // top of cowl ears
const MODEL_COWL_Y = 6.8; // mid-cowl / face
const MODEL_EMBLEM_Y = 5.4; // bat-emblem on chest
const MODEL_BELT_Y = 4.0; // utility belt
const MODEL_KNEE_Y = 2.0; // mid-leg
const MODEL_FEET_Y = 0.4; // boots

interface OrbitPose {
  azimuth: number;
  radius: number;
  cameraY: number;
  targetY: number;
  pivotX?: number;
}

/**
 * Per-chapter palette. Animates between adjacent chapters' themes via CSS
 * transitions on the `.article` root, so a chapter that frames a dark
 * portion of the model (the cape from behind, say) can swap to a light
 * paper background while the model becomes a high-contrast silhouette.
 *
 * The WebGPU canvas clears to transparent — colors here drive the visible
 * page background. Text colors and shadows flip together so legibility
 * holds at both extremes.
 */
interface ChapterTheme {
  bg: string;
  fg: string;
  heading: string;
  eyebrow: string;
  title: string;
  lede: string;
  shadow: string;
  shadowSoft: string;
  shadowStrong: string;
}

/**
 * A real-world photograph rendered as a textured plane *inside* the 3D
 * scene rather than as a DOM overlay. Lives at world-space coords next
 * to the figure so the camera can frame both at once; participates in
 * the silhouette sampler so body text wraps around its rectangle the
 * same way it wraps around the model.
 *
 * The plane fades opacity in/out as its chapter becomes active or
 * inactive, and Batman is shifted aside (`modelOffset` on the chapter)
 * to make room.
 */
interface ChapterFeature {
  src: string;
  alt: string;
  caption?: string;
  /** World-space [x, y, z] of the plane's centre. */
  position: [number, number, number];
  /** World-space [width, height] of the plane in scene units. */
  size: [number, number];
  /** Y-axis rotation in radians (default 0 = facing the +Z hemisphere). */
  rotationY?: number;
}

/**
 * One column-quadrant in a stats chapter. Counter animates from 0 to
 * `value` driven by the chapter's scroll progress. `prefix`/`suffix` ride
 * along with the formatted number; `decimals` controls fixed-point format.
 */
interface StatItem {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

/** Physical bounding box of the figure in centimetres. Rendered as a
 *  monospace footer line under the stats grid — distinct from the four
 *  big numbers because it's three values at once and doesn't read well
 *  as a count-up. */
interface ChapterDimensions {
  height_cm: number;
  width_cm: number;
  depth_cm: number;
}

interface ChapterDef {
  heading: string;
  paragraphs: string[];
  pose: OrbitPose;
  theme?: ChapterTheme;
  feature?: ChapterFeature;
  /** World translation applied to the Batman group while this chapter is
   *  active. Lerped, so transitions arc smoothly. Use this to scoot the
   *  figure aside so a feature plane has room to share the frame. */
  modelOffset?: [number, number, number];
  /** Stats grid rendered alongside the chapter body. Counters animate
   *  with the chapter's scroll progress. */
  stats?: StatItem[];
  /** Physical envelope shown as a footer line under the stats grid. */
  dimensions?: ChapterDimensions;
  /** Override the default 100vh section height — useful for chapters
   *  whose scroll-driven animation needs more runway. */
  minHeightVh?: number;
  /** When true, the chapter's scroll progress drives an upward-sweeping
   *  clipping plane on the model so it assembles brick-by-layer as the
   *  reader scrolls through. */
  revealAssembly?: boolean;
  /** Renders a call-to-action button at the foot of the chapter that
   *  switches the app to the standalone workshop view (free-orbit camera
   *  + per-layer build instructions). */
  buildCTA?: { label: string };
  /** Marks this chapter as the article's outro. Outro chapters render a
   *  fixed-position heading + lede in the top-left and an action cluster
   *  (Workshop / AR) in the bottom-right corner — body text doesn't flow
   *  around the silhouette, so the figure can sit dead-centre uncluttered. */
  outro?: boolean;
  /** USDZ asset path. When set, the outro renders an "View in AR" Quick
   *  Look pill alongside the workshop CTA. */
  arHref?: string;
}

const DARK_THEME: ChapterTheme = {
  bg: "#050507",
  fg: "rgba(255, 255, 255, 0.92)",
  heading: "#f5b400",
  eyebrow: "rgba(255, 255, 255, 0.55)",
  title: "#f5f5f5",
  lede: "rgba(255, 255, 255, 0.84)",
  shadow: "0 1px 8px rgba(0, 0, 0, 0.95), 0 0 2px rgba(0, 0, 0, 0.9)",
  shadowSoft: "0 1px 6px rgba(0, 0, 0, 0.85)",
  shadowStrong:
    "0 4px 24px rgba(0, 0, 0, 0.9), 0 0 2px rgba(0, 0, 0, 0.95)",
};

const LIGHT_THEME: ChapterTheme = {
  bg: "#f1ebdd",
  fg: "rgba(14, 14, 16, 0.92)",
  heading: "#7a3a00",
  eyebrow: "rgba(14, 14, 16, 0.6)",
  title: "#0a0a0a",
  lede: "rgba(14, 14, 16, 0.78)",
  shadow: "0 1px 4px rgba(255, 255, 255, 0.9), 0 0 2px rgba(255, 255, 255, 0.95)",
  shadowSoft: "0 1px 3px rgba(255, 255, 255, 0.85)",
  shadowStrong:
    "0 1px 6px rgba(255, 255, 255, 0.95), 0 0 2px rgba(255, 255, 255, 1)",
};

// Pure-white studio palette. Used by the closing chapter, where Batman
// re-emerges from chapter VII's fog into a flat white frame — the same
// look as a workshop reference photo. Drop shadows lose their dark halos
// (they would smear against white) so text legibility lives on contrast,
// not aura.
const WHITE_THEME: ChapterTheme = {
  bg: "#ffffff",
  fg: "rgba(8, 8, 10, 0.92)",
  heading: "#9a5a00",
  eyebrow: "rgba(8, 8, 10, 0.55)",
  title: "#050505",
  lede: "rgba(8, 8, 10, 0.78)",
  shadow: "0 1px 2px rgba(255, 255, 255, 0.95)",
  shadowSoft: "0 1px 2px rgba(255, 255, 255, 0.85)",
  shadowStrong: "0 1px 3px rgba(255, 255, 255, 1)",
};

/**
 * For each Y row (binned to `binSize` pixels) the silhouette stores the
 * leftmost and rightmost projected pixel of the model. Each text line in
 * pretext queries the rows it overlaps and shrinks its available width to
 * hug the model's actual outline at that height, so the body reads as if
 * it were poured around the bricks themselves.
 */
interface Silhouette {
  /** Map from binned Y (px) → { left, right } in page-pixel coords. */
  rows: Map<number, { left: number; right: number }>;
  binSize: number;
  minY: number;
  maxY: number;
}

interface ArticleIntro {
  title: string;
  lede: string;
}

interface ArticleContent {
  modelFile: string;
  intro: ArticleIntro;
  chapters: ChapterDef[];
}

export type ArticleId = "batman" | "captainAmerica";

const BATMAN_CHAPTERS: ChapterDef[] = [
  {
    heading: "I. The silhouette comes first",
    paragraphs: [
      "Every Rubrick build starts as a black-and-white silhouette. Batman is the easy case — the cape gives him away at thumbnail scale — but the discipline holds. Sketch eight directions, find the angles that read clean, voxelize.",
      "Voxelization is a search problem. Pick a target height, a brick budget, a palette. The rig samples the silhouette into a grid of LEGO-legal positions and asks: which arrangement reproduces the most distinctive features?",
      "For Batman, those are the cowl ears, the cape's hard angles, and the chest emblem. Everything else is filler. A stray brick on the cowl costs more than a stray brick on the thigh.",
    ],
    // Hero shot: full figure, faint downward tilt, biased right of frame.
    pose: { azimuth: 26, radius: 10.5, cameraY: 5.6, targetY: 5.6, pivotX: -1.6 },
    
  },
  {
    heading: "II. Construction is bottom-up",
    paragraphs: [
      "Every Rubrick model is engineered the way it was designed: bottom-up, each layer locking the previous one in place. The cape is the structural surprise — it's load-bearing. If you've held a 1,200-piece minifig and wondered why it doesn't sag, the cape is your answer, working as a back-brace from waist to shoulder.",
      "We tune layer count so no single layer takes more than five minutes. Steady progress, not a marathon. By the cowl, you've earned the moment.",
      "Instructions ship as a paper flipbook tucked behind the foam tray. Turning a real page between layers is a feel we couldn't replicate on screen — so we didn't try.",
    ],
    // Low-angle three-quarter from the left; figure fills the right half.
    pose: { azimuth: -17, radius: 12.5, cameraY: 3.6, targetY: 4.8, pivotX: 1.2 },
  },
  {
    heading: "III. By the numbers",
    paragraphs: [
      "Cold figures, every brick weighed and tallied. Same reason architects keep elevations: they tell you, without poetry, what you've actually built.",
    ],
    // Camera holds steady, model biased to the right of frame so the
    // stats grid claims the left column. Slight three-quarter angle gives
    // the assembly some depth without parallax-stealing the show.
    pose: { azimuth: 26, radius: 10.5, cameraY: 5.6, targetY: 5.6, pivotX: -1.6 },
    // Numbers come from `bun scripts/model-stats.ts Batman.ldr` — the
    // script counts every `.dat` reference in the LDR and weights the
    // four part types this figure uses (1x2, 1x1, 2x4, 2x2 bricks).
    stats: [
      { label: "PIECE COUNT", value: 3650 },
      { label: "WEIGHT", value: 3.09, decimals: 2, suffix: " kg" },
      { label: "BUILD TIME", value: 10.1, decimals: 1, suffix: " hrs" },
      { label: "EST. COST", value: 475, prefix: "$" },
    ],
    dimensions: { height_cm: 71, width_cm: 47.2, depth_cm: 20.8 },
    // 150vh gives the reveal animation enough scroll runway to play out
    // without feeling rushed.
    minHeightVh: 150,
    revealAssembly: true,
  },
    {
    heading: "IV. The bat-emblem, up close",
    paragraphs: [
      "Twelve bricks make the bat. Two stacked plates per wing-point, one black slope on each shoulder of the curve, a single 1×2 tile across the centre. That's it.",
      "We tried a six-piece negative-space variant, a printed-tile shortcut, a stud-shooting compromise. The twelve-brick version won: twenty seconds to build, reads from across the room. Both non-negotiable for a heroic insignia.",
      "The yellow is the one warm note. Three Pantones in audition; we settled on the 1989 movie-poster shade — a callback older readers feel before they identify.",
    ],
    // Extreme close-up on the chest emblem; tight orbit + small radius.
    pose: { azimuth: 4, radius: 4.6, cameraY: MODEL_EMBLEM_Y, targetY: MODEL_EMBLEM_Y, pivotX: -0.6 },
  },
  {
    heading: "V. Behind the cape",
    paragraphs: [
      "Walk around the back and the cape stops being decoration — it's structure. A brick lattice from shoulders to mid-calf, single uninterrupted plane. Every load the figure handles (knees that don't sag, shoulders that don't shrug, a head that won't pop off) is the cape paying its rent.",
      "From here you see the seams. One shade of dark gray meeting another, the angle plates climbing the spine, the inside curve of the hem differing from the outside. None of it reads at thumbnail scale — that's the point. Detail that rewards the build, not the photo.",
      "The cowl from behind is the most honest part of the figure. No emblem, no scowl, no cinematic lighting. Just the geometry of a head that has to land on a neck of exactly the right thickness, or the upper body topples.",
    ],
    // Flip 180° to look at the cape spread from behind, slightly raised.
    pose: { azimuth: 180, radius: 11, cameraY: 5.2, targetY: MODEL_EMBLEM_Y, pivotX: 2.5 },
    // The cape is near-black; against the dark base palette it disappears.
    // Switching to paper inverts the contrast — the cape now reads as
    // silhouette and the construction seams become visible against light.
    theme: LIGHT_THEME,
  },

  {
    heading: "VI. Signed by the bat",
    paragraphs: [
      "We built two of him. One stays on the studio shelf, cape rotated a quarter-turn each month so the polymer ages evenly. The other travels — back of a hatchback, folding table at a convention floor, propped up just unsteadily enough you'd want to ask before leaning on it.",
      "Kevin Conroy voiced Batman for a generation and was unfailingly generous to people who showed up with something handmade. He looked at the duplicate, asked which brick we wanted, and signed the emblem itself — silver paint marker across the central tile. Twenty seconds, dead steady.",
      "He passed in 2022. The signed copy is the only model I won't replace a brick on. Some signatures are more load-bearing than the cape.",
    ],
    // Camera centred on the photo plane at chest height; Batman has
    // walked deep into fog by this chapter so we don't need to frame him.
    pose: { azimuth: 0, radius: 14, cameraY: 4.6, targetY: 4.6, pivotX: 0 },
    feature: {
      src: "/lego/images/kevin-conroy.jpg",
      alt: "Kevin Conroy and a young Evan Bacon standing on either side of a life-sized LEGO Batman, the bat-emblem signed in silver paint marker.",
      caption:
        "Kevin Conroy signs the duplicate, c. 2013. Silver marker, twenty seconds, dead steady.",
      // Hung to the right of frame; text claims the left column.
      position: [3.0, 4.6, 0],
      size: [4.0, 4.0],
    },
    // Walk Batman 35 units back into Z. With scene fog set to far=45 and
    // the camera at z≈14, his distance from camera lands past the fog's
    // far plane, so he's painted entirely in fog colour — visually he
    // dissolves into the page background until the next chapter pulls
    // him back to the origin.
    modelOffset: [0, 0, -35],
  },
  {
    heading: "VII. Step into the studio",
    // One short, punchy line — the outro layout shows it as a fixed lede in
    // the top-left, not flowed around the silhouette, so anything longer
    // would crowd the page.
    paragraphs: [
      "Orbit freely. Scrub the build layer by layer. Or place him in your own room.",
    ],
    // Front-on, dead-centre, pulled back to radius 19 — at FOV 28 that
    // gives ~9.5 vertical units of frame for an 8-unit-tall figure. Boots
    // and cowl ears both clear the viewport, no cape clipping at the
    // bottom. cameraY == targetY at 4.0 → level studio shot.
    pose: { azimuth: 0, radius: 19, cameraY: 4.0, targetY: 4.0, pivotX: 0 },
    theme: WHITE_THEME,
    outro: true,
    buildCTA: { label: "Enter the studio" },
    arHref: "/lego/ar/Batman.usdz",
  },
];

// ---- Captain America chapters --------------------------------------------
//
// Same camera-pose grammar as Batman. The figure is a four-foot-tall live
// build commissioned by Salt Lake Comic Con in September 2015 — built on
// the convention floor across the run of the show, then handed to Chris
// Evans at the closing meet-and-greet. Chapter VII is the moment the
// shield-bearer met the man who plays him.

// Cap landmarks on the height-8 normalised figure.
const CAP_HELMET_Y = 6.6;
const CAP_STAR_Y = 5.2;

const CAPTAIN_AMERICA_CHAPTERS: ChapterDef[] = [
  {
    heading: "I. Three colours, one silhouette",
    paragraphs: [
      "Captain America is a colour problem before he's a sculpting problem. Red, white, and blue — three flat slabs that have to read as a person from across a convention hall. The brick figure has no gradient, no painted shading, no soft edges. Just stud-by-stud votes on where one nation-shade ends and the next begins.",
      "Sketch first. Eight orthographic angles, ink and gouache, the helmet-wing motif in pencil so it can move. Voxelize when the silhouette holds at thumbnail scale: feet planted, shield arm cocked, chest star centred. Anything that survives the thumbnail earns a brick.",
      "The figure spends most of its detail budget on the shoulders, the helmet's wing, and the gauntlet cuffs. The chest is left almost empty on purpose — the star has to land on a clean field, the same way it does on the cover of a 1941 first issue.",
    ],
    pose: { azimuth: 22, radius: 11.0, cameraY: 5.4, targetY: 5.0, pivotX: -1.6 },
  },
  {
    heading: "II. The shield is structural",
    paragraphs: [
      "A circle, in studs, is always a negotiation. Five concentric rings resolve the disc — outer red, inner white, outer red again, inner blue, and the white star at the centre — and every ring has to land on a brick boundary that the next ring can lock into without cantilevering.",
      "The shield carries real load. It's strapped to the figure's left forearm with a hidden technic spine that runs from wrist into the deltoid, then into the torso shell. Without it, an arm holding a two-kilogram disc at full extension would have shrugged off the body inside a week.",
      "The star is twelve plates. Two stacked points each, a single centre tile, no half-bricks or modified shortcuts. We tried a printed-tile cheat and a stud-shooter version; both read flat from across the room. The twelve-piece version is the one that holds at floor distance.",
    ],
    pose: { azimuth: -28, radius: 6.2, cameraY: CAP_STAR_Y + 0.2, targetY: CAP_STAR_Y, pivotX: 0.6 },
  },
  {
    heading: "III. Bottom-up, layer by layer",
    paragraphs: [
      "Built the way it stands: from the boots up, each layer locking the previous one. Forty-one brick layers from sole to helmet crown. The torso uses dual-shell construction so the chest star can sit proud of the structural plate without eating the load path underneath.",
      "The shoulders are where the figure earns its keep. Doubled technic anchors at both deltoids — left because of the shield, right because a heroic pose with a shield demands a matching mirrored line. Single-anchor shoulders sagged within an hour of the build going on display.",
      "Layer count is tuned so no single course takes more than four minutes to lay. Steady tempo over heroics: a builder pacing forty layers across a convention day stays sharper than one chasing a personal best.",
    ],
    pose: { azimuth: -16, radius: 12.5, cameraY: 3.6, targetY: 4.4, pivotX: 1.2 },
  },
  {
    heading: "IV. By the numbers",
    paragraphs: [
      "Cold count, every brick weighed and tallied. The shield alone is roughly an eighth of the figure's mass and a tenth of its piece count — a disproportionate share, which is the right answer for an icon whose silhouette is half disc.",
    ],
    pose: { azimuth: 22, radius: 11.0, cameraY: 5.4, targetY: 5.0, pivotX: -1.6 },
    stats: [
      { label: "PIECE COUNT", value: 4180 },
      { label: "WEIGHT", value: 3.6, decimals: 2, suffix: " kg" },
      { label: "BUILD TIME", value: 12.5, decimals: 1, suffix: " hrs" },
      { label: "EST. COST", value: 540, prefix: "$" },
    ],
    dimensions: { height_cm: 122, width_cm: 56, depth_cm: 28 },
    minHeightVh: 150,
    revealAssembly: true,
  },
  {
    heading: "V. The wing on the helmet",
    paragraphs: [
      "Cap's helmet has a problem no comic-book illustrator has ever fully solved: a single white wing on each side, painted in two dimensions, that has to suggest motion without ever moving. In bricks, you don't get the painter's cheats. The wing has to either project, or step, or both.",
      "Ours steps. One stud per layer for four layers, then a 1×2 plate that turns into a 1×2 tile — flat capstone, the only smooth surface in the whole helmet. The eye reads the gradient from textured field to glossy edge as a feathered tip, even though no curve was modelled.",
      "From the side, the helmet's profile resolves cleanly. From the back, you can see the seam: the wing is a separate sub-assembly that locks in last so it can be replaced if the figure ever tips and bumps an edge against a doorway. It has, twice.",
    ],
    pose: { azimuth: 75, radius: 8.5, cameraY: CAP_HELMET_Y, targetY: CAP_HELMET_Y - 0.2, pivotX: 0 },
    theme: LIGHT_THEME,
  },
  {
    heading: "VI. The star, up close",
    paragraphs: [
      "Twelve bricks, one star. Two stacked plates per point, a single white tile across the centre, blue field underneath in a 6×6 grid that runs unbroken from sternum to belt. The construction is older than the figure: the same star sits on a 2014 prototype torso shipped to the studio shelf.",
      "The blue is the one warm note. Pantone-matched to a 1979 Marvel cover — slightly purpler than the modern movie shade, but the older blue catches a convention spotlight without going chalky. Three test bricks in audition; the 1979 shade won by acclaim.",
      "Around the star, the chest is intentionally still. No texture, no rivets, no panel lines. The eye needs a clean field for the star to land on, the way a flag needs unbroken white between its stripes for the canton to read.",
    ],
    pose: { azimuth: 6, radius: 4.4, cameraY: CAP_STAR_Y, targetY: CAP_STAR_Y, pivotX: -0.6 },
  },
  {
    heading: "VII. Salt Lake Comic Con, 2015",
    paragraphs: [
      "Salt Lake Comic Con commissioned the figure for their September 2015 show. The build happened on the floor, in front of the crowd, across the three days of the convention — a folding table, a parts cart, a stack of foam trays, and as much red 1×2 brick as the local distributor could ship overnight.",
      "Building live is a different sport. You can't redo a layer when a thousand people are watching the layer go in. The instructions get pinned open on a music stand at chest height; you stop chatting with the line when the count gets fiddly and resume on the next clean course.",
      "Chris Evans came through at the close of the show. He looked at the figure, asked which side was the shield-arm, and stood on the other so the photo would frame both. Twenty seconds, dead steady. The shield-arm was the easier side anyway — the technic spine inside it was the only part of the figure built to take a shoulder lean.",
    ],
    pose: { azimuth: 0, radius: 14, cameraY: 4.6, targetY: 4.6, pivotX: 0 },
    feature: {
      src: "/lego/images/captain-america-slcc.jpg",
      alt: "Chris Evans and a young Evan Bacon standing on either side of a four-foot LEGO Captain America at Salt Lake Comic Con, September 2015.",
      caption:
        "Salt Lake Comic Con, September 2015. Built live on the convention floor, handed over at the closing meet-and-greet.",
      position: [3.0, 4.6, 0],
      size: [3.6, 4.6],
    },
    modelOffset: [0, 0, -35],
  },
  {
    heading: "VIII. Step into the studio",
    paragraphs: [
      "Orbit freely. Scrub the build layer by layer. Or place him in your own room.",
    ],
    pose: { azimuth: 0, radius: 19, cameraY: 4.0, targetY: 4.0, pivotX: 0 },
    theme: WHITE_THEME,
    outro: true,
    buildCTA: { label: "Enter the studio" },
    arHref: "/lego/ar/Captain America.usdz",
  },
];

const ARTICLE_CONTENTS: Record<ArticleId, ArticleContent> = {
  batman: {
    modelFile: "Batman.ldr",
    intro: {
      title: "The knight in studs",
      lede: "A study in shadow & studs — how 3,650 bricks become Batman, and why colour is structural.",
    },
    chapters: BATMAN_CHAPTERS,
  },
  captainAmerica: {
    modelFile: "Captain America.ldr",
    intro: {
      title: "The shield-bearer",
      lede: "A four-foot Captain America, built live on the floor of Salt Lake Comic Con — three colours, one star, and a disc that pays the rent on the whole figure.",
    },
    chapters: CAPTAIN_AMERICA_CHAPTERS,
  },
};

// ---- Pose lerping --------------------------------------------------------

/**
 * Resolves an `OrbitPose` to world-space camera position + look-at point.
 * Used both by the silhouette pre-projection and by the live camera
 * driver. Kept pure so the same numbers feed both code paths.
 */
function poseToWorld(p: OrbitPose): {
  cam: [number, number, number];
  target: [number, number, number];
} {
  const rad = (p.azimuth * Math.PI) / 180;
  const px = p.pivotX ?? 0;
  return {
    cam: [px + Math.sin(rad) * p.radius, p.cameraY, Math.cos(rad) * p.radius],
    target: [px, p.targetY, 0],
  };
}

/** Time-constant for orbit-param smoothing. Higher = snappier. ~2.0 lands
 *  in roughly half a second, a comfortable cinematic pace for one
 *  viewport-tall scroll section. */
const POSE_LAMBDA = 2.0;

function dampScalar(from: number, to: number, dt: number): number {
  return from + (to - from) * (1 - Math.exp(-POSE_LAMBDA * dt));
}

/** Shortest-arc angle damping in degrees. Picks the nearer rotation
 *  direction, so a 0° → 180° transition arcs through one side instead
 *  of crawling through 0 → 90 → 180 (or vice versa) deterministically. */
function dampAngle(from: number, to: number, dt: number): number {
  let diff = to - from;
  while (diff > 180) diff -= 360;
  while (diff < -180) diff += 360;
  return from + diff * (1 - Math.exp(-POSE_LAMBDA * dt));
}

// ---- Silhouette computation ---------------------------------------------

const SILHOUETTE_BIN = 4; // px — vertical resolution of the silhouette
const SILHOUETTE_PAD_X = 18; // breathing room around the model in px
const SILHOUETTE_PAD_Y = 8; // grow the obstacle vertically a touch too

/**
 * Builds a per-row left/right silhouette of the model in screen-pixel space
 * by projecting a sample of merged-mesh vertices through `cam`. Pretext
 * queries the result line-by-line during layout, and we re-run this each
 * frame so the wrap follows the model live as the camera moves.
 *
 * We sample rather than rasterize: with merged geometry the brick studs
 * already pack the model with vertices, and the silhouette only needs row
 * resolution good enough for body-text wrap (~4 px). Reading pixels from
 * an offscreen WebGPU target would be more accurate but vastly more work.
 */
function computeSilhouetteFromCamera(
  model: OptimizedModel,
  cam: THREE.Camera,
  pageWidth: number,
  pageHeight: number,
  featureMeshes?: (THREE.Mesh | null)[],
): Silhouette {
  cam.updateMatrixWorld(true);
  model.group.updateMatrixWorld(true);

  const rows = new Map<number, { left: number; right: number }>();
  let minY = Infinity;
  let maxY = -Infinity;
  const v = new THREE.Vector3();

  model.group.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (!mesh.isMesh) return;
    const geom = mesh.geometry as THREE.BufferGeometry;
    const pos = geom.attributes.position as THREE.BufferAttribute | undefined;
    if (!pos) return;
    // Sub-sample dense merged geometry — even ~3000 verts gives a tight
    // silhouette because merged bricks have studs full of edge points.
    const stride = Math.max(1, Math.floor(pos.count / 3000));
    for (let i = 0; i < pos.count; i += stride) {
      v.fromBufferAttribute(pos, i);
      v.applyMatrix4(mesh.matrixWorld);
      v.project(cam);
      if (v.z < -1 || v.z > 1) continue; // behind / outside frustum
      const sx = (v.x * 0.5 + 0.5) * pageWidth;
      const sy = (-v.y * 0.5 + 0.5) * pageHeight;
      if (!isFinite(sx) || !isFinite(sy)) continue;
      const bin = Math.floor(sy / SILHOUETTE_BIN) * SILHOUETTE_BIN;
      if (sy < minY) minY = sy;
      if (sy > maxY) maxY = sy;
      const row = rows.get(bin);
      if (!row) rows.set(bin, { left: sx, right: sx });
      else {
        if (sx < row.left) row.left = sx;
        if (sx > row.right) row.right = sx;
      }
    }
  });

  // Feature planes (e.g. the chapter-VI photo) contribute a filled
  // rectangle: project the plane's vertices, take the screen-space AABB,
  // and stamp every binned row inside with that left/right span. Only
  // counts the plane once it's at least half-faded-in; otherwise text
  // would jump around mid-transition.
  if (featureMeshes) {
    for (const mesh of featureMeshes) {
      if (!mesh || !mesh.visible) continue;
      const mat = mesh.material as THREE.MeshBasicMaterial | undefined;
      if ((mat?.opacity ?? 0) < 0.5) continue;
      const geom = mesh.geometry as THREE.BufferGeometry | undefined;
      const pos = geom?.attributes.position as
        | THREE.BufferAttribute
        | undefined;
      if (!pos) continue;
      mesh.updateMatrixWorld(true);
      let mnx = Infinity;
      let mxx = -Infinity;
      let mny = Infinity;
      let mxy = -Infinity;
      let any = false;
      for (let i = 0; i < pos.count; i++) {
        v.fromBufferAttribute(pos, i);
        v.applyMatrix4(mesh.matrixWorld);
        v.project(cam);
        if (v.z < -1 || v.z > 1) continue;
        const sx = (v.x * 0.5 + 0.5) * pageWidth;
        const sy = (-v.y * 0.5 + 0.5) * pageHeight;
        if (!isFinite(sx) || !isFinite(sy)) continue;
        if (sx < mnx) mnx = sx;
        if (sx > mxx) mxx = sx;
        if (sy < mny) mny = sy;
        if (sy > mxy) mxy = sy;
        any = true;
      }
      if (!any) continue;
      if (mny < minY) minY = mny;
      if (mxy > maxY) maxY = mxy;
      const startBin = Math.floor(mny / SILHOUETTE_BIN) * SILHOUETTE_BIN;
      const endBin = Math.ceil(mxy / SILHOUETTE_BIN) * SILHOUETTE_BIN;
      for (let y = startBin; y <= endBin; y += SILHOUETTE_BIN) {
        const row = rows.get(y);
        if (!row) rows.set(y, { left: mnx, right: mxx });
        else {
          if (mnx < row.left) row.left = mnx;
          if (mxx > row.right) row.right = mxx;
        }
      }
    }
  }

  // Sampled rows can have gaps (especially near the cape's narrow
  // cutouts). Linearly interpolate any 1–2-bin gaps so the silhouette
  // reads as a continuous shape to pretext.
  if (rows.size > 0) {
    const sorted = [...rows.keys()].sort((a, b) => a - b);
    for (let i = 0; i < sorted.length - 1; i++) {
      const a = sorted[i]!;
      const b = sorted[i + 1]!;
      const gap = (b - a) / SILHOUETTE_BIN - 1;
      if (gap > 0 && gap <= 2) {
        const ra = rows.get(a)!;
        const rb = rows.get(b)!;
        for (let k = 1; k <= gap; k++) {
          const t = k / (gap + 1);
          rows.set(a + k * SILHOUETTE_BIN, {
            left: ra.left * (1 - t) + rb.left * t,
            right: ra.right * (1 - t) + rb.right * t,
          });
        }
      }
    }
  }

  return {
    rows,
    binSize: SILHOUETTE_BIN,
    minY: minY - SILHOUETTE_PAD_Y,
    maxY: maxY + SILHOUETTE_PAD_Y,
  };
}

/**
 * Convenience wrapper: build a phantom camera matching the article's
 * canvas projection, then sample the silhouette from it. Used for the
 * initial paint before the live canvas has had a chance to update us
 * with its actual camera state.
 */
function computeSilhouetteFromPose(
  model: OptimizedModel,
  pose: OrbitPose,
  pageWidth: number,
  pageHeight: number,
): Silhouette {
  const cam = new THREE.PerspectiveCamera(
    CAMERA_FOV,
    pageWidth / pageHeight,
    0.3,
    200,
  );
  const w = poseToWorld(pose);
  cam.position.set(w.cam[0], w.cam[1], w.cam[2]);
  cam.lookAt(new THREE.Vector3(w.target[0], w.target[1], w.target[2]));
  return computeSilhouetteFromCamera(model, cam, pageWidth, pageHeight);
}

/**
 * Returns the widest left/right span across all silhouette rows that fall
 * inside `[lineTop, lineBottom]`. Returns null when the line is fully clear
 * of the model (in which case pretext lays it out at full column width).
 */
function silhouetteSpanForLine(
  s: Silhouette,
  lineTop: number,
  lineBottom: number,
): { left: number; right: number } | null {
  if (lineBottom < s.minY || lineTop > s.maxY) return null;
  let left = Infinity;
  let right = -Infinity;
  const startBin =
    Math.floor((lineTop - SILHOUETTE_PAD_Y) / s.binSize) * s.binSize;
  const endBin =
    Math.ceil((lineBottom + SILHOUETTE_PAD_Y) / s.binSize) * s.binSize;
  for (let y = startBin; y <= endBin; y += s.binSize) {
    const r = s.rows.get(y);
    if (r) {
      if (r.left < left) left = r.left;
      if (r.right > right) right = r.right;
    }
  }
  if (left === Infinity) return null;
  return { left: left - SILHOUETTE_PAD_X, right: right + SILHOUETTE_PAD_X };
}

// ---- Background canvas with scroll-driven camera ------------------------

interface FeatureSlot {
  feature: ChapterFeature;
  active: boolean;
  meshRef: RefObject<THREE.Mesh | null>;
}

function BackgroundCanvas({
  model,
  pose,
  modelOffset,
  features,
  fogColor,
  fogNear,
  fogFar,
  assemblyReveal,
  pageWidth,
  pageHeight,
  onSilhouette,
}: {
  model: OptimizedModel | null;
  pose: OrbitPose;
  modelOffset: [number, number, number];
  features: FeatureSlot[];
  fogColor: string;
  fogNear: number;
  fogFar: number;
  assemblyReveal: number;
  pageWidth: number;
  pageHeight: number;
  onSilhouette: (s: Silhouette) => void;
}) {
  const initialCam = poseToWorld(pose).cam;
  return (
    <div className="pointer-events-none fixed inset-0 z-0 [&_canvas]:pointer-events-none [&_canvas]:animate-article-canvas-in [&_canvas]:opacity-0">
      <Canvas
        shadows
        camera={{ position: initialCam, fov: CAMERA_FOV, near: 0.3, far: 200 }}
        gl={async (props) => {
          const renderer = new THREE.WebGPURenderer({
            ...(props as THREE.WebGPURendererParameters),
            antialias: true,
            alpha: true,
          });
          await renderer.init();
          renderer.setClearColor(0x000000, 0);
          renderer.toneMapping = THREE.ACESFilmicToneMapping;
          renderer.toneMappingExposure = 1.5;
          renderer.outputColorSpace = THREE.SRGBColorSpace;
          renderer.shadowMap.enabled = true;
          renderer.shadowMap.type = THREE.PCFSoftShadowMap;
          // Required for material.clippingPlanes to take effect — used by
          // the stats chapter to sweep an upward clip across the model
          // for layer-by-layer assembly.
          renderer.localClippingEnabled = true;
          return renderer;
        }}
      >
        {/* Linear fog: objects start fading at near=22 and are fully fog
            colour by far=45. The default chapters keep Batman well inside
            `near`, so fog is a no-op for them; chapter VI pushes him 35
            units back so his distance lands past `far` and he dissolves
            entirely into whatever colour the active theme paints. */}
        <fog attach="fog" args={[fogColor, fogNear, fogFar]} />
        <FogController color={fogColor} />
        <ambientLight intensity={1.2} color="#dde3ec" />
        <hemisphereLight args={["#f0f4fb", "#4a5160", 1.4]} />
        <directionalLight
          position={[8, 14, 6]}
          intensity={2.8}
          color="#fff5e6"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-bias={-0.0005}
          shadow-radius={5}
        />
        <directionalLight position={[-10, 6, -4]} intensity={1.8} color="#a8bbdb" />
        <directionalLight position={[0, -4, 8]} intensity={0.8} color="#b8c4d8" />
        <pointLight position={[-6, 2, 6]} intensity={50} color="#9d3b4d" decay={2} />
        <pointLight position={[6, 2, 6]} intensity={50} color="#3b5b9d" decay={2} />

        {model && (
          <ScrollCameraModel
            model={model}
            pose={pose}
            modelOffset={modelOffset}
            assemblyReveal={assemblyReveal}
          />
        )}
        {features.map((slot, i) => (
          <FeaturePlane
            key={i}
            feature={slot.feature}
            active={slot.active}
            meshRef={slot.meshRef}
          />
        ))}
        {model && (
          <LiveSilhouetteSampler
            model={model}
            pageWidth={pageWidth}
            pageHeight={pageHeight}
            onSilhouette={onSilhouette}
            features={features}
          />
        )}

        {/* Soft shadow pool. */}
        <mesh
          position={[0, 0.01, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          receiveShadow
        >
          <planeGeometry args={[60, 60]} />
          <shadowNodeMaterial color="#000000" opacity={0.5} transparent />
        </mesh>
      </Canvas>
    </div>
  );
}

/**
 * Lerps `scene.fog.color` toward the active chapter's theme background.
 * Without this, the fog colour would snap on chapter change and Batman
 * would briefly silhouette against the wrong colour while walking into
 * the distance.
 */
function FogController({ color }: { color: string }) {
  const scene = useThree((s) => s.scene);
  const target = useMemo(() => new THREE.Color(color), [color]);
  useFrame((_, dt) => {
    if (!scene.fog) return;
    const fog = scene.fog as THREE.Fog;
    fog.color.lerp(target, 1 - Math.exp(-2.5 * dt));
  });
  return null;
}

/**
 * Renders a chapter's photograph as a textured plane in the 3D scene
 * with a paper-stock backing card behind it. Opacity lerps to 0 when its
 * chapter is inactive, so transitions cross-fade into the next pose.
 *
 * `meshRef` is forwarded to the photo mesh so the silhouette sampler can
 * project the plane's vertices through the live camera each frame and
 * include the photo as part of the obstacle the body text wraps around.
 */
function FeaturePlane({
  feature,
  active,
  meshRef,
}: {
  feature: ChapterFeature;
  active: boolean;
  meshRef: RefObject<THREE.Mesh | null>;
}) {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const cardRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    let cancelled = false;
    new THREE.TextureLoader().load(feature.src, (t) => {
      if (cancelled) return;
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 8;
      setTexture(t);
    });
    return () => {
      cancelled = true;
    };
  }, [feature.src]);

  useFrame((_, dt) => {
    const target = active ? 1 : 0;
    // Fade out ~3× faster than fade in: a non-active plane should clear
    // the scene quickly during fast scrolls so you don't see stale photos
    // ghosting through other chapters' poses.
    const rate = active ? 6.0 : 25.0;
    const k = 1 - Math.exp(-rate * dt);
    const apply = (m: THREE.Mesh | null) => {
      if (!m) return;
      const mat = m.material as THREE.MeshBasicMaterial | undefined;
      if (!mat) return;
      mat.opacity = mat.opacity + (target - mat.opacity) * k;
      m.visible = mat.opacity > 0.005;
    };
    apply(meshRef.current);
    apply(cardRef.current);
  });

  if (!texture) return null;

  // Paper card sits ~half-percent larger and a hair behind the photo, with
  // a touch more bottom margin — gives the figure a polaroid silhouette
  // without modelling a full frame.
  const [w, h] = feature.size;
  const cardPad = 0.18;
  return (
    <group
      position={feature.position}
      rotation={[0, feature.rotationY ?? 0, 0]}
    >
      <mesh ref={cardRef} position={[0, -0.18, -0.01]} visible={false}>
        <planeGeometry args={[w + cardPad * 2, h + cardPad * 3.5]} />
        <meshBasicMaterial
          color="#f4ecd6"
          transparent
          opacity={0}
          toneMapped={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh ref={meshRef} visible={false}>
        <planeGeometry args={[w, h]} />
        <meshBasicMaterial
          map={texture}
          transparent
          opacity={0}
          toneMapped={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

/**
 * Animates the camera between chapter poses by smoothing the **orbit
 * parameters** (azimuth/radius/heights/pivot) instead of cartesian
 * cam.xyz. This means a 0° → 180° flip between chapters arcs around the
 * model along the shortest direction rather than lerping straight
 * through the model's interior.
 */
function ScrollCameraModel({
  model,
  pose,
  modelOffset,
  assemblyReveal,
}: {
  model: OptimizedModel;
  pose: OrbitPose;
  modelOffset: [number, number, number];
  assemblyReveal: number;
}) {
  const camera = useThree((s) => s.camera);
  const live = useRef<OrbitPose>({ ...pose });
  const liveOffset = useRef<[number, number, number]>([...modelOffset]);
  const lookAt = useRef(new THREE.Vector3());

  // World-space horizontal clip plane: normal=(0,-1,0) means the half-
  // space below the plane is kept, above is discarded. constant = revealY
  // is the world Y of the cut. Shared across every brick material so one
  // assignment per material is enough.
  const planeRef = useRef(
    new THREE.Plane(new THREE.Vector3(0, -1, 0), model.height + 1),
  );
  const liveReveal = useRef(model.height + 1);

  useEffect(() => {
    const plane = planeRef.current;
    const apply = (m: THREE.Material) => {
      m.clippingPlanes = [plane];
      m.clipShadows = true;
      (m as { needsUpdate?: boolean }).needsUpdate = true;
    };
    model.group.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (!mesh.isMesh) return;
      const mat = mesh.material;
      if (Array.isArray(mat)) mat.forEach(apply);
      else if (mat) apply(mat);
    });
  }, [model]);

  useFrame((_, delta) => {
    const cur = live.current;
    cur.azimuth = dampAngle(cur.azimuth, pose.azimuth, delta);
    cur.radius = dampScalar(cur.radius, pose.radius, delta);
    cur.cameraY = dampScalar(cur.cameraY, pose.cameraY, delta);
    cur.targetY = dampScalar(cur.targetY, pose.targetY, delta);
    cur.pivotX = dampScalar(cur.pivotX ?? 0, pose.pivotX ?? 0, delta);

    const off = liveOffset.current;
    off[0] = dampScalar(off[0], modelOffset[0], delta);
    off[1] = dampScalar(off[1], modelOffset[1], delta);
    off[2] = dampScalar(off[2], modelOffset[2], delta);
    model.group.position.set(off[0], off[1], off[2]);

    // Map reveal 0..1 → world Y 0..modelHeight. Snap up at the top so
    // geometry tangent to model.height (cowl ears, mostly) doesn't
    // shimmer at the boundary plane.
    const target =
      assemblyReveal >= 0.999
        ? model.height + 0.5
        : assemblyReveal * model.height;
    liveReveal.current = dampScalar(liveReveal.current, target, delta);
    planeRef.current.constant = liveReveal.current;

    const w = poseToWorld(cur);
    camera.position.set(w.cam[0], w.cam[1], w.cam[2]);
    lookAt.current.set(w.target[0], w.target[1], w.target[2]);
    camera.lookAt(lookAt.current);
  });

  return <primitive object={model.group} />;
}

/**
 * Each frame, project the model through the live camera and push the
 * resulting silhouette upstream. The text wrap upstairs re-runs pretext
 * whenever this fires, so the column edges hit-test the model in real
 * time as the scroll-driven camera moves between chapter poses.
 *
 * We throttle to ~33 ms (≈30 Hz) and skip when the camera matrix hasn't
 * changed — silhouette work and the relayout it triggers are wasted
 * otherwise, and most frames the camera is settled at a chapter pose.
 */
function LiveSilhouetteSampler({
  model,
  pageWidth,
  pageHeight,
  onSilhouette,
  features,
}: {
  model: OptimizedModel;
  pageWidth: number;
  pageHeight: number;
  onSilhouette: (s: Silhouette) => void;
  features: FeatureSlot[];
}) {
  const camera = useThree((s) => s.camera);
  const accum = useRef(0);
  const lastMatrix = useRef(new THREE.Matrix4());
  const lastFeatureMatrices = useRef<THREE.Matrix4[]>([]);
  const lastFeatureOpacities = useRef<number[]>([]);
  const dirtyTicks = useRef(0);

  useFrame((_, delta) => {
    accum.current += delta;
    if (accum.current < 0.033) return;
    accum.current = 0;

    camera.updateMatrixWorld(true);
    const camMoved = !camera.matrixWorld.equals(lastMatrix.current);

    // Track each feature mesh's matrix + opacity. Any change means the
    // silhouette obstacle has moved or faded, so we need to re-sample
    // even if the camera is stationary.
    let featureChanged = false;
    const meshes: (THREE.Mesh | null)[] = [];
    for (let i = 0; i < features.length; i++) {
      const m = features[i]!.meshRef.current;
      meshes.push(m);
      if (!m) continue;
      m.updateMatrixWorld(true);
      const mat = m.material as THREE.MeshBasicMaterial | undefined;
      const op = mat?.opacity ?? 0;
      const lm = lastFeatureMatrices.current[i];
      const lo = lastFeatureOpacities.current[i] ?? -1;
      if (!lm) {
        lastFeatureMatrices.current[i] = new THREE.Matrix4().copy(m.matrixWorld);
        lastFeatureOpacities.current[i] = op;
        if (op > 0.01) featureChanged = true;
      } else if (
        !m.matrixWorld.equals(lm) ||
        Math.abs(op - lo) > 0.01
      ) {
        lm.copy(m.matrixWorld);
        lastFeatureOpacities.current[i] = op;
        featureChanged = true;
      }
    }

    if (camMoved) lastMatrix.current.copy(camera.matrixWorld);

    if (camMoved || featureChanged) {
      dirtyTicks.current = 2;
    } else if (dirtyTicks.current <= 0) {
      return;
    } else {
      dirtyTicks.current--;
    }

    const s = computeSilhouetteFromCamera(
      model,
      camera,
      pageWidth,
      pageHeight,
      meshes,
    );
    onSilhouette(s);
  });

  return null;
}

// ---- Pretext text-flow component ----------------------------------------

// Viewport breakpoint between desktop and mobile. Below this, the
// silhouette wrap is suppressed (the figure would crowd both text columns
// to under MIN_SEGMENT_WIDTH on phones) and per-edge padding shrinks so
// the prose still has room to breathe.
const MOBILE_BREAKPOINT = 720;
const TEXT_PAD_DESKTOP = 56;
const TEXT_PAD_MOBILE = 20;
const MIN_SEGMENT_WIDTH = 60; // px — drop a segment if it's narrower
const MAX_PROSE_WIDTH = 678; // px — cap measure for readable line length

function textPadFor(pageWidth: number) {
  return pageWidth < MOBILE_BREAKPOINT ? TEXT_PAD_MOBILE : TEXT_PAD_DESKTOP;
}

// Cap the active prose column at min(50%, 678px) of the page so lines don't
// stretch into unreadable measures on wide viewports. The silhouette wrap
// still uses the full pageWidth so the text continues to dodge the model.
function proseRightEdge(pageWidth: number, pad: number) {
  const cap = Math.min(pageWidth * 0.5, MAX_PROSE_WIDTH);
  return Math.min(pageWidth - pad, pad + cap);
}

/**
 * One typographic block in a flowed layout. The same `FlowedRichText`
 * component handles the article's eyebrow + title + lede header *and*
 * each chapter's body — they're just different sequences of blocks.
 * Paragraph boundaries are encoded inside `text` as `\n\n` so a single
 * block can carry multiple stanzas with shared font/lineHeight.
 */
interface FlowBlock {
  text: string;
  font: string;
  lineHeight: number;
  /** CSS letter-spacing in px. Mirrored into pretext's measurement so the
   *  rendered span and the laid-out width agree. */
  letterSpacing?: number;
  className?: string;
  /** Vertical gap above this block (above its first line). */
  marginTop?: number;
  /** Vertical gap between paragraphs inside this block. */
  paragraphGap?: number;
}

interface FlowedLine {
  text: string;
  y: number;
  x: number;
  font: string;
  lineHeight: number;
  letterSpacing?: number;
  className?: string;
}

/**
 * Lays out a stack of `FlowBlock`s around the model's silhouette using
 * pretext.
 *
 * For each line, we ask the silhouette for its left/right span at the
 * line's Y range, then decide *per line* what to do with the space:
 *
 *   - both sides have room → split into two segments, cursor flowing
 *     left-then-right, so the paragraph reads continuously around the
 *     model (words may break mid-word across the silhouette).
 *   - only one side has room → single segment on that side.
 *   - neither side has room → skip the row entirely (silhouette covers
 *     the whole text column at this Y).
 *
 * Because the side decision is per-line, the wrap auto-shifts as the
 * live silhouette moves: a chapter that frames Batman dead-centre
 * splits both ways, but as the camera dollies him toward one edge the
 * column smoothly collapses to a single side — no per-block mode needed.
 */
function FlowedRichText({
  blocks,
  pageWidth,
  startY,
  silhouette,
  viewportYOffset,
  xOffset = 0,
}: {
  blocks: FlowBlock[];
  pageWidth: number;
  startY: number;
  silhouette: Silhouette | null;
  /** Viewport-Y of the container's top in document coords. Each line's
   *  silhouette query uses its viewport-Y (lineTop + viewportYOffset) so
   *  wrap follows the model as the page scrolls past the fixed canvas. */
  viewportYOffset: number;
  /** Viewport-X of the container's left edge. The silhouette is sampled
   *  in full-viewport pixel coords (the canvas is `position: fixed; inset: 0`),
   *  but text is laid out inside this container; subtract `xOffset` from
   *  silhouette spans so wrap positions land in container coords. */
  xOffset?: number;
}) {
  const layout = useMemo(() => {
    const lines: FlowedLine[] = [];
    const TEXT_PAD = textPadFor(pageWidth);
    const RIGHT_EDGE = proseRightEdge(pageWidth, TEXT_PAD);
    const fullWidth = RIGHT_EDGE - TEXT_PAD;
    let y = startY;

    for (const block of blocks) {
      y += block.marginTop ?? 0;
      const paragraphs = block.text.split("\n\n");
      const paraGap = block.paragraphGap ?? PARAGRAPH_GAP;

      for (let pi = 0; pi < paragraphs.length; pi++) {
        const para = paragraphs[pi]!;
        if (!para) continue;
        const prepared = prepareWithSegments(para, block.font, {
          letterSpacing: block.letterSpacing,
        });
        let cursor: LayoutCursor = { segmentIndex: 0, graphemeIndex: 0 };
        let safety = 0;

        const placeLine = (text: string, x: number) => {
          lines.push({
            text,
            y,
            x,
            font: block.font,
            lineHeight: block.lineHeight,
            letterSpacing: block.letterSpacing,
            className: block.className,
          });
        };

        while (safety++ < 10000) {
          const lineTop = y;
          const lineBottom = y + block.lineHeight;
          const rawSpan = silhouette
            ? silhouetteSpanForLine(
                silhouette,
                lineTop + viewportYOffset,
                lineBottom + viewportYOffset,
              )
            : null;
          const span = rawSpan
            ? { left: rawSpan.left - xOffset, right: rawSpan.right - xOffset }
            : null;

          let placedSomething = false;
          let maxSegmentWidth = 0;

          if (span) {
            const leftEdge = Math.min(
              Math.max(TEXT_PAD, span.left),
              RIGHT_EDGE,
            );
            const rightEdge = Math.max(
              Math.min(RIGHT_EDGE, span.right),
              TEXT_PAD,
            );
            const leftSegW = leftEdge - TEXT_PAD;
            const rightSegW = RIGHT_EDGE - rightEdge;
            maxSegmentWidth = Math.max(leftSegW, rightSegW);

            if (leftSegW >= MIN_SEGMENT_WIDTH) {
              const range = layoutNextLineRange(prepared, cursor, leftSegW);
              if (range) {
                const ln = materializeLineRange(prepared, range);
                placeLine(ln.text, TEXT_PAD);
                cursor = range.end;
                placedSomething = true;
              }
            }
            if (rightSegW >= MIN_SEGMENT_WIDTH) {
              const range = layoutNextLineRange(prepared, cursor, rightSegW);
              if (range) {
                const ln = materializeLineRange(prepared, range);
                placeLine(ln.text, rightEdge);
                cursor = range.end;
                placedSomething = true;
              }
            }
          } else {
            maxSegmentWidth = fullWidth;
            const range = layoutNextLineRange(prepared, cursor, fullWidth);
            if (range) {
              const ln = materializeLineRange(prepared, range);
              placeLine(ln.text, TEXT_PAD);
              cursor = range.end;
              placedSomething = true;
            }
          }

          y += block.lineHeight;

          if (!placedSomething) {
            // If we had real width to work with and pretext still couldn't
            // give us a range, the paragraph is exhausted. Otherwise the
            // silhouette pinched the line below MIN_SEGMENT_WIDTH; skip
            // down to find clearer space.
            if (maxSegmentWidth >= MIN_SEGMENT_WIDTH) break;
            continue;
          }
        }
        if (pi < paragraphs.length - 1) y += paraGap;
      }
    }
    return { lines, height: y };
  }, [blocks, pageWidth, silhouette, startY, viewportYOffset, xOffset]);

  return (
    <div
      style={{ position: "relative", width: pageWidth, height: layout.height }}
    >
      {layout.lines.map((line, i) => (
        <span
          key={i}
          className={line.className}
          style={{
            position: "absolute",
            top: line.y,
            left: line.x,
            font: line.font,
            lineHeight: `${line.lineHeight}px`,
            letterSpacing:
              line.letterSpacing != null ? `${line.letterSpacing}px` : undefined,
            whiteSpace: "pre",
          }}
        >
          {line.text}
        </span>
      ))}
    </div>
  );
}

// ---- Chapter section ----------------------------------------------------

function ChapterSection({
  chapter,
  index,
  onActivate,
  pageWidth,
  pageHeight,
  silhouette,
  scrollY,
  onProgress,
  buildHref,
}: {
  chapter: ChapterDef;
  index: number;
  onActivate: (idx: number) => void;
  pageWidth: number;
  pageHeight: number;
  silhouette: Silhouette | null;
  scrollY: number;
  onProgress?: (p: number) => void;
  buildHref?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [documentTop, setDocumentTop] = useState(0);
  const [documentLeft, setDocumentLeft] = useState(0);
  const [sectionHeight, setSectionHeight] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const rect = el.getBoundingClientRect();
      setDocumentTop(rect.top + window.scrollY);
      setDocumentLeft(rect.left);
      setSectionHeight(rect.height);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    if (document.body) ro.observe(document.body);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  // Scroll progress within the section: 0 when the viewport centre is at
  // section top, 1 when it's at section bottom. Drives both the stats
  // counters and the model-assembly clipping plane.
  const progress = useMemo(() => {
    if (sectionHeight <= 0) return 0;
    const centre = scrollY + pageHeight / 2;
    const p = (centre - documentTop) / sectionHeight;
    return Math.max(0, Math.min(1, p));
  }, [scrollY, documentTop, sectionHeight, pageHeight]);

  useEffect(() => {
    onProgress?.(progress);
  }, [progress, onProgress]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && e.intersectionRatio > 0.55) {
            onActivate(index);
          }
        }
      },
      { threshold: [0.55, 0.7, 0.85] },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [index, onActivate]);

  const viewportYOffset = documentTop - scrollY;

  const blocks = useMemo<FlowBlock[]>(
    () => {
      const out: FlowBlock[] = [
        {
          text: chapter.heading,
          font: '400 26px "Cinzel", serif',
          lineHeight: 32,
          letterSpacing: 26 * 0.06,
          className: "article-h2-line",
        },
        {
          text: chapter.paragraphs.join("\n\n"),
          font: BODY_FONT,
          lineHeight: BODY_LINE_HEIGHT,
          marginTop: 22,
          className: "article-line",
        },
      ];
      // Feature caption flows as silhouette-aware monospace at the end of
      // the chapter — ends up tucked below the photo plane wherever the
      // text wrap let it land.
      if (chapter.feature?.caption) {
        out.push({
          text: chapter.feature.caption,
          font: '500 11px "JetBrains Mono", ui-monospace, monospace',
          lineHeight: 18,
          letterSpacing: 11 * 0.08,
          className: "article-eyebrow-line",
          marginTop: 28,
        });
      }
      return out;
    },
    [chapter.heading, chapter.paragraphs, chapter.feature?.caption],
  );

  // Outro layout: ditch the silhouette wrap and the in-flow heading. We
  // want a clean, snappy "different view" — heading + lede pinned to the
  // top-left, action cluster (Workshop / AR) tucked into the bottom-right,
  // and the figure dead-centre with nothing crossing it.
  if (chapter.outro) {
    return (
      <section
        ref={ref}
        className="relative w-full overflow-hidden"
        style={{ minHeight: `${chapter.minHeightVh ?? 100}vh` }}
      >
        <header className="pointer-events-none absolute left-14 top-24 z-[3] max-w-[min(580px,44vw)] max-[720px]:left-5 max-[720px]:right-5 max-[720px]:top-16 max-[720px]:max-w-none">
          <span className="mb-[22px] block font-['JetBrains_Mono',ui-monospace,monospace] text-[10.5px] font-medium uppercase tracking-[0.4em] text-[var(--article-eyebrow,rgba(255,255,255,0.55))] [text-shadow:var(--article-shadow-soft,0_1px_6px_rgba(0,0,0,0.85))] transition-[color,text-shadow] duration-700 ease-out max-[720px]:mb-3.5 max-[720px]:text-[10px] max-[720px]:tracking-[0.3em]">
            STUDIO
          </span>
          <h2 className="m-0 mb-[22px] font-['Cinzel',serif] text-[clamp(36px,4.4vw,56px)] font-light leading-[1.04] tracking-[0.04em] text-[var(--article-title,#050505)] [text-shadow:var(--article-shadow-strong,0_4px_24px_rgba(0,0,0,0.9))] transition-[color,text-shadow] duration-700 ease-out max-[720px]:mb-3.5 max-[720px]:text-[clamp(28px,9vw,40px)]">
            {chapter.heading}
          </h2>
          {chapter.paragraphs.map((p, i) => (
            <p
              key={i}
              className="m-0 font-['Inter',sans-serif] text-[18px] font-light leading-[1.5] text-[var(--article-lede,rgba(255,255,255,0.84))] [text-shadow:var(--article-shadow,0_1px_8px_rgba(0,0,0,0.95))] transition-[color,text-shadow] duration-700 ease-out max-[720px]:text-base max-[720px]:leading-[1.45]"
            >
              {p}
            </p>
          ))}
        </header>
        <div className="absolute bottom-14 right-14 z-[3] inline-flex items-stretch gap-3 max-[720px]:bottom-7 max-[720px]:left-5 max-[720px]:right-5 max-[720px]:gap-2.5">
          {chapter.buildCTA && buildHref && (
            <Link
              href={buildHref as never}
              className="group/build inline-flex cursor-pointer items-center gap-3 border border-[rgba(5,5,7,0.18)] bg-[rgba(5,5,7,0.04)] px-[22px] py-4 font-['JetBrains_Mono',ui-monospace,monospace] text-[11.5px] font-medium uppercase tracking-[0.32em] text-[#050507] no-underline transition-[background-color,color,border-color,letter-spacing,transform,box-shadow] duration-200 ease-out hover:-translate-y-px hover:border-[#f5b400] hover:bg-[#f5b400] hover:tracking-[0.36em] hover:text-[#050507] hover:shadow-[0_8px_28px_rgba(245,180,0,0.35)] max-[720px]:flex-1 max-[720px]:justify-center max-[720px]:gap-2.5 max-[720px]:px-4 max-[720px]:py-3.5 max-[720px]:text-[10.5px] max-[720px]:tracking-[0.22em]"
            >
              <span
                aria-hidden
                className="inline-block h-[7px] w-[7px] rounded-full bg-[#f5b400] transition-transform duration-200 ease-out group-hover/build:scale-110"
              />
              <span>{chapter.buildCTA.label}</span>
              <span
                className="font-['Inter',sans-serif] text-base font-light tracking-normal transition-transform duration-200 ease-out group-hover/build:translate-x-1"
                aria-hidden
              >
                →
              </span>
            </Link>
          )}
          {chapter.arHref && (
            <ARButton
              href={chapter.arHref}
              loading={false}
              className="article-ar"
            />
          )}
        </div>
      </section>
    );
  }

  return (
    <section
      ref={ref}
      className="relative w-full"
      style={{ minHeight: `${chapter.minHeightVh ?? 100}vh` }}
    >
      <FlowedRichText
        blocks={blocks}
        pageWidth={pageWidth}
        startY={56}
        silhouette={silhouette}
        viewportYOffset={viewportYOffset}
        xOffset={documentLeft}
      />
      {chapter.stats && (
        <StatsGrid stats={chapter.stats} dimensions={chapter.dimensions} />
      )}
      {chapter.buildCTA && buildHref && (
        <div className="px-14 pt-10 max-[720px]:px-5">
          <Link
            href={buildHref as never}
            className="group/build inline-flex cursor-pointer items-center gap-3.5 border border-[#050507] bg-[#050507] px-[30px] py-4 font-['JetBrains_Mono',ui-monospace,monospace] text-[11.5px] font-medium uppercase tracking-[0.32em] text-white transition-[background-color,color,border-color,letter-spacing,transform,box-shadow] duration-200 ease-out hover:-translate-y-px hover:border-[#f5b400] hover:bg-[#f5b400] hover:tracking-[0.36em] hover:text-[#050507] hover:shadow-[0_8px_28px_rgba(245,180,0,0.35)]"
          >
            <span>{chapter.buildCTA.label}</span>
            <span
              className="font-['Inter',sans-serif] text-base font-light tracking-normal transition-transform duration-200 ease-out group-hover/build:translate-x-1"
              aria-hidden
            >
              →
            </span>
          </Link>
        </div>
      )}
    </section>
  );
}

/**
 * Animated 2x2 grid of headline numbers. Counters fire once when the
 * grid first enters the viewport — they don't re-animate on every scroll
 * sample, which made the final values impossible to read. Each counter
 * gets a small lead-in delay so the four numbers cascade rather than
 * resolve in unison. The scroll-driven assembly reveal of the model is
 * unaffected — that lives separately on the chapter section.
 */
function StatsGrid({
  stats,
  dimensions,
}: {
  stats: StatItem[];
  dimensions?: ChapterDimensions;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && e.intersectionRatio > 0.2) {
            setStarted(true);
            obs.disconnect();
            return;
          }
        }
      },
      { threshold: [0.2, 0.4] },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref}>
      <div className="pointer-events-none relative mt-14 grid max-w-[min(640px,50%)] grid-cols-2 gap-x-14 gap-y-11 px-14 max-[720px]:mt-9 max-[720px]:max-w-full max-[720px]:grid-cols-1 max-[720px]:gap-7 max-[720px]:px-5">
        {stats.map((stat, i) => (
          <div key={stat.label} className="relative">
            <div className="mb-2 font-['JetBrains_Mono',ui-monospace,monospace] text-[9.5px] font-medium tracking-[0.36em] text-[var(--article-heading,#f5b400)] opacity-85 transition-[color] duration-700 ease-out">
              {String(i + 1).padStart(2, "0")}
            </div>
            <div className="mb-3.5 font-['JetBrains_Mono',ui-monospace,monospace] text-[10.5px] font-medium uppercase tracking-[0.32em] text-[var(--article-eyebrow,rgba(255,255,255,0.55))] transition-[color] duration-700 ease-out">
              {stat.label}
            </div>
            <div className="flex items-baseline font-['Cinzel','Trajan_Pro',serif] text-[clamp(46px,6.2vw,80px)] font-light leading-[0.92] tabular-nums tracking-[0.005em] text-[var(--article-heading,#f5b400)] [text-shadow:var(--article-shadow-strong,0_4px_24px_rgba(0,0,0,0.9),0_0_2px_rgba(0,0,0,0.95))] transition-[color,text-shadow] duration-700 ease-out max-[720px]:text-[clamp(40px,12vw,64px)]">
              <AnimatedNumber
                value={stat.value}
                active={started}
                decimals={stat.decimals ?? 0}
                prefix={stat.prefix}
                suffix={stat.suffix}
                delayMs={i * 130}
              />
            </div>
            <div className="mt-[18px] h-px bg-current opacity-[0.18] transition-[background-color] duration-700 ease-out" />
          </div>
        ))}
      </div>
      {dimensions && (
        <div
          className={`pointer-events-none mt-9 flex max-w-[min(640px,50%)] flex-wrap items-baseline gap-4 px-14 text-[var(--article-fg,rgba(255,255,255,0.85))] transition-[opacity,transform,color] duration-[900ms,900ms,700ms] ease-[cubic-bezier(0.2,0.7,0.2,1),cubic-bezier(0.2,0.7,0.2,1),ease] motion-reduce:transition-none motion-reduce:!translate-y-0 motion-reduce:!opacity-100 ${started ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}`}
          style={{ transitionDelay: `${stats.length * 130 + 200}ms` }}
        >
          <span className="font-['JetBrains_Mono',ui-monospace,monospace] text-[10.5px] font-medium uppercase tracking-[0.32em] text-[var(--article-eyebrow,rgba(255,255,255,0.55))] transition-[color] duration-700 ease-out">
            DIMENSIONS
          </span>
          <span className="font-['JetBrains_Mono',ui-monospace,monospace] text-[18px] font-medium tabular-nums tracking-[0.04em] text-[var(--article-heading,#f5b400)] [text-shadow:var(--article-shadow,0_1px_6px_rgba(0,0,0,0.85))] transition-[color,text-shadow] duration-700 ease-out">
            {dimensions.height_cm} × {dimensions.width_cm} ×{" "}
            {dimensions.depth_cm}
            <span className="ml-[0.18em] text-[0.78em] opacity-[0.72]"> cm</span>
          </span>
          <span className="font-['JetBrains_Mono',ui-monospace,monospace] text-[9.5px] uppercase tracking-[0.18em] opacity-55">
            h × w × d
          </span>
        </div>
      )}
    </div>
  );
}

/**
 * One-shot ease-out count-up. Renders the formatted number with optional
 * prefix/suffix; the suffix lands in a small unit span so the CSS can
 * style it (smaller, faded) without the parent caring.
 *
 * Animation kicks off the first time `active` flips true, then stays at
 * the final value forever — no scroll-rebinding, no reset on scroll-out.
 */
function AnimatedNumber({
  value,
  active,
  decimals = 0,
  prefix,
  suffix,
  durationMs = 1500,
  delayMs = 0,
}: {
  value: number;
  active: boolean;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  durationMs?: number;
  delayMs?: number;
}) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!active) return;
    let raf = 0;
    let cancelled = false;
    let start = -1;
    const tick = (t: number) => {
      if (cancelled) return;
      if (start < 0) start = t;
      const elapsed = t - start - delayMs;
      if (elapsed < 0) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const p = Math.min(1, elapsed / durationMs);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(value * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, [active, value, durationMs, delayMs]);

  const formatted =
    decimals === 0
      ? Math.round(display).toLocaleString("en-US")
      : display.toFixed(decimals);
  return (
    <>
      {prefix ?? ""}
      {formatted}
      {suffix && (
        <span className="ml-[0.18em] font-['Inter',sans-serif] text-[0.34em] font-light tracking-[0.04em] opacity-[0.72]">
          {suffix}
        </span>
      )}
    </>
  );
}

/**
 * The article's intro block — eyebrow, big serif title, and lede — all
 * flowed through the same silhouette-aware layout as the chapter bodies.
 * Because each block declares its own font + line-height + letter-spacing,
 * the title hugs Batman's cowl and the lede wraps both sides of his
 * shoulders without us hand-positioning any of it.
 */
function FlowedHeader({
  pageWidth,
  silhouette,
  scrollY,
  intro,
}: {
  pageWidth: number;
  silhouette: Silhouette | null;
  scrollY: number;
  intro: ArticleIntro;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [documentTop, setDocumentTop] = useState(0);
  const [documentLeft, setDocumentLeft] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const updateTop = () => {
      const rect = el.getBoundingClientRect();
      setDocumentTop(rect.top + window.scrollY);
      setDocumentLeft(rect.left);
    };
    updateTop();
    const ro = new ResizeObserver(updateTop);
    ro.observe(el);
    if (document.body) ro.observe(document.body);
    window.addEventListener("resize", updateTop);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", updateTop);
    };
  }, []);

  // Title size scales with viewport but is clamped so pretext can measure
  // it as a fixed-px font. 6.5vw × inter-cap leading ≈ original CSS clamp.
  const titleSize = Math.max(48, Math.min(82, pageWidth * 0.062));
  const ledeSize = pageWidth >= 1200 ? 22 : 20;

  const blocks = useMemo<FlowBlock[]>(
    () => [
      {
        text: intro.title,
        font: `300 ${Math.round(titleSize)}px "Cinzel", serif`,
        lineHeight: Math.round(titleSize * 1.04),
        letterSpacing: titleSize * 0.04,
        className: "article-title-line",
        marginTop: 26,
      },
      {
        text: intro.lede,
        font: `300 ${ledeSize}px Inter, sans-serif`,
        lineHeight: Math.round(ledeSize * 1.42),
        className: "article-lede-line",
        marginTop: 32,
      },
    ],
    [titleSize, ledeSize, intro.title, intro.lede],
  );

  const viewportYOffset = documentTop - scrollY;

  return (
    <header
      ref={ref}
      className="relative w-full max-w-[720px] px-14 pb-14 pt-24 max-[720px]:px-5 max-[720px]:pb-8 max-[720px]:pt-14"
      style={{ minHeight: "92vh" }}
    >
      <FlowedRichText
        blocks={blocks}
        pageWidth={pageWidth}
        startY={92}
        silhouette={silhouette}
        viewportYOffset={viewportYOffset}
        xOffset={documentLeft}
      />
    </header>
  );
}

// ---- Main article view --------------------------------------------------

function useViewport() {
  const [size, setSize] = useState(() =>
    typeof window === "undefined"
      ? { w: 1280, h: 720 }
      : { w: window.innerWidth, h: window.innerHeight },
  );
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onResize = () =>
      setSize({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return size;
}

/**
 * Tracks `window.scrollY`, throttled to one update per animation frame.
 * Used to recompute text wrap as the page scrolls — every line's
 * silhouette query depends on its viewport-Y, which depends on scroll.
 */
function useScrollY() {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    if (typeof window === "undefined") return;
    let pending = 0;
    const update = () => {
      pending = 0;
      setScrollY(window.scrollY);
    };
    const onScroll = () => {
      if (pending) return;
      pending = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (pending) cancelAnimationFrame(pending);
    };
  }, []);
  return scrollY;
}

export default function Article({
  backHref,
  buildHref,
  articleId = "batman",
}: {
  backHref?: string;
  buildHref?: string;
  articleId?: ArticleId;
}) {
  const content = ARTICLE_CONTENTS[articleId];
  const CHAPTERS = content.chapters;

  const [model, setModel] = useState<OptimizedModel | null>(null);
  const [activeChapter, setActiveChapter] = useState(0);
  const [fontReady, setFontReady] = useState(false);
  const { w: pageWidth, h: pageHeight } = useViewport();
  const scrollY = useScrollY();

  useEffect(() => {
    let cancelled = false;
    setModel(null);
    setActiveChapter(0);
    loadOptimizedModel(content.modelFile, TARGET_HEIGHT).then((m) => {
      if (!cancelled) setModel(m);
    });
    return () => {
      cancelled = true;
    };
  }, [content.modelFile]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (!document.fonts) {
      setFontReady(true);
      return;
    }
    document.fonts.load(BODY_FONT).then(() => setFontReady(true));
  }, []);

  // One LIVE silhouette, driven by the canvas's actual camera. The first
  // chapter pose seeds it so the very first paint already wraps correctly
  // (without it, layout would render full-width for one frame, then snap
  // tighter once the canvas mounts and pushes its first sample up).
  const [liveSilhouette, setLiveSilhouette] = useState<Silhouette | null>(
    null,
  );
  const initialSilhouette = useMemo(() => {
    if (!model) return null;
    return computeSilhouetteFromPose(
      model,
      CHAPTERS[0]!.pose,
      pageWidth,
      pageHeight,
    );
  }, [model, pageWidth, pageHeight]);
  // On mobile the figure crowds out both text columns, so we drop the
  // silhouette wrap and lay text out at full column width instead. The
  // canvas still renders the model in the background; the prose just
  // overlays it (text-shadow keeps it legible).
  const isMobile = pageWidth < MOBILE_BREAKPOINT;
  const silhouette = isMobile ? null : liveSilhouette ?? initialSilhouette;

  // On mobile portrait the camera FOV is vertical, so an 8-unit-tall model
  // fills ~85% of the viewport at desktop-tuned radii — there's no room
  // for the heading or CTAs without overlapping the figure. Pulling the
  // camera back by 1.9× shrinks Batman to ~55% of the frame.
  //
  // Once we scale the camera distance, the scene depth (fog plane,
  // chapter VII's "walk into fog" modelOffset) has to scale by the same
  // factor or fog cuts in too early (Batman ghosts on chapter VIII at
  // fog.far=45 with a now-distance of ~36) or chapter VII's fog dissolve
  // doesn't reach (model offset sits inside the new fog far).
  const MOBILE_DEPTH_SCALE = 1.9;
  const rawPose = CHAPTERS[activeChapter]!.pose;
  const pose = isMobile
    ? { ...rawPose, radius: rawPose.radius * MOBILE_DEPTH_SCALE }
    : rawPose;
  const theme = CHAPTERS[activeChapter]!.theme ?? DARK_THEME;
  const rawOffset =
    CHAPTERS[activeChapter]!.modelOffset ?? ([0, 0, 0] as [number, number, number]);
  const modelOffset: [number, number, number] = isMobile
    ? [
        rawOffset[0] * MOBILE_DEPTH_SCALE,
        rawOffset[1] * MOBILE_DEPTH_SCALE,
        rawOffset[2] * MOBILE_DEPTH_SCALE,
      ]
    : rawOffset;
  const fogNear = isMobile ? 22 * MOBILE_DEPTH_SCALE : 22;
  const fogFar = isMobile ? 45 * MOBILE_DEPTH_SCALE : 45;

  // Scroll progress for the assembly-reveal chapter. Lives at the Article
  // root so it can drive both the stats counters (via the section that
  // reports it) and the canvas-side clipping plane.
  const revealChapterIndex = useMemo(
    () => CHAPTERS.findIndex((c) => c.revealAssembly),
    [CHAPTERS],
  );
  const [revealProgress, setRevealProgress] = useState(0);
  const assemblyReveal =
    revealChapterIndex >= 0 && activeChapter === revealChapterIndex
      ? revealProgress
      : 1;

  // One stable mesh ref per chapter that has a feature. The active flag
  // (computed each render from `activeChapter`) drives the photo's
  // opacity-fade in FeaturePlane; the meshRef lets the silhouette
  // sampler include its rectangle in the body-text wrap.
  const featureSources = useMemo(
    () =>
      CHAPTERS.flatMap((c, i) =>
        c.feature
          ? [
              {
                chapterIndex: i,
                feature: c.feature,
                meshRef: createRef<THREE.Mesh | null>(),
              },
            ]
          : [],
      ),
    [CHAPTERS],
  );
  const liveSlots: FeatureSlot[] = featureSources.map((s) => ({
    feature: s.feature,
    meshRef: s.meshRef,
    active: s.chapterIndex === activeChapter,
  }));

  // CSS transitions on `.article` animate these vars between chapters; no
  // JS lerp needed. The transition duration in index.html is the lerp.
  const themeStyle = {
    "--article-bg": theme.bg,
    "--article-fg": theme.fg,
    "--article-heading": theme.heading,
    "--article-title": theme.title,
    "--article-lede": theme.lede,
    "--article-shadow": theme.shadow,
    "--article-shadow-soft": theme.shadowSoft,
    "--article-shadow-strong": theme.shadowStrong,
  } as React.CSSProperties;

  return (
    <div
      className="relative min-h-screen animate-article-enter text-[var(--article-fg,#ececec)] [background-color:var(--article-bg,#050507)] transition-[background-color,color] duration-700 ease-out"
      style={themeStyle}
    >
      <BackgroundCanvas
        model={model}
        pose={pose}
        modelOffset={modelOffset}
        features={liveSlots}
        fogColor={theme.bg}
        fogNear={fogNear}
        fogFar={fogFar}
        assemblyReveal={assemblyReveal}
        pageWidth={pageWidth}
        pageHeight={pageHeight}
        onSilhouette={setLiveSilhouette}
      />

      <div className="relative z-[2] w-full animate-article-content-rise">
        {fontReady && model && (
          <FlowedHeader
            pageWidth={pageWidth}
            silhouette={silhouette}
            scrollY={scrollY}
            intro={content.intro}
          />
        )}

        {fontReady &&
          model &&
          CHAPTERS.map((chapter, i) => (
            <ChapterSection
              key={i}
              chapter={chapter}
              index={i}
              onActivate={setActiveChapter}
              pageWidth={pageWidth}
              pageHeight={pageHeight}
              silhouette={silhouette}
              scrollY={scrollY}
              onProgress={
                i === revealChapterIndex ? setRevealProgress : undefined
              }
              buildHref={buildHref}
            />
          ))}

        {/* The outro chapter's corner CTAs replace the textual footer —
            rendering both produces a redundant "Return to splash" pill at
            the bottom of an otherwise clean white frame. */}
        {!CHAPTERS.some((c) => c.outro) && (
          <footer className="px-14 pb-24 pt-20 max-[720px]:px-5 max-[720px]:pb-16 max-[720px]:pt-12">
            <div className="mb-7 h-px bg-current opacity-[0.16] transition-[background-color] duration-700 ease-out" />
            <div className="flex items-center justify-between max-[720px]:flex-col max-[720px]:items-start max-[720px]:gap-[18px]">
              <span className="font-['JetBrains_Mono',ui-monospace,monospace] text-[11px] uppercase tracking-[0.4em] text-white/55">
                END OF FEATURE
              </span>
              {backHref && (
                <Link
                  href={backHref as never}
                  className="inline-flex cursor-pointer items-center gap-3 border border-current bg-transparent px-[26px] py-3 font-['JetBrains_Mono',ui-monospace,monospace] text-[11px] font-medium uppercase tracking-[0.3em] text-[var(--article-fg,#fff)] transition-[background-color,color,border-color] duration-200 ease-out hover:border-current hover:bg-[var(--article-fg,#fff)] hover:text-[var(--article-bg,#050507)]"
                >
                  Return to splash <span aria-hidden>↺</span>
                </Link>
              )}
            </div>
          </footer>
        )}
      </div>
    </div>
  );
}
