"use client";

import { css } from "../../../styled-system/css";
import { acpClient } from "../../lib/acp";
import { AcpStatus } from "../chat/acp-connection-status";
import { OpenPdfSubmit } from "../pdf/open-pdf-submit";

const appHeader = css({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "safe center",
  gap: "3",
  minInlineSize: "0",
  paddingInline: "4",
  paddingBlock: "1.5",
  borderBlockEndWidth: "1px",
  borderBlockEndStyle: "solid",
  borderBlockEndColor: "line",
  background: "surface",
});

const brand = css({
  display: "flex",
  alignItems: "safe center",
  gap: "2",
  minInlineSize: "0",
  fontWeight: "600",
  lineHeight: "1.2",
});

const brandName = css({
  margin: "0",
  flexShrink: "0",
  color: "fg",
  fontSize: "md",
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
  fontSize: "sm",
  fontWeight: "400",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

const actions = css({
  display: "flex",
  alignItems: "safe center",
  gap: "2",
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
