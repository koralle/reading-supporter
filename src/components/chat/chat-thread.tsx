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
  overscrollBehavior: "contain",
  padding: "16px",
  scrollbarColor: "{colors.scrollbarThumb} {colors.scrollbarTrack}",
  scrollbarWidth: "thin",
});

const composerWrap = css({
  position: "sticky",
  bottom: "0",
  marginTop: "16px",
  paddingTop: "12px",
  background: "linear-gradient(to bottom, transparent, {colors.surface} 15%)",
});

type ChatThreadProps = {
  selectedText: string;
  bridgeError: string | null;
  askFocusToken: number;
};

export function ChatThread({ selectedText, bridgeError, askFocusToken }: ChatThreadProps) {
  return (
    <ThreadPrimitive.Root className={threadRoot}>
      <ThreadPrimitive.Viewport className={threadViewport} turnAnchor="top">
        <ThreadPrimitive.Messages>
          {({ message }) => <ChatMessage role={message.role} />}
        </ThreadPrimitive.Messages>

        <ThreadPrimitive.ViewportFooter className={composerWrap}>
          <ChatWelcome selectedText={selectedText} bridgeError={bridgeError} />
          <ChatComposer selectedText={selectedText} askFocusToken={askFocusToken} />
        </ThreadPrimitive.ViewportFooter>
      </ThreadPrimitive.Viewport>
    </ThreadPrimitive.Root>
  );
}
