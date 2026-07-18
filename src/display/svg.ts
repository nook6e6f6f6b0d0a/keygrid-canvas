import type { Size, SvgFrame } from "./types.js";

export function escapeText(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

export function escapeAttribute(value: string): string {
  return escapeText(value).replaceAll("\"", "&quot;");
}

export function svgToDataUrl(svg: string): string {
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export function createSvgDocument(frame: SvgFrame): string {
  const background = frame.background
    ? `<rect width="100%" height="100%" fill="${escapeAttribute(frame.background)}"/>`
    : "";

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${frame.width}" height="${frame.height}" viewBox="0 0 ${frame.width} ${frame.height}">`,
    frame.defs ? `<defs>${frame.defs}</defs>` : "",
    background,
    frame.body,
    "</svg>"
  ].join("");
}

export class SvgVirtualCanvas {
  private readonly parts: string[] = [];
  private readonly defs: string[] = [];

  constructor(
    private readonly size: Size,
    private readonly background = "#000000"
  ) {}

  rect(x: number, y: number, width: number, height: number, fill: string, extra = ""): void {
    this.parts.push(
      `<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="${escapeAttribute(fill)}"${extra}/>`
    );
  }

  text(value: string, x: number, y: number, options: SvgTextOptions): void {
    const attrs = [
      `x="${x}"`,
      `y="${y}"`,
      `fill="${escapeAttribute(options.fill)}"`,
      `font-family="${escapeAttribute(options.fontFamily)}"`,
      `font-size="${options.fontSize}"`,
      options.fontWeight ? `font-weight="${escapeAttribute(options.fontWeight)}"` : "",
      options.opacity !== undefined ? `opacity="${options.opacity}"` : "",
      options.textAnchor ? `text-anchor="${options.textAnchor}"` : "",
      options.dominantBaseline ? `dominant-baseline="${options.dominantBaseline}"` : ""
    ].filter(Boolean).join(" ");

    this.parts.push(`<text ${attrs}>${escapeText(value)}</text>`);
  }

  raw(svg: string): void {
    this.parts.push(svg);
  }

  addDef(svg: string): void {
    this.defs.push(svg);
  }

  toFrame(options: {
    readonly dirtyRects?: SvgFrame["dirtyRects"];
    readonly metadata?: SvgFrame["metadata"];
  } = {}): SvgFrame {
    return {
      kind: "svg",
      width: this.size.width,
      height: this.size.height,
      background: this.background,
      defs: this.defs.join(""),
      body: this.parts.join(""),
      dirtyRects: options.dirtyRects,
      metadata: options.metadata
    };
  }
}

export type SvgTextOptions = {
  readonly fill: string;
  readonly fontFamily: string;
  readonly fontSize: number;
  readonly fontWeight?: string;
  readonly opacity?: number;
  readonly textAnchor?: "start" | "middle" | "end";
  readonly dominantBaseline?: "hanging" | "middle" | "central" | "auto";
};
