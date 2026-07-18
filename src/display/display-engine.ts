import { SvgTileSlicer } from "../slicer/svg-tile-slicer.js";
import { FrameLoop } from "./frame-loop.js";
import { getCanvasSize } from "./layout.js";
import type {
  ButtonLayout,
  EngineStats,
  FramePresenter,
  FrameTiming,
  PresentationResult,
  SceneRenderer
} from "./types.js";

export type CanvasEngineOptions = {
  readonly layout: ButtonLayout;
  readonly renderer: SceneRenderer;
  readonly presenter: FramePresenter;
  readonly targetFps?: number;
  readonly slicer?: SvgTileSlicer;
};

export class CanvasEngine {
  private layout: ButtonLayout;
  private renderer: SceneRenderer;
  private readonly presenter: FramePresenter;
  private readonly slicer: SvgTileSlicer;
  private readonly loop: FrameLoop;
  private targetFps: number;
  private startedAt = performance.now();
  private lastFrameAt = this.startedAt;
  private frameIndex = 0;
  private lastFrameMs = 0;
  private lastChangedTiles = 0;
  private droppedFrames = 0;

  constructor(options: CanvasEngineOptions) {
    this.layout = options.layout;
    this.renderer = options.renderer;
    this.presenter = options.presenter;
    this.slicer = options.slicer ?? new SvgTileSlicer();
    this.targetFps = options.targetFps ?? 4;
    this.renderer.resize?.(getCanvasSize(this.layout));
    this.loop = new FrameLoop({
      targetFps: this.targetFps,
      onFrame: async (nowMs) => {
        await this.renderAt(nowMs);
      },
      onDrop: () => {
        this.droppedFrames += 1;
      }
    });
  }

  start(): void {
    this.startedAt = performance.now();
    this.lastFrameAt = this.startedAt;
    this.loop.start();
  }

  stop(): void {
    this.loop.stop();
  }

  setRenderer(renderer: SceneRenderer): void {
    this.renderer.dispose?.();
    this.renderer = renderer;
    this.renderer.resize?.(getCanvasSize(this.layout));
    this.slicer.reset();
  }

  setTargetFps(targetFps: number): void {
    this.targetFps = Math.max(0, targetFps);
    this.loop.setTargetFps(this.targetFps);
  }

  resize(layout: ButtonLayout): void {
    this.layout = layout;
    this.renderer.resize?.(getCanvasSize(layout));
    this.slicer.reset();
  }

  invalidate(): void {
    this.slicer.reset();
  }

  getStats(): EngineStats {
    return {
      frameIndex: this.frameIndex,
      lastFrameMs: this.lastFrameMs,
      lastChangedTiles: this.lastChangedTiles,
      droppedFrames: this.droppedFrames
    };
  }

  async renderOnce(): Promise<PresentationResult> {
    return this.renderAt(performance.now());
  }

  private async renderAt(nowMs: number): Promise<PresentationResult> {
    const canvas = getCanvasSize(this.layout);
    const deltaMs = Math.max(0, nowMs - this.lastFrameAt);
    const renderStartedAt = performance.now();
    const frame = this.renderer.render({
      canvas,
      frameIndex: this.frameIndex,
      nowMs,
      elapsedMs: nowMs - this.startedAt,
      deltaMs,
      targetFps: this.targetFps
    });
    const renderMs = performance.now() - renderStartedAt;

    const sliceStartedAt = performance.now();
    const slice = this.slicer.slice(frame, this.layout);
    const sliceMs = performance.now() - sliceStartedAt;
    const timing: FrameTiming = {
      frameIndex: this.frameIndex,
      elapsedMs: nowMs - this.startedAt,
      deltaMs,
      renderMs,
      sliceMs,
      targetFps: this.targetFps
    };

    const result = slice.changed.length > 0
      ? await this.presenter.present(frame, slice.changed, timing)
      : { attempted: 0, updated: 0, skipped: slice.tiles.length, failed: 0 };

    this.lastFrameAt = nowMs;
    this.frameIndex += 1;
    this.lastFrameMs = renderMs + sliceMs;
    this.lastChangedTiles = slice.changed.length;
    return result;
  }
}
