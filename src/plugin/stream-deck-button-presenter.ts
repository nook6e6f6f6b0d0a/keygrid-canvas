import { Target, type KeyAction } from "@elgato/streamdeck";
import type { ButtonTile, FramePresenter, FrameTiming, PresentationResult, SvgFrame } from "../display/types.js";

type RegisteredAction = {
  readonly action: KeyAction;
  readonly coordinate: string;
};

export class StreamDeckButtonPresenter implements FramePresenter {
  private readonly byCoordinate = new Map<string, RegisteredAction>();
  private readonly byId = new Map<string, RegisteredAction>();

  constructor(
    private readonly maxConcurrentUpdates = 2,
    private readonly interUpdateDelayMs = 20,
    private readonly target = Target.HardwareAndSoftware
  ) {}

  get visibleCount(): number {
    return this.byId.size;
  }

  add(action: KeyAction): void {
    const coordinates = action.coordinates;
    if (!coordinates) {
      return;
    }
    const coordinate = key(coordinates.row, coordinates.column);
    const registered = { action, coordinate };
    this.byCoordinate.set(coordinate, registered);
    this.byId.set(action.id, registered);
  }

  removeById(actionId: string): void {
    const registered = this.byId.get(actionId);
    if (!registered) {
      return;
    }
    this.byId.delete(actionId);
    this.byCoordinate.delete(registered.coordinate);
  }

  async setSettingsForVisible(settings: Record<string, string>): Promise<void> {
    const actions = Array.from(this.byId.values(), ({ action }) => action);
    await runLimited(actions, this.maxConcurrentUpdates, async (action) => {
      try {
        await action.setSettings(settings);
      } catch {
        // A key may disappear while Stream Deck changes pages.
      }
    });
  }

  async present(_frame: SvgFrame, tiles: readonly ButtonTile[], _timing: FrameTiming): Promise<PresentationResult> {
    const updates = tiles.flatMap((tile) => {
      const registered = this.byCoordinate.get(key(tile.row, tile.column));
      return registered ? [{ tile, registered }] : [];
    });
    let updated = 0;
    let failed = 0;

    await runLimited(updates, this.maxConcurrentUpdates, async ({ tile, registered }) => {
      try {
        await registered.action.setImage(tile.dataUrl, { target: this.target });
        await delay(this.interUpdateDelayMs);
        updated += 1;
      } catch {
        failed += 1;
      }
    });

    return {
      attempted: updates.length,
      updated,
      skipped: tiles.length - updates.length,
      failed
    };
  }
}

function key(row: number, column: number): string {
  return `${row}:${column}`;
}

async function runLimited<T>(
  items: readonly T[],
  concurrency: number,
  worker: (item: T) => Promise<void>
): Promise<void> {
  const queue = [...items];
  const workers = Array.from({ length: Math.max(1, concurrency) }, async () => {
    while (queue.length > 0) {
      const item = queue.shift();
      if (item !== undefined) {
        await worker(item);
      }
    }
  });
  await Promise.all(workers);
}

async function delay(milliseconds: number): Promise<void> {
  if (milliseconds > 0) {
    await new Promise((resolve) => setTimeout(resolve, milliseconds));
  }
}
