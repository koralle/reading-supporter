"use client";

import { EmbedPDF } from "@embedpdf/core/react";
import { usePdfiumEngine } from "@embedpdf/engines/react";
import { css } from "../../../styled-system/css";
import { EmptyReader } from "./empty-reader";
import { PdfOutline } from "./pdf-outline";
import { PdfDocumentView } from "./pdf-document-view";
import { PdfToolbar } from "./pdf-toolbar";
import { pdfPlugins } from "./pdfPlugins";
import { SelectionCapture } from "./selection-capture";

const panelBar = css({
  minHeight: "62px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "16px",
  borderBottomWidth: "1px",
  borderBottomStyle: "solid",
  borderBottomColor: "line",
  padding: "13px 16px",
  smDown: {
    paddingLeft: "12px",
    paddingRight: "12px",
  },
});

const panelKicker = css({
  margin: "0 0 4px",
  color: "inkSoft",
  fontFamily: "mono",
  fontSize: "10px",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
});

const documentName = css({
  maxWidth: "34vw",
  overflow: "hidden",
  margin: "0",
  fontSize: "13px",
  fontWeight: "600",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  mdDown: {
    maxWidth: "48vw",
  },
});

const pdfStage = css({
  height: "100%",
  minHeight: "0",
  position: "relative",
  overflow: "hidden",
  background:
    "linear-gradient(180deg, rgba(255, 254, 250, 0.35), transparent 28%), {colors.pdfStage}",
});

const readerBody = css({
  minHeight: "0",
  display: "grid",
  gridTemplateColumns: "224px minmax(0, 1fr)",
  mdDown: {
    gridTemplateColumns: "1fr",
    gridTemplateRows: "auto minmax(0, 1fr)",
  },
});

type PdfReaderProps = {
  onSelectionChange: (text: string) => void;
  onAskSelection?: (() => void) | undefined;
};

export function PdfReader({ onSelectionChange, onAskSelection }: PdfReaderProps) {
  const { engine, isLoading } = usePdfiumEngine();

  if (isLoading || !engine) {
    return (
      <>
        <div className={panelBar}>
          <div>
            <p className={panelKicker}>Reader</p>
            <p className={documentName}>Loading PDF engine...</p>
          </div>
        </div>
        <div className={pdfStage} />
      </>
    );
  }

  return (
    <EmbedPDF engine={engine} plugins={pdfPlugins}>
      {({ activeDocumentId }) => (
        <>
          <PdfToolbar />
          <div className={readerBody}>
            <PdfOutline engine={engine} />
            <div className={pdfStage}>
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
        </>
      )}
    </EmbedPDF>
  );
}
