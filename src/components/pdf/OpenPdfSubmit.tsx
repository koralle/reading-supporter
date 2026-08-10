"use client";

import { useFormStatus } from "react-dom";
import { css } from "../../../styled-system/css";

const openButton = css({
  border: "0",
  borderRadius: "pill",
  background: "sageDark",
  color: "white",
  fontSize: "12px",
  fontWeight: "700",
  padding: "10px 14px",
  transition: "background 160ms ease, transform 160ms ease",
  _disabled: {
    cursor: "progress",
    opacity: "0.72",
    transform: "none",
  },
  _hover: {
    _enabled: {
      background: "sageHover",
      transform: "translateY(-1px)",
    },
  },
  _motionReduce: {
    transition: "none",
    _hover: {
      transform: "none",
    },
  },
});

export function OpenPdfSubmit() {
  const { pending } = useFormStatus();
  return (
    <button className={openButton} type="submit" disabled={pending} aria-busy={pending}>
      {pending ? "Opening…" : "Open PDF"}
    </button>
  );
}
