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

test("homepage tools section links to the standalone email prompt helper", async () => {
  const content = await loadContent();
  const tools = content.sections.find((section) => section.id === "tools");
  const emailHelper = tools.entries.find((entry) => entry.title === "Email Prompt Helper");

  assert.equal(emailHelper.href, "email-prompt.html");
  assert.equal(emailHelper.status, "Available");
  assert.equal(emailHelper.actionLabel, "Open tool");
  assert.match(emailHelper.description, /copyable prompt/i);
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
  assert.deepEqual(resourceTags, [
    "GitHub 开源工具",
    "AI Tools",
    "Study Path",
    "Project Templates",
    "Programming",
    "Writing",
    "Automation",
  ]);
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
  assert.deepEqual(updateDates, ["2026.08", "2026.06", "2026.06", "2026.06"]);
  assert.deepEqual(updateTitles, [
    "CLI tools on GitHub",
    "Site direction defined",
    "Weekly Report Assistant launched",
    "Resources page published",
  ]);
  assert.match(
    content.about.body,
    /Nanjing University of Posts and Telecommunications.*Institute of AI for Industry/s,
  );
  assert.match(content.about.body, /browser-side tools/i);
  assert.match(content.about.body, /command-line utilities/i);
});

test("profile content exposes a compact mobile summary", async () => {
  const content = await loadContent();

  assert.match(content.profile.mobileSummary, /NUPT undergraduate/i);
  assert.match(content.profile.mobileSummary, /AI for Industry/i);
});

test("homepage tools section lists GitHub CLI tools with README one-liners", async () => {
  const content = await loadContent();
  const tools = content.sections.find((section) => section.id === "tools");
  const ossTools = tools.entries.filter((entry) => entry.group === "GitHub 开源工具");
  const titles = Array.from(ossTools, (entry) => entry.title);

  assert.deepEqual(titles, [
    "tiny-http",
    "fit-to-size",
    "share-safe",
    "twin-photos",
    "reclaim",
    "pdf-desk",
    "bill-ledger",
  ]);
  assert.equal(ossTools[0].href, "https://github.com/Aufuben/tiny-http");
  assert.equal(ossTools[0].status, "考研复试主项目");
  assert.equal(ossTools[0].groupId, "oss-tools");
  for (const entry of ossTools) {
    assert.match(entry.href, /^https:\/\/github\.com\/Aufuben\//);
    assert.equal(entry.actionLabel, "GitHub");
  }
});

test("resources page includes the GitHub CLI tools as compact entries", async () => {
  const content = await loadContent();
  const ossCategory = content.resourcesPage.categories.find(
    (category) => category.title === "GitHub 开源工具",
  );
  const names = Array.from(ossCategory.resources, (resource) => resource.name);

  assert.equal(content.resourcesPage.categories[0].title, "GitHub 开源工具");
  assert.deepEqual(names, [
    "tiny-http",
    "fit-to-size",
    "share-safe",
    "twin-photos",
    "reclaim",
    "pdf-desk",
    "bill-ledger",
  ]);
  assert.equal(ossCategory.resources[0].url, "https://github.com/Aufuben/tiny-http");
  assert.equal(ossCategory.resources[0].bestFor, undefined);
});

test("nav includes a short jump to the GitHub CLI tools", async () => {
  const content = await loadContent();
  const ossNav = content.nav.find((item) => item.href === "#oss-tools");

  assert.equal(ossNav.label, "开源");
});
