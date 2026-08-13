"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import {
  useDocumentManagerCapability,
  useActiveDocument,
} from "@embedpdf/plugin-document-manager/react";
import { open } from "@tauri-apps/plugin-dialog";
import { isTauriRuntime, readSelectedPdf } from "../../lib/tauri";
import { css } from "../../../styled-system/css";

const pdfError = css({
  margin: "16px",
  padding: "12px 14px",
  borderWidth: "1px",
  borderStyle: "solid",
  borderColor: "dangerBorder",
  borderRadius: "control",
  background: "dangerBg",
  color: "danger",
  fontSize: "14px",
});

export type PdfChrome = {
  documentName: string | null;
  error: string | null;
  openPdf: (() => Promise<void>) | null;
};

const IDLE_CHROME: PdfChrome = {
  documentName: null,
  error: null,
  openPdf: null,
};

type PdfOpenBridgeProps = {
  onChromeChange: (chrome: PdfChrome) => void;
};

export function idlePdfChrome(): PdfChrome {
  return IDLE_CHROME;
}

export function PdfOpenBridge({ onChromeChange }: PdfOpenBridgeProps) {
  const { activeDocument } = useActiveDocument();
  const { provides: docManager } = useDocumentManagerCapability();
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const openPdf = useCallback(async () => {
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
      setError(reason instanceof Error ? reason.message : "PDF を開けませんでした。");
    }
  }, [docManager]);

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
        setError(reason instanceof Error ? reason.message : "PDF を開けませんでした。");
      }
    });
  };

  useEffect(() => {
    onChromeChange({
      documentName: activeDocument?.name ?? null,
      error,
      openPdf,
    });
  }, [activeDocument?.name, docManager, error, onChromeChange, openPdf]);

  return (
    <>
      <input ref={inputRef} hidden type="file" accept="application/pdf" onChange={onFileInput} />
      {error ? (
        <p className={pdfError} role="alert">
          {error}
        </p>
      ) : null}
    </>
  );
}
