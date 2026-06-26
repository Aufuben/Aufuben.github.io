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
          title: "Weekly Report Generator",
          description:
            "Turn scattered study, internship, or project notes into a structured weekly report you can copy and edit.",
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
          href: "#resources",
        },
      ],
    },
  ],
  resources: ["AI Tools", "Study Path", "Project Templates", "Programming", "Writing", "Automation"],
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
