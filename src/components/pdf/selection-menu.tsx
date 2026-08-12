"use client";

import { useSelectionCapability } from "@embedpdf/plugin-selection/react";
import type { SelectionSelectionMenuProps } from "@embedpdf/plugin-selection/react";
import { cx, css } from "../../../styled-system/css";

const menu = css({
  position: "absolute",
  display: "flex",
  alignItems: "center",
  gap: "4px",
  borderWidth: "1px",
  borderStyle: "solid",
  borderColor: "line",
  borderRadius: "pill",
  background: "white",
  padding: "4px",
  boxShadow: "0 6px 22px rgba(41, 42, 34, 0.16)",
  pointerEvents: "auto",
});

const menuButton = css({
  border: "0",
  borderRadius: "pill",
  cursor: "pointer",
  fontSize: "11px",
  fontWeight: "600",
  minHeight: "26px",
  padding: "4px 12px",
  whiteSpace: "nowrap",
  transition: "background 140ms ease",
});

const askButton = css({
  background: "sageDark",
  color: "white",
  _hover: {
    background: "sageHover",
  },
});

const copyButton = css({
  background: "transparent",
  color: "inkSoft",
  _hover: {
    background: "sage",
    color: "white",
  },
});

const MENU_HEIGHT = 36;

type SelectionMenuProps = SelectionSelectionMenuProps & {
  documentId: string;
  onAskSelection?: (() => void) | undefined;
};

export function SelectionMenu({
  rect,
  menuWrapperProps,
  placement,
  documentId,
  onAskSelection,
}: SelectionMenuProps) {
  const { provides: selectionCapability } = useSelectionCapability();

  const copySelection = () => {
    const scope = selectionCapability?.forDocument(documentId);
    scope?.copyToClipboard();
    scope?.clear();
  };

  const askSelection = () => {
    selectionCapability?.forDocument(documentId).clear();
    onAskSelection?.();
  };

  // Position above or below based on available space.
  const top = placement.suggestTop ? -(MENU_HEIGHT + 8) : rect.size.height + 8;

  return (
    <div {...menuWrapperProps}>
      <div className={menu} data-no-interaction style={{ top }}>
        <button type="button" className={cx(menuButton, askButton)} onClick={askSelection}>
          Ask about this passage
        </button>
        <button type="button" className={cx(menuButton, copyButton)} onClick={copySelection}>
          Copy
        </button>
      </div>
    </div>
  );
}
