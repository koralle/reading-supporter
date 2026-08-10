"use client";

import { useState, useTransition } from "react";
import { cx, css } from "../../../styled-system/css";
import { ChatPanel } from "../chat/ChatPanel";
import { PdfReader } from "../pdf/PdfReader";
import { WorkspaceHeader } from "./WorkspaceHeader";
import type { MobilePane } from "./MobilePaneSwitcher";

const workspace = css({
  height: "100vh",
  minHeight: "100vh",
  "@supports (height: 100dvh)": {
    height: "100dvh",
    minHeight: "100dvh",
  },
  padding: "20px",
  display: "grid",
  gridTemplateRows: "auto 1fr",
  gap: "16px",
  overflow: "hidden",
  mdDown: {
    padding: "12px",
    gap: "12px",
  },
  smDown: {
    padding: "8px",
  },
});

const desk = css({
  minHeight: "0",
  display: "grid",
  gridTemplateColumns: "minmax(0, 1.08fr) minmax(360px, 0.92fr)",
  gap: "16px",
  mdDown: {
    gridTemplateColumns: "1fr",
    gridTemplateRows: "1fr",
    minHeight: "0",
  },
});

const panel = css({
  minHeight: "0",
  overflow: "hidden",
  borderWidth: "1px",
  borderStyle: "solid",
  borderColor: "line",
  borderRadius: "panel",
  background: "white",
  boxShadow: "panel",
  smDown: {
    borderRadius: "panelCompact",
  },
});

const readerPanel = css({
  display: "grid",
  gridTemplateRows: "auto 1fr",
});

const chatPanel = css({
  minHeight: "0",
  display: "grid",
  gridTemplateRows: "auto 1fr",
  background: "chatBg",
});

const activeMobilePane = css({
  mdDown: {
    minHeight: "calc(100dvh - 92px)",
  },
});

const hideBelowMd = css({
  mdDown: {
    display: "none",
  },
});

export default function Workspace() {
  const [selectedText, setSelectedText] = useState("");
  const [mobilePane, setMobilePane] = useState<MobilePane>("read");
  const [askFocusToken, setAskFocusToken] = useState(0);
  const [, startTransition] = useTransition();

  const readAction = () => {
    setMobilePane("read");
  };

  const askAction = () => {
    setMobilePane("ask");
  };

  const focusAsk = () => {
    startTransition(() => {
      setMobilePane("ask");
    });
  };

  const askAboutSelection = () => {
    focusAsk();
    setAskFocusToken((token) => token + 1);
  };

  return (
    <main className={workspace}>
      <WorkspaceHeader
        mobilePane={mobilePane}
        hasSelection={Boolean(selectedText.trim())}
        onRead={readAction}
        onAsk={askAction}
      />

      <div className={desk}>
        <section
          className={cx(
            panel,
            readerPanel,
            mobilePane === "read" && activeMobilePane,
            mobilePane === "ask" && hideBelowMd,
          )}
          aria-label="PDF reader"
        >
          <PdfReader onSelectionChange={setSelectedText} onAskSelection={askAboutSelection} />
        </section>
        <section
          className={cx(
            panel,
            chatPanel,
            mobilePane === "ask" && activeMobilePane,
            mobilePane === "read" && hideBelowMd,
          )}
          aria-label="Chat with your book"
        >
          <ChatPanel
            selectedText={selectedText}
            onAskFocus={focusAsk}
            askFocusToken={askFocusToken}
          />
        </section>
      </div>
    </main>
  );
}
