# Hardware test: v0.1.1

Tested on 2026-07-18 with Stream Deck 7.5.0.22885 on Windows.

## Device

- Stream Deck XL (2022)
- 8 x 4 key grid
- 32 Canvas Tile actions

## Package

- Version: 0.1.1.0
- SHA-256: `826649DE7AB4EF6420BB91BA1E4737C1601A85AFFD90DF6C85CF221FB4569468`

## Results

- The exact packaged installer completed successfully.
- The plugin connected without a content or manifest error.
- All 32 keys formed one continuous canvas.
- Signal, Clock, Spectrum, and Alignment were selected from the hardware.
- The complete canvas returned after restarting the Stream Deck application.
- The complete canvas returned after disconnecting and reconnecting the device.
- The saved profile retained all 32 Canvas Tile actions.
- The Clock scene used 0.073% of the whole 16-thread CPU during a 20-second
  sample, with a 78.5 MiB working set.

## Known setup limitation

Version 0.1.1 requires the user to place Canvas Tile on every participating
key. A bundled starter profile is planned so supported devices can begin with a
pre-filled canvas.
