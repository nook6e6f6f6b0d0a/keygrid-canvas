export type FrameLoopOptions = {
  readonly targetFps: number;
  readonly onFrame: (nowMs: number) => Promise<void> | void;
  readonly onDrop?: () => void;
};

export class FrameLoop {
  private timer: NodeJS.Timeout | undefined;
  private running = false;
  private inFlight = false;
  private targetFps: number;

  constructor(private readonly options: FrameLoopOptions) {
    this.targetFps = options.targetFps;
  }

  start(): void {
    if (this.running) {
      return;
    }

    this.running = true;
    this.schedule(0);
  }

  stop(): void {
    this.running = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = undefined;
    }
  }

  setTargetFps(targetFps: number): void {
    this.targetFps = Math.max(0, targetFps);
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = undefined;
    }
    if (this.running && this.targetFps > 0) {
      this.schedule(this.frameBudgetMs);
    }
  }

  private schedule(delayMs: number): void {
    if (!this.running || this.targetFps <= 0) {
      return;
    }

    this.timer = setTimeout(() => void this.tick(), Math.max(0, delayMs));
  }

  private async tick(): Promise<void> {
    if (!this.running) {
      return;
    }

    if (this.inFlight) {
      this.options.onDrop?.();
      this.schedule(this.frameBudgetMs);
      return;
    }

    this.inFlight = true;
    const startedAt = performance.now();
    try {
      await this.options.onFrame(startedAt);
    } finally {
      this.inFlight = false;
      this.schedule(this.frameBudgetMs - (performance.now() - startedAt));
    }
  }

  private get frameBudgetMs(): number {
    return this.targetFps > 0 ? 1000 / this.targetFps : Number.POSITIVE_INFINITY;
  }
}
