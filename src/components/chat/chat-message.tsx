"use client";

import { MessagePartPrimitive, MessagePrimitive } from "@assistant-ui/react";
import { cx, css } from "../../../styled-system/css";

const message = css({
  display: "flex",
  flexDirection: "column",
  gap: "6px",
  "&[data-role=user]": {
    alignItems: "flex-end",
  },
  "&[data-role=assistant]": {
    alignItems: "flex-start",
  },
});

const messageLabel = css({
  color: "muted",
  fontFamily: "mono",
  fontSize: "12px",
});

const messageBubble = css({
  maxWidth: "88%",
  borderRadius: "control",
  padding: "10px 12px",
  fontSize: "14px",
  lineHeight: "1.7",
  whiteSpace: "pre-wrap",
  smDown: {
    maxWidth: "94%",
  },
});

const messageBubbleUser = css({
  background: "primarySoft",
  color: "fg",
});

const messageBubbleAssistant = css({
  borderWidth: "1px",
  borderStyle: "solid",
  borderColor: "line",
  background: "surface",
});

type ChatMessageProps = {
  role: "user" | "assistant" | "system";
};

export function ChatMessage({ role }: ChatMessageProps) {
  return (
    <MessagePrimitive.Root className={message} data-role={role}>
      <span className={messageLabel}>{role === "user" ? "あなた" : "OpenCode"}</span>
      <div
        className={cx(
          messageBubble,
          role === "user" && messageBubbleUser,
          role === "assistant" && messageBubbleAssistant,
        )}
      >
        <MessagePrimitive.Parts>
          {({ part }) => {
            if (part.type === "text") {
              return <MessagePartPrimitive.Text />;
            }
            if (part.type === "tool-call") return part.toolUI ?? null;
            return null;
          }}
        </MessagePrimitive.Parts>
      </div>
    </MessagePrimitive.Root>
  );
}
