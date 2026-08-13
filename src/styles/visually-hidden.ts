import { css } from "../../styled-system/css";

/** Clip-based visually hidden control. Do not use `hidden` / `display: none`. */
export const visuallyHidden = css({
  position: "absolute",
  overflow: "hidden",
  clipPath: "inset(50%)",
  whiteSpace: "nowrap",
  borderWidth: "0",
  width: "1px",
  height: "1px",
  padding: "0",
  margin: "-1px",
});
