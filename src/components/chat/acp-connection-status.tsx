"use client";

import { Suspense, use } from "react";
import { ErrorBoundary, getErrorMessage } from "react-error-boundary";
import { css } from "../../../styled-system/css";
import { visuallyHidden } from "../../styles/visually-hidden";

const connectionStatus = css({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  color: "muted",
  fontFamily: "mono",
  fontSize: "0.75rem",
  fontSizeAdjust: "from-font",
  _before: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "muted",
    content: '""',
  },
  "&[data-status=ready]::before": {
    background: "success",
  },
  "&[data-status=pending]::before": {
    background: "muted",
  },
  "&[data-status=error]::before": {
    background: "danger",
  },
});

type AcpConnectionStatusProps = {
  sessionPromise: Promise<string>;
};

function AcpConnectionReady({ sessionPromise }: AcpConnectionStatusProps) {
  use(sessionPromise);
  return (
    <span className={connectionStatus} data-status="ready">
      接続済
    </span>
  );
}

type AcpStatusProps = {
  sessionPromise: Promise<string>;
  onBridgeError?: ((message: string) => void) | undefined;
};

export function AcpStatus({ sessionPromise, onBridgeError }: AcpStatusProps) {
  return (
    <ErrorBoundary
      onError={(error) => {
        onBridgeError?.(getErrorMessage(error) ?? String(error));
      }}
      fallbackRender={({ error }) => {
        const message = getErrorMessage(error) ?? String(error);
        return (
          <span className={connectionStatus} data-status="error">
            未接続
            <span className={visuallyHidden}>{message}</span>
          </span>
        );
      }}
    >
      <Suspense
        fallback={
          <span className={connectionStatus} data-status="pending">
            接続中
          </span>
        }
      >
        <AcpConnectionReady sessionPromise={sessionPromise} />
      </Suspense>
    </ErrorBoundary>
  );
}
