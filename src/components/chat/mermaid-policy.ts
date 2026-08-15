export const mermaidSecurityLevel = "strict" as const;

export const mermaidChartDom = {
  attribute: "data-streamdown",
  value: "mermaid-chart",
} as const;

export type MermaidView = {
  code: string;
  kind: "chart" | "pending";
};

export function mermaidView(code: string, isIncomplete: boolean): MermaidView {
  if (isIncomplete) {
    return { code, kind: "pending" };
  }
  return { code, kind: "chart" };
}

export function mermaidChartSvgSelector(): string {
  return `[${mermaidChartDom.attribute}="${mermaidChartDom.value}"] > svg`;
}

export const mermaidChartLayout = {
  inlineSize: "100%",
  overflow: "visible",
} as const;
