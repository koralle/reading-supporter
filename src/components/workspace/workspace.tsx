"use client";

import { useState } from "react";
import { cx, css } from "../../../styled-system/css";
import { ChatPanel } from "../chat/chat-panel";
import { PdfReader } from "../pdf/pdf-reader";
import { idlePdfChrome } from "../pdf/pdf-open-bridge";
import type { PdfChrome } from "../pdf/pdf-open-bridge";
import { WorkspaceHeader } from "./workspace-header";

const workspace = css({
  display: "grid",
  gridTemplateRows: "auto minmax(0, 1fr)",
  gridTemplateAreas: `"header" "desk"`,
  blockSize: "100dvb",
  minBlockSize: "100dvb",
  overflow: "hidden",
  background: "surface",
});

const headerArea = css({
  gridArea: "header",
  minInlineSize: "0",
});

const desk = css({
  gridArea: "desk",
  minBlockSize: "0",
  minInlineSize: "0",
  display: "grid",
  containerType: "inline-size",
  containerName: "desk",
  gridTemplateColumns: "minmax(0, 1fr)",
  gridTemplateRows: "minmax(0, 1.15fr) minmax(0, 0.85fr)",
  "@container desk (min-width: 48rem)": {
    gridTemplateColumns: "minmax(0, 1.15fr) minmax(min-content, 0.85fr)",
    gridTemplateRows: "minmax(0, 1fr)",
  },
});

const column = css({
  minBlockSize: "0",
  minInlineSize: "0",
  overflow: "hidden",
  background: "surface",
});

const readerColumn = css({
  containerType: "inline-size",
  containerName: "reader",
  display: "grid",
  gridTemplateRows: "minmax(0, 1fr)",
  borderBlockEndWidth: "1px",
  borderBlockEndStyle: "solid",
  borderBlockEndColor: "line",
  "@container desk (min-width: 48rem)": {
    borderBlockEndWidth: "0",
    borderInlineEndWidth: "1px",
    borderInlineEndStyle: "solid",
    borderInlineEndColor: "line",
  },
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
