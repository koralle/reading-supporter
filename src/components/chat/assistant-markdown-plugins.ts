import { cjk } from "@streamdown/cjk";
import { code } from "@streamdown/code";
import { createMermaidPlugin } from "@streamdown/mermaid";
import { mermaidSecurityLevel } from "./mermaid-policy.ts";

export const mermaidPlugin = createMermaidPlugin({
  config: {
    securityLevel: mermaidSecurityLevel,
    startOnLoad: false,
    suppressErrorRendering: true,
  },
});

export const assistantMarkdownPlugins = {
  cjk,
  code,
  mermaid: mermaidPlugin,
};
