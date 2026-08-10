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
  color: "inkSoft",
  fontFamily: "mono",
  fontSize: "9px",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
});

const messageBubble = css({
  maxWidth: "88%",
  borderRadius: "bubble",
  padding: "11px 14px",
  fontSize: "13px",
  lineHeight: "1.7",
  whiteSpace: "pre-wrap",
  smDown: {
    maxWidth: "94%",
  },
});

const messageBubbleUser = css({
  background: "sageDark",
  color: "white",
});

const messageBubbleAssistant = css({
  borderWidth: "1px",
  borderStyle: "solid",
  borderColor: "line",
  background: "white",
});

type ChatMessageProps = {
  role: "user" | "assistant" | "system";
};

export function ChatMessage({ role }: ChatMessageProps) {
  return (
    <MessagePrimitive.Root className={message} data-role={role}>
      <span className={messageLabel}>{role === "user" ? "You" : "OpenCode"}</span>
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
