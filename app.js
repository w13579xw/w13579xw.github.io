import { SITE_CONFIG, CONTENT } from "./data.js";

const state = {
  lang: localStorage.getItem("portfolio_lang") || SITE_CONFIG.defaultLang,
  theme: localStorage.getItem("portfolio_theme") || SITE_CONFIG.defaultTheme,
  projectFilter: "all",
  roleIndex: 0,
  charIndex: 0,
  deleting: false,
  typingTimer: null,
  cmdSelectedIndex: 0,
};

const $ = (id) => document.getElementById(id);

const ICONS = {
  sparkles: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3Z"/></svg>`,
  cpu: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3"/></svg>`,
  code: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
  github: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.87-1.54-3.87-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.25.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.17 1.18a11.05 11.05 0 0 1 5.78 0c2.2-1.49 3.16-1.18 3.16-1.18.63 1.58.23 2.75.11 3.04.74.8 1.18 1.83 1.18 3.08 0 4.41-2.69 5.38-5.26 5.67.41.36.78 1.06.78 2.14 0 1.55-.01 2.79-.01 3.17 0 .31.21.68.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z"/></svg>`,
  mail: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`,
  copy: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`,
  arrow: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`,
};

function applyTheme(theme) {
  state.theme = theme;
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("portfolio_theme", theme);
}

function showToast(message) {
  const toast = $("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove("show"), 2200);
}

async function copyEmail() {
  const t = CONTENT[state.lang];
  try {
    await navigator.clipboard.writeText(SITE_CONFIG.email);
  } catch {
    const input = document.createElement("input");
    input.value = SITE_CONFIG.email;
    document.body.appendChild(input);
    input.select();
    document.execCommand("copy");
    input.remove();
  }
  showToast(`${t.hero.copiedText}: ${SITE_CONFIG.email}`);
}

function startRoleTyping() {
  clearTimeout(state.typingTimer);
  const roles = CONTENT[state.lang].hero.roles;
  const el = $("heroRoleText");
  state.roleIndex = 0;
  state.charIndex = 0;
  state.deleting = false;

  const tick = () => {
    const current = roles[state.roleIndex % roles.length];
    if (!state.deleting) {
      state.charIndex += 1;
      el.textContent = current.slice(0, state.charIndex);
      if (state.charIndex >= current.length) {
        state.deleting = true;
        state.typingTimer = setTimeout(tick, 2000);
        return;
      }
      state.typingTimer = setTimeout(tick, 55);
    } else {
      state.charIndex -= 1;
      el.textContent = current.slice(0, state.charIndex);
      if (state.charIndex <= 0) {
        state.deleting = false;
        state.roleIndex = (state.roleIndex + 1) % roles.length;
        state.typingTimer = setTimeout(tick, 320);
        return;
      }
      state.typingTimer = setTimeout(tick, 28);
    }
  };
  tick();
}

function renderNavbar(t) {
  const links = [
    { href: "#about", label: t.nav.about },
    { href: "#experience", label: t.nav.experience },
    { href: "#projects", label: t.nav.projects },
    { href: "#skills", label: t.nav.skills },
    { href: "#education", label: t.nav.education },
    { href: "#contact", label: t.nav.contact },
  ];

  $("brandName").textContent = t.hero.name;
  $("cmdHintText").textContent = t.nav.cmdHint;
  $("langToggle").textContent = state.lang === "zh" ? "EN" : "中文";

  const html = links
    .map((item) => `<a class="nav-link" href="${item.href}">${item.label}</a>`)
    .join("");
  $("navLinks").innerHTML = html;
  $("mobileNav").innerHTML = html;

  $("mobileNav")
    .querySelectorAll("a")
    .forEach((a) =>
      a.addEventListener("click", () => {
        $("mobileNav").hidden = true;
      })
    );
}

function renderHero(t) {
  $("heroStatus").textContent = t.hero.status;
  $("heroGreeting").textContent = t.hero.greeting;
  $("heroName").textContent = t.hero.name;
  $("heroEnglishName").textContent = t.hero.englishName;
  $("heroRolePrefix").textContent = t.hero.rolePrefix;
  $("heroBio").textContent = t.hero.bio;

  $("heroActions").innerHTML = `
    <a class="btn btn-primary" href="#projects">
      <span>${t.hero.primaryCta}</span>
      ${ICONS.arrow}
    </a>
    <button class="btn btn-secondary" type="button" id="heroCopyEmailBtn">
      ${ICONS.copy}
      <span>${t.hero.secondaryCta}</span>
    </button>
    <a class="btn btn-secondary" href="${SITE_CONFIG.githubUrl}" target="_blank" rel="noopener noreferrer">
      ${ICONS.github}
      <span>${t.hero.githubCta}</span>
    </a>
  `;
  $("heroCopyEmailBtn").addEventListener("click", copyEmail);

  $("heroMetrics").innerHTML = t.hero.metrics
    .map(
      (m) => `
      <div class="metric-card">
        <div class="metric-value">${m.value}</div>
        <div class="metric-label">${m.label}</div>
      </div>`
    )
    .join("");

  startRoleTyping();
}

function renderExperience(t) {
  $("expEyebrow").textContent = t.sections.experience.eyebrow;
  $("expTitle").textContent = t.sections.experience.title;
  $("expSubtitle").textContent = t.sections.experience.subtitle;

  $("experienceList").innerHTML = t.experiences
    .map(
      (exp) => `
      <article class="exp-card reveal">
        <div class="exp-header">
          <div class="exp-title-group">
            <h3>${exp.company}</h3>
            <div class="exp-role">${exp.role} · ${exp.location}</div>
          </div>
          <div class="exp-meta">
            <span class="badge">${exp.badge}</span>
            <span class="period">${exp.period}</span>
          </div>
        </div>
        <p class="exp-summary">${exp.summary}</p>
        <ul class="exp-highlights">
          ${exp.highlights
            .map((h) => `<li><strong>${h.title}：</strong>${h.desc}</li>`)
            .join("")}
        </ul>
        <div class="tag-row">
          ${exp.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
        </div>
      </article>`
    )
    .join("");
}

function renderProjects(t) {
  $("projEyebrow").textContent = t.sections.projects.eyebrow;
  $("projTitle").textContent = t.sections.projects.title;
  $("projSubtitle").textContent = t.sections.projects.subtitle;

  $("projectFilters").innerHTML = t.sections.projects.filters
    .map(
      (f) => `
      <button
        class="filter-btn ${state.projectFilter === f.id ? "active" : ""}"
        type="button"
        role="tab"
        aria-selected="${state.projectFilter === f.id}"
        data-filter="${f.id}"
      >${f.label}</button>`
    )
    .join("");

  $("projectFilters")
    .querySelectorAll(".filter-btn")
    .forEach((btn) => {
      btn.addEventListener("click", () => {
        state.projectFilter = btn.dataset.filter;
        renderProjects(CONTENT[state.lang]);
        observeReveals();
      });
    });

  const filtered =
    state.projectFilter === "all"
      ? t.projects
      : t.projects.filter((p) => p.category === state.projectFilter);

  $("projectGrid").innerHTML = filtered
    .map(
      (p) => `
      <article class="project-card reveal">
        <div class="project-top">
          <span class="project-award">${p.award}</span>
          <span class="period">${p.period}</span>
        </div>
        <h3 class="project-title">${p.title}</h3>
        <div class="project-role">${p.role}</div>
        <p class="project-desc">${p.description}</p>
        <div class="project-metrics">
          ${p.metrics.map((m) => `<span class="metric-chip">${m}</span>`).join("")}
        </div>
        <div class="project-footer">
          <div class="tag-row">
            ${p.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
          </div>
          ${
            p.repoUrl
              ? `<a class="project-repo-link" href="${p.repoUrl}" target="_blank" rel="noopener noreferrer">
                  ${ICONS.github}
                  <span>${state.lang === "zh" ? "GitHub 仓库" : "GitHub Repo"}</span>
                </a>`
              : ""
          }
        </div>
      </article>`
    )
    .join("");
}

function renderSkills(t) {
  $("skillsEyebrow").textContent = t.sections.skills.eyebrow;
  $("skillsTitle").textContent = t.sections.skills.title;
  $("skillsSubtitle").textContent = t.sections.skills.subtitle;

  $("skillsGrid").innerHTML = t.skills
    .map(
      (s) => `
      <div class="skill-card reveal">
        <div class="skill-head">
          <span class="skill-icon">${ICONS[s.icon] || ICONS.code}</span>
          <h3>${s.title}</h3>
        </div>
        <div class="skill-pills">
          ${s.items.map((item) => `<span class="skill-pill">${item}</span>`).join("")}
        </div>
      </div>`
    )
    .join("");
}

function renderEducation(t) {
  $("eduEyebrow").textContent = t.sections.education.eyebrow;
  $("eduTitle").textContent = t.sections.education.title;
  $("eduSubtitle").textContent = t.sections.education.subtitle;
  $("honorsHeading").textContent =
    state.lang === "zh" ? "荣誉奖项与专业认证" : "Awards & Certifications";

  $("educationList").innerHTML = t.education
    .map(
      (edu) => `
      <article class="edu-card reveal">
        <div class="edu-top">
          <h3>${edu.school}</h3>
          <span class="period">${edu.period}</span>
        </div>
        <div class="edu-degree">${edu.degree}</div>
        <div class="edu-highlight">${edu.highlight}</div>
        <ul class="edu-details">
          ${edu.details.map((d) => `<li>${d}</li>`).join("")}
        </ul>
      </article>`
    )
    .join("");

  $("honorsList").innerHTML = t.honors
    .map(
      (h) => `
      <li>
        <span>${h.title}</span>
        <span class="honor-year">${h.year}</span>
      </li>`
    )
    .join("");
}

function renderContact(t) {
  $("contactEyebrow").textContent = t.sections.contact.eyebrow;
  $("contactTitle").textContent = t.sections.contact.title;
  $("contactSubtitle").textContent = t.sections.contact.subtitle;
  $("contactEmailText").textContent = SITE_CONFIG.email;

  $("contactActions").innerHTML = `
    <button class="btn btn-primary" type="button" id="contactCopyBtn">
      ${ICONS.copy}
      <span>${t.sections.contact.copyEmail}</span>
    </button>
    <a class="btn btn-secondary" href="mailto:${SITE_CONFIG.email}">
      ${ICONS.mail}
      <span>${t.sections.contact.sendEmail}</span>
    </a>
    <a class="btn btn-secondary" href="${SITE_CONFIG.githubUrl}" target="_blank" rel="noopener noreferrer">
      ${ICONS.github}
      <span>${t.sections.contact.visitGithub}</span>
    </a>
  `;
  $("contactCopyBtn").addEventListener("click", copyEmail);

  $("footerCopy").textContent = t.footer.copyright;
  $("backToTop").textContent = `↑ ${t.footer.backToTop}`;
}

function renderAll() {
  const t = CONTENT[state.lang];
  document.documentElement.lang = state.lang === "zh" ? "zh-CN" : "en";
  document.title = t.meta.title;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute("content", t.meta.description);

  renderNavbar(t);
  renderHero(t);
  renderExperience(t);
  renderProjects(t);
  renderSkills(t);
  renderEducation(t);
  renderContact(t);
  observeReveals();
}

/* =========================================================
 * 视口入场动画 & 滚动监听
 * ========================================================= */
let revealObserver = null;
function observeReveals() {
  if (revealObserver) revealObserver.disconnect();
  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -24px 0px" }
  );

  document.querySelectorAll(".reveal").forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.95) {
      el.classList.add("visible");
    } else {
      revealObserver.observe(el);
    }
  });
}

function handleScroll() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0;
  $("scrollProgress").style.width = `${pct}%`;

  const sections = ["about", "experience", "projects", "skills", "education", "contact"];
  let current = "about";
  for (const id of sections) {
    const el = $(id);
    if (el && el.getBoundingClientRect().top <= 140) {
      current = id;
    }
  }
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
  });
}

/* =========================================================
 * 快捷命令面板 (Ctrl/Cmd + K)
 * ========================================================= */
function getCmdItems(query) {
  const t = CONTENT[state.lang];
  const q = query.trim().toLowerCase();
  const items = [
    ...t.cmdPalette.actions,
    ...t.projects.map((p, idx) => ({
      id: `proj-${idx}`,
      label: p.title,
      hint: p.category.toUpperCase(),
      section: "#projects",
      filter: p.category,
    })),
  ];
  if (!q) return items;
  return items.filter(
    (item) =>
      item.label.toLowerCase().includes(q) || item.hint.toLowerCase().includes(q)
  );
}

function renderCmdList() {
  const t = CONTENT[state.lang];
  const items = getCmdItems($("cmdInput").value);
  state.cmdSelectedIndex = Math.min(state.cmdSelectedIndex, Math.max(0, items.length - 1));

  if (items.length === 0) {
    $("cmdList").innerHTML = `<li class="cmd-item">${t.cmdPalette.empty}</li>`;
    return;
  }

  $("cmdList").innerHTML = items
    .map(
      (item, i) => `
      <li>
        <button
          type="button"
          class="cmd-item ${i === state.cmdSelectedIndex ? "selected" : ""}"
          data-idx="${i}"
        >
          <span>${item.label}</span>
          <span class="cmd-item-hint">${item.hint}</span>
        </button>
      </li>`
    )
    .join("");

  $("cmdList")
    .querySelectorAll(".cmd-item")
    .forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = Number(btn.dataset.idx);
        executeCmd(items[idx]);
      });
    });
}

function executeCmd(item) {
  if (!item) return;
  closeCmdPalette();

  if (item.id === "copy-email") return copyEmail();
  if (item.id === "toggle-theme") {
    return applyTheme(state.theme === "dark" ? "light" : "dark");
  }
  if (item.id === "toggle-lang") {
    state.lang = state.lang === "zh" ? "en" : "zh";
    localStorage.setItem("portfolio_lang", state.lang);
    return renderAll();
  }
  if (item.id.startsWith("go-")) {
    const target = $(item.id.replace("go-", ""));
    if (target) target.scrollIntoView({ behavior: "smooth" });
    return;
  }
  if (item.section) {
    if (item.filter) {
      state.projectFilter = item.filter;
      renderProjects(CONTENT[state.lang]);
      observeReveals();
    }
    const target = document.querySelector(item.section);
    if (target) target.scrollIntoView({ behavior: "smooth" });
  }
}

function openCmdPalette() {
  const t = CONTENT[state.lang];
  $("cmdInput").placeholder = t.cmdPalette.placeholder;
  $("cmdInput").value = "";
  state.cmdSelectedIndex = 0;
  $("cmdBackdrop").hidden = false;
  renderCmdList();
  requestAnimationFrame(() => $("cmdInput").focus());
}

function closeCmdPalette() {
  $("cmdBackdrop").hidden = true;
}

/* =========================================================
 * 事件绑定与初始化
 * ========================================================= */
function init() {
  applyTheme(state.theme);
  renderAll();

  $("themeToggle").addEventListener("click", () => {
    applyTheme(state.theme === "dark" ? "light" : "dark");
  });

  $("langToggle").addEventListener("click", () => {
    state.lang = state.lang === "zh" ? "en" : "zh";
    localStorage.setItem("portfolio_lang", state.lang);
    renderAll();
  });

  $("mobileMenuBtn").addEventListener("click", () => {
    $("mobileNav").hidden = !$("mobileNav").hidden;
  });

  $("cmdTrigger").addEventListener("click", openCmdPalette);
  $("cmdBackdrop").addEventListener("click", (e) => {
    if (e.target === $("cmdBackdrop")) closeCmdPalette();
  });
  $("cmdInput").addEventListener("input", () => {
    state.cmdSelectedIndex = 0;
    renderCmdList();
  });

  window.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      if ($("cmdBackdrop").hidden) openCmdPalette();
      else closeCmdPalette();
      return;
    }
    if ($("cmdBackdrop").hidden) return;
    if (e.key === "Escape") {
      closeCmdPalette();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const items = getCmdItems($("cmdInput").value);
      state.cmdSelectedIndex = (state.cmdSelectedIndex + 1) % Math.max(1, items.length);
      renderCmdList();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const items = getCmdItems($("cmdInput").value);
      state.cmdSelectedIndex =
        (state.cmdSelectedIndex - 1 + Math.max(1, items.length)) % Math.max(1, items.length);
      renderCmdList();
    } else if (e.key === "Enter") {
      e.preventDefault();
      const items = getCmdItems($("cmdInput").value);
      executeCmd(items[state.cmdSelectedIndex]);
    }
  });

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();
}

init();
