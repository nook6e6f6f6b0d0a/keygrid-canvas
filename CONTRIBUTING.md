# Contributing

Contributions are welcome when they keep the project focused on the shared
canvas engine.

## Good contributions

- Device-layout fixes.
- Rendering and tile-update performance improvements.
- Small, self-contained gallery scenes.
- Accessibility, documentation, and packaging improvements.
- Tests that expose a real edge case.

## Before opening a pull request

1. Run `pnpm check`.
2. Run `pnpm test`.
3. Run `pnpm build`.
4. Run `pnpm preview` and inspect the generated previews.
5. Keep network access, telemetry, shell execution, and unrelated integrations
   out of the core plugin.

Please explain the user-visible effect and include a screenshot or preview for
visual changes.
