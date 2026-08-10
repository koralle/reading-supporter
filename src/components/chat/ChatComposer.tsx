"use client";

import { useEffect, useRef } from "react";
import { ComposerPrimitive } from "@assistant-ui/react";
import { css } from "../../../styled-system/css";

const composer = css({
  display: "grid",
  gridTemplateColumns: "1fr auto",
  alignItems: "end",
  gap: "8px",
  borderWidth: "1px",
  borderStyle: "solid",
  borderColor: "lineStrong",
  borderRadius: "composer",
  background: "white",
  padding: "7px",
  boxShadow: "composer",
  "& textarea": {
    width: "100%",
    minHeight: "42px",
    maxHeight: "130px",
    resize: "vertical",
    border: "0",
    outline: "0",
    background: "transparent",
    padding: "10px 9px",
    color: "ink",
    fontSize: "12px",
  },
  "& textarea::placeholder": {
    color: "placeholder",
  },
});

const selectedContext = css({
  gridColumn: "1 / -1",
  display: "flex",
  alignItems: "flex-start",
  gap: "8px",
  borderLeftWidth: "2px",
  borderLeftStyle: "solid",
  borderLeftColor: "sage",
  padding: "4px 8px",
  color: "inkSoft",
  fontSize: "10px",
  lineHeight: "1.5",
  "& strong": {
    color: "sageDark",
    fontFamily: "mono",
    fontSize: "9px",
    fontWeight: "500",
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    whiteSpace: "nowrap",
  },
});

const sendButton = css({
  border: "0",
  borderRadius: "pill",
  background: "sageDark",
  color: "white",
  fontSize: "12px",
  fontWeight: "700",
  minWidth: "66px",
  minHeight: "38px",
  padding: "8px 12px",
  transition: "background 160ms ease, transform 160ms ease",
  _disabled: {
    cursor: "not-allowed",
    opacity: "0.45",
  },
  _hover: {
    _enabled: {
      background: "sageHover",
      transform: "translateY(-1px)",
    },
  },
  _motionReduce: {
    transition: "none",
    _hover: {
      _enabled: {
        transform: "none",
      },
    },
  },
});

type ChatComposerProps = {
  selectedText: string;
  onAskFocus?: (() => void) | undefined;
  askFocusToken?: number | undefined;
};

export function ChatComposer({ selectedText, onAskFocus, askFocusToken = 0 }: ChatComposerProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Focus the composer whenever a new "Ask about this passage" action fires.
  useEffect(() => {
    if (askFocusToken > 0) inputRef.current?.focus();
  }, [askFocusToken]);

  return (
    <ComposerPrimitive.Root className={composer} onFocusCapture={onAskFocus}>
      {selectedText.trim() ? (
        <div className={selectedContext}>
          <strong>Context</strong>
          <span>
            {selectedText.replace(/\s+/g, " ").slice(0, 150)}
            {selectedText.length > 150 ? "..." : ""}
          </span>
        </div>
      ) : null}
      <ComposerPrimitive.Input
        ref={inputRef}
        placeholder="Ask about this book..."
        submitMode="enter"
      />
      <ComposerPrimitive.Send className={sendButton}>Send</ComposerPrimitive.Send>
    </ComposerPrimitive.Root>
  );
}
