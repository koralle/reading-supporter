"use client";

import { MessagePartPrimitive, MessagePrimitive } from "@assistant-ui/react";
import { cx, css } from "../../../styled-system/css";
import { AssistantMarkdown } from "./assistant-markdown";

const message = css({
  display: "flex",
  flexDirection: "column",
  gap: "6px",
  "&[data-role=user]": {
    alignItems: "flex-end",
  },
  "&[data-role=assistant]": {
    alignItems: "stretch",
  },
});

const messageLabel = css({
  color: "muted",
  fontFamily: "mono",
  fontSize: "12px",
});

const messageBubble = css({
  minInlineSize: "0",
  borderRadius: "control",
  padding: "10px 12px",
  fontSize: "14px",
  lineHeight: "1.7",
});

const messageBubbleUser = css({
  maxInlineSize: "88%",
  background: "primarySoft",
  color: "fg",
  whiteSpace: "pre-wrap",
  smDown: {
    maxInlineSize: "94%",
  },
});

const messageBubbleAssistant = css({
  inlineSize: "100%",
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
      <span className={messageLabel}>
        {role === "user" ? "あなた" : <span lang="en">OpenCode</span>}
      </span>
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
              if (role === "assistant") {
                return (
                  <AssistantMarkdown
                    text={part.text}
                    isAnimating={part.status.type === "running"}
                  />
                );
              }
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
