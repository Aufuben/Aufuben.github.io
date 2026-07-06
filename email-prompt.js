(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }
  if (root) {
    root.YumoEmailPrompt = api;
  }
})(typeof window !== "undefined" ? window : globalThis, function () {
  const emptyMessages = {
    "中文": "请先写下这封邮件的粗糙想法。",
    English: "Write a few rough notes for this email first.",
    Bilingual: "请先写下这封邮件的粗糙想法。 / Write a few rough notes for this email first.",
  };

  const labelMaps = {
    scenario: {
      "Ask for meeting": { zh: "预约沟通", en: "meeting request" },
      "Ask for help": { zh: "请求帮助", en: "help request" },
      "Follow up": { zh: "跟进确认", en: "follow-up" },
      "Apology or delay": { zh: "说明延期或致歉", en: "apology or delay explanation" },
      "Thank you": { zh: "感谢回复", en: "thank-you email" },
      Application: { zh: "申请或自荐", en: "application or self-introduction" },
    },
    senderRole: {
      Student: { zh: "学生", en: "student" },
      Intern: { zh: "实习生", en: "intern" },
      "Project Member": { zh: "项目成员", en: "project member" },
      Applicant: { zh: "申请者", en: "applicant" },
    },
    recipient: {
      Teacher: { zh: "老师", en: "teacher" },
      Advisor: { zh: "导师", en: "advisor" },
      "Team Lead": { zh: "组长", en: "team lead" },
      Classmate: { zh: "同学", en: "classmate" },
      Recruiter: { zh: "招聘方", en: "recruiter" },
    },
    tone: {
      Polite: { zh: "礼貌自然", en: "polite and natural" },
      Concise: { zh: "简洁直接", en: "concise" },
      Formal: { zh: "正式但不生硬", en: "formal but not stiff" },
      Warm: { zh: "温和友好", en: "warm and friendly" },
      Firm: { zh: "坚定但礼貌", en: "firm but polite" },
    },
  };

  const emailExamples = [
    {
      id: "teacher-meeting",
      fields: {
        subjectHint: "约时间讨论项目选题",
        scenario: "Ask for meeting",
        senderRole: "Student",
        recipient: "Teacher",
        tone: "Polite",
        language: "中文",
        deadline: "下周三前",
        ask: "希望老师下周给我 20 分钟建议",
        attachments: "项目想法草稿",
        roughNotes: "我想做一个课程项目\n方向还不确定\n希望老师帮我看看是否可行",
      },
    },
    {
      id: "team-follow-up",
      fields: {
        subjectHint: "跟进上周提交的 demo 反馈",
        scenario: "Follow up",
        senderRole: "Intern",
        recipient: "Team Lead",
        tone: "Concise",
        language: "中文",
        deadline: "本周五前",
        ask: "想确认评审意见是否已经有结果",
        attachments: "demo 链接和更新记录",
        roughNotes: "上周五发了 demo\n需要反馈后继续改\n不想催得太硬",
      },
    },
    {
      id: "delay-apology",
      fields: {
        subjectHint: "说明报告延期提交",
        scenario: "Apology or delay",
        senderRole: "Project Member",
        recipient: "Advisor",
        tone: "Formal",
        language: "中文",
        deadline: "明晚前补交",
        ask: "希望对方同意我延后一天提交",
        attachments: "当前进度截图",
        roughNotes: "报告还差实验结果整理\n今天遇到数据导出问题\n明晚前可以补完整",
      },
    },
  ];

  function normalizeLanguage(language) {
    return emptyMessages[language] ? language : "中文";
  }

  function normalizeLines(rawNotes) {
    return String(rawNotes || "")
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
  }

  function label(group, key, fallback, language) {
    const value = labelMaps[group][key] || labelMaps[group][fallback];
    return language === "English" ? value.en : value.zh;
  }

  function clean(value, fallback) {
    const text = String(value || "").trim();
    return text || fallback;
  }

  function normalizeFields(fields) {
    const language = normalizeLanguage(fields && fields.language);
    return {
      scenario: fields && fields.scenario ? fields.scenario : "Ask for meeting",
      senderRole: fields && fields.senderRole ? fields.senderRole : "Student",
      recipient: fields && fields.recipient ? fields.recipient : "Teacher",
      tone: fields && fields.tone ? fields.tone : "Polite",
      language,
      subjectHint: clean(fields && fields.subjectHint, language === "English" ? "Not provided" : "未提供"),
      ask: clean(fields && fields.ask, language === "English" ? "Not provided" : "未提供"),
      deadline: clean(fields && fields.deadline, language === "English" ? "Not provided" : "未提供"),
      attachments: clean(fields && fields.attachments, language === "English" ? "None mentioned" : "未提及"),
      roughNotes: String((fields && fields.roughNotes) || ""),
      lines: normalizeLines(fields && fields.roughNotes),
    };
  }

  function hasProvided(value) {
    return String(value || "").trim().length > 0;
  }

  function analyzeMissingInfo(fields) {
    const language = normalizeLanguage(fields && fields.language);
    const messages =
      language === "English"
        ? {
            subjectHint: "Add a subject hint so the model can write a more accurate subject line.",
            ask: "Clarify what you want the recipient to do so the email is easier to reply to.",
            deadline: "Add a time or deadline to reduce back-and-forth clarification.",
          }
        : {
            subjectHint: "补充邮件主题线索会更容易生成准确标题。",
            ask: "写清楚希望对方做什么，邮件会更容易回复。",
            deadline: "补充时间或截止点可以减少来回确认。",
          };
    const missing = [];

    if (!hasProvided(fields && fields.subjectHint)) missing.push(messages.subjectHint);
    if (!hasProvided(fields && fields.ask)) missing.push(messages.ask);
    if (!hasProvided(fields && fields.deadline)) missing.push(messages.deadline);

    return missing;
  }

  function formatLines(lines) {
    return lines.map((line) => `- ${line}`).join("\n");
  }

  function generateChinesePrompt(fields) {
    const scenario = label("scenario", fields.scenario, "Ask for meeting", fields.language);
    const senderRole = label("senderRole", fields.senderRole, "Student", fields.language);
    const recipient = label("recipient", fields.recipient, "Teacher", fields.language);
    const tone = label("tone", fields.tone, "Polite", fields.language);

    return [
      "请根据下面信息帮我写一封邮件。先判断信息是否足够；如果关键信息缺失，请先列出需要补充的问题。否则请直接生成邮件。",
      "",
      "背景：",
      `- 发件人身份：${senderRole}`,
      `- 收件人：${recipient}`,
      `- 邮件场景：${scenario}`,
      `- 语气：${tone}`,
      `- 输出语言：${fields.language}`,
      `- 主题线索：${fields.subjectHint}`,
      `- 希望对方做什么：${fields.ask}`,
      `- 时间或截止：${fields.deadline}`,
      `- 附件或材料：${fields.attachments}`,
      "",
      "原始输入：",
      formatLines(fields.lines),
      "",
      "要求：",
      "1. 不要编造我没有提供的事实。",
      "2. 如果内容太少，可以把表达写得更完整，但只能使用泛化说法。",
      "3. 语气要自然、礼貌、具体，不要过度讨好，也不要显得强硬。",
      "4. 如果需要对方行动，请把请求写清楚，并给出容易回复的选项。",
      "5. 如果有附件或材料，请在正文中自然提到。",
      "6. 请输出：邮件主题、邮件正文、简短版、后续跟进版本。",
    ].join("\n");
  }

  function generateEnglishPrompt(fields) {
    const scenario = label("scenario", fields.scenario, "Ask for meeting", "English");
    const senderRole = label("senderRole", fields.senderRole, "Student", "English");
    const recipient = label("recipient", fields.recipient, "Teacher", "English");
    const tone = label("tone", fields.tone, "Polite", "English");

    return [
      "Please write an email based on the information below. First decide whether the information is sufficient; if key details are missing, ask concise follow-up questions before drafting.",
      "",
      "Context:",
      `- Sender role: ${senderRole}`,
      `- Recipient: ${recipient}`,
      `- Email scenario: ${scenario}`,
      `- Tone: ${tone}`,
      `- Output language: ${fields.language}`,
      `- Subject hint: ${fields.subjectHint}`,
      `- What I want the recipient to do: ${fields.ask}`,
      `- Time or deadline: ${fields.deadline}`,
      `- Attachments or materials: ${fields.attachments}`,
      "",
      "Rough notes:",
      formatLines(fields.lines),
      "",
      "Requirements:",
      "1. Do not invent facts that I did not provide.",
      "2. You may make the wording clearer and more complete, but keep any added context generic.",
      "3. Keep the tone natural, respectful, and specific.",
      "4. If I need the recipient to act, make the request easy to understand and easy to reply to.",
      "5. Mention attachments or materials naturally if they are provided.",
      "6. Output: subject line, email body, shorter version, and follow-up version.",
    ].join("\n");
  }

  function generateEmailPrompt(fields) {
    const normalized = normalizeFields(fields);
    const missingInfo = analyzeMissingInfo(fields);
    if (normalized.lines.length === 0) {
      return { ok: false, prompt: "", message: emptyMessages[normalized.language], missingInfo: [] };
    }

    const prompt =
      normalized.language === "English"
        ? generateEnglishPrompt(normalized)
        : generateChinesePrompt(normalized);

    return { ok: true, prompt, message: "", missingInfo };
  }

  function readForm(form) {
    return {
      subjectHint: form.querySelector("#email-subject").value,
      scenario: form.querySelector("#email-scenario").value,
      senderRole: form.querySelector("#email-sender-role").value,
      recipient: form.querySelector("#email-recipient").value,
      tone: form.querySelector("#email-tone").value,
      language: form.querySelector("#email-language").value,
      deadline: form.querySelector("#email-deadline").value,
      ask: form.querySelector("#email-ask").value,
      attachments: form.querySelector("#email-attachments").value,
      roughNotes: form.querySelector("#email-rough-notes").value,
    };
  }

  function bindEmailPromptTool(documentRef) {
    const form = documentRef.querySelector("#email-prompt-form");
    const output = documentRef.querySelector("#email-prompt-output");
    const missingInfoList = documentRef.querySelector("#email-missing-info");
    const status = documentRef.querySelector("#email-prompt-status");
    const copyButton = documentRef.querySelector("#copy-email-prompt");
    const clearButton = documentRef.querySelector("#clear-email-prompt");
    const exampleButtons = Array.from(documentRef.querySelectorAll("[data-email-example]"));

    if (!form || !output || !missingInfoList || !status || !copyButton || !clearButton) return;

    function setMissingInfo(items) {
      missingInfoList.replaceChildren(
        ...items.map((item) => {
          const listItem = documentRef.createElement("li");
          listItem.textContent = item;
          return listItem;
        }),
      );
    }

    function setField(selector, value) {
      const field = form.querySelector(selector);
      if (field) field.value = value || "";
    }

    function applyExample(example) {
      setField("#email-subject", example.fields.subjectHint);
      setField("#email-scenario", example.fields.scenario);
      setField("#email-sender-role", example.fields.senderRole);
      setField("#email-recipient", example.fields.recipient);
      setField("#email-tone", example.fields.tone);
      setField("#email-language", example.fields.language);
      setField("#email-deadline", example.fields.deadline);
      setField("#email-ask", example.fields.ask);
      setField("#email-attachments", example.fields.attachments);
      setField("#email-rough-notes", example.fields.roughNotes);
      output.value = "";
      setMissingInfo([]);
      status.textContent = "Example loaded.";
      copyButton.disabled = true;
    }

    for (const button of exampleButtons) {
      button.addEventListener("click", () => {
        const example = emailExamples.find((item) => item.id === button.dataset.emailExample);
        if (example) applyExample(example);
      });
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const result = generateEmailPrompt(readForm(form));
      output.value = result.prompt;
      status.textContent = result.ok ? "Prompt 已生成，内容只在你的浏览器中处理。" : result.message;
      setMissingInfo(result.missingInfo || []);
      copyButton.disabled = !result.ok;
    });

    copyButton.addEventListener("click", async () => {
      if (!output.value) return;
      try {
        await navigator.clipboard.writeText(output.value);
        status.textContent = "Prompt 已复制。";
      } catch (error) {
        status.textContent = "复制失败。你仍然可以手动选中文本复制。";
      }
    });

    clearButton.addEventListener("click", () => {
      form.reset();
      output.value = "";
      setMissingInfo([]);
      status.textContent = "Inputs cleared.";
      copyButton.disabled = true;
    });
  }

  if (typeof document !== "undefined") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => bindEmailPromptTool(document), { once: true });
    } else {
      bindEmailPromptTool(document);
    }
  }

  return {
    emailExamples,
    analyzeMissingInfo,
    generateEmailPrompt,
    bindEmailPromptTool,
  };
});
