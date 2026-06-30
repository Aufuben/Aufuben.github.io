import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";
import test from "node:test";

async function loadContent() {
  const source = await readFile(new URL("../content.js", import.meta.url), "utf8");
  const sandbox = { window: {} };
  vm.runInNewContext(source, sandbox, { filename: "content.js" });
  return sandbox.window.YUMO_SITE_CONTENT;
}

test("homepage tools section links to the standalone weekly report page", async () => {
  const content = await loadContent();
  const tools = content.sections.find((section) => section.id === "tools");
  const weeklyReport = tools.entries.find((entry) => entry.title === "Weekly Report Assistant");

  assert.equal(weeklyReport.href, "weekly-report.html");
  assert.equal(weeklyReport.status, "Available");
  assert.equal(weeklyReport.actionLabel, "Open tool");
  assert.match(weeklyReport.description, /rough notes/i);
});

test("homepage content has the expanded Experience and Resources structures", async () => {
  const content = await loadContent();
  const experience = content.sections.find((section) => section.id === "experience");
  const resources = content.sections.find((section) => section.id === "resources");
  const experienceTitles = Array.from(experience.entries, (entry) => entry.title);
  const resourceTags = Array.from(content.resources);

  assert.deepEqual(
    experienceTitles,
    ["Learning routes", "Project notes", "AI workflows"],
  );
  assert.deepEqual(resourceTags, ["AI Tools", "Study Path", "Project Templates", "Programming", "Writing", "Automation"]);
  assert.match(resources.title, /Reusable/i);
  assert.equal(resources.entries[0].href, "resources.html");
  assert.equal(resources.entries[0].actionLabel, "Open resources");
});

test("homepage identity content replaces placeholder profile and update copy", async () => {
  const content = await loadContent();
  const updateTitles = Array.from(content.updates, (update) => update.title);
  const updateDates = Array.from(content.updates, (update) => update.date);
  const educationText = content.profile.education.join(" ");

  assert.doesNotMatch(educationText, /Coming soon/i);
  assert.deepEqual(updateDates, ["2026.06", "2026.06", "2026.06"]);
  assert.deepEqual(updateTitles, [
    "Site direction defined",
    "Weekly Report Assistant launched",
    "Resources page published",
  ]);
  assert.match(
    content.about.body,
    /Nanjing University of Posts and Telecommunications.*Institute of AI for Industry/s,
  );
  assert.match(content.about.body, /browser-side tools/i);
});
