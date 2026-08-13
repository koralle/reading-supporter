"use client";

import { useLayoutEffect, useRef } from "react";
import { useSelectionCapability } from "@embedpdf/plugin-selection/react";
import type { SelectionSelectionMenuProps } from "@embedpdf/plugin-selection/react";
import { cx, css } from "../../../styled-system/css";
import { tapTarget } from "../../styles/visually-hidden";

const menuAnchor = css({
  "@supports (anchor-name: --selection-menu)": {
    anchorName: "--selection-menu",
  },
});

const menu = css({
  position: "absolute",
  display: "flex",
  alignItems: "center",
  gap: "4px",
  borderWidth: "1px",
  borderStyle: "solid",
  borderColor: "lineStrong",
  borderRadius: "control",
  background: "surface",
  padding: "4px",
  boxShadow: "menu",
  pointerEvents: "auto",
  "@supports (anchor-name: --selection-menu)": {
    position: "fixed",
    positionAnchor: "--selection-menu",
    positionArea: "block-start",
    positionTryFallbacks: "flip-block, flip-inline",
    inset: "auto",
    top: "auto!",
  },
});

const menuButton = css({
  ...tapTarget,
  border: "0",
  borderRadius: "control",
  cursor: "pointer",
  fontSize: "0.875rem",
  fontWeight: "600",
  paddingInline: "12px",
  whiteSpace: "nowrap",
  transition: "background 140ms ease",
  _motionReduce: {
    transition: "none",
  },
});

const askButton = css({
  background: "primary",
  color: "onPrimary",
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

const MENU_HEIGHT = 52;

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
  const menuRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const node = menuRef.current;
    if (!node || typeof node.showPopover !== "function") {
      return;
    }
    node.showPopover();
    return () => {
      if (typeof node.hidePopover === "function" && node.matches(":popover-open")) {
        node.hidePopover();
      }
    };
  }, []);

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
  const wrapperClassName =
    "className" in menuWrapperProps && typeof menuWrapperProps.className === "string"
      ? menuWrapperProps.className
      : undefined;

  return (
    <div {...menuWrapperProps} className={cx(wrapperClassName, menuAnchor)}>
      <div ref={menuRef} popover="manual" className={menu} data-no-interaction style={{ top }}>
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
