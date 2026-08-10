"use client";

import { ThreadPrimitive } from "@assistant-ui/react";
import { css } from "../../../styled-system/css";

const threadWelcome = css({
  minHeight: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  padding: "10px 2px 24px",
});

const eyebrow = css({
  margin: "0 0 10px",
  color: "sageDark",
  fontFamily: "mono",
  fontSize: "10px",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
});

const welcomeTitle = css({
  maxWidth: "390px",
  margin: "0",
  fontSize: "clamp(34px, 4vw, 52px)",
  fontWeight: "400",
  lineHeight: "0.98",
  mdDown: {
    fontSize: "clamp(30px, 9vw, 44px)",
  },
});

const welcomeBody = css({
  maxWidth: "340px",
  margin: "18px 0 0",
  color: "inkSoft",
  fontSize: "12px",
  lineHeight: "1.7",
});

const selectionReady = css({
  color: "sageDark!",
  fontWeight: "600",
});

const bridgeErrorStyle = css({
  marginTop: "14px",
  color: "error",
  fontSize: "11px",
  lineHeight: "1.5",
});

type ChatWelcomeProps = {
  selectedText: string;
  bridgeError: string | null;
};

export function ChatWelcome({ selectedText, bridgeError }: ChatWelcomeProps) {
  return (
    <ThreadPrimitive.Empty>
      <div className={threadWelcome}>
        <p className={eyebrow}>A conversation with the text</p>
        <h2 className={welcomeTitle}>What made you pause?</h2>
        <p className={welcomeBody}>
          Select a passage on the left and ask for a definition, a summary, or a second way to see
          the author&apos;s argument.
        </p>
        {selectedText.trim() ? (
          <p className={selectionReady}>Passage selected — ask about it below.</p>
        ) : null}
        {bridgeError && <p className={bridgeErrorStyle}>{bridgeError}</p>}
      </div>
    </ThreadPrimitive.Empty>
  );
}
