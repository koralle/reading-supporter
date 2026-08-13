"use client";

import { ThreadPrimitive } from "@assistant-ui/react";
import { css } from "../../../styled-system/css";

const threadWelcome = css({
  minHeight: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  padding: "8px 0 16px",
});

const welcomeBody = css({
  margin: "0",
  color: "muted",
  fontSize: "14px",
  lineHeight: "1.7",
});

const selectionReady = css({
  marginTop: "8px",
  color: "primary",
  fontSize: "14px",
  fontWeight: "600",
});

const bridgeErrorStyle = css({
  marginTop: "12px",
  color: "danger",
  fontSize: "12px",
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
        <p className={welcomeBody}>テキストを選択して質問できます。</p>
        {selectedText.trim() ? (
          <p className={selectionReady}>選択した箇所について、下から質問できます。</p>
        ) : null}
        {bridgeError ? <p className={bridgeErrorStyle}>{bridgeError}</p> : null}
      </div>
    </ThreadPrimitive.Empty>
  );
}
