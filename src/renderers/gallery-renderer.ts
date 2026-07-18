import { SvgVirtualCanvas } from "../display/svg.js";
import type { RenderContext, SceneRenderer, Size, SvgFrame } from "../display/types.js";

export const GALLERY_SCENES = ["signal", "clock", "spectrum", "alignment"] as const;
export type GalleryScene = (typeof GALLERY_SCENES)[number];

export class GalleryRenderer implements SceneRenderer {
  readonly id = "gallery";
  readonly name = "KeyGrid gallery";
  private canvas: Size = { width: 720, height: 432 };

  constructor(
    private scene: GalleryScene = "signal",
    private readonly now: () => Date = () => new Date()
  ) {}

  resize(canvas: Size): void {
    this.canvas = canvas;
  }

  setScene(scene: GalleryScene): void {
    this.scene = scene;
  }

  getScene(): GalleryScene {
    return this.scene;
  }

  render(context: RenderContext): SvgFrame {
    if (this.scene === "clock") {
      return this.renderClock();
    }
    if (this.scene === "spectrum") {
      return this.renderSpectrum(context);
    }
    if (this.scene === "alignment") {
      return this.renderAlignment();
    }
    return this.renderSignal(context);
  }

  private renderSignal(context: RenderContext): SvgFrame {
    const canvas = this.baseCanvas();
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    const sweepX = ((context.elapsedMs / 5) % (this.canvas.width + 240)) - 120;

    canvas.raw(`<path d="M-80 ${this.canvas.height * 0.77} L${this.canvas.width * 0.3} ${this.canvas.height * 0.3} L${this.canvas.width * 0.54} ${this.canvas.height * 0.68} L${this.canvas.width + 80} ${this.canvas.height * 0.2}" fill="none" stroke="#ffcc4d" stroke-width="${Math.max(10, this.canvas.height * 0.035)}" stroke-linecap="square" stroke-linejoin="round"/>`);
    canvas.raw(`<line x1="${sweepX}" y1="0" x2="${sweepX + 180}" y2="${this.canvas.height}" stroke="#ff5d73" stroke-width="18" opacity="0.8"/>`);
    canvas.text("ONE CANVAS", centerX, centerY - this.canvas.height * 0.09, {
      fill: "#f7fbff",
      fontFamily: "Arial Black, Segoe UI, Arial, sans-serif",
      fontSize: Math.max(42, this.canvas.height * 0.17),
      fontWeight: "900",
      textAnchor: "middle",
      dominantBaseline: "middle"
    });
    canvas.text("EVERY KEY", centerX, centerY + this.canvas.height * 0.11, {
      fill: "#46f6d6",
      fontFamily: "Arial Black, Segoe UI, Arial, sans-serif",
      fontSize: Math.max(28, this.canvas.height * 0.09),
      fontWeight: "900",
      textAnchor: "middle",
      dominantBaseline: "middle"
    });
    this.drawSceneLabel(canvas, "SIGNAL  /  PRESS ANY KEY");
    return canvas.toFrame({ metadata: { scene: this.scene } });
  }

