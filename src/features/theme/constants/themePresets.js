import { BackgroundVariant } from "@xyflow/react";
const THEME_PRESETS = [
  {
    id: "zinc-noir",
    name: "Zinc Noir",
    canvasBg: "#09090b",
    dotColor: "rgba(244, 244, 245, 0.12)",
    dotSize: 1.5,
    dotGap: 20,
    variant: BackgroundVariant.Dots,
    panelBg: "#18181b",
    borderColor: "#3f3f46",
    primaryAccent: "#f4f4f5"
  },
  {
    id: "obsidian-grid",
    name: "Obsidian Grid",
    canvasBg: "#0b0f14",
    dotColor: "rgba(56, 189, 248, 0.12)",
    dotSize: 1,
    dotGap: 24,
    variant: BackgroundVariant.Lines,
    panelBg: "#111827",
    borderColor: "#1f2937",
    primaryAccent: "#38bdf8"
  },
  {
    id: "monochrome-pure",
    name: "Monochrome Pure",
    canvasBg: "#000000",
    dotColor: "rgba(255, 255, 255, 0.15)",
    dotSize: 1.5,
    dotGap: 20,
    variant: BackgroundVariant.Dots,
    panelBg: "#121212",
    borderColor: "#262626",
    primaryAccent: "#ffffff"
  },
  {
    id: "slate-cross",
    name: "Slate Blueprint",
    canvasBg: "#0f172a",
    dotColor: "rgba(148, 163, 184, 0.15)",
    dotSize: 2,
    dotGap: 28,
    variant: BackgroundVariant.Cross,
    panelBg: "#1e293b",
    borderColor: "#334155",
    primaryAccent: "#94a3b8"
  }
];
export {
  THEME_PRESETS
};
