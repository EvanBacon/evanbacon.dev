import type { BlogConfig } from "./Blog";

export type BlogId = "masterChief";

export const BLOG_CONFIGS: Record<BlogId, BlogConfig> = {
  masterChief: {
    modelFile: "Master Chief Ground.ldr",
    arHref: "/lego/ar/Master Chief Ground.usdz",
    title: "Master Chief",
    subtitle: "MJOLNIR armour, brick by brick",
    kicker: "Issue 03 · Master Chief",
    cameraPosition: [0, 5.0, 22],
    cameraFov: 20,
    lookY: 4.6,
    sections: [
      {
        eyebrow: "I · Mass",
        heading: "Bulk over fluidity",
        paragraphs: [
          "Where Captain America is a study in restraint, the Chief is a study in mass. The MJOLNIR armour wants to read as engineered slabs — and brick stacking, with its strict orthogonal grid, is in this sense the perfect medium. The tradeoff is the visor, which has to suggest curvature with nothing but stepped edges.",
          "The figure stands on a small base plate — partly for stability, partly so the legs land on a clean reference line that gives the silhouette a strong horizontal anchor.",
        ],
      },
      {
        eyebrow: "II · Visor",
        heading: "A face without a face",
        paragraphs: [
          "The Chief never takes the helmet off. The model honours that — the visor is a single contiguous panel, deliberately unbroken, with its only highlight a thin gold band at the brow line.",
          "Reflectivity is faked through colour choice rather than a true gloss surface. Gold-trans bricks would have read flat under the splash's spotlight rig; the solid gold catches the rim light cleanly and lets the rest of the helmet stay matte.",
        ],
      },
      {
        eyebrow: "III · Pose",
        heading: "At rest, ready",
        paragraphs: [
          "Hands by the sides, weight distributed evenly — a posture that reads as alertness rather than action. Heroic stances tempt over-articulation; the brick figure's joints are locked, so any pose has to read in a single static frame.",
          "The base plate quietly does work the figure can't: a faint colour shift at the front edge implies the direction the Chief is facing, the way a film frame's foreground does for a wide shot.",
        ],
      },
    ],
  },
};
