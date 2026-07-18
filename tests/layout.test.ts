import assert from "node:assert/strict";
import test from "node:test";
import { getCanvasSize, LAYOUT_PRESETS, layoutFromDeviceSize } from "../src/display/layout.js";

test("XL layout creates a 1152 by 576 virtual canvas", () => {
  assert.deepEqual(getCanvasSize(LAYOUT_PRESETS.xl), { width: 1152, height: 576 });
});

test("unknown keypad sizes are accepted dynamically", () => {
  const layout = layoutFromDeviceSize("device", "Prototype", { columns: 6, rows: 3 });
  assert.equal(layout.columns, 6);
  assert.equal(layout.rows, 3);
  assert.match(layout.id, /6x3/);
});
