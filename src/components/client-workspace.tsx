"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { styled } from "../../styled-system/jsx";
import { ErrorBoundary } from "react-error-boundary";

function AppLoading() {
  return (
    <styled.div
      display="grid"
      minBlockSize="100svh"
      placeContent="center"
      color="muted"
      fontSize="14px"
    >
      読み込み中…
    </styled.div>
  );
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
