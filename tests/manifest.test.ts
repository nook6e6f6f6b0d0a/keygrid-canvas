import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const pluginRoot = "com.keygrid.canvas.sdPlugin";

test("categorized plugins provide both category icon sizes", () => {
  const manifest = JSON.parse(
    readFileSync(`${pluginRoot}/manifest.json`, "utf8")
  ) as { Category?: string; CategoryIcon?: string };

  assert.equal(manifest.Category, "KeyGrid Canvas");
  assert.equal(manifest.CategoryIcon, "imgs/category-icon");

  const icon = `${pluginRoot}/${manifest.CategoryIcon}.svg`;
  const icon2x = `${pluginRoot}/${manifest.CategoryIcon}@2x.svg`;
  assert.equal(existsSync(icon), true);
  assert.equal(existsSync(icon2x), true);
  assert.match(readFileSync(icon, "utf8"), /width="28" height="28"/);
  assert.match(readFileSync(icon2x, "utf8"), /width="56" height="56"/);
});
