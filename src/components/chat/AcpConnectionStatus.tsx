"use client";

import { use } from "react";
import { css } from "../../../styled-system/css";

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

type AcpConnectionStatusProps = {
  sessionPromise: Promise<string>;
};

export function AcpConnectionStatus({ sessionPromise }: AcpConnectionStatusProps) {
  use(sessionPromise);
  return (
    <span className={connectionStatus} data-connected="true">
      OpenCode ready
    </span>
  );
}
