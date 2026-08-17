"use client";

import { Suspense, use } from "react";
import { ErrorBoundary, getErrorMessage } from "react-error-boundary";
import { css } from "../../../styled-system/css";
import { visuallyHidden } from "../../styles/visually-hidden";

const connectionStatus = css({
  display: "flex",
  alignItems: "safe center",
  gap: "2",
  color: "muted",
  fontFamily: "mono",
  fontSize: "xs",
  fontSizeAdjust: "from-font",
  _before: {
    inlineSize: "0.5em",
    aspectRatio: "1",
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
