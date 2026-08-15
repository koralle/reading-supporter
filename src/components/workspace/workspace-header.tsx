"use client";

import { css } from "../../../styled-system/css";
import { acpClient } from "../../lib/acp";
import { AcpStatus } from "../chat/acp-connection-status";
import { OpenPdfSubmit } from "../pdf/open-pdf-submit";

const appHeader = css({
  display: "flex",
  alignItems: "center",
  gap: "12px",
  minInlineSize: "0",
  height: "56px",
  paddingInline: "16px",
  borderBottomWidth: "1px",
  borderBottomStyle: "solid",
  borderBottomColor: "line",
  background: "surface",
});

const brand = css({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  minInlineSize: "0",
  fontSize: "16px",
  fontWeight: "600",
  lineHeight: "1.2",
});

const brandName = css({
  margin: "0",
  flexShrink: "0",
  color: "fg",
  fontSize: "1rem",
  fontWeight: "600",
  lineHeight: "1.2",
});

const crumbSep = css({
  flexShrink: "0",
  color: "muted",
});

const crumbName = css({
  minInlineSize: "0",
  overflow: "hidden",
  color: "muted",
  fontSize: "14px",
  fontWeight: "400",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

const actions = css({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  marginInlineStart: "auto",
  flexShrink: "0",
});

type WorkspaceHeaderProps = {
  documentName: string | null;
  openPdf: (() => Promise<void>) | null;
  onBridgeError: (message: string) => void;
};

export function WorkspaceHeader({ documentName, openPdf, onBridgeError }: WorkspaceHeaderProps) {
  const sessionPromise = acpClient.getSessionResource();

  return (
    <header className={appHeader}>
      <div className={brand}>
        <h1 className={brandName}>
          <span lang="en">Reading Supporter</span>
        </h1>
        <span className={crumbSep} aria-hidden>
          /
        </span>
        <span className={crumbName}>{documentName ?? "PDFを開く"}</span>
      </div>
      <div className={actions}>
        <AcpStatus sessionPromise={sessionPromise} onBridgeError={onBridgeError} />
        {openPdf ? (
          <form action={openPdf}>
            <OpenPdfSubmit />
          </form>
        ) : (
          <OpenPdfSubmit disabled />
        )}
      </div>
    </header>
  );
}
