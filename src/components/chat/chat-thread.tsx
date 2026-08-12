"use client";

import { ThreadPrimitive } from "@assistant-ui/react";
import { css } from "../../../styled-system/css";
import { ChatComposer } from "./chat-composer";
import { ChatMessage } from "./chat-message";
import { ChatWelcome } from "./chat-welcome";

const threadRoot = css({
  height: "100%",
});

const threadViewport = css({
  height: "100%",
  minHeight: "0",
  overflowY: "auto",
  padding: "24px 20px 18px",
  scrollbarColor: "{colors.scrollbar} transparent",
  smDown: {
    paddingLeft: "12px",
    paddingRight: "12px",
  },
});

const composerWrap = css({
  position: "sticky",
  bottom: "0",
  marginTop: "24px",
  paddingTop: "12px",
  background: "linear-gradient(to bottom, transparent, {colors.chatBg} 15%)",
});

type ChatThreadProps = {
  selectedText: string;
  bridgeError: string | null;
  onAskFocus?: (() => void) | undefined;
  askFocusToken?: number | undefined;
};

export function ChatThread({
  selectedText,
  bridgeError,
  onAskFocus,
  askFocusToken,
}: ChatThreadProps) {
  return (
    <ThreadPrimitive.Root className={threadRoot}>
      <ThreadPrimitive.Viewport className={threadViewport} turnAnchor="top">
        <ThreadPrimitive.Messages>
          {({ message }) => <ChatMessage role={message.role} />}
        </ThreadPrimitive.Messages>

        <ThreadPrimitive.ViewportFooter className={composerWrap}>
          <ChatWelcome selectedText={selectedText} bridgeError={bridgeError} />
          <ChatComposer
            selectedText={selectedText}
            onAskFocus={onAskFocus}
            askFocusToken={askFocusToken}
          />
        </ThreadPrimitive.ViewportFooter>
      </ThreadPrimitive.Viewport>
    </ThreadPrimitive.Root>
  );
}
