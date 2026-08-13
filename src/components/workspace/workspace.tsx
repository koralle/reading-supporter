"use client";

import { useState, useTransition } from "react";
import { cx, css } from "../../../styled-system/css";
import { ChatPanel } from "../chat/chat-panel";
import { PdfReader } from "../pdf/pdf-reader";
import { idlePdfChrome } from "../pdf/pdf-open-bridge";
import type { PdfChrome } from "../pdf/pdf-open-bridge";
import { WorkspaceHeader } from "./workspace-header";
import type { MobilePane } from "./mobile-pane-switcher";

const workspace = css({
  height: "100vh",
  minHeight: "100vh",
  display: "grid",
  gridTemplateRows: "56px minmax(0, 1fr)",
  gridTemplateAreas: `"header" "desk"`,
  overflow: "hidden",
  background: "surface",
  "@supports (height: 100dvh)": {
    height: "100dvh",
    minHeight: "100dvh",
  },
});

const headerArea = css({
  gridArea: "header",
});

const desk = css({
  gridArea: "desk",
  minHeight: "0",
  minInlineSize: "0",
  display: "grid",
  gridTemplateColumns: "minmax(0, 1.15fr) minmax(420px, 0.85fr)",
  mdDown: {
    gridTemplateColumns: "1fr",
    gridTemplateRows: "1fr",
  },
});

const deskChatCollapsed = css({
  gridTemplateColumns: "minmax(0, 1fr)",
});

const column = css({
  minHeight: "0",
  minInlineSize: "0",
  overflow: "hidden",
  background: "surface",
});

const readerColumn = css({
  display: "grid",
  gridTemplateRows: "minmax(0, 1fr)",
  borderRightWidth: "1px",
  borderRightStyle: "solid",
  borderRightColor: "line",
  mdDown: {
    borderRightWidth: "0",
  },
});

const chatColumn = css({
  display: "grid",
  gridTemplateRows: "minmax(0, 1fr)",
});

const activeMobilePane = css({
  mdDown: {
    minHeight: "calc(100dvh - 56px)",
  },
});

const hideBelowMd = css({
  mdDown: {
    display: "none",
  },
});

const hideChatDesktop = css({
  md: {
    display: "none",
  },
});

function useWorkspaceState() {
  const [selectedText, setSelectedText] = useState("");
  const [mobilePane, setMobilePane] = useState<MobilePane>("read");
  const [chatOpen, setChatOpen] = useState(true);
  const [askFocusToken, setAskFocusToken] = useState(0);
  const [bridgeError, setBridgeError] = useState<string | null>(null);
  const [pdfChrome, setPdfChrome] = useState<PdfChrome>(idlePdfChrome);
  const [, startTransition] = useTransition();

  const readAction = () => {
    setMobilePane("read");
  };

  const askAction = () => {
    setMobilePane("ask");
    setChatOpen(true);
  };

  const focusAsk = () => {
    startTransition(() => {
      setMobilePane("ask");
      setChatOpen(true);
    });
  };

  const askAboutSelection = () => {
    focusAsk();
    setAskFocusToken((token) => token + 1);
  };

  return {
    selectedText,
    setSelectedText,
    mobilePane,
    chatOpen,
    setChatOpen,
    askFocusToken,
    bridgeError,
    setBridgeError,
    pdfChrome,
    setPdfChrome,
    readAction,
    askAction,
    focusAsk,
    askAboutSelection,
  };
}

export default function Workspace() {
  const {
    selectedText,
    setSelectedText,
    mobilePane,
    chatOpen,
    setChatOpen,
    askFocusToken,
    bridgeError,
    setBridgeError,
    pdfChrome,
    setPdfChrome,
    readAction,
    askAction,
    focusAsk,
    askAboutSelection,
  } = useWorkspaceState();

  return (
    <main className={workspace}>
      <div className={headerArea}>
        <WorkspaceHeader
          documentName={pdfChrome.documentName}
          openPdf={pdfChrome.openPdf}
          chatOpen={chatOpen}
          mobilePane={mobilePane}
          hasSelection={Boolean(selectedText.trim())}
          onToggleChat={() => setChatOpen((open) => !open)}
          onRead={readAction}
          onAsk={askAction}
          onBridgeError={setBridgeError}
        />
      </div>

      <div className={cx(desk, !chatOpen && deskChatCollapsed)}>
        <section
          className={cx(
            column,
            readerColumn,
            mobilePane === "read" && activeMobilePane,
            mobilePane === "ask" && hideBelowMd,
          )}
          aria-label="PDF reader"
        >
          <PdfReader
            onSelectionChange={setSelectedText}
            onAskSelection={askAboutSelection}
            onChromeChange={setPdfChrome}
          />
        </section>
        <section
          className={cx(
            column,
            chatColumn,
            mobilePane === "ask" && activeMobilePane,
            mobilePane === "read" && hideBelowMd,
            !chatOpen && hideChatDesktop,
          )}
          aria-label="チャット"
        >
          <ChatPanel
            selectedText={selectedText}
            bridgeError={bridgeError}
            onAskFocus={focusAsk}
            askFocusToken={askFocusToken}
          />
        </section>
      </div>
    </main>
  );
}
