"use client";

import { css } from "../../../styled-system/css";

const pdfEmpty = css({
  height: "100%",
  minHeight: "0",
  display: "grid",
  placeItems: "center",
  padding: "40px",
  textAlign: "center",
});

const pdfEmptyBody = css({
  maxWidth: "320px",
  margin: "0",
  color: "muted",
  fontSize: "14px",
  lineHeight: "1.7",
});

export function EmptyReader() {
  return (
    <div className={pdfEmpty}>
      <p className={pdfEmptyBody}>PDF を開いて、気になる箇所を選択してください。</p>
    </div>
  );
}
