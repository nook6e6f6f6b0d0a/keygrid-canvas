import assert from "node:assert/strict";
import test from "node:test";
import { CanvasEngine } from "../src/display/display-engine.js";
import { createLayout } from "../src/display/layout.js";
import type {
  ButtonTile,
  FramePresenter,
  FrameTiming,
  PresentationResult,
  SceneRenderer,
  SvgFrame
} from "../src/display/types.js";

class StaticRenderer implements SceneRenderer {
  readonly id = "static";
  readonly name = "Static";

  render(): SvgFrame {
    return {
      kind: "svg",
      width: 20,
      height: 10,
      background: "#000",
      body: '<rect width="20" height="10" fill="#fff"/>'
    };
  }
}

class RecordingPresenter implements FramePresenter {
  calls = 0;
  tiles = 0;

  async present(
    _frame: SvgFrame,
    tiles: readonly ButtonTile[],
    _timing: FrameTiming
  ): Promise<PresentationResult> {
    this.calls += 1;
    this.tiles += tiles.length;
    return { attempted: tiles.length, updated: tiles.length, skipped: 0, failed: 0 };
  }
}

test("engine does not present an unchanged second frame", async () => {
  const presenter = new RecordingPresenter();
  const engine = new CanvasEngine({
    layout: createLayout("test", "Test", { columns: 2, rows: 1 }, { width: 10, height: 10 }),
    renderer: new StaticRenderer(),
    presenter,
    targetFps: 0
  });

  await engine.renderOnce();
  const second = await engine.renderOnce();

  assert.equal(presenter.calls, 1);
  assert.equal(presenter.tiles, 2);
  assert.deepEqual(second, { attempted: 0, updated: 0, skipped: 2, failed: 0 });
});
