import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { Streamdown } from "streamdown";
import nextConfig from "../../../next.config.ts";
import { assistantMarkdownPlugins } from "./assistant-markdown-plugins.ts";
import { mermaidChartSvgSelector, mermaidSecurityLevel, mermaidView } from "./mermaid-policy.ts";

function MermaidProbe({
  code,
  isIncomplete,
}: {
  code: string;
  isIncomplete: boolean;
  language: string;
}) {
  const view = mermaidView(code, isIncomplete);
  return createElement("div", { "data-mermaid-view": view.kind }, view.code);
}

function renderAssistantMarkdown(text: string, isAnimating: boolean): string {
  return renderToString(
    createElement(
      Streamdown,
      {
        isAnimating,
        plugins: {
          ...assistantMarkdownPlugins,
          renderers: [{ component: MermaidProbe, language: "mermaid" }],
        },
      },
      text,
    ),
  );
}

test("renders headings, lists, and fenced code", () => {
  const html = renderAssistantMarkdown(
    ["# Title", "", "- item", "", "```js", "console.log(1)", "```"].join("\n"),
    false,
  );

  assert.match(html, /data-streamdown="heading-1"/);
  assert.match(html, /data-streamdown="unordered-list"/);
  assert.match(html, /data-streamdown="code-block"/);
  assert.match(html, /console\.log\(1\)/);
});

test("does not emit a script tag for HTML in the markdown", () => {
  const html = renderAssistantMarkdown('hello <script>alert("xss")</script>', false);

  assert.equal(/<script/i.test(html), false);
  assert.match(html, /hello/);
});

test("keeps an unclosed mermaid fence as pending while streaming", () => {
  const html = renderAssistantMarkdown("```mermaid\nflowchart TD\n  A --> B", true);

  assert.match(html, /data-mermaid-view="pending"/);
  assert.equal(html.includes('data-mermaid-view="chart"'), false);
});

test("renders a closed mermaid fence as a chart once streaming finishes", () => {
  const html = renderAssistantMarkdown("```mermaid\nflowchart TD\n  A --> B\n```\n", false);

  assert.match(html, /data-mermaid-view="chart"/);
});

test("does not treat an incomplete mermaid fence as ready to render", () => {
  assert.deepEqual(mermaidView("flowchart TD", true), { code: "flowchart TD", kind: "pending" });
  assert.deepEqual(mermaidView("flowchart TD", false), { code: "flowchart TD", kind: "chart" });
});

test("mermaid plugin stays on strict security", () => {
  assert.equal(mermaidSecurityLevel, "strict");
  assert.equal(assistantMarkdownPlugins.mermaid.name, "mermaid");
});

test("sizes only the chart svg, not pan-zoom control icons", () => {
  assert.equal(mermaidChartSvgSelector(), '[data-streamdown="mermaid-chart"] > svg');
});

test("does not stretch every svg inside Streamdown mermaid chrome", () => {
  const files = ["./assistant-markdown.tsx", "./assistant-mermaid.tsx", "./mermaid-chart.tsx"];
  const source = files
    .map((file) => {
      const path = new URL(file, import.meta.url);
      return existsSync(path) ? readFileSync(path, "utf8") : "";
    })
    .join("\n");

  assert.equal(source.includes("[data-streamdown=mermaid] svg"), false);
});

test("production bundler does not stub langium or vscode-jsonrpc", () => {
  assert.equal("webpack" in nextConfig, false);
  assert.equal("turbopack" in nextConfig, false);
  assert.equal("serverExternalPackages" in nextConfig, false);
});

test("does not keep a mermaid node stub that production never bundles", () => {
  const stub = fileURLToPath(new URL("../../lib/mermaid-node-stub.ts", import.meta.url));
  assert.equal(existsSync(stub), false);
});
