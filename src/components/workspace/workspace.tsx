"use client";

import { useState } from "react";
import { cx, css } from "../../../styled-system/css";
import { ChatPanel } from "../chat/chat-panel";
import { PdfReader } from "../pdf/pdf-reader";
import { idlePdfChrome } from "../pdf/pdf-open-bridge";
import type { PdfChrome } from "../pdf/pdf-open-bridge";
import { WorkspaceHeader } from "./workspace-header";

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
});

const chatColumn = css({
  display: "grid",
  gridTemplateRows: "minmax(0, 1fr)",
});

export default function Workspace() {
  const [selectedText, setSelectedText] = useState("");
  const [askFocusToken, setAskFocusToken] = useState(0);
  const [bridgeError, setBridgeError] = useState<string | null>(null);
  const [pdfChrome, setPdfChrome] = useState<PdfChrome>(idlePdfChrome);

  return (
    <main className={workspace}>
      <div className={headerArea}>
        <WorkspaceHeader
          documentName={pdfChrome.documentName}
          openPdf={pdfChrome.openPdf}
          onBridgeError={setBridgeError}
        />
      </div>

      <div className={desk}>
        <section className={cx(column, readerColumn)} aria-label="PDFリーダー">
          <PdfReader
            onSelectionChange={setSelectedText}
            onAskSelection={() => setAskFocusToken((token) => token + 1)}
            onChromeChange={setPdfChrome}
          />
        </section>
        <section className={cx(column, chatColumn)} aria-label="チャット">
          <ChatPanel
            selectedText={selectedText}
            bridgeError={bridgeError}
            askFocusToken={askFocusToken}
          />
        </section>
      </div>
    </main>
  );
}
