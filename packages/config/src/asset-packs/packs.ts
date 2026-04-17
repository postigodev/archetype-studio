import type { AssetPackConfig } from "@archetype-studio/core";

const phoneBubble = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 140"><rect x="10" y="18" width="180" height="86" rx="30" fill="#5bc0eb"/><circle cx="58" cy="62" r="8" fill="#101014"/><circle cx="92" cy="62" r="8" fill="#101014"/><circle cx="126" cy="62" r="8" fill="#101014"/><path d="M58 104 34 132l8-36z" fill="#5bc0eb"/></svg>`;
const notification = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180"><rect x="20" y="42" width="140" height="96" rx="28" fill="#f4ecd8"/><circle cx="138" cy="42" r="28" fill="#ff5d5d"/><text x="138" y="52" text-anchor="middle" font-family="Arial" font-size="30" font-weight="700" fill="#fff">3</text><rect x="44" y="72" width="72" height="10" rx="5" fill="#101014"/><rect x="44" y="96" width="94" height="10" rx="5" fill="#5c5962"/></svg>`;
const starSticker = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160"><path d="m80 10 17 48 51 2-40 31 14 49-42-28-42 28 14-49-40-31 51-2z" fill="#ffd166" stroke="#101014" stroke-width="8" stroke-linejoin="round"/></svg>`;
const paperScrap = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 160"><path d="M18 22 202 10l-10 130-170 8z" fill="#fff7df"/><path d="M42 54h118M42 82h136M42 110h86" stroke="#8b7c68" stroke-width="8" stroke-linecap="round"/></svg>`;
const marginNote = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 220"><rect x="22" y="18" width="136" height="184" rx="8" fill="#fffdf7" stroke="#9b3328" stroke-width="5"/><path d="M48 58h84M48 88h66M48 118h78M48 148h48" stroke="#686058" stroke-width="7" stroke-linecap="round"/></svg>`;
const annotationArrow = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 120"><path d="M18 78c52-52 110-62 166-32" fill="none" stroke="#9b3328" stroke-width="10" stroke-linecap="round"/><path d="m166 18 40 36-52 12" fill="none" stroke="#9b3328" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const terminalWindow = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 150"><rect x="10" y="16" width="220" height="118" rx="12" fill="#101b14" stroke="#7dff9b" stroke-width="4"/><circle cx="34" cy="38" r="6" fill="#7dff9b"/><circle cx="54" cy="38" r="6" fill="#a6c7ae"/><path d="m38 76 24 18-24 18M78 112h72" fill="none" stroke="#7dff9b" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const syntaxBraces = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180"><text x="34" y="122" font-family="Courier New" font-size="116" font-weight="700" fill="#7dff9b">{</text><text x="102" y="122" font-family="Courier New" font-size="116" font-weight="700" fill="#7dff9b">}</text></svg>`;
const musicCard = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 180"><rect x="18" y="18" width="184" height="144" rx="10" fill="#fff7fb" stroke="#e96f92" stroke-width="5"/><circle cx="78" cy="84" r="34" fill="#e96f92"/><circle cx="78" cy="84" r="11" fill="#fff7fb"/><path d="M128 62h42M128 88h32M128 114h52" stroke="#725d78" stroke-width="8" stroke-linecap="round"/></svg>`;
const lightLeak = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 220"><defs><radialGradient id="g"><stop offset="0" stop-color="#fff" stop-opacity=".8"/><stop offset=".45" stop-color="#e96f92" stop-opacity=".45"/><stop offset="1" stop-color="#e96f92" stop-opacity="0"/></radialGradient></defs><circle cx="96" cy="90" r="94" fill="url(#g)"/></svg>`;
const smileSticker = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 170 170"><circle cx="85" cy="85" r="62" fill="#cb5a37"/><circle cx="64" cy="72" r="8" fill="#fffaf3"/><circle cx="106" cy="72" r="8" fill="#fffaf3"/><path d="M58 98c18 24 42 24 60 0" fill="none" stroke="#fffaf3" stroke-width="8" stroke-linecap="round"/></svg>`;
const simpleShape = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180"><rect x="28" y="28" width="124" height="124" rx="28" fill="#cb5a37"/><circle cx="126" cy="54" r="28" fill="#f2e7da" opacity=".8"/></svg>`;

