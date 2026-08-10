"use client";

import { useEffect, useEffectEvent } from "react";
import { useSelectionCapability } from "@embedpdf/plugin-selection/react";

type SelectionCaptureProps = {
  documentId: string;
  onSelectionChange: (text: string) => void;
};

export function SelectionCapture({ documentId, onSelectionChange }: SelectionCaptureProps) {
  const { provides: selectionCapability } = useSelectionCapability();
  // Keep the latest callback without re-subscribing the external EmbedPDF listener.
  const onSelectionChangeEvent = useEffectEvent(onSelectionChange);

  useEffect(() => {
    const selection = selectionCapability?.forDocument(documentId);
    if (!selection) return;

    return selection.onEndSelection(() => {
      void selection
        .getSelectedText()
        .toPromise()
        .then((lines) => {
          onSelectionChangeEvent(lines.join("\n").trim());
        })
        .catch(() => onSelectionChangeEvent(""));
    });
  }, [documentId, selectionCapability]);

  return null;
}
