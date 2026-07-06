import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";
import test from "node:test";

async function loadWeeklyReport() {
  const source = await readFile(new URL("../weekly-report.js", import.meta.url), "utf8");
  const sandbox = { module: { exports: {} }, globalThis: {} };
  vm.runInNewContext(source, sandbox, { filename: "weekly-report.js" });
  return sandbox.module.exports;
}

test("returns a friendly empty state when notes are blank", async () => {
  const api = await loadWeeklyReport();
  const result = api.generateWeeklyReportAssistant({ rawNotes: "", language: "中文" });

  assert.equal(result.ok, false);
  assert.equal(result.quickDraft, "");
  assert.equal(result.aiPrompt, "");
  assert.match(result.message, /请先粘贴/);
});

test("generates a Chinese assistant draft and AI prompt from rough notes", async () => {
  const api = await loadWeeklyReport();
  const result = api.generateWeeklyReportAssistant({
    context: "第 6 周 / 学习周报",
    role: "Student",
    recipient: "Teacher",
    reportType: "Study",
    tone: "Formal",
    language: "中文",
    rawNotes: "写了数学作业\n明天打算复习英语\n看了一点论文但还没整理\n下周想把项目文档补完",
  });

  assert.equal(result.ok, true);
  assert.match(result.quickDraft, /# 第 6 周 \/ 学习周报/);
  assert.match(result.quickDraft, /周报对象：老师/);
  assert.match(result.quickDraft, /## 可以继续补充/);
  assert.match(result.aiPrompt, /请帮我把下面的零散笔记整理成一份自然、真实、不过度夸大的周报。/);
  assert.match(result.aiPrompt, /不要编造我没有做过的事情/);
});

test("keeps English mode available through the legacy report structure", async () => {
  const api = await loadWeeklyReport();
  const result = api.generateWeeklyReportAssistant({
    context: "Week 6",
    role: "Intern",
    language: "English",
    rawNotes: "Finished UI draft\nNext week test on mobile\nNeed sync with teammate",
  });

  assert.equal(result.ok, true);
  assert.match(result.quickDraft, /## Weekly Focus/);
  assert.match(result.quickDraft, /Role: Intern/);
  assert.match(result.aiPrompt, /输出语言：English/);
});
