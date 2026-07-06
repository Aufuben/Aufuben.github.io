import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";
import test from "node:test";

function createElementFactory(documentRef) {
  return function createElement(tag) {
    const element = {
      tagName: tag.toUpperCase(),
      children: [],
      attributes: {},
      className: "",
      textContent: "",
      append(...items) {
        this.children.push(...items);
      },
      replaceChildren(...items) {
        this.children = items;
      },
      setAttribute(name, value) {
        this.attributes[name] = value;
      },
    };

    Object.defineProperty(element, "href", {
      get() {
        return this.attributes.href;
      },
      set(value) {
        this.attributes.href = value;
      },
    });

    Object.defineProperty(element, "src", {
      get() {
        return this.attributes.src;
      },
      set(value) {
        this.attributes.src = value;
      },
    });

    Object.defineProperty(element, "alt", {
      get() {
        return this.attributes.alt;
      },
      set(value) {
        this.attributes.alt = value;
      },
    });

    return element;
  };
}

async function loadScript(rootIds = []) {
  const source = await readFile(new URL("../script.js", import.meta.url), "utf8");
  const roots = new Map(rootIds.map((id) => [id, { id, children: [], replaceChildren(...items) { this.children = items; } }]));
  const documentRef = {
    readyState: "complete",
    createElement: null,
    getElementById(id) {
      return roots.get(id) || null;
    },
    addEventListener() {},
  };
  documentRef.createElement = createElementFactory(documentRef);

  const sandbox = {
    document: documentRef,
    window: {
      YUMO_SITE_CONTENT: {
        nav: [],
        profile: {
          name: "Yumo",
          avatar: "assets/Yumo.jpg",
          mobileSummary: "NUPT undergraduate / AI for Industry trainee",
          labels: { education: "Education", personalNote: "Personal Note", contact: "Contact" },
          education: ["NUPT undergraduate"],
          quote: "Keep swimming.",
          contacts: [{ label: "GitHub", href: "https://github.com/Aufuben" }],
        },
        hero: {},
        sections: [],
        resources: [],
        resourcesPage: null,
        updatesSection: { label: "Updates", title: "Recent updates" },
        updates: [],
        about: { label: "About", title: "About", body: "Body" },
      },
    },
  };
  sandbox.window.document = documentRef;
  vm.runInNewContext(source, sandbox, { filename: "script.js" });
  return { api: sandbox.window.YumoSite, roots };
}

function collectElements(root, predicate, found = []) {
  if (!root) return found;
  if (predicate(root)) found.push(root);
  for (const child of root.children || []) collectElements(child, predicate, found);
  return found;
}

test("renderSite skips homepage-only containers when a standalone page omits them", async () => {
  const { api, roots } = await loadScript(["profile-sidebar", "top-nav"]);

  assert.doesNotThrow(() => api.renderSite(windowlessContent()));
  assert.equal(roots.get("profile-sidebar").children.length > 0, true);
  assert.equal(roots.get("top-nav").children.length, 0);
});

test("renderProfileSidebar includes compact mobile identity hooks", async () => {
  const { api, roots } = await loadScript(["profile-sidebar"]);
  const content = windowlessContent();

  api.renderProfileSidebar(content);

  const root = roots.get("profile-sidebar");
  const mobileSummary = collectElements(root, (element) => element.className === "profile-mobile-summary");
  const noteBlocks = collectElements(root, (element) => element.className === "profile-block profile-block-note");
  const contactBlocks = collectElements(root, (element) => element.className === "profile-block profile-block-contact");

  assert.equal(mobileSummary.length, 1);
  assert.equal(mobileSummary[0].textContent, "NUPT undergraduate / AI for Industry trainee");
  assert.equal(noteBlocks.length, 1);
  assert.equal(contactBlocks.length, 1);
});

test("renderContentSections makes available tool entries visibly clickable", async () => {
  const { api, roots } = await loadScript(["content-sections"]);
  const content = windowlessContent();
  content.sections = [
    {
      id: "tools",
      label: "02 / Tools",
      title: "Tools",
      entries: [
        {
          title: "Weekly Report Assistant",
          description: "Turn rough notes into drafts.",
          href: "weekly-report.html",
          status: "Available",
          actionLabel: "Open tool",
        },
      ],
    },
  ];

  api.renderContentSections(content.sections, content.resources);

  const links = collectElements(roots.get("content-sections"), (element) => element.tagName === "A");
  assert.equal(links.some((link) => link.className === "flow-title-link" && link.textContent === "Weekly Report Assistant"), true);
  assert.equal(links.some((link) => link.className === "flow-action" && link.textContent === "Open tool"), true);
});

function windowlessContent() {
  return {
    publicTitle: "Yumo's Site",
    siteTitle: "Yumo",
    nav: [],
    profile: {
      name: "Yumo",
      avatar: "assets/Yumo.jpg",
      mobileSummary: "NUPT undergraduate / AI for Industry trainee",
      labels: { education: "Education", personalNote: "Personal Note", contact: "Contact" },
      education: ["NUPT undergraduate"],
      quote: "Keep swimming.",
      contacts: [{ label: "GitHub", href: "https://github.com/Aufuben" }],
    },
    hero: { kicker: "", title: "", subtitle: "" },
    sections: [],
    resources: [],
    resourcesPage: null,
    updatesSection: { label: "Updates", title: "Recent updates" },
    updates: [],
    about: { label: "About", title: "About", body: "Body" },
  };
}
