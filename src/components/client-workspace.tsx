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
      color="inkSoft"
      letterSpacing="0.02em"
    >
      Preparing your reading desk...
    </styled.div>
  );
}

const Workspace = dynamic(() => import("./workspace/workspace"), {
  ssr: false,
});

export default function ClientWorkspace() {
  return (
    <ErrorBoundary fallback={<p>Cloud not load the application.</p>}>
      <Suspense fallback={<AppLoading />}>
        <Workspace />
      </Suspense>
    </ErrorBoundary>
  );
}
