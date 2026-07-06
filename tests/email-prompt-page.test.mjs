import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("email prompt page includes the required form and output controls", async () => {
  const html = await readFile(new URL("../email-prompt.html", import.meta.url), "utf8");

  assert.match(html, /Email Prompt Helper/);
  assert.match(html, /id="email-prompt-form"/);
  assert.match(html, /id="email-example-actions"/);
  assert.match(html, /data-email-example="teacher-meeting"/);
  assert.match(html, /data-email-example="team-follow-up"/);
  assert.match(html, /data-email-example="delay-apology"/);
  assert.match(html, /id="email-scenario"/);
  assert.match(html, /id="email-recipient"/);
  assert.match(html, /id="email-tone"/);
  assert.match(html, /id="email-language"/);
  assert.match(html, /id="email-ask"/);
  assert.match(html, /id="email-rough-notes"/);
  assert.match(html, /id="email-prompt-output"/);
  assert.match(html, /id="email-missing-info"/);
  assert.match(html, /id="copy-email-prompt"/);
});

test("email prompt page keeps the shared site identity", async () => {
  const html = await readFile(new URL("../email-prompt.html", import.meta.url), "utf8");

  assert.match(html, /id="profile-sidebar"/);
  assert.match(html, /id="top-nav"/);
  assert.match(html, /assets\/Yumo\.jpg/);
  assert.match(html, /index\.html#tools/);
});
