"use client";

import { DocumentContent } from "@embedpdf/plugin-document-manager/react";
import { PagePointerProvider } from "@embedpdf/plugin-interaction-manager/react";
import { RenderLayer } from "@embedpdf/plugin-render/react";
import { Scroller } from "@embedpdf/plugin-scroll/react";
import { SelectionLayer } from "@embedpdf/plugin-selection/react";
import { Viewport } from "@embedpdf/plugin-viewport/react";
import { css } from "../../../styled-system/css";
import { SelectionMenu } from "./selection-menu";

const pdfEmpty = css({
  height: "100%",
  minHeight: "480px",
  display: "grid",
  placeItems: "center",
  padding: "40px",
  textAlign: "center",
  mdDown: {
    minHeight: "calc(100dvh - 170px)",
  },
});

const pdfError = css({
  margin: "20px",
  padding: "12px 14px",
  borderWidth: "1px",
  borderStyle: "solid",
  borderColor: "errorBorder",
  borderRadius: "error",
  background: "errorBg",
  color: "error",
  fontSize: "12px",
});

const pdfViewport = css({
  width: "100%",
  height: "100%",
  minWidth: "0",
  minHeight: "0",
  overflow: "auto",
});

type PdfDocumentViewProps = {
  documentId: string;
  onAskSelection?: (() => void) | undefined;
};

export function PdfDocumentView({ documentId, onAskSelection }: PdfDocumentViewProps) {
  return (
    <DocumentContent documentId={documentId}>
      {({ isLoaded, isLoading: documentLoading, isError }) => {
        // Keep the stage mounted; only show a first-open placeholder, not a wipe of loaded pages.
        if (isError) return <div className={pdfError}>This PDF could not be opened.</div>;
        if (!isLoaded && documentLoading) {
          return <div className={pdfEmpty}>Opening document...</div>;
        }
        if (!isLoaded) return null;

        return (
          <Viewport className={pdfViewport} documentId={documentId}>
            <Scroller
              documentId={documentId}
              renderPage={({ width, height, pageIndex }) => (
                <div style={{ width, height }}>
                  <PagePointerProvider documentId={documentId} pageIndex={pageIndex}>
                    <RenderLayer documentId={documentId} pageIndex={pageIndex} />
                    <SelectionLayer
                      documentId={documentId}
                      pageIndex={pageIndex}
                      selectionMenu={(props) => (
                        <SelectionMenu
                          {...props}
                          documentId={documentId}
                          onAskSelection={onAskSelection}
                        />
                      )}
                    />
                  </PagePointerProvider>
                </div>
              )}
            />
          </Viewport>
        );
      }}
    </DocumentContent>
  );
}
