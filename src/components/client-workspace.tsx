"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { css } from "../../styled-system/css";
import { ErrorBoundary } from "react-error-boundary";

const loading = css({
  display: "grid",
  minBlockSize: "100dvb",
  placeContent: "center",
  color: "muted",
  fontSize: "sm",
});

function AppLoading() {
  return <div className={loading}>読み込み中…</div>;
}

const Workspace = dynamic(() => import("./workspace/workspace"), {
  ssr: false,
});

export default function ClientWorkspace() {
  return (
    <ErrorBoundary fallback={<p>アプリを読み込めませんでした。</p>}>
      <Suspense fallback={<AppLoading />}>
        <Workspace />
      </Suspense>
    </ErrorBoundary>
  );
}
