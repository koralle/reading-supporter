"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { css } from "../../styled-system/css";

const appLoading = css({
  minHeight: "100vh",
  display: "grid",
  placeItems: "center",
  color: "inkSoft",
  letterSpacing: "0.02em",
});

const Workspace = dynamic(() => import("./workspace/Workspace"), {
  ssr: false,
});

export default function ClientWorkspace() {
  return (
    <Suspense fallback={<div className={appLoading}>Preparing your reading desk...</div>}>
      <Workspace />
    </Suspense>
  );
}
