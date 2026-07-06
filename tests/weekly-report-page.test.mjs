import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("weekly report page includes assistant form and dual outputs", async () => {
  const html = await readFile(new URL("../weekly-report.html", import.meta.url), "utf8");

  assert.match(html, /Weekly Report Assistant/);
  assert.match(html, /id="weekly-report-form"/);
  assert.match(html, /id="report-context"/);
  assert.match(html, /id="report-recipient"/);
  assert.match(html, /id="report-type"/);
  assert.match(html, /id="report-detail"/);
  assert.match(html, /id="quick-draft-output"/);
  assert.match(html, /id="ai-prompt-output"/);
  assert.match(html, /id="copy-quick-draft"/);
  assert.match(html, /id="copy-ai-prompt"/);
});

test("weekly report page keeps the shared site identity", async () => {
  const html = await readFile(new URL("../weekly-report.html", import.meta.url), "utf8");

  assert.match(html, /id="profile-sidebar"/);
  assert.match(html, /id="top-nav"/);
  assert.match(html, /assets\/Yumo\.jpg/);
  assert.match(html, /index\.html#tools/);
});
