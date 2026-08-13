"use client";

import { useFormStatus } from "react-dom";
import { css } from "../../../styled-system/css";

const openButton = css({
  border: "0",
  borderRadius: "control",
  background: "primary",
  color: "surface",
  fontSize: "14px",
  fontWeight: "600",
  minHeight: "36px",
  paddingInline: "12px",
  transition: "background 160ms ease",
  _disabled: {
    cursor: "progress",
    opacity: "0.72",
  },
  _hover: {
    _enabled: {
      background: "primaryHover",
    },
  },
  _motionReduce: {
    transition: "none",
  },
});

type OpenPdfSubmitProps = {
  disabled?: boolean | undefined;
};

export function OpenPdfSubmit({ disabled = false }: OpenPdfSubmitProps) {
  const { pending } = useFormStatus();
  const isDisabled = disabled || pending;
  return (
    <button
      className={openButton}
      type={disabled ? "button" : "submit"}
      disabled={isDisabled}
      aria-busy={pending}
    >
      {pending ? "開いています…" : "PDFを開く"}
    </button>
  );
}
