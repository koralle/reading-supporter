"use client";

import { useEffect, useRef, useState } from "react";
import { ComposerPrimitive } from "@assistant-ui/react";
import { useChatSubmit } from "use-chat-submit";
import type { SubmitMode } from "use-chat-submit";
import { css } from "../../../styled-system/css";

const STORAGE_KEY = "reading-supporter:chat-submit-mode";

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

const actions = css({
  display: "flex",
  alignItems: "center",
  gap: "6px",
});

const modeToggle = css({
  borderWidth: "1px",
  borderStyle: "solid",
  borderColor: "line",
  borderRadius: "pill",
  background: "transparent",
  color: "inkSoft",
  fontFamily: "mono",
  fontSize: "10px",
  fontWeight: "600",
  letterSpacing: "0.02em",
  minHeight: "38px",
  padding: "6px 10px",
  whiteSpace: "nowrap",
  transition: "background 160ms ease, color 160ms ease, border-color 160ms ease",
  _hover: {
    borderColor: "lineStrong",
    color: "ink",
    background: "paper",
  },
  _motionReduce: {
    transition: "none",
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

function isSubmitMode(value: string | null): value is SubmitMode {
  return value === "mod-enter" || value === "enter";
}

function readStoredMode(): SubmitMode {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (isSubmitMode(stored)) {
      return stored;
    }
  } catch {
    // Storage may be unavailable.
  }
  return "mod-enter";
}

function writeStoredMode(mode: SubmitMode) {
  try {
    localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    // Storage may be unavailable.
  }
}

function formatSubmitHint(mode: SubmitMode, keys: string[] | undefined): string {
  if (keys && keys.length > 0) {
    return `${keys.join("")} 送信`;
  }
  return mode === "mod-enter" ? "⌘⏎ 送信" : "⏎ 送信";
}

type ChatComposerProps = {
  selectedText: string;
  onAskFocus?: (() => void) | undefined;
  askFocusToken?: number | undefined;
};

export function ChatComposer({ selectedText, onAskFocus, askFocusToken = 0 }: ChatComposerProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [mode, setMode] = useState<SubmitMode>("mod-enter");

  useEffect(() => {
    setMode(readStoredMode());
  }, []);

  useEffect(() => {
    if (askFocusToken > 0) {
      inputRef.current?.focus();
    }
  }, [askFocusToken]);

  const { getTextareaProps, shortcutHintLabels } = useChatSubmit({
    mode,
    modKey: "auto",
    onSubmit: (_value, ctx) => {
      ctx.target.closest("form")?.requestSubmit();
    },
  });

  const { ref: textareaRef, onKeyDown } = getTextareaProps({
    ref: inputRef,
    onKeyDown: (event) => {
      if (mode !== "enter") {
        return;
      }
      if (!(event.metaKey || event.ctrlKey)) {
        return;
      }
      if (event.key !== "Enter" || event.shiftKey) {
        return;
      }
      if (event.nativeEvent.isComposing) {
        return;
      }
      event.preventDefault();
      document.execCommand("insertText", false, "\n");
    },
  });

  const submitHint = formatSubmitHint(mode, shortcutHintLabels?.submit.keys);
  const isModEnter = mode === "mod-enter";

  const toggleMode = () => {
    const next: SubmitMode = isModEnter ? "enter" : "mod-enter";
    setMode(next);
    writeStoredMode(next);
  };

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
        ref={textareaRef}
        onKeyDown={onKeyDown}
        placeholder="Ask about this book..."
        submitMode="none"
      />
      <div className={actions}>
        <button
          type="button"
          className={modeToggle}
          onClick={toggleMode}
          aria-pressed={isModEnter}
          aria-label={`送信ショートカットを切り替え（現在: ${submitHint}）`}
          title={
            isModEnter
              ? "Enterで改行 / ⌘Enterで送信（クリックで切替）"
              : "Enterで送信 / ⌘Enterで改行（クリックで切替）"
          }
        >
          {submitHint}
        </button>
        <ComposerPrimitive.Send className={sendButton}>Send</ComposerPrimitive.Send>
      </div>
    </ComposerPrimitive.Root>
  );
}
