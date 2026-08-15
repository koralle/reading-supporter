"use client";

import type { CustomRendererProps } from "streamdown";
import { css } from "../../../styled-system/css";
import { MermaidChart } from "./mermaid-chart";
import { mermaidView } from "./mermaid-policy";

const pending = css({
  marginBlock: "0.4em",
  overflow: "auto",
  fontFamily: "mono",
  fontSize: "0.9em",
  background: "stage",
  padding: "0.6em 0.75em",
  borderRadius: "4px",
});

export function AssistantMermaid({ code, isIncomplete }: CustomRendererProps) {
  const view = mermaidView(code, isIncomplete);
  if (view.kind === "pending") {
    return (
      <pre className={pending} data-streamdown="mermaid-pending">
        <code>{view.code}</code>
      </pre>
    );
  }
  return <MermaidChart source={view.code} />;
}
