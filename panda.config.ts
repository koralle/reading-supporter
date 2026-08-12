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
          ink: { value: "#20201d" },
          inkSoft: { value: "#6f706b" },
          paper: { value: "#f5f4ef" },
          white: { value: "#fffefa" },
          sage: { value: "#71816d" },
          sageDark: { value: "#536752" },
          sageHover: { value: "#40563f" },
          line: { value: "rgba(32, 32, 29, 0.12)" },
          lineStrong: { value: "rgba(32, 32, 29, 0.18)" },
          lineMuted: { value: "rgba(32, 32, 29, 0.2)" },
          gold: { value: "#c6a45c" },
          connected: { value: "#78936e" },
          error: { value: "#914a3c" },
          errorBorder: { value: "rgba(146, 64, 50, 0.2)" },
          errorBg: { value: "rgba(146, 64, 50, 0.06)" },
          chatBg: { value: "#f9f8f3" },
          pdfStage: { value: "#deded6" },
          placeholder: { value: "#9a9b93" },
          scrollbar: { value: "#86877f" },
          glass: { value: "rgba(255, 254, 250, 0.82)" },
        },
        fonts: {
          body: { value: "var(--font-noto-sans-jp), sans-serif" },
          mono: { value: '"DM Mono", monospace' },
        },
        shadows: {
          panel: { value: "0 18px 50px rgba(41, 42, 34, 0.08)" },
          composer: { value: "0 7px 22px rgba(41, 42, 34, 0.06)" },
          emptyMark: { value: "7px 7px 0 rgba(32, 32, 29, 0.08)" },
        },
        radii: {
          panel: { value: "18px" },
          panelCompact: { value: "13px" },
          pill: { value: "999px" },
          bubble: { value: "14px" },
          composer: { value: "13px" },
          error: { value: "10px" },
          mark: { value: "4px" },
        },
      },
    },
  },
  globalCss,
});
