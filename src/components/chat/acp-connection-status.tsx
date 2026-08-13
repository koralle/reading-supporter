"use client";

import { Suspense, use } from "react";
import { ErrorBoundary, getErrorMessage } from "react-error-boundary";
import { css } from "../../../styled-system/css";

const connectionStatus = css({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  color: "muted",
  fontFamily: "mono",
  fontSize: "12px",
  _before: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "muted",
    content: '""',
  },
  "&[data-connected=true]::before": {
    background: "success",
  },
  "&[data-connected=false]::before": {
    background: "danger",
  },
});

type AcpConnectionStatusProps = {
  sessionPromise: Promise<string>;
};

function AcpConnectionReady({ sessionPromise }: AcpConnectionStatusProps) {
  use(sessionPromise);
  return (
    <span className={connectionStatus} data-connected="true">
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
      fallbackRender={({ error }) => (
        <span
          className={connectionStatus}
          data-connected="false"
          title={getErrorMessage(error) ?? String(error)}
        >
          未接続
        </span>
      )}
    >
      <Suspense
        fallback={
          <span className={connectionStatus} data-connected="false">
            接続中
          </span>
        }
      >
        <AcpConnectionReady sessionPromise={sessionPromise} />
      </Suspense>
    </ErrorBoundary>
  );
}
