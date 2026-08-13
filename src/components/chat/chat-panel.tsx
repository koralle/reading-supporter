"use client";

import { useRef } from "react";
import { AssistantRuntimeProvider, useLocalRuntime } from "@assistant-ui/react";
import type { ChatModelAdapter } from "@assistant-ui/react";
import { acpClient, createPrompt, textFromMessage } from "../../lib/acp";
import { css } from "../../../styled-system/css";
import { ChatThread } from "./chat-thread";

const chatThread = css({
  minHeight: "0",
  height: "100%",
});

type ChatPanelProps = {
  selectedText: string;
  bridgeError: string | null;
  onAskFocus?: (() => void) | undefined;
  askFocusToken?: number | undefined;
};

export function ChatPanel({
  selectedText,
  bridgeError,
  onAskFocus,
  askFocusToken,
}: ChatPanelProps) {
  const selectedTextRef = useRef(selectedText);
  selectedTextRef.current = selectedText;

  const adapterRef = useRef<ChatModelAdapter | null>(null);
  if (!adapterRef.current) {
    adapterRef.current = {
      async *run({ messages, abortSignal }) {
        const latestUserMessage = [...messages]
          .toReversed()
          .find((message) => message.role === "user");
        const question = latestUserMessage ? textFromMessage(latestUserMessage) : "";
        if (!question) return;

        const selectedForThisTurn = selectedTextRef.current;
        for await (const text of acpClient.prompt(
          createPrompt(question, selectedForThisTurn),
          abortSignal,
        )) {
          yield { content: [{ type: "text", text }] };
        }
      },
    };
  }

  const runtime = useLocalRuntime(adapterRef.current as ChatModelAdapter);

  return (
    <div className={chatThread}>
      <AssistantRuntimeProvider runtime={runtime}>
        <ChatThread
          selectedText={selectedText}
          bridgeError={bridgeError}
          onAskFocus={onAskFocus}
          askFocusToken={askFocusToken}
        />
      </AssistantRuntimeProvider>
    </div>
  );
}
