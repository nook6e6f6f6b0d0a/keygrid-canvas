# Release checklist

1. Update versions in `package.json`, `CHANGELOG.md`, and `manifest.json`.
2. Run `pnpm install --frozen-lockfile`.
3. Run `pnpm release:check`.
4. Inspect every SVG and tiled HTML preview in `docs/assets/`.
5. Test the packaged plugin on at least one physical keypad device.
6. Confirm the release contains no logs, local paths, credentials, or personal
   integrations.
7. Tag the verified commit and attach the generated `.streamDeckPlugin` file.

## Marketplace handoff

1. Review `marketplace/submission.md` and confirm the product name, free price,
   description, links, and release notes.
2. Confirm the Maker organization name matches `Author` in `manifest.json`.
3. Upload `marketplace/app-icon.png`, `marketplace/thumbnail.png`, and all three
   `marketplace/gallery-*.png` images.
4. Re-test the exact uploaded plugin file on physical hardware.
5. Create the product in Elgato Maker Console and submit it for review.

Marketplace submission is separate from a GitHub release. Do not mark the
physical-device check complete until someone has installed and used the exact
package on a supported Stream Deck.
