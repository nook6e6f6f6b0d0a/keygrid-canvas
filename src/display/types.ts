export type Milliseconds = number;

export type Size = {
  readonly width: number;
  readonly height: number;
};

export type GridSize = {
  readonly columns: number;
  readonly rows: number;
};

export type Point = {
  readonly x: number;
  readonly y: number;
};

export type Rect = Point &
  Size & {
    readonly row?: number;
    readonly column?: number;
  };

export type ButtonLayout = GridSize & {
  readonly id: string;
  readonly name: string;
  readonly button: Size;
};

export type RenderContext = {
  readonly canvas: Size;
  readonly frameIndex: number;
  readonly nowMs: Milliseconds;
  readonly elapsedMs: Milliseconds;
  readonly deltaMs: Milliseconds;
  readonly targetFps: number;
};

export type SvgFrame = {
  readonly kind: "svg";
  readonly width: number;
  readonly height: number;
  readonly defs?: string;
  readonly body: string;
  readonly background?: string;
  readonly dirtyRects?: readonly Rect[];
  readonly metadata?: Record<string, string | number | boolean>;
};

export type ButtonTile = {
  readonly index: number;
  readonly row: number;
  readonly column: number;
  readonly crop: Rect;
  readonly dataUrl: string;
  readonly hash: string;
};

export type FrameTiming = {
  readonly frameIndex: number;
  readonly elapsedMs: Milliseconds;
  readonly deltaMs: Milliseconds;
  readonly renderMs: number;
  readonly sliceMs: number;
  readonly targetFps: number;
};

export type PresentationResult = {
  readonly attempted: number;
  readonly updated: number;
  readonly skipped: number;
  readonly failed: number;
};

export interface SceneRenderer {
  readonly id: string;
  readonly name: string;
  render(context: RenderContext): SvgFrame;
  resize?(canvas: Size): void;
  dispose?(): void;
}

export interface FramePresenter {
  present(frame: SvgFrame, tiles: readonly ButtonTile[], timing: FrameTiming): Promise<PresentationResult>;
}

export type EngineStats = {
  readonly frameIndex: number;
  readonly lastFrameMs: number;
  readonly lastChangedTiles: number;
  readonly droppedFrames: number;
};
