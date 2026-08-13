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
  borderRadius: "control",
  background: "surface",
  padding: "4px",
  boxShadow: "menu",
  pointerEvents: "auto",
});

const menuButton = css({
  border: "0",
  borderRadius: "control",
  cursor: "pointer",
  fontSize: "12px",
  fontWeight: "600",
  minHeight: "28px",
  padding: "4px 12px",
  whiteSpace: "nowrap",
  transition: "background 140ms ease",
});

const askButton = css({
  background: "primary",
  color: "surface",
  _hover: {
    background: "primaryHover",
  },
});

const copyButton = css({
  background: "transparent",
  color: "muted",
  _hover: {
    background: "stage",
    color: "fg",
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

  const top = placement.suggestTop ? -(MENU_HEIGHT + 8) : rect.size.height + 8;

  return (
    <div {...menuWrapperProps}>
      <div className={menu} data-no-interaction style={{ top }}>
        <button type="button" className={cx(menuButton, askButton)} onClick={askSelection}>
          この箇所について聞く
        </button>
        <button type="button" className={cx(menuButton, copyButton)} onClick={copySelection}>
          コピー
        </button>
      </div>
    </div>
  );
}
