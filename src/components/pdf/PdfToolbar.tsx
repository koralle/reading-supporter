"use client";

import { useRef, useState, useTransition } from "react";
import {
  useDocumentManagerCapability,
  useActiveDocument,
} from "@embedpdf/plugin-document-manager/react";
import { open } from "@tauri-apps/plugin-dialog";
import { isTauriRuntime, readSelectedPdf } from "../../lib/tauri";
import { css } from "../../../styled-system/css";
import { OpenPdfSubmit } from "./OpenPdfSubmit";

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

export function PdfToolbar() {
  const { activeDocument } = useActiveDocument();
  const { provides: docManager } = useDocumentManagerCapability();
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const openPdfAction = async () => {
    if (!docManager) return;
    setError(null);

    try {
      if (isTauriRuntime()) {
        const path = await open({
          multiple: false,
          directory: false,
          filters: [{ name: "PDF", extensions: ["pdf"] }],
        });
        if (typeof path !== "string") return;
        const buffer = await readSelectedPdf(path);
        await docManager
          .openDocumentBuffer({ buffer, name: path.split(/[\\/]/).pop() ?? "document.pdf" })
          .toPromise();
        return;
      }
      inputRef.current?.click();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "The PDF could not be opened.");
    }
  };

  const onFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !docManager) return;

    startTransition(async () => {
      setError(null);
      try {
        await docManager
          .openDocumentBuffer({ buffer: await file.arrayBuffer(), name: file.name })
          .toPromise();
      } catch (reason) {
        setError(reason instanceof Error ? reason.message : "The PDF could not be opened.");
      }
    });
  };

  return (
    <div className={panelBar}>
      <div>
        <p className={panelKicker}>Reader / PDF</p>
        <p className={documentName}>{activeDocument?.name ?? "No document open"}</p>
        {error && <p className={pdfError}>{error}</p>}
      </div>
      <div>
        <form action={openPdfAction}>
          <OpenPdfSubmit />
        </form>
        <input ref={inputRef} hidden type="file" accept="application/pdf" onChange={onFileInput} />
      </div>
    </div>
  );
}
