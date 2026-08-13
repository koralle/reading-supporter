"use client";

import { useEffect } from "react";
import { EmbedPDF } from "@embedpdf/core/react";
import { usePdfiumEngine } from "@embedpdf/engines/react";
import { css } from "../../../styled-system/css";
import { EmptyReader } from "./empty-reader";
import { PdfOutline } from "./pdf-outline";
import { PdfDocumentView } from "./pdf-document-view";
import { idlePdfChrome, PdfOpenBridge } from "./pdf-open-bridge";
import type { PdfChrome } from "./pdf-open-bridge";
import { pdfPlugins } from "./pdfPlugins";
import { SelectionCapture } from "./selection-capture";

const pdfStage = css({
  height: "100%",
  minHeight: "0",
  minInlineSize: "0",
  position: "relative",
  overflow: "hidden",
  background: "stage",
});

const readerBody = css({
  minHeight: "0",
  height: "100%",
  display: "grid",
  gridTemplateColumns: "240px minmax(0, 1fr)",
  mdDown: {
    gridTemplateColumns: "1fr",
    gridTemplateRows: "auto minmax(0, 1fr)",
  },
});

const engineLoading = css({
  height: "100%",
  display: "grid",
  placeItems: "center",
  color: "muted",
  fontSize: "14px",
});

type PdfReaderProps = {
  onSelectionChange: (text: string) => void;
  onAskSelection?: (() => void) | undefined;
  onChromeChange: (chrome: PdfChrome) => void;
};

export function PdfReader({ onSelectionChange, onAskSelection, onChromeChange }: PdfReaderProps) {
  const { engine, isLoading } = usePdfiumEngine();

  useEffect(() => {
    if (isLoading || !engine) {
      onChromeChange(idlePdfChrome());
    }
  }, [engine, isLoading, onChromeChange]);

  if (isLoading || !engine) {
    return (
      <div className={pdfStage}>
        <p className={engineLoading}>読み込み中…</p>
      </div>
    );
  }

  return (
    <EmbedPDF engine={engine} plugins={pdfPlugins}>
      {({ activeDocumentId }) => (
        <div className={readerBody}>
          <PdfOutline engine={engine} />
          <div className={pdfStage}>
            <PdfOpenBridge onChromeChange={onChromeChange} />
            {activeDocumentId ? (
              <>
                <SelectionCapture
                  documentId={activeDocumentId}
                  onSelectionChange={onSelectionChange}
                />
                <PdfDocumentView documentId={activeDocumentId} onAskSelection={onAskSelection} />
              </>
            ) : (
              <EmptyReader />
            )}
          </div>
        </div>
      )}
    </EmbedPDF>
  );
}
