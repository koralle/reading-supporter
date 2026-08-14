import { defineConfig } from "@pandacss/dev";
import { globalCss } from "./src/styles/global-styles.panda";

export default defineConfig({
  preflight: false,
  include: ["./src/**/*.{js,jsx,ts,tsx}"],
  exclude: [],
  jsxFramework: "react",
  outdir: "styled-system",
  theme: {
    extend: {
      breakpoints: {
        sm: "521px",
        md: "901px",
      },
      tokens: {
        colors: {
          primary: { value: "#1D4ED8" },
          primaryHover: { value: "#1E40AF" },
          primarySoft: { value: "#EFF6FF" },
          primaryText: { value: "#1D4ED8" },
          onPrimary: { value: "#FFFFFF" },
          secondary: { value: "#6D28D9" },
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
            value: "0 8px 24px rgba(17, 24, 39, 0.12)",
          },
        },
        radii: {
          control: { value: "8px" },
        },
      },
    },
  },
  globalCss,
});
