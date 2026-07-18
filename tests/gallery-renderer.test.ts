import assert from "node:assert/strict";
import test from "node:test";
import {
  GalleryRenderer,
  GALLERY_SCENES,
  nextScene,
  type GalleryScene
} from "../src/renderers/gallery-renderer.js";

test("gallery cycles through every public scene", () => {
  let scene: GalleryScene = GALLERY_SCENES[0];
  for (let index = 0; index < GALLERY_SCENES.length; index += 1) {
    scene = nextScene(scene);
  }
  assert.equal(scene, GALLERY_SCENES[0]);
});

test("alignment scene produces a full SVG frame", () => {
  const renderer = new GalleryRenderer("alignment");
  renderer.resize({ width: 720, height: 432 });
  const frame = renderer.render({
    canvas: { width: 720, height: 432 },
    frameIndex: 0,
    nowMs: 0,
    elapsedMs: 0,
    deltaMs: 0,
    targetFps: 1
  });

  assert.equal(frame.width, 720);
  assert.equal(frame.height, 432);
  assert.match(frame.body, /ALIGNMENT/);
});

test("clock scene uses an injected time source", () => {
  const renderer = new GalleryRenderer("clock", () => new Date(2026, 6, 17, 21, 11, 3));
  renderer.resize({ width: 720, height: 432 });
  const frame = renderer.render({
    canvas: { width: 720, height: 432 },
    frameIndex: 0,
    nowMs: 0,
    elapsedMs: 0,
    deltaMs: 0,
    targetFps: 1
  });

  assert.match(frame.body, /21:11:03/);
  assert.match(frame.body, /FRI, JUL 17/);
});
