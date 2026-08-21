import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("stylesheet includes weekly assistant and resources classes", async () => {
  const css = await readFile(new URL("../styles.css", import.meta.url), "utf8");

  assert.match(css, /\.tool-shell/);
  assert.match(css, /\.tool-workbench/);
  assert.match(css, /\.tool-form/);
  assert.match(css, /\.field-group/);
  assert.match(css, /\.assistant-output-block/);
  assert.match(css, /#email-prompt-output/);
  assert.match(css, /\.resource-card-grid/);
  assert.match(css, /\.flow-group-title/);
  assert.match(css, /@media \(max-width: 860px\)/);
});

test("stylesheet keeps the mobile shared profile compact", async () => {
  const css = await readFile(new URL("../styles.css", import.meta.url), "utf8");

  assert.match(css, /\.profile-mobile-summary\s*{[\s\S]*?display: none;/);
  assert.match(
    css,
    /@media \(max-width: 860px\)\s*{[\s\S]*?\.profile-sidebar\s*{[\s\S]*?grid-template-columns: 72px minmax\(0, 1fr\);/,
  );
  assert.match(css, /@media \(max-width: 860px\)\s*{[\s\S]*?\.profile-mobile-summary\s*{[\s\S]*?display: block;/);
  assert.match(css, /@media \(max-width: 860px\)\s*{[\s\S]*?\.profile-education,\s*\.profile-block-note\s*{[\s\S]*?display: none;/);
  assert.match(css, /@media \(max-width: 860px\)\s*{[\s\S]*?\.profile-block-contact \.rail-label\s*{[\s\S]*?display: none;/);
});

test("form controls keep readable widths before wrapping", async () => {
  const css = await readFile(new URL("../styles.css", import.meta.url), "utf8");

  assert.match(css, /\.field-row\s*{[\s\S]*?grid-template-columns: repeat\(auto-fit, minmax\(10rem, 1fr\)\);/);
  assert.match(css, /\.field-group input,\s*\.field-group select\s*{[\s\S]*?min-width: 0;/);
});

test("sitemap includes all pages with the current sync date", async () => {
  const sitemap = await readFile(new URL("../sitemap.xml", import.meta.url), "utf8");

  assert.match(sitemap, /<loc>https:\/\/Aufuben\.github\.io\/<\/loc>/);
  assert.match(sitemap, /<loc>https:\/\/Aufuben\.github\.io\/weekly-report\.html<\/loc>/);
  assert.match(sitemap, /<loc>https:\/\/Aufuben\.github\.io\/email-prompt\.html<\/loc>/);
  assert.match(sitemap, /<loc>https:\/\/Aufuben\.github\.io\/resources\.html<\/loc>/);
  assert.equal((sitemap.match(/<lastmod>2026-08-21<\/lastmod>/g) || []).length, 4);
});
