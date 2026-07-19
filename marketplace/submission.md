# KeyGrid Canvas Marketplace submission

This is the ready-to-paste listing for Elgato Maker Console. Keep it as a draft
until the physical-device and organization-name checks at the end are complete.

## Product

- Product type: Stream Deck plugin
- Name: KeyGrid Canvas
- Price: Free
- Version: 0.1.1
- Primary category: Select the closest available productivity or utility category
- Supported systems: Windows 10 or newer; macOS 13 or newer
- Requirement: Stream Deck 7.1 or newer

### Short description

Turn every Stream Deck key into one programmable tiled canvas with four
animated, grid-wide scenes.

### Full description

KeyGrid Canvas turns every Stream Deck key into one programmable tiled canvas.
Instead of treating keys as separate buttons, it renders one scene at the size
of the full keypad and slices it across the physical grid, preserving the gaps
between keys. Use the included Signal, Clock, Spectrum, and Alignment scenes,
then press any Canvas Tile key to cycle the entire display.

Set up in three steps: install the plugin, add Canvas Tile to every key on one
Stream Deck page, and press any key to switch scenes. KeyGrid Canvas adapts to
Stream Deck Mini, Stream Deck and MK.2, Stream Deck Neo keys, Stream Deck +
keys, Stream Deck XL, and other keypad sizes detected by the Stream Deck SDK.
The Stream Deck + touch strip and dials are not included in this version.

KeyGrid Canvas is free and open source under the MIT License. It runs locally
with no account, cloud service, telemetry, shell execution, or companion
application. Requires Stream Deck 7.1 or later on Windows 10+ or macOS 13+.

### Suggested search terms

Stream Deck, Stream Deck XL, tiled canvas, multi-key display, animated keys,
productivity, developer tools, open source

Use only tags that Maker Console actually offers. Do not append these as a
keyword block to the product description.

## Additional links

- Website and source: https://github.com/nook6e6f6f6b0d0a/keygrid-canvas
- Setup guide: https://github.com/nook6e6f6f6b0d0a/keygrid-canvas#quick-start
- Support: https://github.com/nook6e6f6f6b0d0a/keygrid-canvas/issues
- Privacy and boundaries: https://github.com/nook6e6f6f6b0d0a/keygrid-canvas#privacy-and-boundaries
- License: https://github.com/nook6e6f6f6b0d0a/keygrid-canvas/blob/main/LICENSE

## Release notes

Initial public alpha. Includes Signal, Clock, Spectrum, and Alignment scenes;
automatic keypad-grid detection; coordinated scene changes from any Canvas
Tile key; cached tile updates; corrected Stream Deck action-list category
icons; Windows and macOS support; and fully local operation with no account,
cloud service, or telemetry.

## Upload files

| File | Required size | Purpose |
| --- | ---: | --- |
| `app-icon.png` | 288 x 288 | Marketplace app icon |
| `thumbnail.png` | 1920 x 960 | Listing thumbnail |
| `gallery-scenes.png` | 1920 x 960 | Included scene gallery |
| `gallery-devices.png` | 1920 x 960 | Supported key grids |
| `gallery-setup.png` | 1920 x 960 | Setup and privacy summary |
| `../dist/com.keygrid.canvas.streamDeckPlugin` | Packaged plugin | Product file |

## Before submitting

- [ ] Confirm the Maker organization name is `nook6e6f6f6b0d0a`, or update the
  manifest Author field and rebuild the package before uploading.
- [ ] Confirm **KeyGrid Canvas** is the permanent product name.
- [ ] Confirm **Free** is the intended monetization option.
- [x] Install the exact packaged file on at least one physical Stream Deck.
- [x] Fill every key on one page with Canvas Tile and verify all four scenes.
- [ ] Confirm animation remains responsive and the plugin stops cleanly when
  the page is left or Stream Deck closes.
- [ ] Review the Maker Agreement in the organization's Maker Console settings.

Maker Console does not allow changing the product name or monetization option
directly after creation. Contact Elgato Maker support if either must change.
