"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { css } from "../../../styled-system/css";
import { mermaidPlugin } from "./assistant-markdown-plugins";
import { mermaidChartDom, mermaidChartLayout } from "./mermaid-policy";

const chart = css({
  ...mermaidChartLayout,
  "& > svg": {
    display: "block",
    inlineSize: "100%",
    maxInlineSize: "100%",
    blockSize: "auto",
    height: "auto",
  },
});

const errorBox = css({
  marginBlock: "0.4em",
  overflow: "auto",
  fontFamily: "mono",
  fontSize: "0.9em",
  background: "stage",
  padding: "0.6em 0.75em",
  borderRadius: "4px",
});

type MermaidChartProps = {
  source: string;
};

export function MermaidChart({ source }: MermaidChartProps) {
  const reactId = useId().replaceAll(":", "");
  const [svg, setSvg] = useState("");
  const [renderError, setRenderError] = useState<string | null>(null);
  const markup = useMemo(() => ({ __html: svg }), [svg]);

  useEffect(() => {
    let cancelled = false;

    async function renderChart(): Promise<void> {
      try {
        const rendered = await mermaidPlugin.getMermaid().render(`mermaid-${reactId}`, source);
        if (cancelled) {
          return;
        }
        setRenderError(null);
        setSvg(rendered.svg);
      } catch (error: unknown) {
        if (cancelled) {
          return;
        }
        setSvg("");
        setRenderError(error instanceof Error ? error.message : "Failed to render Mermaid chart");
      }
    }

    renderChart();

    return () => {
      cancelled = true;
    };
  }, [reactId, source]);

  if (renderError !== null) {
    return (
      <pre className={errorBox} data-streamdown="mermaid-error">
        <code>{source}</code>
      </pre>
    );
  }

  if (svg === "") {
    return null;
  }

  return (
    <figure
      className={chart}
      data-streamdown={mermaidChartDom.value}
      // oxlint-disable-next-line react/no-danger -- Mermaid SVG is produced with securityLevel: "strict".
      dangerouslySetInnerHTML={markup}
    />
  );
}
