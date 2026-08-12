type BookmarkDestination = {
  pageIndex: number;
  zoom?: {
    mode?: number | string;
    params?: {
      x: number;
      y: number;
      zoom: number;
    };
  };
};

type BookmarkAction = {
  type: number | string;
  destination?: BookmarkDestination;
};

export type PdfOutlineBookmark = {
  title: string;
  target?:
    | { type: "destination"; destination: BookmarkDestination }
    | { type: "action"; action: BookmarkAction };
  children?: PdfOutlineBookmark[];
};

export type OutlineItem = {
  id: string;
  title: string;
  depth: number;
  pageIndex: number | null;
  bookmark: PdfOutlineBookmark;
};

export type ScrollTarget = {
  pageNumber: number;
  pageCoordinates?: {
    x: number;
    y: number;
  };
};

/**
 * PDFium/EmbedPDF `PdfZoomMode.XYZ`. `FPDFDest_GetLocationInPage` returns these
 * params in PDF user space (origin at the crop-box lower-left, y-up).
 */
export const PDF_ZOOM_MODE_XYZ = 1;

export type OutlinePageGeometry = {
  size: { width: number; height: number };
  rotation?: number;
  boxes?: {
    crop?: { left: number; bottom: number };
  };
};

export type ScrollTargetContext = {
  pages?: readonly (OutlinePageGeometry | undefined)[] | null;
};

export type OutlineDocumentState = {
  status: string;
  document: unknown | null;
};

export type OutlinePanelKind = "empty" | "loading" | "document-error" | "ready";

export function getOutlinePanelKind(
  activeDocument: OutlineDocumentState | null | undefined,
): OutlinePanelKind {
  if (!activeDocument) return "empty";
  if (activeDocument.status === "loading") return "loading";
  if (activeDocument.status === "error" || !activeDocument.document) {
    return "document-error";
  }
  return "ready";
}

export function getBookmarkDestination(bookmark: PdfOutlineBookmark): BookmarkDestination | null {
  const { target } = bookmark;
  if (!target) {
    return null;
  }
  if (target.type === "destination") {
    return target.destination;
  }
  return target.action.destination ?? null;
}

function isXyzZoomMode(mode: number | string | undefined): boolean {
  return mode === PDF_ZOOM_MODE_XYZ || mode === "XYZ";
}

/**
 * Convert a PDF user-space point to EmbedPDF `scrollToPage` pageCoordinates.
 * Subtract the crop-box origin, then y-flip into unrotated device space
 * (top-left, y-down). Do not apply `page.rotation`: `scrollToPage` already
 * applies effective page/viewer rotation via `transformPosition`.
 */
export function toScrollPageCoordinates(
  point: { x: number; y: number },
  page: OutlinePageGeometry,
): { x: number; y: number } {
  const originX = page.boxes?.crop?.left ?? 0;
  const originY = page.boxes?.crop?.bottom ?? 0;
  const pageX = point.x - originX;
  const pageY = point.y - originY;
  return { x: pageX, y: page.size.height - pageY };
}

export function getScrollTarget(
  destination: BookmarkDestination | null,
  context: ScrollTargetContext = {},
): ScrollTarget | null {
  if (!destination || !Number.isInteger(destination.pageIndex) || destination.pageIndex < 0) {
    return null;
  }

  const pageNumber = destination.pageIndex + 1;
  const params = destination.zoom?.params;
  const page = context.pages?.[destination.pageIndex];
  const canConvertXyz =
    isXyzZoomMode(destination.zoom?.mode) &&
    params !== undefined &&
    Number.isFinite(params.x) &&
    Number.isFinite(params.y) &&
    page !== undefined &&
    Number.isFinite(page.size.width) &&
    Number.isFinite(page.size.height) &&
    page.size.width > 0 &&
    page.size.height > 0;

  if (canConvertXyz && params && page) {
    return {
      pageNumber,
      pageCoordinates: toScrollPageCoordinates({ x: params.x, y: params.y }, page),
    };
  }

  return { pageNumber };
}

export function flattenBookmarks(
  bookmarks: readonly PdfOutlineBookmark[],
  depth = 0,
  parentId = "",
): OutlineItem[] {
  return bookmarks.flatMap((bookmark, index) => {
    const id = parentId ? `${parentId}/${index}` : String(index);
    const destination = getBookmarkDestination(bookmark);
    const item: OutlineItem = {
      id,
      title: bookmark.title,
      depth,
      pageIndex: destination?.pageIndex ?? null,
      bookmark,
    };
    const children = bookmark.children ? flattenBookmarks(bookmark.children, depth + 1, id) : [];
    return [item, ...children];
  });
}

export function findActiveOutlineId(
  items: readonly OutlineItem[],
  currentPage: number,
): string | null {
  let activeId: string | null = null;
  for (const item of items) {
    if (item.pageIndex !== null && item.pageIndex + 1 <= currentPage) {
      activeId = item.id;
    }
  }
  return activeId;
}
