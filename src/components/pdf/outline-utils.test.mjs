import { strict as assert } from "node:assert";
import { describe, it } from "node:test";
import { transformPosition } from "@embedpdf/models";
import {
  PDF_ZOOM_MODE_XYZ,
  findActiveOutlineId,
  flattenBookmarks,
  getBookmarkDestination,
  getOutlinePanelKind,
  getScrollTarget,
  toScrollPageCoordinates,
} from "./outline-utils.ts";

const letterPage = { size: { width: 612, height: 792 } };

const chapter1 = {
  title: "Chapter 1",
  target: { type: "destination", destination: { pageIndex: 2, zoom: {} } },
  children: [
    {
      title: "Section 1.1",
      target: { type: "destination", destination: { pageIndex: 4, zoom: {} } },
    },
  ],
};

const bookmarks = [
  chapter1,
  {
    title: "Chapter 2",
    target: { type: "destination", destination: { pageIndex: 8, zoom: {} } },
  },
];

describe("flattenBookmarks", () => {
  it("assigns stable ids and depths", () => {
    const items = flattenBookmarks(bookmarks);
    assert.deepEqual(
      items.map((item) => ({ id: item.id, depth: item.depth, title: item.title })),
      [
        { id: "0", depth: 0, title: "Chapter 1" },
        { id: "0/0", depth: 1, title: "Section 1.1" },
        { id: "1", depth: 0, title: "Chapter 2" },
      ],
    );
  });
});

describe("getBookmarkDestination", () => {
  it("reads destination and action targets", () => {
    assert.deepEqual(getBookmarkDestination(chapter1), { pageIndex: 2, zoom: {} });
    assert.equal(getBookmarkDestination({ title: "No target" }), null);
    assert.deepEqual(
      getBookmarkDestination({
        title: "GoTo",
        target: {
          type: "action",
          action: { type: 1, destination: { pageIndex: 6, zoom: {} } },
        },
      }),
      { pageIndex: 6, zoom: {} },
    );
    assert.equal(
      getBookmarkDestination({
        title: "URI",
        target: { type: "action", action: { type: 3 } },
      }),
      null,
    );
  });
});

describe("getScrollTarget", () => {
  it("maps 0-based pageIndex to 1-based pageNumber", () => {
    assert.deepEqual(getScrollTarget(getBookmarkDestination(chapter1)), {
      pageNumber: 3,
    });
  });

  it("rejects missing or invalid destinations", () => {
    assert.equal(getScrollTarget(null), null);
    assert.equal(getScrollTarget({ pageIndex: -1 }), null);
    assert.equal(getScrollTarget({ pageIndex: 1.5 }), null);
    assert.equal(getScrollTarget({ pageIndex: Number.NaN }), null);
  });

  it("does not pass raw PDF user-space XYZ coords to scrollToPage", () => {
    const destination = {
      pageIndex: 0,
      zoom: {
        mode: PDF_ZOOM_MODE_XYZ,
        params: { x: 72, y: 720, zoom: 0 },
      },
    };

    assert.deepEqual(getScrollTarget(destination), { pageNumber: 1 });
    assert.deepEqual(getScrollTarget(destination, { pages: [letterPage] }), {
      pageNumber: 1,
      pageCoordinates: { x: 72, y: 72 },
    });
  });

  it("converts XYZ from PDF user space (bottom-left) to EmbedPDF pageCoordinates (top-left)", () => {
    const topOfPage = {
      pageIndex: 0,
      zoom: { mode: PDF_ZOOM_MODE_XYZ, params: { x: 0, y: 792, zoom: 0 } },
    };
    const bottomOfPage = {
      pageIndex: 0,
      zoom: { mode: PDF_ZOOM_MODE_XYZ, params: { x: 0, y: 0, zoom: 0 } },
    };

    assert.deepEqual(getScrollTarget(topOfPage, { pages: [letterPage] }), {
      pageNumber: 1,
      pageCoordinates: { x: 0, y: 0 },
    });
    assert.deepEqual(getScrollTarget(bottomOfPage, { pages: [letterPage] }), {
      pageNumber: 1,
      pageCoordinates: { x: 0, y: 792 },
    });
  });

  it("offsets XYZ by the crop-box origin the way EmbedPDF does", () => {
    const page = {
      size: { width: 612, height: 792 },
      boxes: { crop: { left: 10, bottom: 20 } },
    };
    const destination = {
      pageIndex: 0,
      zoom: { mode: PDF_ZOOM_MODE_XYZ, params: { x: 72, y: 720, zoom: 0 } },
    };

    assert.deepEqual(getScrollTarget(destination, { pages: [page] }), {
      pageNumber: 1,
      pageCoordinates: { x: 62, y: 92 },
    });
  });

  it("ignores page rotation when converting XYZ for scrollToPage", () => {
    const destination = {
      pageIndex: 0,
      zoom: { mode: PDF_ZOOM_MODE_XYZ, params: { x: 72, y: 720, zoom: 0 } },
    };
    const expected = { pageNumber: 1, pageCoordinates: { x: 72, y: 72 } };

    for (const rotation of [0, 1, 2, 3]) {
      assert.deepEqual(
        getScrollTarget(destination, { pages: [{ ...letterPage, rotation }] }),
        expected,
      );
    }
  });

  it("falls back to page-only navigation when XYZ cannot be converted", () => {
    const destination = {
      pageIndex: 0,
      zoom: { mode: PDF_ZOOM_MODE_XYZ, params: { x: 72, y: 720, zoom: 0 } },
    };

    assert.deepEqual(getScrollTarget(destination, { pages: [] }), { pageNumber: 1 });
    assert.deepEqual(
      getScrollTarget(destination, { pages: [{ size: { width: 0, height: 792 } }] }),
      { pageNumber: 1 },
    );
    assert.deepEqual(
      getScrollTarget(
        {
          pageIndex: 0,
          zoom: { mode: PDF_ZOOM_MODE_XYZ, params: { x: Number.NaN, y: 10, zoom: 0 } },
        },
        { pages: [letterPage] },
      ),
      { pageNumber: 1 },
    );
    assert.deepEqual(
      getScrollTarget({ pageIndex: 2, zoom: { mode: 2 } }, { pages: [letterPage] }),
      { pageNumber: 3 },
    );
  });
});

