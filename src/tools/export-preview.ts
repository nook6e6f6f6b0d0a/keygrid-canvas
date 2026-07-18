import { mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { createSvgDocument, escapeAttribute, escapeText } from "../display/svg.js";
import { getCanvasSize, LAYOUT_PRESETS } from "../display/layout.js";
import type { ButtonLayout, ButtonTile } from "../display/types.js";
import { GalleryRenderer, GALLERY_SCENES, type GalleryScene } from "../renderers/gallery-renderer.js";
import { SvgTileSlicer } from "../slicer/svg-tile-slicer.js";

const outputRoot = resolve(process.cwd(), "docs", "assets");
mkdirSync(outputRoot, { recursive: true });

for (const scene of GALLERY_SCENES) {
  exportPreview(scene, LAYOUT_PRESETS.xl);
}
exportPreview("signal", LAYOUT_PRESETS.classic);

function exportPreview(scene: GalleryScene, layout: ButtonLayout): void {
  const renderer = new GalleryRenderer(scene, () => new Date(2026, 6, 17, 21, 11, 3));
  const canvas = getCanvasSize(layout);
  renderer.resize(canvas);
  const frame = renderer.render({
    canvas,
    frameIndex: 0,
    nowMs: 0,
    elapsedMs: scene === "spectrum" ? 900 : 0,
    deltaMs: 0,
    targetFps: 1
  });
  const slice = new SvgTileSlicer().slice(frame, layout);
  const baseName = `${layout.id}-${scene}`;
  writeFileSync(join(outputRoot, `${baseName}.svg`), createSvgDocument(frame), "utf8");
  writeFileSync(join(outputRoot, `${baseName}-deck.svg`), createDeckSvg(scene, layout, slice.tiles), "utf8");
  writeFileSync(join(outputRoot, `${baseName}-tiles.html`), createTilesHtml(scene, layout, slice.tiles), "utf8");
}

function createDeckSvg(scene: string, layout: ButtonLayout, tiles: readonly ButtonTile[]): string {
  const gap = 10;
  const padding = 18;
  const headingHeight = 50;
  const deckWidth = padding * 2 + layout.columns * 144 + (layout.columns - 1) * gap;
  const deckHeight = padding * 2 + layout.rows * 144 + (layout.rows - 1) * gap;
  const width = deckWidth + 64;
  const height = headingHeight + deckHeight + 64;
  const definitions = tiles.map((tile) => {
    const x = 32 + padding + tile.column * (144 + gap);
    const y = headingHeight + 32 + padding + tile.row * (144 + gap);
    return `<clipPath id="tile-${tile.index}"><rect x="${x}" y="${y}" width="144" height="144" rx="8"/></clipPath>`;
  }).join("");
  const images = tiles.map((tile) => {
    const x = 32 + padding + tile.column * (144 + gap);
    const y = headingHeight + 32 + padding + tile.row * (144 + gap);
    return `<image href="${escapeAttribute(tile.dataUrl)}" x="${x}" y="${y}" width="144" height="144" clip-path="url(#tile-${tile.index})"/>`;
  }).join("");

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`,
    `<rect width="${width}" height="${height}" fill="#06080c"/>`,
    `<defs>${definitions}</defs>`,
    `<text x="32" y="38" fill="#f7fbff" font-family="Segoe UI,Arial,sans-serif" font-size="20" font-weight="700">${escapeText(layout.name)} / ${escapeText(scene)}</text>`,
    `<rect x="32" y="${headingHeight + 32}" width="${deckWidth}" height="${deckHeight}" rx="8" fill="#101722" stroke="#33475b"/>`,
    images,
    "</svg>"
  ].join("");
}

function createTilesHtml(scene: string, layout: ButtonLayout, tiles: readonly ButtonTile[]): string {
  const cells = tiles.map((tile) =>
    `<img src="${escapeAttribute(tile.dataUrl)}" width="144" height="144" alt="Key ${tile.column},${tile.row}">`
  ).join("");
  return [
    "<!doctype html>",
    '<html lang="en">',
    "<head>",
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width,initial-scale=1">',
    `<title>${escapeText(scene)} - KeyGrid Canvas preview</title>`,
    "<style>",
    "body{margin:0;padding:32px;background:#06080c;color:#f7fbff;font:16px Segoe UI,Arial,sans-serif}",
    ".grid{display:grid;gap:10px;grid-template-columns:repeat(var(--columns),144px)}",
    ".deck{display:inline-block;padding:18px;background:#101722;border:1px solid #33475b;border-radius:8px}",
    "img{display:block;border-radius:8px;background:#000}",
    "h1{font-size:20px;margin:0 0 16px;letter-spacing:0}",
    "</style>",
    "</head>",
    "<body>",
    `<h1>${escapeText(layout.name)} / ${escapeText(scene)}</h1>`,
    '<div class="deck">',
    `<div class="grid" style="--columns:${layout.columns}">${cells}</div>`,
    "</div>",
    "</body>",
    "</html>"
  ].join("");
}
