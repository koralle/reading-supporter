"use client";

import { css } from "../../../styled-system/css";

const pdfEmpty = css({
  blockSize: "100%",
  minBlockSize: "0",
  display: "grid",
  placeItems: "center",
  padding: "10",
  textAlign: "center",
});

const pdfEmptyBody = css({
  maxInlineSize: "22em",
  margin: "0",
  color: "muted",
  fontSize: "sm",
  lineHeight: "1.7",
});

export function EmptyReader() {
  return (
    <div className={pdfEmpty}>
      <p className={pdfEmptyBody}>PDF を開いて、気になる箇所を選択してください。</p>
    </div>
  );
}
