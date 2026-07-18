import assert from "node:assert/strict";
import test from "node:test";
import { createLayout } from "../src/display/layout.js";
import type { SvgFrame } from "../src/display/types.js";
import { SvgTileSlicer } from "../src/slicer/svg-tile-slicer.js";

const layout = createLayout("test", "Test 2x2", { columns: 2, rows: 2 }, { width: 10, height: 10 });

test("identical frames reuse every tile", () => {
  const slicer = new SvgTileSlicer();
  const frame: SvgFrame = {
    kind: "svg",
    width: 20,
    height: 20,
    background: "#000",
    body: '<rect width="20" height="20" fill="#fff"/>'
  };

  assert.equal(slicer.slice(frame, layout).changed.length, 4);
  const repeated = slicer.slice(frame, layout);
  assert.equal(repeated.changed.length, 0);
  assert.equal(repeated.unchanged.length, 4);
});

test("dirty rectangles regenerate only intersecting cached tiles", () => {
  const slicer = new SvgTileSlicer();
  const original: SvgFrame = {
    kind: "svg",
    width: 20,
    height: 20,
    background: "#000",
    body: '<rect width="20" height="20" fill="#fff"/>'
  };
  slicer.slice(original, layout);

  const changed = slicer.slice({
    ...original,
    body: `${original.body}<circle cx="5" cy="5" r="2" fill="#f00"/>`,
    dirtyRects: [{ x: 1, y: 1, width: 6, height: 6 }]
  }, layout);

  assert.equal(changed.changed.length, 1);
  assert.equal(changed.changed[0]?.row, 0);
  assert.equal(changed.changed[0]?.column, 0);
  assert.equal(changed.unchanged.length, 3);
});
