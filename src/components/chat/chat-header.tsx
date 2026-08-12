"use client";

import { Suspense } from "react";
import { ErrorBoundary, getErrorMessage } from "react-error-boundary";
import { css } from "../../../styled-system/css";
import { AcpConnectionStatus } from "./acp-connection-status";

const chatHeading = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  borderBottomWidth: "1px",
  borderBottomStyle: "solid",
  borderBottomColor: "line",
  padding: "17px 20px 15px",
  smDown: {
    paddingLeft: "12px",
    paddingRight: "12px",
  },
});

const chatTitle = css({
  margin: "0",
  fontSize: "27px",
  fontWeight: "400",
  smDown: {
    fontSize: "24px",
  },
});

const connectionStatus = css({
  display: "flex",
  alignItems: "center",
  gap: "7px",
  color: "inkSoft",
  fontFamily: "mono",
  fontSize: "10px",
  textTransform: "uppercase",
  _before: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "gold",
    content: '""',
  },
  "&[data-connected=true]::before": {
    background: "connected",
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

type ChatHeaderProps = {
  sessionPromise: Promise<string>;
  onBridgeError: (message: string) => void;
};

export function ChatHeader({ sessionPromise, onBridgeError }: ChatHeaderProps) {
  return (
    <div className={chatHeading}>
      <div>
        <p className={panelKicker}>Conversation / ACP</p>
        <h1 className={chatTitle}>Ask the page</h1>
      </div>
      <ErrorBoundary
        onError={(error) => {
          onBridgeError(getErrorMessage(error) ?? String(error));
        }}
        fallbackRender={({ error }) => (
          <span
            className={connectionStatus}
            data-connected="false"
            title={getErrorMessage(error) ?? String(error)}
          >
            Unavailable
          </span>
        )}
      >
        <Suspense
          fallback={
            <span className={connectionStatus} data-connected="false">
              Connecting
            </span>
          }
        >
          <AcpConnectionStatus sessionPromise={sessionPromise} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
