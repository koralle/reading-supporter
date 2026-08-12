"use client";

import { css } from "../../../styled-system/css";

const mobileSwitch = css({
  display: "none",
  margin: "0",
  alignItems: "center",
  gap: "4px",
  borderWidth: "1px",
  borderStyle: "solid",
  borderColor: "line",
  borderRadius: "pill",
  background: "glass",
  padding: "3px",
  backdropFilter: "blur(8px)",
  mdDown: {
    display: "inline-flex",
  },
});

const mobileSwitchButton = css({
  position: "relative",
  border: "0",
  borderRadius: "pill",
  background: "transparent",
  color: "inkSoft",
  padding: "8px 14px",
  fontSize: "12px",
  fontWeight: "600",
  transition: "background 160ms ease, color 160ms ease",
  "&[data-active=true]": {
    background: "sageDark",
    color: "white",
  },
  _motionReduce: {
    transition: "none",
  },
});

const mobileSwitchDot = css({
  position: "absolute",
  top: "7px",
  right: "8px",
  width: "6px",
  height: "6px",
  borderRadius: "50%",
  background: "gold",
});

type MobilePane = "read" | "ask";

type MobilePaneSwitcherProps = {
  mobilePane: MobilePane;
  hasSelection: boolean;
  onRead: () => void;
  onAsk: () => void;
};

export function MobilePaneSwitcher({
  mobilePane,
  hasSelection,
  onRead,
  onAsk,
}: MobilePaneSwitcherProps) {
  return (
    <form className={mobileSwitch} role="tablist" aria-label="Reading layout">
      <button
        type="submit"
        role="tab"
        formAction={onRead}
        aria-selected={mobilePane === "read"}
        className={mobileSwitchButton}
        data-active={mobilePane === "read"}
      >
        Read
      </button>
      <button
        type="submit"
        role="tab"
        formAction={onAsk}
        aria-selected={mobilePane === "ask"}
        className={mobileSwitchButton}
        data-active={mobilePane === "ask"}
      >
        Ask
        {hasSelection ? <span className={mobileSwitchDot} aria-hidden /> : null}
      </button>
    </form>
  );
}

export type { MobilePane };
