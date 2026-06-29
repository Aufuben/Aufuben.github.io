(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }
  if (root) {
    root.YumoWeeklyReport = api;
  }
})(typeof window !== "undefined" ? window : globalThis, function () {
  const roleLabels = {
    Student: { zh: "学生", en: "Student", bilingual: "学生 / Student" },
    Intern: { zh: "实习生", en: "Intern", bilingual: "实习生 / Intern" },
    "Project Member": { zh: "项目成员", en: "Project member", bilingual: "项目成员 / Project member" },
  };

  const headings = {
    "中文": {
      focus: "本周重点",
      completed: "已完成工作",
      blockers: "进行中或遇到的问题",
      next: "下周计划",
      support: "需要协助或同步的事项",
      role: "角色",
      empty: "请先粘贴这一周的零散记录。",
      fallback: "暂无明确记录，可在复制后补充。",
    },
    English: {
      focus: "Weekly Focus",
      completed: "Completed Work",
      blockers: "In Progress or Blockers",
      next: "Next Week Plan",
      support: "Support or Sync Needed",
      role: "Role",
      empty: "Paste your scattered weekly notes first.",
      fallback: "No clear notes yet. Add more detail after copying.",
    },
    Bilingual: {
      focus: "本周重点 / Weekly Focus",
      completed: "已完成工作 / Completed Work",
      blockers: "进行中或遇到的问题 / In Progress or Blockers",
      next: "下周计划 / Next Week Plan",
      support: "需要协助或同步的事项 / Support or Sync Needed",
      role: "角色 / Role",
      empty: "请先粘贴这一周的零散记录。 / Paste your scattered weekly notes first.",
      fallback: "暂无明确记录，可在复制后补充。 / No clear notes yet. Add more detail after copying.",
    },
  };

  const keywordGroups = {
    support: [/help/i, /support/i, /sync/i, /assist/i, /协助/, /同步/, /沟通/, /确认/],
    blockers: [/block/i, /issue/i, /problem/i, /risk/i, /遇到/, /问题/, /卡住/, /风险/, /困难/],
    next: [/next/i, /plan/i, /todo/i, /下周/, /计划/, /待办/, /准备/],
    focus: [/focus/i, /goal/i, /重点/, /目标/],
    completed: [/done/i, /finish/i, /finished/i, /complete/i, /完成/, /实现/, /整理/, /学习/, /调研/, /阅读/],
  };

  function normalizeLanguage(language) {
    return headings[language] ? language : "中文";
  }

  function normalizeLines(rawNotes) {
    return String(rawNotes || "")
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
  }

  function matchesAny(line, patterns) {
    return patterns.some((pattern) => pattern.test(line));
  }

  function bucketNotes(lines) {
    const buckets = {
      focus: [],
      completed: [],
      blockers: [],
      next: [],
      support: [],
    };

    for (const line of lines) {
      if (matchesAny(line, keywordGroups.support)) {
        buckets.support.push(line);
      } else if (matchesAny(line, keywordGroups.blockers)) {
        buckets.blockers.push(line);
      } else if (matchesAny(line, keywordGroups.next)) {
        buckets.next.push(line);
      } else if (matchesAny(line, keywordGroups.focus)) {
        buckets.focus.push(line);
      } else {
        buckets.completed.push(line);
      }
    }

    if (buckets.focus.length === 0 && buckets.completed.length > 0) {
      buckets.focus.push(buckets.completed[0]);
    }

    return buckets;
  }

  function formatList(items, fallback) {
    if (items.length === 0) return `- ${fallback}`;
    return items.map((item) => `- ${item}`).join("\n");
  }

  function roleLabel(role, language) {
    const labels = roleLabels[role] || roleLabels.Student;
    if (language === "English") return labels.en;
    if (language === "Bilingual") return labels.bilingual;
    return labels.zh;
  }

  function formatRoleLine(role, language, copy) {
    if (language === "English") return `${copy.role}: ${role}`;
    return `${copy.role}：${role}`;
  }

  const recipientLabels = {
    Teacher: { zh: "老师", en: "teacher" },
    Advisor: { zh: "导师", en: "advisor" },
    "Team Lead": { zh: "组长", en: "team lead" },
    "Self Review": { zh: "自己复盘", en: "self review" },
  };

  const reportTypeLabels = {
    Study: { zh: "学习周报", en: "study weekly report" },
    Internship: { zh: "实习周报", en: "internship weekly report" },
    Project: { zh: "项目周报", en: "project weekly report" },
    Research: { zh: "科研周报", en: "research weekly report" },
  };

  const toneLabels = {
    Concise: { zh: "简洁", en: "concise" },
    Formal: { zh: "正式但自然", en: "formal but natural" },
    Warm: { zh: "温和自然", en: "warm and natural" },
  };

  function getLabel(map, key, fallback, language) {
    const value = map[key] || map[fallback];
    return language === "English" ? value.en : value.zh;
  }

  function normalizeAssistantFields(fields) {
    const language = normalizeLanguage(fields && fields.language);
    return {
      context: String((fields && fields.context) || "").trim() || (language === "English" ? "Weekly Report" : "本周周报"),
      role: fields && fields.role ? fields.role : "Student",
      recipient: fields && fields.recipient ? fields.recipient : "Teacher",
      reportType: fields && fields.reportType ? fields.reportType : "Study",
      detailLevel: fields && fields.detailLevel ? fields.detailLevel : "Moderate expansion",
      tone: fields && fields.tone ? fields.tone : "Formal",
      language,
      rawNotes: String((fields && fields.rawNotes) || ""),
      lines: normalizeLines(fields && fields.rawNotes),
    };
  }

  function expandChineseNote(line) {
    if (/数学|作业/.test(line)) return `完成了数学课程相关作业，对近期学习内容进行了巩固。原始记录：${line}`;
    if (/英语|复习|单词|阅读|听力|写作/.test(line)) return `接下来计划继续复习英语，并围绕词汇、阅读或阶段性薄弱点进行整理。原始记录：${line}`;
    if (/论文|文献|阅读/.test(line)) return `阅读了相关资料，对主题背景、已有方法或后续问题有了进一步了解。原始记录：${line}`;
    if (/调研|整理|开发|测试|脚本|代码/.test(line)) return `推进了与项目相关的${/调研/.test(line) ? "调研" : "任务"}，并对后续工作需要的信息进行了整理。原始记录：${line}`;
    if (/问题|困难|卡住|不稳定|报错/.test(line)) return `本周遇到了一些需要继续排查的问题，后续会进一步确认原因并寻找解决办法。原始记录：${line}`;
    if (/下周|明天|计划|准备|打算/.test(line)) return `后续计划继续推进这项安排，并根据实际进展调整学习或工作节奏。原始记录：${line}`;
    return `围绕这项记录推进了相关学习或工作，后续可以补充更多背景、过程和结果。原始记录：${line}`;
  }

  function followUpQuestions(lines) {
    const joined = lines.join(" ");
    const questions = [];
    if (/数学|作业/.test(joined)) questions.push("这项作业对应哪门课或哪个知识点？");
    if (/英语|复习/.test(joined)) questions.push("复习英语时更想补词汇、阅读、听力还是写作？");
    if (!/问题|困难|卡住|不稳定|报错/.test(joined)) questions.push("有没有遇到卡住的地方？");
    return questions.slice(0, 3);
  }

  function generateQuickDraft(fields) {
    const normalized = normalizeAssistantFields(fields);
    const copy = headings[normalized.language];
    if (normalized.lines.length === 0) {
      return { ok: false, quickDraft: "", questions: [], message: copy.empty };
    }

    if (normalized.language !== "中文") {
      const legacy = generateWeeklyReport(fields);
      return {
        ok: legacy.ok,
        quickDraft: legacy.report,
        questions: [],
        message: legacy.message,
      };
    }

    const buckets = bucketNotes(normalized.lines);
    const expandedCompleted = buckets.completed.map(expandChineseNote);
    const expandedNext = buckets.next.map(expandChineseNote);
    const expandedBlockers = buckets.blockers.map(expandChineseNote);
    const expandedSupport = buckets.support.map(expandChineseNote);
    const questions = followUpQuestions(normalized.lines);
    const focus = expandedCompleted[0] || expandedNext[0] || expandChineseNote(normalized.lines[0]);
    const recipient = getLabel(recipientLabels, normalized.recipient, "Teacher", normalized.language);
    const type = getLabel(reportTypeLabels, normalized.reportType, "Study", normalized.language);
    const role = roleLabel(normalized.role, normalized.language);

    const report = [
      `# ${normalized.context}`,
      "",
      `周报对象：${recipient}`,
      `周报类型：${type}`,
      `角色：${role}`,
      "",
      "## 本周重点",
      `- ${focus}`,
      "",
      "## 已完成工作",
      formatList(expandedCompleted, copy.fallback),
      "",
      "## 遇到的问题或不足",
      formatList(expandedBlockers, "目前记录中没有明确的问题，可以补充本周卡住、效率较低或需要继续加强的地方。"),
      "",
      "## 下周计划",
      formatList(expandedNext, "继续按照当前安排推进学习或工作，并在下周记录更具体的进展。"),
      "",
      "## 需要同步或确认的事项",
      formatList(expandedSupport, "暂无明确需要同步的事项，如有老师、导师或同伴需要确认的内容，可以继续补充。"),
      "",
      "## 可以继续补充",
      formatList(questions, "可以补充具体课程、任务背景、遇到的问题和下周优先级。"),
    ].join("\n");

    return { ok: true, quickDraft: report, questions, message: "" };
  }

  function formatRawNotesForPrompt(lines) {
    return lines.map((line) => `- ${line}`).join("\n");
  }

  function generateAIPrompt(fields) {
    const normalized = normalizeAssistantFields(fields);
    const copy = headings[normalized.language];
    if (normalized.lines.length === 0) {
      return { ok: false, aiPrompt: "", message: copy.empty };
    }

    const quickDraft = generateQuickDraft(fields);
    const recipient = getLabel(recipientLabels, normalized.recipient, "Teacher", normalized.language);
    const type = getLabel(reportTypeLabels, normalized.reportType, "Study", normalized.language);
    const tone = getLabel(toneLabels, normalized.tone, "Formal", normalized.language);
    const role = roleLabel(normalized.role, normalized.language);
    const prompt = [
      "请帮我把下面的零散笔记整理成一份自然、真实、不过度夸大的周报。",
      "",
      "背景：",
      `- 周报对象：${recipient}`,
      `- 角色：${role}`,
      `- 类型：${type}`,
      `- 语气：${tone}`,
      `- 输出语言：${normalized.language}`,
      "",
      "要求：",
      "1. 不要编造我没有做过的事情。",
      "2. 可以把口语化表达改得更正式、更完整。",
      "3. 如果内容太少，可以适度补充学习过程、收获和下周安排，但必须保持泛化表达。",
      "4. 不要写得像夸大成果，也不要加入具体章节、数据、会议、成绩或反馈，除非我在笔记里写了。",
      "5. 输出结构包含：本周重点、已完成工作、遇到的问题或不足、下周计划、需要同步或确认的事项。",
      "",
      "我的原始笔记：",
      formatRawNotesForPrompt(normalized.lines),
      "",
      "可参考的本地草稿：",
      quickDraft.quickDraft,
    ].join("\n");

    return { ok: true, aiPrompt: prompt, message: "" };
  }

  function generateWeeklyReportAssistant(fields) {
    const quickDraft = generateQuickDraft(fields);
    const aiPrompt = generateAIPrompt(fields);
    return {
      ok: quickDraft.ok && aiPrompt.ok,
      quickDraft: quickDraft.quickDraft,
      aiPrompt: aiPrompt.aiPrompt,
      questions: quickDraft.questions,
      message: quickDraft.message || aiPrompt.message,
    };
  }

  function generateWeeklyReport(fields) {
    const language = normalizeLanguage(fields && fields.language);
    const copy = headings[language];
    const lines = normalizeLines(fields && fields.rawNotes);

    if (lines.length === 0) {
      return { ok: false, report: "", message: copy.empty };
    }

    const context = String((fields && fields.context) || "").trim() || (language === "English" ? "Weekly Report" : "本周周报");
    const role = roleLabel(fields && fields.role, language);
    const buckets = bucketNotes(lines);
    const report = [
      `# ${context}`,
      "",
      formatRoleLine(role, language, copy),
      "",
      `## ${copy.focus}`,
      formatList(buckets.focus, copy.fallback),
      "",
      `## ${copy.completed}`,
      formatList(buckets.completed, copy.fallback),
      "",
      `## ${copy.blockers}`,
      formatList(buckets.blockers, copy.fallback),
      "",
      `## ${copy.next}`,
      formatList(buckets.next, copy.fallback),
      "",
      `## ${copy.support}`,
      formatList(buckets.support, copy.fallback),
    ].join("\n");

    return { ok: true, report, message: "" };
  }

  function readForm(form) {
    return {
      context: form.querySelector("#report-context").value,
      role: form.querySelector("#report-role").value,
      recipient: form.querySelector("#report-recipient").value,
      reportType: form.querySelector("#report-type").value,
      detailLevel: form.querySelector("#report-detail").value,
      tone: form.querySelector("#report-tone").value,
      language: form.querySelector("#report-language").value,
      rawNotes: form.querySelector("#report-notes").value,
    };
  }

  function bindWeeklyReportTool(documentRef) {
    const form = documentRef.querySelector("#weekly-report-form");
    const quickDraftOutput = documentRef.querySelector("#quick-draft-output");
    const aiPromptOutput = documentRef.querySelector("#ai-prompt-output");
    const status = documentRef.querySelector("#report-status");
    const copyQuickDraftButton = documentRef.querySelector("#copy-quick-draft");
    const copyAIPromptButton = documentRef.querySelector("#copy-ai-prompt");
    const clearButton = documentRef.querySelector("#clear-report");

    if (!form || !quickDraftOutput || !aiPromptOutput || !status || !copyQuickDraftButton || !copyAIPromptButton || !clearButton) return;

    function setCopyState(enabled) {
      copyQuickDraftButton.disabled = !enabled;
      copyAIPromptButton.disabled = !enabled;
    }

    async function copyText(text, successMessage) {
      if (!text) return;
      try {
        await navigator.clipboard.writeText(text);
        status.textContent = successMessage;
      } catch (error) {
        status.textContent = "复制失败。你仍然可以手动选中文本复制。";
      }
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const result = generateWeeklyReportAssistant(readForm(form));
      quickDraftOutput.value = result.quickDraft;
      aiPromptOutput.value = result.aiPrompt;
      status.textContent = result.ok ? "草稿和 AI 提示词已生成，内容只在你的浏览器中处理。" : result.message;
      setCopyState(result.ok);
    });

    copyQuickDraftButton.addEventListener("click", () => {
      copyText(quickDraftOutput.value, "草稿已复制。");
    });

    copyAIPromptButton.addEventListener("click", () => {
      copyText(aiPromptOutput.value, "AI 提示词已复制。");
    });

    clearButton.addEventListener("click", () => {
      form.reset();
      quickDraftOutput.value = "";
      aiPromptOutput.value = "";
      status.textContent = "Inputs cleared.";
      setCopyState(false);
    });
  }

  if (typeof document !== "undefined") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => bindWeeklyReportTool(document), { once: true });
    } else {
      bindWeeklyReportTool(document);
    }
  }

  return {
    generateWeeklyReport,
    generateQuickDraft,
    generateAIPrompt,
    generateWeeklyReportAssistant,
    bindWeeklyReportTool,
  };
});
