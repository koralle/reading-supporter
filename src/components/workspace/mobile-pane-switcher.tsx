"use client";

import { css } from "../../../styled-system/css";
import { tapTarget, visuallyHidden } from "../../styles/visually-hidden";

const mobileSwitch = css({
  display: "none",
  margin: "0",
  alignItems: "center",
  gap: "4px",
  borderWidth: "1px",
  borderStyle: "solid",
  borderColor: "lineStrong",
  borderRadius: "control",
  background: "surface",
  padding: "3px",
  mdDown: {
    display: "inline-flex",
  },
});

const mobileSwitchButton = css({
  ...tapTarget,
  position: "relative",
  border: "0",
  borderRadius: "control",
  background: "transparent",
  color: "muted",
  paddingInline: "12px",
  fontSize: "0.875rem",
  fontWeight: "600",
  transition: "background 160ms ease, color 160ms ease",
  "&[data-active=true]": {
    background: "primary",
    color: "onPrimary",
  },
  _motionReduce: {
    transition: "none",
  },
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
    <fieldset className={mobileSwitch}>
      <legend className={visuallyHidden}>画面の切替</legend>
      <button
        type="button"
        aria-pressed={mobilePane === "read"}
        className={mobileSwitchButton}
        data-active={mobilePane === "read"}
        onClick={onRead}
      >
        読む
      </button>
      <button
        type="button"
        aria-pressed={mobilePane === "ask"}
        className={mobileSwitchButton}
        data-active={mobilePane === "ask"}
        onClick={onAsk}
      >
        聞く
        {hasSelection ? <span className={visuallyHidden}>選択あり</span> : null}
      </button>
    </fieldset>
  );
}

export type { MobilePane };
