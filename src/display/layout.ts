import type { ButtonLayout, GridSize, Size } from "./types.js";

export const DEFAULT_BUTTON_SIZE: Size = {
  width: 144,
  height: 144
};

export const LAYOUT_PRESETS = {
  mini: createLayout("mini", "Stream Deck Mini", { columns: 3, rows: 2 }),
  classic: createLayout("classic", "Stream Deck / MK.2", { columns: 5, rows: 3 }),
  neo: createLayout("neo", "Stream Deck Neo keys", { columns: 4, rows: 2 }),
  plus: createLayout("plus", "Stream Deck Plus keys", { columns: 4, rows: 2 }),
  xl: createLayout("xl", "Stream Deck XL", { columns: 8, rows: 4 })
} as const;

export type LayoutPresetName = keyof typeof LAYOUT_PRESETS;

export function createLayout(
  id: string,
  name: string,
  grid: GridSize,
  button: Size = DEFAULT_BUTTON_SIZE
): ButtonLayout {
  return {
    id,
    name,
    columns: grid.columns,
    rows: grid.rows,
    button
  };
}

export function layoutFromDeviceSize(id: string, name: string, size: GridSize): ButtonLayout {
  const known = Object.values(LAYOUT_PRESETS).find(
    (preset) => preset.columns === size.columns && preset.rows === size.rows
  );

  return createLayout(
    known ? `${id}-${known.id}` : `${id}-${size.columns}x${size.rows}`,
    known ? `${name} (${known.name})` : `${name} (${size.columns}x${size.rows})`,
    size
  );
}

export function getCanvasSize(layout: ButtonLayout): Size {
  return {
    width: layout.columns * layout.button.width,
    height: layout.rows * layout.button.height
  };
}

export function getTileIndex(row: number, column: number, layout: ButtonLayout): number {
  return row * layout.columns + column;
}

export function getTileCrop(row: number, column: number, layout: ButtonLayout) {
  return {
    x: column * layout.button.width,
    y: row * layout.button.height,
    width: layout.button.width,
    height: layout.button.height,
    row,
    column
  };
}
