"use client";

import { useFormStatus } from "react-dom";
import { css } from "../../../styled-system/css";
import { tapTarget } from "../../styles/visually-hidden";

const openButton = css({
  ...tapTarget,
  border: "0",
  borderRadius: "control",
  background: "primary",
  color: "onPrimary",
  fontSize: "0.875rem",
  fontWeight: "600",
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
  id?: string | undefined;
};

export function OpenPdfSubmit({ disabled = false, id }: OpenPdfSubmitProps) {
  const { pending } = useFormStatus();
  const isDisabled = disabled || pending;
  return (
    <button
      id={id}
      className={openButton}
      type={disabled ? "button" : "submit"}
      disabled={isDisabled}
      aria-busy={pending}
    >
      {pending ? "開いています…" : "PDFを開く"}
    </button>
  );
}