export const assetPacks: AssetPackConfig[] = [
  {
    id: "phone-ui-fragments",
    label: "Phone UI Fragments",
    style: "ui-fragments",
    assets: [
      { id: "phone-bubble", label: "Phone Bubble", kind: "ui-fragment", path: "assets/packs/phone-ui-fragments/phone-bubble.svg", tags: ["phone", "chat"], svg: phoneBubble },
      { id: "notification", label: "Notification", kind: "ui-fragment", path: "assets/packs/phone-ui-fragments/notification.svg", tags: ["phone", "alert"], svg: notification }
    ]
  },
  {
    id: "emoji-stickers",
    label: "Emoji Stickers",
    style: "stickers",
    assets: [
      { id: "star-sticker", label: "Star Sticker", kind: "sticker", path: "assets/packs/emoji-stickers/star-sticker.svg", tags: ["emoji", "spark"], svg: starSticker }
    ]
  },
  {
    id: "paper-textures",
    label: "Paper Textures",
    style: "texture-only",
    assets: [
      { id: "paper-scrap", label: "Paper Scrap", kind: "texture", path: "assets/packs/paper-textures/paper-scrap.svg", tags: ["paper", "texture"], svg: paperScrap }
    ]
  },
  {
    id: "margin-notes",
    label: "Margin Notes",
    style: "symbols",
    assets: [
      { id: "margin-note", label: "Margin Note", kind: "symbol", path: "assets/packs/margin-notes/margin-note.svg", tags: ["notes", "academic"], svg: marginNote }
    ]
  },
  {
    id: "annotation-symbols",
    label: "Annotation Symbols",
    style: "symbols",
    assets: [
      { id: "annotation-arrow", label: "Annotation Arrow", kind: "symbol", path: "assets/packs/annotation-symbols/annotation-arrow.svg", tags: ["annotation", "arrow"], svg: annotationArrow }
    ]
  },
  {
    id: "terminal-fragments",
    label: "Terminal Fragments",
    style: "ui-fragments",
    assets: [
      { id: "terminal-window", label: "Terminal Window", kind: "ui-fragment", path: "assets/packs/terminal-fragments/terminal-window.svg", tags: ["terminal", "code"], svg: terminalWindow }
    ]
  },
  {
    id: "syntax-shapes",
    label: "Syntax Shapes",
    style: "symbols",
    assets: [
      { id: "syntax-braces", label: "Syntax Braces", kind: "symbol", path: "assets/packs/syntax-shapes/syntax-braces.svg", tags: ["code", "braces"], svg: syntaxBraces }
    ]
  },
  {
    id: "grid-textures",
    label: "Grid Textures",
    style: "texture-only",
    assets: [
      { id: "grid-scrap", label: "Grid Scrap", kind: "texture", path: "assets/packs/grid-textures/grid-scrap.svg", tags: ["grid", "systems"], svg: paperScrap }
    ]
  },
  {
    id: "music-collage",
    label: "Music Collage",
    style: "photo-collage",
    assets: [
      { id: "music-card", label: "Music Card", kind: "photo-card", path: "assets/packs/music-collage/music-card.svg", tags: ["music", "album"], svg: musicCard }
    ]
  },
  {
    id: "grain-textures",
    label: "Grain Textures",
    style: "texture-only",
    assets: [
      { id: "grain-scrap", label: "Grain Scrap", kind: "texture", path: "assets/packs/grain-textures/grain-scrap.svg", tags: ["grain", "texture"], svg: paperScrap }
    ]
  },
  {
    id: "soft-light-leaks",
    label: "Soft Light Leaks",
    style: "texture-only",
    assets: [
      { id: "light-leak", label: "Light Leak", kind: "texture", path: "assets/packs/soft-light-leaks/light-leak.svg", tags: ["light", "dream"], svg: lightLeak }
    ]
  },
  {
    id: "starter-stickers",
    label: "Starter Stickers",
    style: "stickers",
    assets: [
      { id: "smile-sticker", label: "Smile Sticker", kind: "sticker", path: "assets/packs/starter-stickers/smile-sticker.svg", tags: ["smile", "friendly"], svg: smileSticker }
    ]
  },
  {
    id: "simple-shapes",
    label: "Simple Shapes",
    style: "symbols",
    assets: [
      { id: "soft-square", label: "Soft Square", kind: "symbol", path: "assets/packs/simple-shapes/soft-square.svg", tags: ["shape", "simple"], svg: simpleShape }
    ]
  }
];
