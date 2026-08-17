"use client";

import { Suspense, use, useOptimistic, useState, useTransition } from "react";
import { ErrorBoundary } from "react-error-boundary";
import type { usePdfiumEngine } from "@embedpdf/engines/react";
import { useActiveDocument } from "@embedpdf/plugin-document-manager/react";
import { useScroll } from "@embedpdf/plugin-scroll/react";
import { css } from "../../../styled-system/css";
import { tapTarget } from "../../styles/visually-hidden";
import {
  findActiveOutlineId,
  flattenBookmarks,
  getBookmarkDestination,
  getOutlinePanelKind,
  getScrollTarget,
  type PdfOutlineBookmark,
} from "./outline-utils";

type EmbedPdfEngine = NonNullable<ReturnType<typeof usePdfiumEngine>["engine"]>;
type PdfDocument = Parameters<EmbedPdfEngine["getBookmarks"]>[0];

const bookmarkPromises = new WeakMap<object, Promise<PdfOutlineBookmark[]>>();

function getBookmarkPromise(
  engine: EmbedPdfEngine,
  document: PdfDocument,
): Promise<PdfOutlineBookmark[]> {
  const cached = bookmarkPromises.get(document);
  if (cached) return cached;

  const promise = (async () => {
    try {
      const result = await engine.getBookmarks(document).toPromise();
      return result.bookmarks as PdfOutlineBookmark[];
    } catch (error: unknown) {
      bookmarkPromises.delete(document);
      throw error;
    }
  })();
  bookmarkPromises.set(document, promise);
  return promise;
}

const OUTLINE_BODY_ID = "pdf-outline-body";

const outlineShell = css({
  minBlockSize: "0",
  minInlineSize: "0",
  display: "grid",
  gridTemplateRows: "auto",
  borderInlineEndWidth: "0",
  borderBlockEndWidth: "1px",
  borderBlockEndStyle: "solid",
  borderBlockEndColor: "line",
  background: "stage",
  '&[data-open="true"]': {
    gridTemplateRows: "auto minmax(0, min(15rem, 45cqi))",
  },
  "@container reader (min-width: 40rem)": {
    gridTemplateRows: "auto minmax(0, 1fr)",
    borderInlineEndWidth: "1px",
    borderInlineEndStyle: "solid",
    borderInlineEndColor: "line",
    borderBlockEndWidth: "0",
    background: "surface",
    '&[data-open="true"]': {
      gridTemplateRows: "auto minmax(0, 1fr)",
    },
  },
});

const outlineHeader = css({
  display: "flex",
  alignItems: "safe center",
  justifyContent: "space-between",
  gap: "2.5",
  paddingBlock: "2.5",
  paddingInline: "3",
  borderBlockEndWidth: "1px",
  borderBlockEndStyle: "solid",
  borderBlockEndColor: "line",
});

const outlineHeading = css({
  margin: "0",
  color: "fg",
  fontSize: "sm",
  fontWeight: "600",
});

const outlineToggle = css({
  ...tapTarget,
  display: "inline-flex",
  alignItems: "center",
  gap: "1.5",
  borderWidth: "1px",
  borderStyle: "solid",
  borderColor: "lineStrong",
  borderRadius: "control",
  background: "surface",
  paddingInline: "2",
  color: "muted",
  fontSize: "xs",
  fontWeight: "600",
  "@container reader (min-width: 40rem)": {
    display: "none",
  },
});

const outlineBody = css({
  minBlockSize: "0",
  overflowY: "auto",
  overscrollBehavior: "contain",
  paddingBlock: "2 4.5",
  paddingInline: "2",
  scrollbarColor: "{colors.scrollbarThumb} {colors.scrollbarTrack}",
  scrollbarWidth: "thin",
  display: "none",
  '&[data-open="true"]': {
    display: "block",
  },
  "@container reader (min-width: 40rem)": {
    display: "block",
  },
});

const outlineList = css({
  display: "grid",
  gap: "0.5",
  margin: "0",
  padding: "0",
  listStyle: "none",
});

const outlineItem = css({
  minInlineSize: "0",
});

const outlineRow = css({
  minInlineSize: "0",
  display: "grid",
  gridTemplateColumns: "auto minmax(0, 1fr)",
  alignItems: "stretch",
  gap: "0.5",
  paddingInlineStart: "calc(var(--outline-depth) * 0.8em)",
  borderRadius: "md",
  '&[data-active="true"]': {
    background: "primarySoft",
    boxShadow: "inset 0.125rem 0 0 {colors.primary}",
  },
});

