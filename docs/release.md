# Release checklist

1. Update versions in `package.json`, `CHANGELOG.md`, and `manifest.json`.
2. Run `pnpm install --frozen-lockfile`.
3. Run `pnpm release:check`.
4. Inspect every SVG and tiled HTML preview in `docs/assets/`.
5. Test the packaged plugin on at least one physical keypad device.
6. Confirm the release contains no logs, local paths, credentials, or personal
   integrations.
7. Tag the verified commit and attach the generated `.streamDeckPlugin` file.

Marketplace submission is a separate review through Elgato Maker Console. A
GitHub release is not a Marketplace publication.
