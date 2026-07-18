# Architecture

## Frame pipeline

`CanvasEngine` owns timing and coordinates three replaceable components:

1. A `SceneRenderer` creates one SVG frame at full-grid dimensions.
2. `SvgTileSlicer` crops the frame into one 144 x 144 SVG per key.
3. A `FramePresenter` sends changed tiles to the target device.

The Stream Deck adapter is intentionally thin. The display engine and slicer
can be tested without hardware or the Stream Deck runtime.

## Tile caching

Each generated tile receives a stable content hash. Identical tiles are not
presented again. A renderer can additionally provide `dirtyRects`; cached tiles
outside those rectangles are reused without regenerating their SVG.

Dirty rectangles are an optimization hint, not a correctness requirement. A
renderer should omit the hint when a change may affect the full composition.

## Device geometry

Known layouts are presets, while unknown keypad sizes are accepted dynamically.
The virtual canvas is simply:

```text
width  = columns x 144
height = rows x 144
```

The renderer works in that coordinate system. Each key receives a translated
view of the same SVG body.

## Runtime safety

The public plugin contains no network client, subprocess bridge, filesystem
data provider, credential path, or application launcher. It only receives
Stream Deck events and sets key images and action settings.
