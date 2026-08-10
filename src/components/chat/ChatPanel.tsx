"use client";

import { useRef, useState } from "react";
import {
  AssistantRuntimeProvider,
  type ChatModelAdapter,
  useLocalRuntime,
} from "@assistant-ui/react";
import { acpClient, createPrompt, textFromMessage } from "../../lib/acp";
import { css } from "../../../styled-system/css";
import { ChatHeader } from "./ChatHeader";
import { ChatThread } from "./ChatThread";

const chatThread = css({
  minHeight: "0",
  height: "100%",
});

type ChatPanelProps = {
  selectedText: string;
  onAskFocus?: (() => void) | undefined;
  askFocusToken?: number | undefined;
};

export function ChatPanel({ selectedText, onAskFocus, askFocusToken }: ChatPanelProps) {
  // Render-time resource: AcpClient returns one shared promise across Suspense remounts.
  const sessionPromise = acpClient.getSessionResource();
  const [bridgeError, setBridgeError] = useState<string | null>(null);
  const selectedTextRef = useRef(selectedText);
  selectedTextRef.current = selectedText;

  const adapterRef = useRef<ChatModelAdapter | null>(null);
  if (!adapterRef.current) {
    adapterRef.current = {
      async *run({ messages, abortSignal }) {
        // Only the latest user turn is sent; selection is snapshotted at send time.
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
    <>
      <ChatHeader sessionPromise={sessionPromise} onBridgeError={setBridgeError} />
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
    </>
  );
}
