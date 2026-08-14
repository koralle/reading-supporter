"use client";

import { cjk } from "@streamdown/cjk";
import { code } from "@streamdown/code";
import { mermaid } from "@streamdown/mermaid";
import { Streamdown } from "streamdown";
import { css } from "../../../styled-system/css";

const streamdownPlugins = { code, mermaid, cjk };

const markdown = css({
  minWidth: "0",
  overflowX: "auto",
  color: "fg",
  fontFamily: "body",
  "& :is(h1, h2, h3, h4, h5, h6):first-child": {
    marginTop: "0!",
  },
  "& [data-streamdown=heading-1]": {
    fontSize: "1.2em!",
    marginBlock: "0.55em 0.3em",
  },
  "& [data-streamdown=heading-2]": {
    fontSize: "1.12em!",
    marginBlock: "0.5em 0.28em",
  },
  "& [data-streamdown=heading-3]": {
    fontSize: "1.06em!",
    marginBlock: "0.45em 0.25em",
  },
  "& [data-streamdown=heading-4], & [data-streamdown=heading-5], & [data-streamdown=heading-6]": {
    fontSize: "1em!",
    marginBlock: "0.4em 0.2em",
  },
  "& p": {
    marginBlock: "0.45em",
  },
  "& p:first-child": {
    marginTop: "0",
  },
  "& p:last-child": {
    marginBottom: "0",
  },
  "& ul": {
    listStyleType: "disc",
    paddingInlineStart: "1.4em",
    marginBlock: "0.4em",
  },
  "& ol": {
    listStyleType: "decimal",
    paddingInlineStart: "1.4em",
    marginBlock: "0.4em",
  },
  "& ul ul": {
    listStyleType: "circle",
  },
  "& li": {
    marginBlock: "0.15em",
  },
  "& a": {
    color: "primary",
    textDecorationLine: "underline",
    textUnderlineOffset: "2px",
  },
  "& [data-streamdown=blockquote]": {
    color: "muted",
    borderColor: "line",
  },
  "& :not(pre) > code": {
    fontFamily: "mono",
    fontSize: "0.9em",
    background: "stage",
    paddingInline: "0.35em",
    paddingBlock: "0.1em",
    borderRadius: "4px",
  },
});

type AssistantMarkdownProps = {
  text: string;
  isAnimating: boolean;
};

export function AssistantMarkdown({ text, isAnimating }: AssistantMarkdownProps) {
  return (
    <Streamdown className={markdown} plugins={streamdownPlugins} isAnimating={isAnimating}>
      {text}
    </Streamdown>
  );
}
