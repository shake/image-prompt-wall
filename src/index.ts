/// <reference path="../worker-configuration.d.ts" />

const SITE_TITLE = "Image Prompt Wall";
const SITE_SUBTITLE = "Prompts worth keeping. Images worth revisiting.";
const DEFAULT_CATEGORIES = [
  "Infographic",
  "Poster",
  "Photography",
  "UI",
  "Illustration",
  "Typography",
];

type EntryRow = {
  id: string;
  title: string;
  prompt: string;
  category: string;
  tags_json: string;
  cover_image_key: string;
  created_at: string;
  updated_at: string;
  is_public: number;
  image_count?: number;
};

type EntryImageRow = {
  id: string;
  entry_id: string;
  image_key: string;
  sort_order: number;
  created_at: string;
};

type EntryDetail = {
  id: string;
  title: string;
  prompt: string;
  category: string;
  tags: string[];
  coverImageUrl: string;
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
  images: Array<{
    id: string;
    url: string;
    sortOrder: number;
  }>;
};

type EntryListItem = EntryDetail & {
  imageCount: number;
};

type AdminEntrySummary = EntryListItem & {
  imageCount: number;
};

function htmlEscape(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function attrEscape(value: string): string {
  return htmlEscape(value);
}

function truncate(value: string, max = 64): string {
  if (value.length <= max) return value;
  return `${value.slice(0, Math.max(0, max - 1)).trimEnd()}…`;
}

function parseTags(raw: string | null | undefined): string[] {
  if (!raw) return [];
  const trimmed = raw.trim();
  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed
          .map((tag) => String(tag).trim())
          .filter(Boolean)
          .filter((tag, index, array) => array.indexOf(tag) === index);
      }
    } catch {
      // Fall through to comma-separated parsing.
    }
  }
  return trimmed
    .split(/[,，\n]/)
    .map((tag) => tag.trim().replace(/^["'\[\]\s]+|["'\[\]\s]+$/g, ""))
    .filter(Boolean)
    .filter((tag, index, array) => array.indexOf(tag) === index);
}

function tagsToText(tags: string[]): string {
  return tags.join(", ");
}

function makePublicImageUrl(request: Request, imageKey: string): string {
  return new URL(`/media/${encodeURIComponent(imageKey)}`, request.url).toString();
}

function renderPage(options: {
  title: string;
  body: string;
  script?: string;
}): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="${htmlEscape(SITE_SUBTITLE)}" />
    <title>${htmlEscape(options.title)}</title>
    <style>
      :root {
        color-scheme: light;
        --bg: #f5efe4;
        --panel: rgba(255, 255, 255, 0.78);
        --panel-strong: #ffffff;
        --text: #1f1d1b;
        --muted: #6f655a;
        --line: rgba(50, 40, 30, 0.12);
        --shadow: 0 18px 50px rgba(44, 30, 12, 0.08);
        --radius: 22px;
        --accent: #2d261f;
      }
      * { box-sizing: border-box; }
      html, body { margin: 0; padding: 0; background: radial-gradient(circle at top, #fff8ee 0, var(--bg) 54%); color: var(--text); font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
      body { min-height: 100vh; }
      a { color: inherit; }
      .shell { width: min(1540px, calc(100vw - 32px)); margin: 0 auto; }
      .topbar { position: sticky; top: 0; z-index: 20; backdrop-filter: blur(18px); background: rgba(245, 239, 228, 0.82); border-bottom: 1px solid var(--line); }
      .topbar-inner { width: min(1540px, calc(100vw - 32px)); margin: 0 auto; display: grid; grid-template-columns: 1fr auto; gap: 16px; padding: 18px 0; align-items: center; }
      .brand { display: flex; flex-direction: column; gap: 6px; }
      .brand h1 { margin: 0; font-size: clamp(28px, 3vw, 44px); letter-spacing: -0.04em; }
      .brand p { margin: 0; color: var(--muted); font-size: 15px; }
      .toolbar { display: flex; gap: 10px; flex-wrap: wrap; justify-content: flex-end; align-items: center; }
      .field, .button, .select, .textarea, .input {
        border: 1px solid var(--line);
        background: var(--panel-strong);
        color: var(--text);
        border-radius: 999px;
        padding: 14px 18px;
        font: inherit;
        outline: none;
        box-shadow: none;
      }
      .input, .select { min-width: 220px; }
      .button { cursor: pointer; font-weight: 700; background: #2f2922; color: white; border-color: #2f2922; }
      .button.secondary { background: white; color: var(--text); }
      .button.danger { background: #a63324; border-color: #a63324; }
      .toolbar .search { min-width: min(56vw, 620px); }
      .hero { padding: 24px 0 18px; display: flex; flex-wrap: wrap; align-items: center; gap: 12px; }
      .pill { display: inline-flex; align-items: center; gap: 8px; padding: 12px 16px; border-radius: 999px; background: rgba(255,255,255,0.78); border: 1px solid var(--line); color: var(--text); text-decoration: none; font-weight: 600; box-shadow: var(--shadow); }
      .pill.active { background: #2f2922; color: white; border-color: #2f2922; }
      .count { margin-left: auto; color: var(--muted); font-weight: 600; }
      .cards { column-width: 280px; column-gap: 16px; padding: 14px 0 44px; }
      .card {
        display: inline-block;
        width: 100%;
        margin: 0 0 16px;
        break-inside: avoid;
        overflow: hidden;
        position: relative;
        border-radius: 22px;
        background: #efe8db;
        box-shadow: var(--shadow);
        text-decoration: none;
      }
      .card img { width: 100%; height: auto; display: block; background: #e6ddcb; }
      .card-title {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        padding: 18px 16px 12px;
        font-weight: 700;
        font-size: 15px;
        line-height: 1.25;
        color: #fff;
        background: linear-gradient(to top, rgba(0, 0, 0, 0.72), rgba(0, 0, 0, 0));
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.35);
      }
      .empty {
        padding: 64px 0;
        color: var(--muted);
      }
      .detail {
        display: grid;
        grid-template-columns: minmax(0, 1.15fr) minmax(340px, 0.85fr);
        gap: 28px;
        padding: 24px 0 44px;
        align-items: start;
      }
      .viewer, .panel, .admin-panel, .admin-list {
        border: 1px solid var(--line);
        background: rgba(255,255,255,0.8);
        border-radius: var(--radius);
        box-shadow: var(--shadow);
      }
      .viewer { overflow: hidden; padding: 14px; }
      .main-image {
        display: block;
        width: 100%;
        height: auto;
        border-radius: 18px;
        background: #eadfcd;
      }
      .thumbs {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
        margin-top: 12px;
      }
      .thumb {
        width: 74px;
        height: 74px;
        padding: 0;
        border: 1px solid var(--line);
        border-radius: 14px;
        overflow: hidden;
        background: white;
        cursor: pointer;
      }
      .thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
      .panel, .admin-panel, .admin-list { padding: 20px; }
      .eyebrow { color: #6b5fbe; font-weight: 700; font-size: 14px; margin-bottom: 8px; }
      .panel h1, .admin-panel h1 { margin: 0; font-size: clamp(34px, 4vw, 56px); line-height: 1.04; letter-spacing: -0.05em; }
      .meta { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; margin: 14px 0 18px; color: var(--muted); }
      .meta .dot { width: 4px; height: 4px; border-radius: 999px; background: currentColor; opacity: 0.3; }
      .section { margin-top: 24px; }
      .section h2 { font-size: 14px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted); margin: 0 0 10px; }
      pre.prompt {
        margin: 0;
        white-space: pre-wrap;
        word-break: break-word;
        background: rgba(250, 247, 240, 0.95);
        border: 1px solid var(--line);
        border-radius: 18px;
        padding: 16px;
        font-size: 15px;
        line-height: 1.6;
      }
      .actions { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 16px; }
      .chips { display: flex; flex-wrap: wrap; gap: 10px; }
      .chip { display: inline-flex; align-items: center; padding: 8px 12px; border-radius: 999px; background: white; border: 1px solid var(--line); font-size: 14px; font-weight: 600; color: var(--text); text-decoration: none; }
      .admin-layout { display: grid; grid-template-columns: minmax(0, 0.88fr) minmax(360px, 1.12fr); gap: 24px; padding: 24px 0 44px; align-items: start; }
      .stack { display: grid; gap: 16px; }
      .admin-panel label { display: grid; gap: 8px; font-weight: 600; font-size: 14px; color: var(--muted); }
      .admin-panel .input, .admin-panel .textarea, .admin-panel .select {
        width: 100%;
        border-radius: 18px;
        border: 1px solid var(--line);
        background: #fff;
        padding: 14px 16px;
      }
      .admin-panel .textarea { min-height: 160px; resize: vertical; }
      .admin-panel .row { display: grid; gap: 14px; grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .admin-panel .row.one { grid-template-columns: 1fr; }
      .admin-panel .helper { color: var(--muted); font-size: 13px; line-height: 1.5; }
      .admin-list { display: grid; gap: 12px; }
      .admin-item { display: grid; grid-template-columns: 84px 1fr auto; gap: 14px; padding: 14px; border-radius: 18px; border: 1px solid var(--line); background: rgba(255,255,255,0.75); align-items: center; }
      .admin-item img { width: 84px; height: 84px; object-fit: cover; border-radius: 14px; background: #eae1d2; }
      .admin-item h3 { margin: 0 0 6px; font-size: 18px; line-height: 1.1; }
      .admin-item p { margin: 0; color: var(--muted); font-size: 14px; }
      .admin-item .controls { display: flex; gap: 8px; flex-wrap: wrap; justify-content: flex-end; }
      .status { margin-top: 12px; color: var(--muted); font-size: 14px; min-height: 20px; }
      .footer-space { height: 30px; }
      @media (max-width: 980px) {
        .topbar-inner, .detail, .admin-layout { grid-template-columns: 1fr; }
        .toolbar { justify-content: flex-start; }
        .toolbar .search { min-width: min(100%, 560px); }
        .count { margin-left: 0; }
      }
      @media (max-width: 640px) {
        .shell, .topbar-inner { width: min(100vw - 20px, 1540px); }
        .cards { column-width: 100%; }
        .admin-item { grid-template-columns: 72px 1fr; }
        .admin-item .controls { grid-column: 1 / -1; justify-content: flex-start; }
        .admin-panel .row { grid-template-columns: 1fr; }
      }
    </style>
  </head>
  <body>
    ${options.body}
    ${options.script ? `<script>${options.script}</script>` : ""}
  </body>
</html>`;
}

function renderTopBar(active: "home" | "admin", title: string, subtitle: string): string {
  return `<header class="topbar">
    <div class="topbar-inner">
      <div class="brand">
        <h1>${htmlEscape(title)}</h1>
        <p>${htmlEscape(subtitle)}</p>
      </div>
      <div class="toolbar">
        <a class="pill ${active === "home" ? "active" : ""}" href="/">Explore</a>
        <a class="pill ${active === "admin" ? "active" : ""}" href="/admin">Admin</a>
      </div>
    </div>
  </header>`;
}

function normalizeCategory(value: string | null | undefined): string {
  const text = (value || "").trim();
  return text || DEFAULT_CATEGORIES[0];
}

function getFormText(form: FormData, key: string): string {
  const value = form.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function getFormBoolean(form: FormData, key: string): boolean {
  return form.get(key) !== null;
}

function guessExtension(filename: string, mimeType: string): string {
  const lower = filename.toLowerCase();
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return ".jpg";
  if (lower.endsWith(".png")) return ".png";
  if (lower.endsWith(".webp")) return ".webp";
  if (lower.endsWith(".gif")) return ".gif";
  if (lower.endsWith(".avif")) return ".avif";
  if (mimeType === "image/jpeg") return ".jpg";
  if (mimeType === "image/png") return ".png";
  if (mimeType === "image/webp") return ".webp";
  if (mimeType === "image/gif") return ".gif";
  if (mimeType === "image/avif") return ".avif";
  return "";
}

function safeSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 24);
}

async function loadEntries(
  env: Env,
  request: Request,
  options: { q?: string; category?: string; admin?: boolean } = {},
): Promise<EntryListItem[]> {
  const binds: string[] = [];
  let sql = `
    SELECT
      e.id,
      e.title,
      e.prompt,
      e.category,
      e.tags_json,
      e.cover_image_key,
      e.created_at,
      e.updated_at,
      e.is_public,
      COUNT(i.id) AS image_count
    FROM entries e
    LEFT JOIN entry_images i ON i.entry_id = e.id
    WHERE 1 = 1
  `;

  if (!options.admin) {
    sql += ` AND e.is_public = 1`;
  }
  if (options.category && options.category !== "all") {
    sql += ` AND e.category = ?`;
    binds.push(options.category);
  }
  if (options.q) {
    const q = `%${options.q}%`;
    sql += ` AND (e.title LIKE ? OR e.category LIKE ? OR e.tags_json LIKE ?)`;
    binds.push(q, q, q);
  }

  sql += `
    GROUP BY e.id
    ORDER BY e.created_at DESC
  `;

  const result = await env.image_prompt_wall_db
    .prepare(sql)
    .bind(...binds)
    .all<EntryRow>();

  return result.results.map((row) => ({
    id: row.id,
    title: row.title,
    prompt: row.prompt,
    category: row.category,
    tags: parseTags(row.tags_json),
    coverImageUrl: makePublicImageUrl(request, row.cover_image_key),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    isPublic: row.is_public === 1,
    images: [],
    imageCount: Number(row.image_count || 0),
  }));
}

async function loadEntryDetail(
  env: Env,
  request: Request,
  id: string,
  admin = false,
): Promise<EntryDetail | null> {
  const entry = await env.image_prompt_wall_db
    .prepare(
      `
      SELECT id, title, prompt, category, tags_json, cover_image_key, created_at, updated_at, is_public
      FROM entries
      WHERE id = ? ${admin ? "" : "AND is_public = 1"}
      LIMIT 1
      `,
    )
    .bind(id)
    .first<EntryRow>();

  if (!entry) return null;

  const images = await env.image_prompt_wall_db
    .prepare(
      `
      SELECT id, entry_id, image_key, sort_order, created_at
      FROM entry_images
      WHERE entry_id = ?
      ORDER BY sort_order ASC, created_at ASC
      `,
    )
    .bind(id)
    .all<EntryImageRow>();

  return {
    id: entry.id,
    title: entry.title,
    prompt: entry.prompt,
    category: entry.category,
    tags: parseTags(entry.tags_json),
    coverImageUrl: makePublicImageUrl(request, entry.cover_image_key),
    createdAt: entry.created_at,
    updatedAt: entry.updated_at,
    isPublic: entry.is_public === 1,
    images: images.results.map((image) => ({
      id: image.id,
      url: makePublicImageUrl(request, image.image_key),
      sortOrder: image.sort_order,
    })),
  };
}

function renderHomePage(request: Request, entries: EntryDetail[], categories: string[], q: string, category: string): string {
  const cards = entries.length
    ? entries
        .map(
          (entry) => `
            <a class="card" href="/entry/${encodeURIComponent(entry.id)}">
              <img src="${htmlEscape(entry.coverImageUrl)}" alt="${attrEscape(entry.title)}" loading="lazy" />
              <div class="card-title">${htmlEscape(truncate(entry.title, 54))}</div>
            </a>
          `,
        )
        .join("")
    : `<div class="empty">No prompts yet. Add your first image and prompt to start building the wall.</div>`;

  const categoryOptions = ["all", ...DEFAULT_CATEGORIES, ...categories]
    .filter((value, index, array) => array.indexOf(value) === index)
    .map(
      (value) =>
        `<option value="${attrEscape(value)}" ${value === category ? "selected" : ""}>${htmlEscape(value === "all" ? "All categories" : value)}</option>`,
    )
    .join("");

  const categoryPills = ["all", ...DEFAULT_CATEGORIES, ...categories]
    .filter((value, index, array) => array.indexOf(value) === index)
    .map(
      (value) =>
        `<a class="pill ${value === category ? "active" : ""}" href="/?q=${encodeURIComponent(q)}&category=${encodeURIComponent(value)}">${htmlEscape(value === "all" ? "All" : value)}</a>`,
    )
    .join("");

  return renderPage({
    title: SITE_TITLE,
    body: `
      ${renderTopBar("home", SITE_TITLE, SITE_SUBTITLE)}
      <main class="shell">
        <section class="hero">
          <form class="toolbar" method="GET" action="/">
            <input class="field search" type="search" name="q" placeholder="Search prompts, titles, tags..." value="${attrEscape(q)}" />
            <select class="select" name="category">
              ${categoryOptions}
            </select>
            <button class="button" type="submit">Search</button>
          </form>
          <div class="count">${entries.length} prompt${entries.length === 1 ? "" : "s"}</div>
        </section>
        <section class="hero" style="padding-top: 0;">${categoryPills}</section>
        <section class="cards">${cards}</section>
        <div class="footer-space"></div>
      </main>
    `,
  });
}

function renderDetailPage(request: Request, entry: EntryDetail): string {
  const visibleImages = [
    { id: `${entry.id}-cover`, url: entry.coverImageUrl, sortOrder: 0 },
    ...entry.images.filter((image) => image.url !== entry.coverImageUrl),
  ];

  const thumbnails = visibleImages
    .map(
      (image, index) => `
        <button class="thumb" type="button" data-image-url="${htmlEscape(image.url)}" aria-label="Show variation ${index + 1}">
          <img src="${htmlEscape(image.url)}" alt="${attrEscape(entry.title)} variation ${index + 1}" loading="lazy" />
        </button>
      `,
    )
    .join("");

  const tags = entry.tags
    .map((tag) => `<span class="chip">${htmlEscape(tag)}</span>`)
    .join("");

  return renderPage({
    title: `${entry.title} · ${SITE_TITLE}`,
    body: `
      ${renderTopBar("home", SITE_TITLE, SITE_SUBTITLE)}
      <main class="shell">
        <section class="detail">
          <article class="viewer">
            <img id="mainImage" class="main-image" src="${htmlEscape(visibleImages[0]?.url || entry.coverImageUrl)}" alt="${attrEscape(entry.title)}" />
            <div class="thumbs">${thumbnails}</div>
          </article>
          <aside class="panel">
            <div class="eyebrow">${htmlEscape(entry.category)}</div>
            <h1>${htmlEscape(entry.title)}</h1>
            <div class="meta">
              <span>${entry.isPublic ? "Public" : "Private"}</span>
              <span class="dot"></span>
              <span>${htmlEscape(entry.createdAt.slice(0, 10))}</span>
              <span class="dot"></span>
            <span>${entry.images.length} image${entry.images.length === 1 ? "" : "s"}</span>
            </div>
            <div class="actions">
              <button class="button" type="button" data-copy-title>Copy title</button>
              <button class="button secondary" type="button" data-copy-prompt>Copy prompt</button>
            </div>
            <div class="section">
              <h2>Prompt</h2>
              <pre class="prompt" id="promptText">${htmlEscape(entry.prompt)}</pre>
            </div>
            <div class="section">
              <h2>Tags</h2>
              <div class="chips">${tags || `<span class="helper">No tags yet.</span>`}</div>
            </div>
          </aside>
        </section>
      </main>
    `,
    script: `
      const mainImage = document.getElementById('mainImage');
      document.querySelectorAll('[data-image-url]').forEach((button) => {
        button.addEventListener('click', () => {
          const url = button.getAttribute('data-image-url');
          if (url && mainImage) mainImage.src = url;
        });
      });
      const promptText = document.getElementById('promptText');
      document.querySelector('[data-copy-title]')?.addEventListener('click', async () => {
        await navigator.clipboard.writeText(${JSON.stringify(entry.title)});
      });
      document.querySelector('[data-copy-prompt]')?.addEventListener('click', async () => {
        await navigator.clipboard.writeText(promptText?.textContent || ${JSON.stringify(entry.prompt)});
      });
    `,
  });
}

function renderAdminPage(request: Request, categories: string[]): string {
  const categoryOptions = [...DEFAULT_CATEGORIES, ...categories]
    .filter((value, index, array) => array.indexOf(value) === index)
    .map((value) => `<option value="${attrEscape(value)}"></option>`)
    .join("");

  return renderPage({
    title: `${SITE_TITLE} · Admin`,
    body: `
      ${renderTopBar("admin", SITE_TITLE, SITE_SUBTITLE)}
      <main class="shell">
        <section class="admin-layout">
          <article class="admin-panel">
            <h1>Add prompt</h1>
            <p class="helper">Upload images, paste the prompt, set a title and category, then publish. Add more images later by editing the entry.</p>
            <form id="entryForm" class="stack" enctype="multipart/form-data">
              <input type="hidden" name="id" id="entryId" />
              <div class="row">
                <label>Title
                  <input class="input" name="title" id="titleField" maxlength="120" placeholder="Short, one-line title" required />
                </label>
                <label>Category
                  <input class="input" name="category" id="categoryField" list="categoryOptions" placeholder="Infographic" required />
                  <datalist id="categoryOptions">${categoryOptions}</datalist>
                </label>
              </div>
              <div class="row">
                <label>Tags
                  <input class="input" name="tags" id="tagsField" placeholder="infographic, blue, math" />
                </label>
                <label>Images
                  <input class="input" name="images" id="imagesField" type="file" accept="image/*" multiple />
                </label>
              </div>
              <label>Prompt
                <textarea class="textarea" name="prompt" id="promptField" placeholder="Paste the full prompt here" required></textarea>
              </label>
              <label style="display:flex;align-items:center;gap:10px;flex-direction:row;">
                <input type="checkbox" name="is_public" id="publicField" checked />
                <span>Public</span>
              </label>
              <div class="row one">
                <button class="button" id="submitButton" type="submit">Publish</button>
                <button class="button secondary" id="resetButton" type="button">Reset</button>
              </div>
              <div id="formStatus" class="status"></div>
            </form>
          </article>
          <aside class="admin-list">
            <div class="actions" style="margin-top:0;">
              <button class="button secondary" id="refreshListButton" type="button">Refresh list</button>
            </div>
            <div id="entriesList" class="stack"></div>
          </aside>
        </section>
      </main>
    `,
    script: `
      const form = document.getElementById('entryForm');
      const status = document.getElementById('formStatus');
      const entriesList = document.getElementById('entriesList');
      const submitButton = document.getElementById('submitButton');
      const resetButton = document.getElementById('resetButton');
      const refreshListButton = document.getElementById('refreshListButton');
      const titleField = document.getElementById('titleField');
      const categoryField = document.getElementById('categoryField');
      const tagsField = document.getElementById('tagsField');
      const promptField = document.getElementById('promptField');
      const publicField = document.getElementById('publicField');
      const entryIdField = document.getElementById('entryId');
      const imagesField = document.getElementById('imagesField');

      function clearForm() {
        form.reset();
        entryIdField.value = '';
        submitButton.textContent = 'Publish';
        status.textContent = '';
        publicField.checked = true;
      }

      function entryItem(entry) {
        const wrapper = document.createElement('article');
        wrapper.className = 'admin-item';
        wrapper.innerHTML = \`
          <img src="\${entry.coverImageUrl}" alt="" />
          <div>
            <h3>\${entry.title}</h3>
            <p>\${entry.category} · \${(entry.tags || []).join(', ') || 'No tags'} · \${entry.imageCount} images</p>
          </div>
          <div class="controls">
            <button class="button secondary" type="button" data-edit>Edit</button>
            <button class="button danger" type="button" data-delete>Delete</button>
          </div>
        \`;
        wrapper.querySelector('[data-edit]')?.addEventListener('click', async () => {
          const response = await fetch('/api/entries/' + encodeURIComponent(entry.id) + '?admin=1');
          if (!response.ok) return;
          const detail = await response.json();
          entryIdField.value = detail.id;
          titleField.value = detail.title;
          categoryField.value = detail.category;
          tagsField.value = (detail.tags || []).join(', ');
          promptField.value = detail.prompt;
          publicField.checked = Boolean(detail.isPublic);
          submitButton.textContent = 'Save changes';
          status.textContent = 'Editing ' + detail.title;
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        wrapper.querySelector('[data-delete]')?.addEventListener('click', async () => {
          if (!confirm('Delete this prompt and all linked images?')) return;
          const response = await fetch('/api/admin/entries/' + encodeURIComponent(entry.id), { method: 'DELETE' });
          if (!response.ok) {
            status.textContent = 'Delete failed.';
            return;
          }
          status.textContent = 'Deleted.';
          await loadEntries();
        });
        return wrapper;
      }

      async function loadEntries() {
        const response = await fetch('/api/admin/entries');
        if (!response.ok) {
          entriesList.innerHTML = '<div class="helper">Unable to load entries.</div>';
          return;
        }
        const payload = await response.json();
        entriesList.innerHTML = '';
        if (!payload.entries.length) {
          entriesList.innerHTML = '<div class="helper">No entries yet.</div>';
          return;
        }
        payload.entries.forEach((entry) => entriesList.appendChild(entryItem(entry)));
      }

      form.addEventListener('submit', async (event) => {
        event.preventDefault();
        status.textContent = 'Saving...';
        submitButton.disabled = true;
        try {
          const formData = new FormData(form);
          if (!publicField.checked) {
            formData.delete('is_public');
          }
          const response = await fetch('/api/admin/entries', {
            method: 'POST',
            body: formData,
          });
          const payload = await response.json().catch(() => ({}));
          if (!response.ok) {
            throw new Error(payload.error || 'Save failed');
          }
          clearForm();
          status.textContent = payload.mode === 'update' ? 'Updated.' : 'Created.';
          await loadEntries();
        } catch (error) {
          status.textContent = error instanceof Error ? error.message : 'Save failed.';
        } finally {
          submitButton.disabled = false;
        }
      });

      resetButton.addEventListener('click', clearForm);
      refreshListButton.addEventListener('click', loadEntries);
      loadEntries();
    `,
  });
}

async function uploadImages(
  env: Env,
  entryId: string,
  files: File[],
  startSortOrder = 0,
): Promise<Array<{ id: string; imageKey: string; sortOrder: number }>> {
  const inserted: Array<{ id: string; imageKey: string; sortOrder: number }> = [];
  for (let index = 0; index < files.length; index += 1) {
    const file = files[index];
    const sortOrder = startSortOrder + index;
    const extension = guessExtension(file.name, file.type);
    const randomPart = crypto.randomUUID();
    const key = `entries/${entryId}/${String(sortOrder).padStart(2, "0")}-${randomPart}${extension}`;
    await env.image_prompt_wall_images.put(key, file, {
      httpMetadata: {
        contentType: file.type || "application/octet-stream",
      },
      customMetadata: {
        entryId,
        sortOrder: String(sortOrder),
      },
    });
    inserted.push({ id: crypto.randomUUID(), imageKey: key, sortOrder });
  }
  return inserted;
}

async function deleteEntryImages(env: Env, imageKeys: string[]): Promise<void> {
  await Promise.allSettled(imageKeys.map((key) => env.image_prompt_wall_images.delete(key)));
}

async function handleCreateOrUpdateEntry(request: Request, env: Env): Promise<Response> {
  const form = await request.formData();
  const entryId = getFormText(form, "id");
  const title = getFormText(form, "title");
  const prompt = getFormText(form, "prompt");
  const category = normalizeCategory(getFormText(form, "category"));
  const tags = parseTags(getFormText(form, "tags"));
  const isPublic = getFormBoolean(form, "is_public") ? 1 : 0;
  const files = form
    .getAll("images")
    .filter((value): value is File => value instanceof File && value.size > 0);

  if (!title || !prompt) {
    return Response.json({ error: "Title and prompt are required." }, { status: 400 });
  }

  if (!entryId && files.length === 0) {
    return Response.json({ error: "At least one image is required for a new entry." }, { status: 400 });
  }

  const existing = entryId
    ? await env.image_prompt_wall_db
        .prepare("SELECT id, cover_image_key FROM entries WHERE id = ? LIMIT 1")
        .bind(entryId)
        .first<{ id: string; cover_image_key: string }>()
    : null;

  if (entryId && !existing) {
    return Response.json({ error: "Entry not found." }, { status: 404 });
  }

  const id = entryId || crypto.randomUUID();
  const now = new Date().toISOString();
  let uploadedKeys: string[] = [];

  try {
    const images = files.length ? await uploadImages(env, id, files, entryId ? await getNextSortOrder(env, id) : 0) : [];
    uploadedKeys = images.map((image) => image.imageKey);

    if (!entryId) {
      const coverKey = images[0]?.imageKey;
      if (!coverKey) {
        return Response.json({ error: "Cover image is required." }, { status: 400 });
      }

      await env.image_prompt_wall_db.batch([
        env.image_prompt_wall_db
          .prepare(
            `
            INSERT INTO entries (
              id, title, prompt, category, tags_json, cover_image_key, created_at, updated_at, is_public
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
          )
          .bind(id, title, prompt, category, JSON.stringify(tags), coverKey, now, now, isPublic),
        ...images.map((image) =>
          env.image_prompt_wall_db
            .prepare(
              `
              INSERT INTO entry_images (id, entry_id, image_key, sort_order, created_at)
              VALUES (?, ?, ?, ?, ?)
              `,
            )
            .bind(image.id, id, image.imageKey, image.sortOrder, now),
        ),
      ]);
      return Response.json({ ok: true, mode: "create", id });
    }

    await env.image_prompt_wall_db
      .batch([
        env.image_prompt_wall_db
          .prepare(
            `
            UPDATE entries
            SET title = ?, prompt = ?, category = ?, tags_json = ?, is_public = ?, updated_at = ?
            WHERE id = ?
            `,
          )
          .bind(title, prompt, category, JSON.stringify(tags), isPublic, now, id),
        ...images.map((image) =>
          env.image_prompt_wall_db
            .prepare(
              `
              INSERT INTO entry_images (id, entry_id, image_key, sort_order, created_at)
              VALUES (?, ?, ?, ?, ?)
              `,
            )
            .bind(image.id, id, image.imageKey, image.sortOrder, now),
        ),
      ]);

    return Response.json({ ok: true, mode: "update", id });
  } catch (error) {
    if (uploadedKeys.length) {
      await deleteEntryImages(env, uploadedKeys);
    }
    throw error;
  }
}

async function getNextSortOrder(env: Env, entryId: string): Promise<number> {
  const result = await env.image_prompt_wall_db
    .prepare("SELECT COALESCE(MAX(sort_order), -1) AS max_sort FROM entry_images WHERE entry_id = ?")
    .bind(entryId)
    .first<{ max_sort: number }>();
  return Number(result?.max_sort ?? -1) + 1;
}

async function handleDeleteEntry(env: Env, id: string): Promise<Response> {
  const entry = await env.image_prompt_wall_db
    .prepare("SELECT id FROM entries WHERE id = ? LIMIT 1")
    .bind(id)
    .first<{ id: string }>();

  if (!entry) {
    return Response.json({ error: "Entry not found." }, { status: 404 });
  }

  const images = await env.image_prompt_wall_db
    .prepare("SELECT image_key FROM entry_images WHERE entry_id = ?")
    .bind(id)
    .all<{ image_key: string }>();

  await deleteEntryImages(env, images.results.map((row) => row.image_key));
  await env.image_prompt_wall_db.batch([
    env.image_prompt_wall_db.prepare("DELETE FROM entry_images WHERE entry_id = ?").bind(id),
    env.image_prompt_wall_db.prepare("DELETE FROM entries WHERE id = ?").bind(id),
  ]);

  return Response.json({ ok: true });
}

async function jsonEntriesResponse(
  env: Env,
  request: Request,
  options: { admin?: boolean; q?: string; category?: string } = {},
): Promise<Response> {
  const entries = await loadEntries(env, request, options);
  return Response.json({ entries });
}

async function jsonEntryResponse(env: Env, request: Request, id: string, admin = false): Promise<Response> {
  const entry = await loadEntryDetail(env, request, id, admin);
  if (!entry) {
    return Response.json({ error: "Not found." }, { status: 404 });
  }
  return Response.json(entry);
}

async function handleMediaRequest(env: Env, request: Request, key: string): Promise<Response> {
  const object = await env.image_prompt_wall_images.get(key);
  if (!object) {
    return new Response("Not found", { status: 404 });
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);
  headers.set("cache-control", "public, max-age=31536000, immutable");
  return new Response(request.method === "HEAD" ? null : object.body, { headers });
}

async function getCategories(env: Env): Promise<string[]> {
  const result = await env.image_prompt_wall_db
    .prepare("SELECT DISTINCT category FROM entries ORDER BY category ASC")
    .all<{ category: string }>();
  return result.results.map((row) => row.category);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const pathname = url.pathname;

    try {
      if (pathname === "/") {
        const q = (url.searchParams.get("q") || "").trim();
        const category = (url.searchParams.get("category") || "all").trim() || "all";
        const [entries, categories] = await Promise.all([
          loadEntries(env, request, { q: q || undefined, category: category || undefined }),
          getCategories(env),
        ]);
        return new Response(renderHomePage(request, entries, categories, q, category), {
          headers: { "content-type": "text/html; charset=utf-8" },
        });
      }

      if (pathname === "/admin") {
        const categories = await getCategories(env);
        return new Response(renderAdminPage(request, categories), {
          headers: { "content-type": "text/html; charset=utf-8" },
        });
      }

      if (pathname.startsWith("/entry/")) {
        const id = decodeURIComponent(pathname.slice("/entry/".length));
        const entry = await loadEntryDetail(env, request, id, false);
        if (!entry) return new Response("Not found", { status: 404 });
        return new Response(renderDetailPage(request, entry), {
          headers: { "content-type": "text/html; charset=utf-8" },
        });
      }

      if (pathname.startsWith("/media/") && (request.method === "GET" || request.method === "HEAD")) {
        const key = decodeURIComponent(pathname.slice("/media/".length));
        return handleMediaRequest(env, request, key);
      }

      if (pathname === "/api/entries" && request.method === "GET") {
        const q = (url.searchParams.get("q") || "").trim();
        const category = (url.searchParams.get("category") || "all").trim() || "all";
        return jsonEntriesResponse(env, request, {
          q: q || undefined,
          category: category || undefined,
        });
      }

      if (pathname.startsWith("/api/entries/") && request.method === "GET") {
        const id = decodeURIComponent(pathname.slice("/api/entries/".length));
        const admin = url.searchParams.get("admin") === "1";
        return jsonEntryResponse(env, request, id, admin);
      }

      if (pathname === "/api/admin/entries" && request.method === "GET") {
        const entries = await loadEntries(env, request, { admin: true });
        return Response.json({ entries: entries as AdminEntrySummary[] });
      }

      if (pathname === "/api/admin/entries" && request.method === "POST") {
        return handleCreateOrUpdateEntry(request, env);
      }

      if (pathname.startsWith("/api/admin/entries/") && request.method === "DELETE") {
        const id = decodeURIComponent(pathname.slice("/api/admin/entries/".length));
        return handleDeleteEntry(env, id);
      }

      return new Response("Not found", { status: 404 });
    } catch (error) {
      console.error(error);
      return Response.json(
        {
          error: "Internal server error",
        },
        { status: 500 },
      );
    }
  },
};
