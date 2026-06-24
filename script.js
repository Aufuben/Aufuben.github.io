(function () {
  function createEl(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function clearAndAppend(root, children) {
    root.replaceChildren(...children.filter(Boolean));
  }

  function createLink(item, className) {
    const link = createEl("a", className, item.label || item.title);
    link.href = item.href;
    if (item.href.startsWith("http")) {
      link.target = "_blank";
      link.rel = "noreferrer";
    }
    return link;
  }

  function renderProfileSidebar(content) {
    const profile = content.profile;
    const root = document.getElementById("profile-sidebar");

    const avatar = createEl("img", "profile-avatar");
    avatar.src = profile.avatar;
    avatar.alt = `${profile.name} avatar`;

    const name = createEl("h1", "profile-name", profile.name);

    const education = createEl("div", "profile-education");
    education.append(createEl("strong", "", profile.labels.education));
    for (const line of profile.education) {
      education.append(createEl("span", "", line));
    }

    const quoteBlock = createEl("section", "profile-block");
    quoteBlock.append(createEl("div", "rail-label", profile.labels.personalNote));
    quoteBlock.append(createEl("p", "profile-quote", profile.quote));

    const contactBlock = createEl("section", "profile-block");
    contactBlock.append(createEl("div", "rail-label", profile.labels.contact));
    const contactList = createEl("div", "contact-list");
    for (const contact of profile.contacts.filter((item) => item.href)) {
      contactList.append(createLink(contact, "contact-link"));
    }
    contactBlock.append(contactList);

    clearAndAppend(root, [avatar, name, education, quoteBlock, contactBlock]);
  }

  function renderTopNav(navItems) {
    const root = document.getElementById("top-nav");
    const links = navItems.map((item) => createLink(item, "nav-link"));
    clearAndAppend(root, links);
  }

  function renderHero(hero) {
    const root = document.getElementById("hero");
    const kicker = createEl("div", "hero-kicker", hero.kicker);
    const title = createEl("h2", "hero-title", hero.title);
    const subtitle = createEl("p", "hero-subtitle", hero.subtitle);
    clearAndAppend(root, [kicker, title, subtitle]);
  }

  function renderEntry(entry) {
    const article = createEl("article", "flow-item");
    const body = createEl("div", "flow-body");
    body.append(createEl("h3", "flow-title", entry.title));
    body.append(createEl("p", "flow-description", entry.description));
    if (entry.status) {
      body.append(createEl("span", "flow-status", entry.status));
    }

    const arrow = createEl("a", "flow-arrow", "↗");
    arrow.href = entry.href;
    arrow.setAttribute("aria-label", `Open ${entry.title}`);

    article.append(body, arrow);
    return article;
  }

  function renderResourceTags(resources) {
    const wrapper = createEl("div", "resource-tags");
    for (const tag of resources) {
      wrapper.append(createEl("span", "resource-tag", tag));
    }
    return wrapper;
  }

  function renderContentSections(sections, resources) {
    const root = document.getElementById("content-sections");
    const rendered = sections.map((section) => {
      const block = createEl("section", "content-section");
      block.id = section.id;

      const heading = createEl("div", "section-heading");
      heading.append(createEl("span", "", section.label));
      heading.append(createEl("h2", "", section.title));

      const entries = createEl("div", "flow-list");
      for (const entry of section.entries) entries.append(renderEntry(entry));

      block.append(heading, entries);
      if (section.id === "resources") block.append(renderResourceTags(resources));
      return block;
    });

    clearAndAppend(root, rendered);
  }

  function renderUpdates(updates) {
    const root = document.getElementById("updates");
    const heading = createEl("div", "section-heading");
    heading.append(createEl("span", "", window.YUMO_SITE_CONTENT.updatesSection.label));
    heading.append(createEl("h2", "", window.YUMO_SITE_CONTENT.updatesSection.title));

    const list = createEl("div", "flow-list");
    for (const update of updates) {
      list.append(
        renderEntry({
          title: `${update.date} · ${update.title}`,
          description: update.description,
          href: "#updates",
        }),
      );
    }

    clearAndAppend(root, [heading, list]);
  }

  function renderAbout(about) {
    const root = document.getElementById("about");
    const heading = createEl("div", "section-heading");
    heading.append(createEl("span", "", about.label));
    heading.append(createEl("h2", "", about.title));
    const body = createEl("p", "", about.body);
    clearAndAppend(root, [heading, body]);
  }

  function renderSite(content) {
    document.title = content.publicTitle || content.siteTitle;
    renderProfileSidebar(content);
    renderTopNav(content.nav);
    renderHero(content.hero);
    renderContentSections(content.sections, content.resources);
    renderUpdates(content.updates);
    renderAbout(content.about);
  }

  window.YumoSite = {
    renderSite,
    renderProfileSidebar,
    renderTopNav,
    renderHero,
    renderContentSections,
    renderUpdates,
    renderAbout,
  };

  function boot() {
    if (!window.YUMO_SITE_CONTENT) return;
    renderSite(window.YUMO_SITE_CONTENT);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
