window.YUMO_SITE_CONTENT = {
  siteTitle: "Yumo的小站",
  publicTitle: "Yumo's Site",
  nav: [
    { label: "Home", href: "#home" },
    { label: "Experience", href: "#experience" },
    { label: "Tools", href: "#tools" },
    { label: "Resources", href: "#resources" },
    { label: "About", href: "#about" },
  ],
  profile: {
    name: "Yumo",
    avatar: "assets/Yumo.jpg",
    labels: {
      education: "Education",
      personalNote: "Personal Note",
      contact: "Contact",
    },
    education: [
      "Undergraduate Student in Nanjing University of Posts and Telecommunications",
      "Trainee in Institute of AI for Industry, Chinese Academy of Sciences",
      "Coming soon...",
    ],
    quote: "Keep swimming, until the sea turns blue.",
    contacts: [
      { label: "Email", href: "mailto:zdw1165224925@163.com" },
      { label: "GitHub", href: "https://github.com/Aufuben" },
      { label: "ORCID", href: "https://orcid.org/0009-0001-2097-369X" },
    ],
  },
  hero: {
    kicker: "FOR LEARNERS, BUILDERS, AND PEOPLE WHO LIKE USEFUL THINGS",
    title: "Experience, tools, and resources for learning better and working smarter.",
    subtitle:
      "I collect learning routes, project notes, AI workflows, practical templates, and small tools that help people avoid repeated detours.",
  },
  sections: [
    {
      id: "experience",
      label: "01 / Experience",
      title: "Learning and project notes",
      entries: [
        {
          title: "Learning routes",
          description:
            "Course paths, study notes, and decisions that help juniors find a workable starting point.",
          href: "#experience",
        },
        {
          title: "Project notes",
          description:
            "Reflections from projects, competitions, internships, and collaborations: what worked, what wasted time, and what can be reused.",
          href: "#experience",
        },
        {
          title: "AI workflows",
          description:
            "Practical ways to use AI for study, writing, coding, automation, and knowledge work without losing judgment.",
          href: "#experience",
        },
      ],
    },
    {
      id: "tools",
      label: "02 / Tools",
      title: "A small toolbox for daily work",
      entries: [
        {
          title: "Weekly Report Assistant",
          description:
            "Turn rough notes into a safer weekly report draft and a copyable AI prompt for further polishing.",
          href: "weekly-report.html",
          status: "Available",
          actionLabel: "Open tool",
        },
        {
          title: "Email Template Helper",
          description:
            "Draft polite, concise, or stronger emails for common study and work situations.",
          href: "#tools",
          status: "Coming soon",
        },
        {
          title: "Task Board",
          description:
            "A lightweight board for course, project, and work tasks without unnecessary ceremony.",
          href: "#tools",
          status: "Coming soon",
        },
        {
          title: "Public Webpage to Table Script",
          description:
            "Collect public webpage information and export it into a clean spreadsheet for comparison.",
          href: "#tools",
          status: "Coming soon",
        },
      ],
    },
    {
      id: "resources",
      label: "03 / Resources",
      title: "Reusable links and templates",
      entries: [
        {
          title: "Curated resource shelves",
          description:
            "AI tools, study paths, project templates, programming references, writing support, and automation ideas worth revisiting.",
          href: "resources.html",
          actionLabel: "Open resources",
        },
      ],
    },
  ],
  resources: ["AI Tools", "Study Path", "Project Templates", "Programming", "Writing", "Automation"],
  resourcesPage: {
    intro: {
      eyebrow: "Resources",
      title: "一小排真正会反复用到的资源",
      description:
        "这里不做大而全的收藏夹，只放适合学习、搭建项目、写作和自动化的稳定入口。每个资源都附上适合谁、什么时候打开，以及我为什么会把它留在这里。",
    },
    categories: [
      {
        title: "AI Tools",
        description: "用于思考、写作、整理材料和推进复杂任务的 AI 工作入口。",
        resources: [
          {
            name: "ChatGPT",
            url: "https://chatgpt.com/",
            summary: "用于写作草稿、概念解释、探索想法和二次整理的灵活 AI 工作台。",
            bestFor: "需要通用思考搭档的学生和建设者。",
            useWhen: "当你需要辅助写作、学习一个概念、编程或规划任务时打开它。",
            whyKeepIt: "它足够通用，也足够容易上手，适合作为 AI 工作流的起点。",
          },
          {
            name: "Claude",
            url: "https://claude.ai/",
            summary: "适合长文本理解、文档整理、代码辅助和细致改写的 AI 工具。",
            bestFor: "需要处理复杂材料、长文档或高质量表达的人。",
            useWhen: "当你要梳理杂乱材料、审阅想法，或把一个任务拆清楚时打开它。",
            whyKeepIt: "它和这个网站的写作、学习、工具搭建方向很契合。",
          },
        ],
      },
      {
        title: "Study Path",
        description: "适合从零搭建学习路线、补基础、找课程材料的长期入口。",
        resources: [
          {
            name: "MIT OpenCourseWare",
            url: "https://ocw.mit.edu/",
            summary: "MIT 的公开课程资料库，包含讲义、作业、考试和课程安排。",
            bestFor: "想用大学课程材料自学的人。",
            useWhen: "当你想找成体系的课程资料，又不想先注册平台时打开它。",
            whyKeepIt: "它更像长期学习底座，而不是短期流行课程清单。",
          },
          {
            name: "CS50x",
            url: "https://cs50.harvard.edu/x/",
            summary: "哈佛 CS50 的公开版本，适合作为第一次系统进入计算机科学的路线。",
            bestFor: "想认真入门计算机科学和编程实践的初学者。",
            useWhen: "当你不知道先学什么、想跟着清晰路径做题和写代码时打开它。",
            whyKeepIt: "它帮初学者减少“先学什么”的猜测成本。",
          },
        ],
      },
      {
        title: "Project Templates",
        description: "给项目、文档和协作流程找一个可复用的起点。",
        resources: [
          {
            name: "GitHub Skills",
            url: "https://skills.github.com/",
            summary: "GitHub 官方的互动练习，用小项目学习分支、PR、Pages 和 Actions。",
            bestFor: "想通过实践理解 GitHub 工作流的人。",
            useWhen: "当你需要练习分支、Pull Request、Pages 或自动化流程时打开它。",
            whyKeepIt: "它把抽象开发流程变成可以重复完成的小任务。",
          },
          {
            name: "Overleaf Templates",
            url: "https://www.overleaf.com/latex/templates",
            summary: "论文、简历、报告、海报和学术文档的 LaTeX 模板库。",
            bestFor: "需要快速开始正式文档的人。",
            useWhen: "当你不想从空白页开始排版报告、简历或论文时打开它。",
            whyKeepIt: "它能省下排版时间，也让学生从成熟格式开始。",
          },
        ],
      },
      {
        title: "Programming",
        description: "优先回到一手文档，减少被零散片段带偏。",
        resources: [
          {
            name: "MDN Web Docs",
            url: "https://developer.mozilla.org/en-US/",
            summary: "Web 平台的核心参考，覆盖 HTML、CSS、JavaScript 和浏览器 API。",
            bestFor: "学习或查证前端知识的人。",
            useWhen: "当你需要确认语法、浏览器兼容性或 API 行为时打开它。",
            whyKeepIt: "它是值得反复回来的 Web 基础参考。",
          },
          {
            name: "Python Documentation",
            url: "https://docs.python.org/3/",
            summary: "Python 语言、教程和标准库的一手官方文档。",
            bestFor: "写 Python 时需要准确答案的人。",
            useWhen: "当你需要确认语法行为、库细节、教程或官方示例时打开它。",
            whyKeepIt: "它提醒自己优先依赖一手文档，而不只是复制片段。",
          },
        ],
      },
      {
        title: "Writing",
        description: "帮助把资料、引用和表达整理成更可靠的文字成果。",
        resources: [
          {
            name: "Purdue OWL",
            url: "https://owl.purdue.edu/owl/",
            summary: "面向学术写作、引用、语法和风格的长期参考站。",
            bestFor: "写英文论文、报告或申请材料的人。",
            useWhen: "当你需要组织论文、处理引用或检查英文写作规范时打开它。",
            whyKeepIt: "它对学生和非英语母语写作者都很稳定、有用。",
          },
          {
            name: "Zotero",
            url: "https://www.zotero.org/",
            summary: "用于收集、管理、引用和复用研究资料的文献工具。",
            bestFor: "读论文、做综述或准备资料密集型文档的人。",
            useWhen: "当你的资料开始散落在浏览器、PDF 文件夹和笔记里时打开它。",
            whyKeepIt: "它把零散参考文献变成真正可维护的研究资料库。",
          },
        ],
      },
      {
        title: "Automation",
        description: "把重复的小流程交给脚本、规则和自动化工具处理。",
        resources: [
          {
            name: "Google Apps Script",
            url: "https://developers.google.com/apps-script",
            summary: "用于自动化 Google Sheets、Docs、Gmail、Drive 和轻量流程的平台。",
            bestFor: "日常使用表格、文档和邮件的人。",
            useWhen: "当你想自动处理重复的 Google Workspace 任务，又不想搭完整应用时打开它。",
            whyKeepIt: "它对日常使用表格和文档的人很友好。",
          },
          {
            name: "GitHub Actions",
            url: "https://docs.github.com/en/actions",
            summary: "用于自动化构建、测试、发布和仓库维护的 GitHub 工作流工具。",
            bestFor: "维护代码仓库、静态网站或项目流程的人。",
            useWhen: "当你希望代码或网站维护在提交后自动运行时打开它。",
            whyKeepIt: "它和这个 GitHub Pages 网站的维护流程直接相关。",
          },
        ],
      },
    ],
  },
  updatesSection: {
    label: "04 / Updates",
    title: "Recent updates",
  },
  updates: [
    {
      date: "2026.06",
      title: "First direction defined",
      description:
        "Yumo's Site starts as a warm personal homepage with experience notes, tools, and useful resources.",
    },
    {
      date: "Coming soon",
      title: "First tool pages",
      description:
        "The first batch can include a weekly report generator, a task board, and an email template helper.",
    },
  ],
  about: {
    label: "05 / About",
    title: "About this site",
    body: "This site is a semi-public place for Yumo to collect experience, tools, and resources that may help others learn and work better.",
  },
};