const outlineDisclosure = css({
  ...tapTarget,
  alignSelf: "start",
  minInlineSize: "tap",
  border: "0",
  borderRadius: "sm",
  background: "transparent",
  color: "muted",
  fontSize: "xs",
  lineHeight: "1",
  "&:hover": {
    background: "primarySoft",
  },
});

const outlineDisclosurePlaceholder = css({
  minInlineSize: "tap",
});

const outlineLink = css({
  ...tapTarget,
  minInlineSize: "0",
  display: "flex",
  alignItems: "center",
  gap: "1.5",
  border: "0",
  borderRadius: "sm",
  background: "transparent",
  paddingInline: "1 0.5",
  color: "muted",
  textAlign: "start",
  fontSize: "xs",
  lineHeight: "1.35",
  "&:hover": {
    background: "primarySoft",
    color: "fg",
  },
  '&[data-active="true"]': {
    color: "primaryText",
    fontWeight: "600",
  },
  "&:disabled": {
    cursor: "default",
    opacity: "0.55",
  },
});

const outlineTitle = css({
  minInlineSize: "0",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

const outlinePage = css({
  flexShrink: "0",
  marginInlineStart: "auto",
  color: "placeholder",
  fontFamily: "mono",
  fontSize: "0.75em",
  fontVariantNumeric: "tabular-nums",
});

const outlineMessage = css({
  display: "grid",
  justifyItems: "start",
  gap: "2.5",
  paddingBlock: "4",
  paddingInline: "3",
  color: "muted",
  fontSize: "xs",
  lineHeight: "1.6",
});

const outlineRetry = css({
  ...tapTarget,
  borderWidth: "1px",
  borderStyle: "solid",
  borderColor: "lineStrong",
  borderRadius: "control",
  background: "transparent",
  paddingInline: "2.5",
  color: "primaryText",
  fontSize: "xs",
  fontWeight: "600",
});

function OutlineLoading() {
  return <output className={outlineMessage}>目次を読み込み中…</output>;
}

function OutlineEmpty() {
  return <p className={outlineMessage}>目次がありません。</p>;
}

function OutlineDocumentError() {
  return (
    <div className={outlineMessage} role="alert">
      <p>この PDF を開けなかったため、目次を表示できません。</p>
    </div>
  );
}

function OutlineError({ resetErrorBoundary }: { resetErrorBoundary: () => void }) {
  return (
    <div className={outlineMessage} role="alert">
      <p>目次を読み込めませんでした。</p>
      <button className={outlineRetry} type="button" onClick={resetErrorBoundary}>
        再読み込み
      </button>
    </div>
  );
}

function OutlineTree({
  bookmarks,
  currentPage,
  onNavigate,
  pendingId,
}: {
  bookmarks: PdfOutlineBookmark[];
  currentPage: number;
  onNavigate: (bookmark: PdfOutlineBookmark, id: string) => void;
  pendingId: string | null;
}) {
  const items = flattenBookmarks(bookmarks);
  const activeId = findActiveOutlineId(items, currentPage);
  const [expandedIds, setExpandedIds] = useState(
    () => new Set(items.filter((item) => item.bookmark.children?.length).map((item) => item.id)),
  );

  if (bookmarks.length === 0) {
    return <p className={outlineMessage}>目次がありません。</p>;
  }

  const toggleExpanded = (id: string) => {
    setExpandedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <nav aria-label="PDFの目次">
      <OutlineBookmarkList
        bookmarks={bookmarks}
        parentId=""
        depth={0}
        activeId={activeId}
        expandedIds={expandedIds}
        pendingId={pendingId}
        onNavigate={onNavigate}
        onToggle={toggleExpanded}
      />
    </nav>
  );
}

function OutlineBookmarkList({
  bookmarks,
  parentId,
  depth,
  activeId,
  expandedIds,
  pendingId,
  onNavigate,
  onToggle,
}: {
  bookmarks: readonly PdfOutlineBookmark[];
  parentId: string;
  depth: number;
  activeId: string | null;
  expandedIds: ReadonlySet<string>;
  pendingId: string | null;
  onNavigate: (bookmark: PdfOutlineBookmark, id: string) => void;
  onToggle: (id: string) => void;
}) {
  return (
    <ul className={outlineList}>
      {bookmarks.map((bookmark, index) => {
        const id = parentId ? `${parentId}/${index}` : String(index);
        const children = bookmark.children ?? [];
        const hasChildren = children.length > 0;
        const isExpanded = expandedIds.has(id);
        const isActive = activeId === id;
        const isPending = pendingId === id;
        const destination = getBookmarkDestination(bookmark);
        const pageNumber = destination ? destination.pageIndex + 1 : null;
        const childrenId = `outline-children-${id.replaceAll("/", "-")}`;

        return (
          <li className={outlineItem} key={id}>
            <div
              className={outlineRow}
              data-active={isActive}
              style={{ "--outline-depth": depth } as React.CSSProperties}
            >
              {hasChildren ? (
                <button
                  aria-controls={childrenId}
                  aria-expanded={isExpanded}
                  aria-label={`${bookmark.title || "セクション"}の子項目`}
                  className={outlineDisclosure}
                  type="button"
                  onClick={() => onToggle(id)}
                >
                  {isExpanded ? "⌄" : "›"}
                </button>
              ) : (
                <span className={outlineDisclosurePlaceholder} aria-hidden="true" />
              )}
              <button
                aria-current={isActive ? "location" : undefined}
                className={outlineLink}
                data-active={isActive}
                disabled={!destination}
                type="button"
                onClick={() => onNavigate(bookmark, id)}
              >
                <span className={outlineTitle} title={bookmark.title || "無題のセクション"}>
                  {bookmark.title || "無題のセクション"}
                </span>
                {isPending ? <span className={outlinePage}>移動中</span> : null}
                {!isPending && pageNumber !== null ? (
                  <span className={outlinePage}>{pageNumber}</span>
                ) : null}
              </button>
            </div>
            {hasChildren ? (
              <div hidden={!isExpanded} id={childrenId}>
                <OutlineBookmarkList
                  bookmarks={children}
                  parentId={id}
                  depth={depth + 1}
                  activeId={activeId}
                  expandedIds={expandedIds}
                  pendingId={pendingId}
                  onNavigate={onNavigate}
                  onToggle={onToggle}
                />
              </div>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

function OutlineContent({
  engine,
  document,
  documentId,
}: {
  engine: EmbedPdfEngine;
  document: PdfDocument;
  documentId: string;
}) {
  const bookmarks = use(getBookmarkPromise(engine, document));
  const scroll = useScroll(documentId);
  const [isPending, startTransition] = useTransition();
  const [optimisticPage, setOptimisticPage] = useOptimistic(scroll.state.currentPage);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const navigate = (bookmark: PdfOutlineBookmark, id: string) => {
    const target = getScrollTarget(getBookmarkDestination(bookmark), {
      pages: document.pages,
    });
    if (!target || !scroll.provides) return;

    setPendingId(id);
    startTransition(() => {
      setOptimisticPage(target.pageNumber);
      scroll.provides?.scrollToPage({ ...target, behavior: "smooth", alignY: 20 });
    });
  };

  return (
    <OutlineTree
      bookmarks={bookmarks}
      currentPage={optimisticPage}
      onNavigate={navigate}
      pendingId={isPending ? pendingId : null}
    />
  );
}

function OutlinePanelBody({
  engine,
  activeDocument,
}: {
  engine: EmbedPdfEngine;
  activeDocument: ReturnType<typeof useActiveDocument>["activeDocument"];
}) {
  const panelKind = getOutlinePanelKind(activeDocument);
  const documentId = activeDocument?.id ?? null;
  const document = activeDocument?.document ?? null;

  if (panelKind === "empty") return <OutlineEmpty />;
  if (panelKind === "loading") return <OutlineLoading />;
  if (panelKind === "document-error" || !document || !documentId) {
    return <OutlineDocumentError />;
  }

  return (
    <ErrorBoundary fallbackRender={OutlineError} resetKeys={[documentId]}>
      <Suspense fallback={<OutlineLoading />}>
        <OutlineContent
          key={documentId}
          engine={engine}
          document={document}
          documentId={documentId}
        />
      </Suspense>
    </ErrorBoundary>
  );
}

export function PdfOutline({ engine }: { engine: EmbedPdfEngine }) {
  const { activeDocument } = useActiveDocument();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <aside className={outlineShell} data-open={isOpen} aria-label="PDFの目次パネル">
      <div className={outlineHeader}>
        <h2 className={outlineHeading}>目次</h2>
        <button
          aria-controls={OUTLINE_BODY_ID}
          aria-expanded={isOpen}
          aria-label="目次"
          className={outlineToggle}
          type="button"
          onClick={() => setIsOpen((open) => !open)}
        >
          {isOpen ? "閉じる" : "開く"}
          <span aria-hidden="true">{isOpen ? "⌃" : "⌄"}</span>
        </button>
      </div>
      <div className={outlineBody} data-open={isOpen} id={OUTLINE_BODY_ID}>
        <OutlinePanelBody engine={engine} activeDocument={activeDocument} />
      </div>
    </aside>
  );
}
