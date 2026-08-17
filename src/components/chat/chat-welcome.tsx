"use client";

import { ThreadPrimitive } from "@assistant-ui/react";
import { css } from "../../../styled-system/css";

const threadWelcome = css({
  minBlockSize: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  gap: "2",
  paddingBlock: "2 4",
});

const welcomeBody = css({
  margin: "0",
  color: "muted",
  fontSize: "sm",
  lineHeight: "1.7",
});

const selectionReady = css({
  color: "primaryText",
  fontSize: "sm",
  fontWeight: "600",
});

const bridgeErrorStyle = css({
  color: "danger",
  fontSize: "xs",
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
        {bridgeError ? (
          <p className={bridgeErrorStyle} role="alert">
            {bridgeError}
          </p>
        ) : null}
      </div>
    </ThreadPrimitive.Empty>
  );
}
