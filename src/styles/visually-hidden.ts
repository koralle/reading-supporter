import { css } from "../../styled-system/css";

/** Clip-based visually hidden control. Do not use `hidden` / `display: none`. */
export const visuallyHidden = css({
  position: "absolute",
  overflow: "hidden",
  clipPath: "inset(50%)",
  whiteSpace: "nowrap",
  borderWidth: "0",
  inlineSize: "1px",
  blockSize: "1px",
  padding: "0",
  margin: "-1px",
});

/** WCAG 2.5.8 floor, bumped on coarse pointers (`forms` / `css` touch targets). */
export const tapTarget = {
  minBlockSize: "tap",
  "@media (pointer: coarse)": {
    minBlockSize: "tapCoarse",
  },
} as const;
