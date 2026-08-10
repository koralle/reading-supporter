"use client";

import { css } from "../../../styled-system/css";

const pdfEmpty = css({
  height: "100%",
  minHeight: "480px",
  display: "grid",
  placeItems: "center",
  padding: "40px",
  textAlign: "center",
  mdDown: {
    minHeight: "calc(100dvh - 170px)",
  },
});

const pdfEmptyInner = css({
  maxWidth: "300px",
});

const pdfEmptyMark = css({
  width: "56px",
  height: "70px",
  margin: "0 auto 18px",
  display: "grid",
  placeItems: "end center",
  borderWidth: "1px",
  borderStyle: "solid",
  borderColor: "lineMuted",
  borderRadius: "mark",
  background: "white",
  boxShadow: "emptyMark",
  color: "sageDark",
  fontFamily: "mono",
  fontSize: "10px",
  paddingBottom: "9px",
});

const pdfEmptyTitle = css({
  margin: "0 0 8px",
  fontSize: "28px",
  fontWeight: "400",
});

const pdfEmptyBody = css({
  margin: "0",
  color: "inkSoft",
  fontSize: "12px",
  lineHeight: "1.7",
});

export function EmptyReader() {
  return (
    <div className={pdfEmpty}>
      <div className={pdfEmptyInner}>
        <div className={pdfEmptyMark}>PDF</div>
        <h2 className={pdfEmptyTitle}>Bring a book to the desk.</h2>
        <p className={pdfEmptyBody}>
          Open a PDF, select a passage, and ask the question that is slowing you down.
        </p>
      </div>
    </div>
  );
}