describe("toScrollPageCoordinates", () => {
  it("y-flips crop-relative coords and ignores page rotation 0/90/180/270", () => {
    const xyz = { x: 72, y: 720 };
    const expected = { x: 72, y: 72 };

    for (const rotation of [0, 1, 2, 3]) {
      assert.deepEqual(toScrollPageCoordinates(xyz, { ...letterPage, rotation }), expected);
    }
  });

  it("offsets by crop-box then y-flips for every page rotation", () => {
    const page = {
      size: { width: 612, height: 792 },
      boxes: { crop: { left: 10, bottom: 20 } },
    };
    const xyz = { x: 72, y: 720 };
    const expected = { x: 62, y: 92 };

    for (const rotation of [0, 1, 2, 3]) {
      assert.deepEqual(toScrollPageCoordinates(xyz, { ...page, rotation }), expected);
    }
  });

  it("composes with scrollToPage transformPosition without double-rotating", () => {
    const xyz = { x: 72, y: 720 };
    const page = {
      size: { width: 612, height: 792 },
      boxes: { crop: { left: 10, bottom: 20 } },
    };
    const expectedDisplayed = {
      0: { x: 62, y: 92 },
      1: { x: 700, y: 62 },
      2: { x: 550, y: 700 },
      3: { x: 92, y: 550 },
    };

    for (const rotation of [0, 1, 2, 3]) {
      const coords = toScrollPageCoordinates(xyz, { ...page, rotation });
      const displayed = transformPosition(page.size, coords, rotation, 1);
      assert.deepEqual(coords, { x: 62, y: 92 });
      assert.deepEqual(displayed, expectedDisplayed[rotation]);
    }
  });
});

describe("findActiveOutlineId", () => {
  const items = flattenBookmarks(bookmarks);

  it("selects the last outline item whose page is at or before the current page", () => {
    assert.equal(findActiveOutlineId(items, 1), null);
    assert.equal(findActiveOutlineId(items, 5), "0/0");
    assert.equal(findActiveOutlineId(items, 7), "0/0");
    assert.equal(findActiveOutlineId(items, 9), "1");
  });
});

describe("getOutlinePanelKind", () => {
  it("does not treat idle or failed documents as loading", () => {
    assert.equal(getOutlinePanelKind(null), "empty");
    assert.equal(getOutlinePanelKind(undefined), "empty");
    assert.equal(getOutlinePanelKind({ status: "loading", document: null }), "loading");
    assert.equal(getOutlinePanelKind({ status: "error", document: null }), "document-error");
    assert.equal(getOutlinePanelKind({ status: "loaded", document: null }), "document-error");
    assert.equal(getOutlinePanelKind({ status: "loaded", document: { id: "doc" } }), "ready");
  });
});
