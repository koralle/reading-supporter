"use client";

import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { ComposerPrimitive } from "@assistant-ui/react";
import { getUserAgentSummary, useChatSubmit } from "use-chat-submit";
import type { SubmitMode } from "use-chat-submit";
import { css } from "../../../styled-system/css";
import { tapTarget, visuallyHidden } from "../../styles/visually-hidden";

const STORAGE_KEY = "reading-supporter:chat-submit-mode";

const composer = css({
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr)",
  gap: "2",
  borderWidth: "1px",
  borderStyle: "solid",
  borderColor: "lineStrong",
  borderRadius: "control",
  background: "surface",
  padding: "2",
  "& textarea": {
    inlineSize: "100%",
    minBlockSize: "3lh",
    maxBlockSize: "10em",
    fieldSizing: "content",
    resize: "block",
    border: "0",
    outline: "0",
    background: "transparent",
    padding: "2",
    color: "fg",
    fontSize: "md",
  },
  "& textarea::placeholder": {
    color: "placeholder",
  },
});

const selectedContext = css({
  gridColumn: "1 / -1",
  display: "flex",
  alignItems: "start",
  gap: "2",
  borderInlineStartWidth: "0.125rem",
  borderInlineStartStyle: "solid",
  borderInlineStartColor: "primary",
  paddingBlock: "1",
  paddingInline: "2",
  color: "muted",
  fontSize: "xs",
  lineHeight: "1.5",
  "& strong": {
    color: "primaryText",
    fontFamily: "mono",
    fontSize: "xs",
    fontWeight: "600",
    whiteSpace: "nowrap",
  },
});

const actions = css({
  display: "flex",
  alignItems: "safe center",
  justifyContent: "end",
  gap: "2",
});

const modeToggle = css({
  ...tapTarget,
  borderWidth: "1px",
  borderStyle: "solid",
  borderColor: "lineStrong",
  borderRadius: "control",
  background: "transparent",
  color: "muted",
  fontFamily: "mono",
  fontSize: "xs",
  fontWeight: "600",
  paddingInline: "2.5",
  whiteSpace: "nowrap",
  transition: "background 160ms ease, color 160ms ease, border-color 160ms ease",
  _hover: {
    color: "fg",
    background: "stage",
  },
  _motionReduce: {
    transition: "none",
  },
});

const sendButton = css({
  ...tapTarget,
  border: "0",
  borderRadius: "control",
  background: "primary",
  color: "onPrimary",
  fontSize: "sm",
  fontWeight: "600",
  minInlineSize: "4em",
  paddingInline: "3",
  transition: "background 160ms ease",
  _disabled: {
    cursor: "not-allowed",
    opacity: "0.45",
  },
  _hover: {
    _enabled: {
      background: "primaryHover",
    },
  },
  _motionReduce: {
    transition: "none",
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

function modKeyLabel(isApple: boolean | undefined): string {
  if (isApple === false) {
    return "Ctrl";
  }
  if (isApple === true) {
    return "⌘";
  }
  return "Ctrl/⌘";
}

function formatSubmitHint(
  mode: SubmitMode,
  keys: string[] | undefined,
  isApple: boolean | undefined,
): string {
  if (keys && keys.length > 0) {
    return `${keys.join(" + ")} で送信`;
  }
  if (mode === "enter") {
    return "⏎ で送信";
  }
  return `${modKeyLabel(isApple)} + ⏎ で送信`;
}

function describeMode(mode: SubmitMode, isApple: boolean | undefined): string {
  const mod = modKeyLabel(isApple);
  if (mode === "mod-enter") {
    return `Enter=改行 / ${mod}+Enter=送信`;
  }
  return `Enter=送信 / ${mod}+Enter=改行`;
}

function insertNewlineAtCaret(textarea: HTMLTextAreaElement) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  textarea.setRangeText("\n", start, end, "end");
  textarea.dispatchEvent(
    new InputEvent("input", {
      bubbles: true,
      cancelable: true,
      inputType: "insertLineBreak",
      data: "\n",
    }),
  );
}

function shouldInsertModNewline(
  event: KeyboardEvent<HTMLTextAreaElement>,
  mode: SubmitMode,
): boolean {
  return (
    mode === "enter" &&
    !event.repeat &&
    (event.metaKey || event.ctrlKey) &&
    event.key === "Enter" &&
    !event.shiftKey &&
    !event.nativeEvent.isComposing
  );
}

function usePersistedSubmitMode() {
  const [mode, setMode] = useState<SubmitMode>("mod-enter");
  const [isApple, setIsApple] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    setMode(readStoredMode());
    setIsApple(getUserAgentSummary()?.isAppleDevice);
  }, []);

  const isEnterMode = mode === "enter";
  const nextMode: SubmitMode = isEnterMode ? "mod-enter" : "enter";

  const toggleMode = () => {
    setMode(nextMode);
    writeStoredMode(nextMode);
  };

  return { mode, isApple, isEnterMode, nextMode, toggleMode };
}

type ChatComposerProps = {
  selectedText: string;
  askFocusToken: number;
};

export function ChatComposer({ selectedText, askFocusToken }: ChatComposerProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { mode, isApple, isEnterMode, nextMode, toggleMode } = usePersistedSubmitMode();

  useEffect(() => {
    if (askFocusToken > 0) {
      inputRef.current?.focus();
    }
  }, [askFocusToken]);

  const { getTextareaProps, shortcutHintLabels } = useChatSubmit({
    mode,
    modKey: "auto",
    enabled: true,
    onSubmit: (_value, ctx) => {
      ctx.target.closest("form")?.requestSubmit();
    },
  });

  const { ref: textareaRef, onKeyDown } = getTextareaProps({
    ref: inputRef,
    onKeyDown: (event) => {
      if (!shouldInsertModNewline(event, mode)) {
        return;
      }
      event.preventDefault();
      insertNewlineAtCaret(event.currentTarget);
    },
  });

  const submitHint = formatSubmitHint(mode, shortcutHintLabels?.submit.keys, isApple);
  const toggleAriaLabel = `現在: ${submitHint}。クリックで ${describeMode(nextMode, isApple)} に切替`;
  const toggleTitle = `${describeMode(mode, isApple)}（クリックで切替）`;

  return (
    <ComposerPrimitive.Root className={composer}>
      {selectedText.trim() ? (
        <div className={selectedContext}>
          <strong>選択中</strong>
          <span>
            {selectedText.replace(/\s+/g, " ").slice(0, 150)}
            {selectedText.length > 150 ? "..." : ""}
          </span>
        </div>
      ) : null}
      <label className={visuallyHidden} htmlFor="chat-composer-input">
        質問
      </label>
      <ComposerPrimitive.Input
        id="chat-composer-input"
        ref={textareaRef}
        onKeyDown={onKeyDown}
        placeholder="質問を入力..."
        submitMode="none"
      />
      <div className={actions}>
        <button
          type="button"
          className={modeToggle}
          onClick={toggleMode}
          aria-pressed={isEnterMode}
          aria-label={toggleAriaLabel}
          title={toggleTitle}
        >
          {submitHint}
        </button>
        <ComposerPrimitive.Send className={sendButton}>送信</ComposerPrimitive.Send>
      </div>
    </ComposerPrimitive.Root>
  );
}
