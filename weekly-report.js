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
      tone: form.querySelector("#report-tone").value,
      language: form.querySelector("#report-language").value,
      rawNotes: form.querySelector("#report-notes").value,
    };
  }

  function bindWeeklyReportTool(documentRef) {
    const form = documentRef.querySelector("#weekly-report-form");
    const output = documentRef.querySelector("#report-output");
    const status = documentRef.querySelector("#report-status");
    const copyButton = documentRef.querySelector("#copy-report");
    const clearButton = documentRef.querySelector("#clear-report");

    if (!form || !output || !status || !copyButton || !clearButton) return;

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const result = generateWeeklyReport(readForm(form));
      output.value = result.report;
      status.textContent = result.ok ? "Report generated in your browser." : result.message;
      copyButton.disabled = !result.ok;
    });

    copyButton.addEventListener("click", async () => {
      if (!output.value) return;
      try {
        await navigator.clipboard.writeText(output.value);
        status.textContent = "Copied to clipboard.";
      } catch (error) {
        status.textContent = "Copy failed. You can still select and copy the text manually.";
      }
    });

    clearButton.addEventListener("click", () => {
      form.reset();
      output.value = "";
      status.textContent = "Inputs cleared.";
      copyButton.disabled = true;
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
    bindWeeklyReportTool,
  };
});
