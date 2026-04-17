import type { VisualDirectionConfig } from "@archetype-studio/core";

export const visualDirections: VisualDirectionConfig[] = [
  {
    id: "messy-phone-collage",
    label: "Messy Phone Collage",
    palette: {
      background: "#101014",
      panel: "#f4ecd8",
      accent: "#5bc0eb",
      ink: "#18181d",
      muted: "#5c5962"
    },
    typographyStyle: "mixed",
    assetStyle: "ui-fragments",
    layoutEnergy: "chaotic",
    moodTags: ["social", "phone", "messy", "internet"],
    assetPackIds: ["phone-ui-fragments", "emoji-stickers", "paper-textures"]
  },
  {
    id: "academic-margins",
    label: "Academic Margins",
    palette: {
      background: "#eee8dc",
      panel: "#fffdf7",
      accent: "#9b3328",
      ink: "#25201b",
      muted: "#686058"
    },
    typographyStyle: "serif",
    assetStyle: "symbols",
    layoutEnergy: "clean",
    moodTags: ["reader", "academic", "notes", "bookish"],
    assetPackIds: ["margin-notes", "paper-textures", "annotation-symbols"]
  },
  {
    id: "terminal-core",
    label: "Terminal Core",
    palette: {
      background: "#07110c",
      panel: "#101b14",
      accent: "#7dff9b",
      ink: "#e6ffee",
      muted: "#a6c7ae"
    },
    typographyStyle: "mono",
    assetStyle: "ui-fragments",
    layoutEnergy: "dense",
    moodTags: ["programming", "systems", "terminal", "logic"],
    assetPackIds: ["terminal-fragments", "syntax-shapes", "grid-textures"]
  },
  {
    id: "dreamy-music-mag",
    label: "Dreamy Music Mag",
    palette: {
      background: "#e9e1f4",
      panel: "#fff7fb",
      accent: "#e96f92",
      ink: "#2b2433",
      muted: "#725d78"
    },
    typographyStyle: "display",
    assetStyle: "photo-collage",
    layoutEnergy: "poster",
    moodTags: ["music", "dreamy", "magazine", "sound"],
    assetPackIds: ["music-collage", "grain-textures", "soft-light-leaks"]
  },
  {
    id: "soft-sticker-board",
    label: "Soft Sticker Board",
    palette: {
      background: "#f2e7da",
      panel: "#fffaf3",
      accent: "#cb5a37",
      ink: "#241d1a",
      muted: "#5f5956"
    },
    typographyStyle: "serif",
    assetStyle: "stickers",
    layoutEnergy: "clean",
    moodTags: ["general", "warm", "friendly", "starter"],
    assetPackIds: ["starter-stickers", "paper-textures", "simple-shapes"]
  }
];