  private renderClock(): SvgFrame {
    const canvas = this.baseCanvas();
    const now = this.now();
    const time = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    });
    const date = now.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "2-digit"
    }).toUpperCase();
    const centerX = this.canvas.width / 2;

    canvas.raw(`<rect x="${this.canvas.width * 0.08}" y="${this.canvas.height * 0.25}" width="${this.canvas.width * 0.84}" height="${this.canvas.height * 0.48}" rx="20" fill="#101722" stroke="#46f6d6" stroke-width="4"/>`);
    canvas.text(time, centerX, this.canvas.height * 0.47, {
      fill: "#f7fbff",
      fontFamily: "Consolas, Cascadia Mono, monospace",
      fontSize: Math.max(48, this.canvas.height * 0.2),
      fontWeight: "800",
      textAnchor: "middle",
      dominantBaseline: "middle"
    });
    canvas.text(date, centerX, this.canvas.height * 0.64, {
      fill: "#ffcc4d",
      fontFamily: "Segoe UI, Arial, sans-serif",
      fontSize: Math.max(20, this.canvas.height * 0.055),
      fontWeight: "800",
      textAnchor: "middle",
      dominantBaseline: "middle"
    });
    this.drawSceneLabel(canvas, "CLOCK  /  PRESS ANY KEY");

    return canvas.toFrame({
      dirtyRects: [{
        x: this.canvas.width * 0.08,
        y: this.canvas.height * 0.25,
        width: this.canvas.width * 0.84,
        height: this.canvas.height * 0.48
      }],
      metadata: { scene: this.scene, time }
    });
  }

  private renderSpectrum(context: RenderContext): SvgFrame {
    const canvas = this.baseCanvas();
    const barCount = Math.max(16, Math.round(this.canvas.width / 34));
    const gap = Math.max(5, this.canvas.width * 0.006);
    const barWidth = (this.canvas.width - gap * (barCount + 1)) / barCount;

    for (let index = 0; index < barCount; index += 1) {
      const phase = context.elapsedMs / 520 + index * 0.58;
      const normalized = 0.18 + Math.abs(Math.sin(phase) * 0.48 + Math.cos(phase * 0.43) * 0.22);
      const height = Math.min(this.canvas.height * 0.72, this.canvas.height * normalized);
      const x = gap + index * (barWidth + gap);
      const y = this.canvas.height * 0.82 - height;
      const color = index % 4 === 0 ? "#ff5d73" : index % 3 === 0 ? "#ffcc4d" : "#46f6d6";
      canvas.raw(`<rect x="${x}" y="${y}" width="${barWidth}" height="${height}" rx="${Math.min(8, barWidth / 3)}" fill="${color}"/>`);
    }

    canvas.text("LIVE ACROSS THE GRID", this.canvas.width / 2, this.canvas.height * 0.13, {
      fill: "#f7fbff",
      fontFamily: "Arial Black, Segoe UI, Arial, sans-serif",
      fontSize: Math.max(22, this.canvas.height * 0.065),
      fontWeight: "900",
      textAnchor: "middle",
      dominantBaseline: "middle"
    });
    this.drawSceneLabel(canvas, "SPECTRUM  /  PRESS ANY KEY");
    return canvas.toFrame({ metadata: { scene: this.scene } });
  }

  private renderAlignment(): SvgFrame {
    const canvas = this.baseCanvas();
    const columns = Math.max(1, Math.round(this.canvas.width / 144));
    const rows = Math.max(1, Math.round(this.canvas.height / 144));

    canvas.raw(`<line x1="0" y1="0" x2="${this.canvas.width}" y2="${this.canvas.height}" stroke="#ffcc4d" stroke-width="14"/>`);
    canvas.raw(`<line x1="${this.canvas.width}" y1="0" x2="0" y2="${this.canvas.height}" stroke="#ff5d73" stroke-width="14"/>`);
    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        const x = column * 144;
        const y = row * 144;
        canvas.raw(`<rect x="${x + 7}" y="${y + 7}" width="130" height="130" rx="12" fill="none" stroke="#46f6d6" stroke-width="4"/>`);
        canvas.text(`${column},${row}`, x + 72, y + 72, {
          fill: "#f7fbff",
          fontFamily: "Consolas, Cascadia Mono, monospace",
          fontSize: 28,
          fontWeight: "800",
          textAnchor: "middle",
          dominantBaseline: "middle"
        });
      }
    }
    this.drawSceneLabel(canvas, "ALIGNMENT  /  PRESS ANY KEY");
    return canvas.toFrame({ metadata: { scene: this.scene } });
  }

  private baseCanvas(): SvgVirtualCanvas {
    const canvas = new SvgVirtualCanvas(this.canvas, "#06080c");
    canvas.rect(0, 0, this.canvas.width, this.canvas.height, "#06080c");
    for (let x = 0; x <= this.canvas.width; x += 72) {
      canvas.raw(`<line x1="${x}" y1="0" x2="${x}" y2="${this.canvas.height}" stroke="#172332" stroke-width="1"/>`);
    }
    for (let y = 0; y <= this.canvas.height; y += 72) {
      canvas.raw(`<line x1="0" y1="${y}" x2="${this.canvas.width}" y2="${y}" stroke="#172332" stroke-width="1"/>`);
    }
    return canvas;
  }

  private drawSceneLabel(canvas: SvgVirtualCanvas, label: string): void {
    canvas.text(label, 24, this.canvas.height - 28, {
      fill: "#9fb3c8",
      fontFamily: "Segoe UI, Arial, sans-serif",
      fontSize: Math.max(14, this.canvas.height * 0.035),
      fontWeight: "700",
      dominantBaseline: "middle"
    });
  }
}

export function nextScene(scene: GalleryScene): GalleryScene {
  const index = GALLERY_SCENES.indexOf(scene);
  return GALLERY_SCENES[(index + 1) % GALLERY_SCENES.length];
}

export function sceneTargetFps(scene: GalleryScene): number {
  if (scene === "clock") {
    return 1;
  }
  if (scene === "spectrum") {
    return 6;
  }
  if (scene === "alignment") {
    return 0.5;
  }
  return 5;
}
