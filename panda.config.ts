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
          primary: { value: "light-dark(#1D4ED8, #93C5FD)" },
          primaryHover: { value: "light-dark(#1E40AF, #BFDBFE)" },
          primarySoft: { value: "light-dark(#EFF6FF, #1E3A8A)" },
          primaryText: { value: "light-dark(#1D4ED8, #93C5FD)" },
          onPrimary: { value: "light-dark(#FFFFFF, #111827)" },
          secondary: { value: "light-dark(#6D28D9, #C4B5FD)" },
          success: { value: "light-dark(#15803D, #4ADE80)" },
          danger: { value: "light-dark(#B91C1C, #FCA5A5)" },
          dangerBorder: { value: "light-dark(rgba(185, 28, 28, 0.35), rgba(252, 165, 165, 0.4))" },
          dangerBg: { value: "light-dark(rgba(185, 28, 28, 0.08), rgba(185, 28, 28, 0.24))" },
          surface: { value: "light-dark(#FFFFFF, #111827)" },
          fg: { value: "light-dark(#111827, #F9FAFB)" },
          muted: { value: "light-dark(#4B5563, #D1D5DB)" },
          line: { value: "light-dark(#737B88, #9CA3AF)" },
          stage: { value: "light-dark(#F3F4F6, #1F2937)" },
          highlight: { value: "light-dark(#CA8A04, #FDE047)" },
          placeholder: { value: "light-dark(#4B5563, #9CA3AF)" },
          scrollbarThumb: { value: "light-dark(#4B5563, #D1D5DB)" },
          scrollbarTrack: { value: "light-dark(#E5E7EB, #1F2937)" },
        },
        fonts: {
          body: { value: "var(--font-noto-sans-jp), sans-serif" },
          mono: {
            value: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
          },
        },
        shadows: {
          menu: {
            value:
              "light-dark(0 8px 24px rgba(17, 24, 39, 0.12), 0 8px 24px rgba(0, 0, 0, 0.45))",
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
