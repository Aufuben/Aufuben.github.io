import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";
import test from "node:test";

async function loadEmailPrompt() {
  const source = await readFile(new URL("../email-prompt.js", import.meta.url), "utf8");
  const sandbox = { module: { exports: {} }, globalThis: {} };
  vm.runInNewContext(source, sandbox, { filename: "email-prompt.js" });
  return sandbox.module.exports;
}

test("returns a friendly empty state when rough notes are blank", async () => {
  const api = await loadEmailPrompt();
  const result = api.generateEmailPrompt({ roughNotes: "", language: "中文" });

  assert.equal(result.ok, false);
  assert.equal(result.prompt, "");
  assert.match(result.message, /请先写下/);
});

test("generates a Chinese prompt for a study or work email", async () => {
  const api = await loadEmailPrompt();
  const result = api.generateEmailPrompt({
    scenario: "Ask for meeting",
    senderRole: "Student",
    recipient: "Teacher",
    tone: "Polite",
    language: "中文",
    subjectHint: "约时间讨论项目选题",
    ask: "希望老师下周给我 20 分钟建议",
    deadline: "下周三前",
    attachments: "项目想法草稿",
    roughNotes: "我想做一个课程项目\n方向还不确定\n希望老师帮我看看是否可行",
  });

  assert.equal(result.ok, true);
  assert.match(result.prompt, /请根据下面信息帮我写一封邮件/);
  assert.match(result.prompt, /收件人：老师/);
  assert.match(result.prompt, /邮件场景：预约沟通/);
  assert.match(result.prompt, /不要编造我没有提供的事实/);
  assert.match(result.prompt, /请输出：邮件主题、邮件正文、简短版、后续跟进版本/);
  assert.match(result.prompt, /项目想法草稿/);
  assert.deepEqual(Array.from(result.missingInfo), []);
});

test("generates an English prompt when English output is selected", async () => {
  const api = await loadEmailPrompt();
  const result = api.generateEmailPrompt({
    scenario: "Follow up",
    senderRole: "Intern",
    recipient: "Team Lead",
    tone: "Concise",
    language: "English",
    ask: "Ask whether the review comments are ready",
    roughNotes: "Sent the draft last Friday\nNeed feedback before updating the demo",
  });

  assert.equal(result.ok, true);
  assert.match(result.prompt, /Please write an email based on the information below/);
  assert.match(result.prompt, /Recipient: team lead/);
  assert.match(result.prompt, /Do not invent facts/);
  assert.match(result.prompt, /Output: subject line, email body, shorter version, and follow-up version/);
});

test("reports missing information without blocking prompt generation", async () => {
  const api = await loadEmailPrompt();
  const result = api.generateEmailPrompt({
    scenario: "Follow up",
    senderRole: "Student",
    recipient: "Teacher",
    tone: "Polite",
    language: "中文",
    roughNotes: "老师还没有回复",
  });

  assert.equal(result.ok, true);
  assert.match(result.prompt, /未提供/);
  assert.deepEqual(Array.from(result.missingInfo), [
    "补充邮件主题线索会更容易生成准确标题。",
    "写清楚希望对方做什么，邮件会更容易回复。",
    "补充时间或截止点可以减少来回确认。",
  ]);
});

test("exposes reusable example presets for the page", async () => {
  const api = await loadEmailPrompt();
  const teacherMeeting = api.emailExamples.find((example) => example.id === "teacher-meeting");
  const followUp = api.emailExamples.find((example) => example.id === "team-follow-up");

  assert.equal(api.emailExamples.length >= 3, true);
  assert.equal(teacherMeeting.fields.scenario, "Ask for meeting");
  assert.match(teacherMeeting.fields.roughNotes, /课程项目/);
  assert.equal(followUp.fields.scenario, "Follow up");
});
