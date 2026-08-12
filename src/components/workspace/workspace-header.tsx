"use client";

import { css } from "../../../styled-system/css";
import { MobilePaneSwitcher, type MobilePane } from "./mobile-pane-switcher";

const appHeader = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "12px",
  padding: "4px 4px 0",
});

const brand = css({
  display: "flex",
  alignItems: "baseline",
  gap: "10px",
  minWidth: "0",
});

const brandMark = css({
  color: "sageDark",
  fontFamily: "mono",
  fontSize: "11px",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  smDown: {
    display: "none",
  },
});

const brandName = css({
  fontSize: "30px",
  lineHeight: "1",
  smDown: {
    fontSize: "24px",
  },
});

const headerNote = css({
  color: "inkSoft",
  fontSize: "12px",
  mdDown: {
    display: "none",
  },
});

type WorkspaceHeaderProps = {
  mobilePane: MobilePane;
  hasSelection: boolean;
  onRead: () => void;
  onAsk: () => void;
};

export function WorkspaceHeader({ mobilePane, hasSelection, onRead, onAsk }: WorkspaceHeaderProps) {
  return (
    <header className={appHeader}>
      <div className={brand}>
        <span className={brandMark}>RS / 01</span>
        <span className={brandName}>Reading Supporter</span>
      </div>
      <span className={headerNote}>A quieter way to read difficult things.</span>
      <MobilePaneSwitcher
        mobilePane={mobilePane}
        hasSelection={hasSelection}
        onRead={onRead}
        onAsk={onAsk}
      />
    </header>
  );
}
