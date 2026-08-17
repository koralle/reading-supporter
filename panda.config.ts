import { defineConfig } from "@pandacss/dev";
import { globalCss } from "./src/styles/global-styles.panda";

export default defineConfig({
  preflight: false,
  include: ["./src/**/*.{js,jsx,ts,tsx}"],
  exclude: [],
  outdir: "styled-system",
  theme: {
    extend: {
      tokens: {
        colors: {
          primary: { value: "#1D4ED8" },
          primaryHover: { value: "#1E40AF" },
          primarySoft: { value: "#EFF6FF" },
          primaryText: { value: "#1D4ED8" },
          onPrimary: { value: "#FFFFFF" },
          success: { value: "#15803D" },
          danger: { value: "#B91C1C" },
          dangerBorder: { value: "rgba(185, 28, 28, 0.35)" },
          dangerBg: { value: "rgba(185, 28, 28, 0.08)" },
          surface: { value: "#FFFFFF" },
          fg: { value: "#111827" },
          muted: { value: "#4B5563" },
          line: { value: "#E5E7EB" },
          lineStrong: { value: "#8A9099" },
          stage: { value: "#F3F4F6" },
          highlight: { value: "#CA8A04" },
          placeholder: { value: "#4B5563" },
          scrollbarThumb: { value: "#4B5563" },
          scrollbarTrack: { value: "#E5E7EB" },
        },
        fonts: {
          body: { value: "var(--font-noto-sans-jp), sans-serif" },
          mono: {
            value: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
          },
        },
        shadows: {
          menu: {
            value: "0 0.5rem 1.5rem rgba(17, 24, 39, 0.12)",
          },
        },
        radii: {
          control: { value: "0.5rem" },
        },
        sizes: {
          // WCAG 2.5.8 の下限。固定の正方形ではなく min-block-size として使う。
          tap: { value: "2.75rem" },
          tapCoarse: { value: "3rem" },
        },
      },
    },
  },
  globalCss,
});
