import { getTileCrop, getTileIndex } from "../display/layout.js";
import { escapeAttribute, svgToDataUrl } from "../display/svg.js";
import type { ButtonLayout, ButtonTile, Rect, SvgFrame } from "../display/types.js";
import { stableHash } from "./hash.js";

export type TileSliceResult = {
  readonly tiles: readonly ButtonTile[];
  readonly changed: readonly ButtonTile[];
  readonly unchanged: readonly ButtonTile[];
};

export class SvgTileSlicer {
  private readonly cache = new Map<string, ButtonTile>();

  slice(frame: SvgFrame, layout: ButtonLayout): TileSliceResult {
    const tiles: ButtonTile[] = [];
    const changed: ButtonTile[] = [];
    const unchanged: ButtonTile[] = [];

    for (let row = 0; row < layout.rows; row += 1) {
      for (let column = 0; column < layout.columns; column += 1) {
        const index = getTileIndex(row, column, layout);
        const cacheKey = `${layout.id}:${index}`;
        const previous = this.cache.get(cacheKey);
        const crop = getTileCrop(row, column, layout);

        if (previous && frame.dirtyRects && !frame.dirtyRects.some((rect) => intersects(crop, rect))) {
          tiles.push(previous);
          unchanged.push(previous);
          continue;
        }

        const tile = this.createTile(frame, layout, row, column);
        tiles.push(tile);
        if (previous?.hash === tile.hash) {
          unchanged.push(previous);
          continue;
        }

        this.cache.set(cacheKey, tile);
        changed.push(tile);
      }
    }

    return { tiles, changed, unchanged };
  }

  reset(): void {
    this.cache.clear();
  }

  private createTile(frame: SvgFrame, layout: ButtonLayout, row: number, column: number): ButtonTile {
    const index = getTileIndex(row, column, layout);
    const crop = getTileCrop(row, column, layout);
    const background = frame.background
      ? `<rect width="100%" height="100%" fill="${escapeAttribute(frame.background)}"/>`
      : "";
    const tileSvg = [
      `<svg xmlns="http://www.w3.org/2000/svg" width="${layout.button.width}" height="${layout.button.height}" viewBox="0 0 ${layout.button.width} ${layout.button.height}">`,
      frame.defs ? `<defs>${frame.defs}</defs>` : "",
      background,
      `<g transform="translate(${-crop.x} ${-crop.y})">`,
      frame.body,
      "</g>",
      "</svg>"
    ].join("");

    return {
      index,
      row,
      column,
      crop,
      dataUrl: svgToDataUrl(tileSvg),
      hash: stableHash(tileSvg)
    };
  }
}

function intersects(a: Rect, b: Rect): boolean {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}
