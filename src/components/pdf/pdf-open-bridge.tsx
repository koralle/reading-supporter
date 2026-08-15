"use client";

import { useCallback, useEffect, useState } from "react";
import {
  useDocumentManagerCapability,
  useActiveDocument,
} from "@embedpdf/plugin-document-manager/react";
import { open } from "@tauri-apps/plugin-dialog";
import { readSelectedPdf } from "../../lib/tauri";
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
  openPdf: (() => Promise<void>) | null;
};

const IDLE_CHROME: PdfChrome = {
  documentName: null,
  openPdf: null,
};

type PdfOpenBridgeProps = {
  onChromeChange: (chrome: PdfChrome) => void;
};

export function idlePdfChrome(): PdfChrome {
  return IDLE_CHROME;
}

/** Native Tauri dialog only. There is no browser file-input fallback. */
export function PdfOpenBridge({ onChromeChange }: PdfOpenBridgeProps) {
  const { activeDocument } = useActiveDocument();
  const { provides: docManager } = useDocumentManagerCapability();
  const [error, setError] = useState<string | null>(null);

  const openPdf = useCallback(async () => {
    if (!docManager) return;
    setError(null);

    try {
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
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "PDF を開けませんでした。");
    }
  }, [docManager]);

  useEffect(() => {
    onChromeChange({
      documentName: activeDocument?.name ?? null,
      openPdf,
    });
  }, [activeDocument?.name, onChromeChange, openPdf]);

  return error ? (
    <p className={pdfError} role="alert">
      {error}
    </p>
  ) : null;
}
