/// <reference path="../worker-configuration.d.ts" />

const SITE_TITLE = "Image Prompt Wall";
const SITE_SUBTITLE = "Prompts worth keeping. Images worth revisiting.";
const SITE_SUBTITLE_ZH = "值得保留的提示词。值得回看的图片。";
const GITHUB_URL = "https://github.com/shake/image-prompt-wall";
const THEME_COOKIE = "ipw_theme";
const LANG_COOKIE = "ipw_lang";
const THEME_OPTIONS = ["paper", "warm", "dark"] as const;
const MAX_IMAGES_PER_ENTRY = 2;
type Theme = (typeof THEME_OPTIONS)[number];
type Lang = "en" | "zh";
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
  prompt_note: string;
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
  note: string;
  category: string;
  tags: string[];
  coverImageKey: string;
  coverImageUrl: string;
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
  images: Array<{
    key: string;
    id: string;
    url: string;
    sortOrder: number;
  }>;
};

type EntryListItem = EntryDetail & {
  imageCount: number;
};

const COPY: Record<Lang, {
  all: string;
  allCategories: string;
  admin: string;
  addPrompt: string;
  allowPublic: string;
  appTitle: string;
  backToExplore: string;
  category: string;
  clear: string;
  copyPrompt: string;
  download: string;
  close: string;
  created: string;
  deleteConfirm: string;
  deleteFailed: string;
  deleted: string;
  deletePrompt: string;
  detailPublic: string;
  detailPrivate: string;
  edit: string;
  editing: string;
  delete: string;
  emptyState: string;
  explore: string;
  github: string;
  imageCount: (count: number) => string;
  images: string;
  info: string;
  language: string;
  logout: string;
  menu: string;
  noTags: string;
  note: string;
  notePlaceholder: string;
  noNote: string;
  noPromptsYet: string;
  paperTheme: string;
  prompt: string;
  prompts: string;
  publish: string;
  publishing: string;
  reset: string;
  saveChanges: string;
  saved: string;
  search: string;
  searchPlaceholder: string;
  selectCategory: string;
  selectTheme: string;
  subtitle: string;
  tags: string;
  theme: string;
  title: string;
  updated: string;
  warmTheme: string;
  darkTheme: string;
  viewOriginal: string;
  viewOnGitHub: string;
}> = {
  en: {
    all: "All",
    allCategories: "All categories",
    admin: "Admin",
    addPrompt: "Add prompt",
    allowPublic: "Public",
    appTitle: SITE_TITLE,
    backToExplore: "Explore",
    category: "Category",
    clear: "Clear",
    copyPrompt: "Copy prompt",
    download: "Download",
    close: "Close",
    created: "Created",
    deleteConfirm: "Delete this prompt and all linked images?",
    deleteFailed: "Delete failed.",
    deleted: "Deleted.",
    deletePrompt: "Delete prompt",
    detailPublic: "Public",
    detailPrivate: "Private",
    edit: "Edit",
    editing: "Editing",
    delete: "Delete",
    emptyState: "No prompts yet. Add your first image and prompt to start building the wall.",
    explore: "Explore",
    github: "GitHub",
    imageCount: (count) => `${count} image${count === 1 ? "" : "s"}`,
    images: "Images",
    info: "Info",
    language: "Language",
    logout: "Logout",
    menu: "Menu",
    noTags: "No tags yet.",
    note: "Remark",
    notePlaceholder: "Add a short note about how to adapt this prompt.",
    noNote: "No remark yet.",
    noPromptsYet: "No prompts yet.",
    paperTheme: "Light",
    prompt: "Prompt",
    prompts: "prompts",
    publish: "Publish",
    publishing: "Publishing",
    reset: "Reset",
    saveChanges: "Save changes",
    saved: "Saved",
    search: "Search",
    searchPlaceholder: "Search prompts, titles, tags...",
    selectCategory: "Select category",
    selectTheme: "Select theme",
    subtitle: SITE_SUBTITLE,
    tags: "Tags",
    theme: "Theme switch",
    title: "Title",
    updated: "Updated",
    warmTheme: "Warm",
    darkTheme: "Dark",
    viewOriginal: "View original",
    viewOnGitHub: "View on GitHub",
  },
  zh: {
    all: "全部",
    allCategories: "全部分类",
    admin: "后台",
    addPrompt: "新增提示词",
    allowPublic: "公开",
    appTitle: SITE_TITLE,
    backToExplore: "浏览",
    category: "分类",
    clear: "清空",
    copyPrompt: "复制提示词",
    download: "下载",
    close: "关闭",
    created: "创建时间",
    deleteConfirm: "确定删除这条提示词和所有关联图片吗？",
    deleteFailed: "删除失败。",
    deleted: "已删除。",
    deletePrompt: "删除提示词",
    detailPublic: "公开",
    detailPrivate: "私密",
    edit: "编辑",
    editing: "正在编辑",
    delete: "删除",
    emptyState: "还没有内容。先上传第一张图片和提示词，开始搭建这面墙。",
    explore: "浏览",
    github: "GitHub",
    imageCount: (count) => `${count} 张图`,
    images: "图片",
    info: "说明",
    language: "语言",
    logout: "退出",
    menu: "菜单",
    noTags: "暂无标签。",
    note: "备注",
    notePlaceholder: "补充这条提示词的替换方法和灵活用法。",
    noNote: "暂无备注。",
    noPromptsYet: "还没有提示词。",
    paperTheme: "浅色",
    prompt: "提示词",
    prompts: "条",
    publish: "发布",
    publishing: "正在保存",
    reset: "重置",
    saveChanges: "保存修改",
    saved: "已保存",
    search: "搜索",
    searchPlaceholder: "搜索提示词、标题、标签…",
    selectCategory: "选择分类",
    selectTheme: "选择主题",
    subtitle: SITE_SUBTITLE_ZH,
    tags: "标签",
    theme: "主题切换",
    title: "标题",
    updated: "更新时间",
    warmTheme: "暖色",
    darkTheme: "深色",
    viewOriginal: "查看原图",
    viewOnGitHub: "查看 GitHub 项目",
  },
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

function getCookie(request: Request, name: string): string | null {
  const cookie = request.headers.get("Cookie");
  if (!cookie) return null;
  const parts = cookie.split(/;\s*/);
  for (const part of parts) {
    const index = part.indexOf("=");
    if (index === -1) continue;
    const key = part.slice(0, index).trim();
    if (key === name) return decodeURIComponent(part.slice(index + 1));
  }
  return null;
}

function getLang(request: Request): Lang {
  const cookie = getCookie(request, LANG_COOKIE);
  if (cookie === "zh" || cookie === "en") return cookie;
  const acceptLanguage = request.headers.get("accept-language") || "";
  return /(^|,|\s)zh/i.test(acceptLanguage) ? "zh" : "en";
}

function getTheme(request: Request): Theme {
  const cookie = getCookie(request, THEME_COOKIE);
  if (cookie === "paper" || cookie === "warm" || cookie === "dark") return cookie;
  return "warm";
}

function setCookieHeader(name: string, value: string): string {
  return `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=31536000; SameSite=Lax`;
}

function ui(lang: Lang) {
  return COPY[lang];
}

function themeLabel(lang: Lang, theme: Theme): string {
  const copy = ui(lang);
  if (theme === "paper") return copy.paperTheme;
  if (theme === "warm") return copy.warmTheme;
  return copy.darkTheme;
}

function categoryLabel(lang: Lang, category: string): string {
  const map: Record<string, { en: string; zh: string }> = {
    Infographic: { en: "Infographic", zh: "信息图" },
    Poster: { en: "Poster", zh: "海报" },
    Photography: { en: "Photography", zh: "摄影" },
    UI: { en: "UI", zh: "界面" },
    Illustration: { en: "Illustration", zh: "插画" },
    Typography: { en: "Typography", zh: "字体排版" },
  };
  const value = map[category];
  if (!value) return category;
  return value[lang];
}

function formatCount(lang: Lang, count: number): string {
  if (lang === "zh") return `${count}${ui(lang).prompts}`;
  return `${count} ${ui(lang).prompts}`;
}

function iconGithub(): string {
  return `<svg viewBox="0 0 24 24" aria-hidden="true" width="18" height="18" fill="currentColor"><path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.8-.25.8-.56v-2.02c-3.28.72-3.97-1.4-3.97-1.4-.54-1.38-1.32-1.75-1.32-1.75-1.08-.74.08-.73.08-.73 1.2.08 1.83 1.24 1.83 1.24 1.06 1.82 2.78 1.29 3.46.98.1-.78.42-1.29.77-1.59-2.62-.3-5.38-1.31-5.38-5.83 0-1.29.46-2.35 1.23-3.18-.12-.3-.53-1.5.11-3.12 0 0 1-.32 3.3 1.22a11.4 11.4 0 0 1 6 0C18.5 5.8 19.5 6.12 19.5 6.12c.64 1.62.24 2.82.12 3.12.77.83 1.22 1.89 1.22 3.18 0 4.53-2.76 5.52-5.39 5.82.43.37.82 1.11.82 2.24v3.32c0 .31.21.66.8.55A11.5 11.5 0 0 0 12 .5Z"/></svg>`;
}

function iconDots(): string {
  return `<svg viewBox="0 0 24 24" aria-hidden="true" width="18" height="18" fill="currentColor"><path d="M5 10.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm7-0.0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm7 0.0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z"/></svg>`;
}

function iconSun(): string {
  return `<svg viewBox="0 0 24 24" aria-hidden="true" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>`;
}

function iconMoon(): string {
  return `<svg viewBox="0 0 24 24" aria-hidden="true" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/></svg>`;
}

function iconPaper(): string {
  return `<svg viewBox="0 0 24 24" aria-hidden="true" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="4"/><path d="M8 8h8M8 12h8M8 16h5"/></svg>`;
}

function iconOpen(): string {
  return `<svg viewBox="0 0 1024 1024" aria-hidden="true" width="18" height="18" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M131.413333 85.333333h142.933334a32 32 0 1 0 0-64H54.186667a32 32 0 0 0-32 32v221.013334a32 32 0 1 0 64 0V131.413333l344.32 344.32a32 32 0 0 0 45.226666-45.226666zM969.813333 717.653333a32 32 0 0 0-32 32v142.506667l-344.32-344.32a32 32 0 0 0-45.226666 45.226667l344.32 345.6h-142.933334a32 32 0 0 0 0 64h220.16a32 32 0 0 0 32-32v-221.013334a32 32 0 0 0-32-32zM999.253333 42.666667a32 32 0 0 0-29.44-19.626667h-220.16a32 32 0 1 0 0 64h142.506667l-344.32 344.32a32 32 0 1 0 45.226667 45.226667L938.666667 131.413333v142.933334a32 32 0 1 0 64 0V54.186667a32 32 0 0 0-3.413334-11.52zM430.506667 548.266667L85.333333 892.586667v-142.933334a32 32 0 1 0-64 0v220.16a32 32 0 0 0 32 32h221.013334a32 32 0 1 0 0-64H131.413333l344.32-344.32a32 32 0 0 0-45.226666-45.226666z"/></svg>`;
}

function iconDownload(): string {
  return `<svg viewBox="0 0 1024 1024" aria-hidden="true" width="18" height="18" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M843.001 820.769c-0.024 0-0.050 0-0.050 0h-658.793c-14.14 0-25.599 11.459-25.599 25.624 0 14.14 11.484 25.6 25.599 25.6h658.793c0 0 0.024 0 0.050 0 14.14 0 25.6-11.459 25.6-25.6 0-14.166-11.459-25.624-25.6-25.624zM494.381 766.031c4.78 4.806 11.358 7.817 18.668 7.817v0 0c7.309 0 13.886-2.986 18.617-7.841l318.189-318.19c4.781-4.755 7.793-11.331 7.817-18.592 0-14.494-11.839-26.231-26.256-26.231-7.285-0.025-13.837 2.96-18.567 7.715l-273.569 273.544v-495.206c-0.026-0.025-0.026-0.025-0.026-0.050 0.026-14.494-11.71-26.257-26.18-26.257-14.494 0-26.231 11.763-26.231 26.257 0 0 0 0.025 0.025 0.050v495.182l-273.544-273.543c-4.73-4.755-11.332-7.715-18.567-7.69-14.494-0.025-26.231 11.737-26.282 26.181 0 7.285 2.986 13.913 7.766 18.618l318.14 318.241z"/></svg>`;
}

function iconCopy(): string {
  return `<svg viewBox="0 0 1024 1024" aria-hidden="true" width="18" height="18" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M394.666667 106.666667h448a74.666667 74.666667 0 0 1 74.666666 74.666666v448a74.666667 74.666667 0 0 1-74.666666 74.666667H394.666667a74.666667 74.666667 0 0 1-74.666667-74.666667V181.333333a74.666667 74.666667 0 0 1 74.666667-74.666666z m0 64a10.666667 10.666667 0 0 0-10.666667 10.666666v448a10.666667 10.666667 0 0 0 10.666667 10.666667h448a10.666667 10.666667 0 0 0 10.666666-10.666667V181.333333a10.666667 10.666667 0 0 0-10.666666-10.666666H394.666667z m245.333333 597.333333a32 32 0 0 1 64 0v74.666667a74.666667 74.666667 0 0 1-74.666667 74.666666H181.333333a74.666667 74.666667 0 0 1-74.666666-74.666666V394.666667a74.666667 74.666667 0 0 1 74.666666-74.666667h74.666667a32 32 0 0 1 0 64h-74.666667a10.666667 10.666667 0 0 0-10.666666 10.666667v448a10.666667 10.666667 0 0 0 10.666666 10.666666h448a10.666667 10.666667 0 0 0 10.666667-10.666666v-74.666667z"/></svg>`;
}

function iconClose(): string {
  return `<svg viewBox="0 0 1024 1024" aria-hidden="true" width="18" height="18" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M548.992 503.744L885.44 167.328a31.968 31.968 0 1 0-45.248-45.248L503.744 458.496 167.328 122.08a31.968 31.968 0 1 0-45.248 45.248l336.416 336.416L122.08 840.16a31.968 31.968 0 1 0 45.248 45.248l336.416-336.416L840.16 885.44a31.968 31.968 0 1 0 45.248-45.248L548.992 503.744z"/></svg>`;
}

function iconEdit(): string {
  return `<svg viewBox="0 0 24 24" aria-hidden="true" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg"><path d="M4 18.5V20h1.5l10.2-10.2-1.5-1.5L4 18.5Z"/><path d="m13.2 8.3 1.5 1.5"/><path d="M14 4.5h5.2a.8.8 0 0 1 .8.8v5.2"/><path d="M19.8 5.3 9.4 15.7"/></svg>`;
}

function iconTrash(): string {
  return `<svg viewBox="0 0 24 24" aria-hidden="true" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg"><path d="M3.8 6h16.4"/><path d="M9.5 6V4.8A1.3 1.3 0 0 1 10.8 3.5h2.4a1.3 1.3 0 0 1 1.3 1.3V6"/><path d="M8.2 6.2 9 19a1.3 1.3 0 0 0 1.3 1.2h3.4a1.3 1.3 0 0 0 1.3-1.2l.8-12.8"/><path d="M12 9.2v7.2M9.2 9.2l.3 7.2M14.8 9.2l-.3 7.2"/></svg>`;
}

function iconRestore(): string {
  return `<svg viewBox="0 0 24 24" aria-hidden="true" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg"><path d="M6 12a6 6 0 1 1 2 4.46"/><path d="M6 16v-4h4"/><path d="M9 12h3.5"/></svg>`;
}

function iconUpload(): string {
  return `<svg viewBox="0 0 24 24" aria-hidden="true" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg"><path d="M12 4v10"/><path d="m8.5 7.5 3.5-3.5 3.5 3.5"/><path d="M5 15.5a2.5 2.5 0 0 0 2.5 2.5h9a2.5 2.5 0 0 0 2.5-2.5"/><path d="M6.5 16h11"/></svg>`;
}

function iconChevronLeft(): string {
  return `<svg viewBox="0 0 24 24" aria-hidden="true" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg"><path d="M15 6 9 12l6 6"/></svg>`;
}

function iconChevronRight(): string {
  return `<svg viewBox="0 0 24 24" aria-hidden="true" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg"><path d="m9 6 6 6-6 6"/></svg>`;
}

function themeIcon(theme: Theme): string {
  if (theme === "paper") return iconPaper();
  if (theme === "warm") return iconSun();
  return iconMoon();
}

function makePublicImageUrl(request: Request, imageKey: string): string {
  return new URL(`/media/${encodeURIComponent(imageKey)}`, request.url).toString();
}

function getDisplayImages(entry: EntryDetail): EntryDetail["images"] {
  const images: EntryDetail["images"] = [
    { key: entry.coverImageKey, id: `${entry.id}-cover`, url: entry.coverImageUrl, sortOrder: 0 },
  ];
  for (const image of entry.images) {
    if (images.some((item) => item.key === image.key || item.url === image.url)) continue;
    images.push(image);
    if (images.length >= MAX_IMAGES_PER_ENTRY) break;
  }
  return images.slice(0, MAX_IMAGES_PER_ENTRY);
}

function hasAdminSession(request: Request): boolean {
  if (request.headers.get("cf-access-jwt-assertion")) return true;
  const cookie = request.headers.get("cookie") || "";
  return /(?:^|;\s*)CF_Authorization=/.test(cookie);
}

function buildSharedScript(): string {
  return `(() => {
    const themeKey = ${JSON.stringify(THEME_COOKIE)};
    const langKey = ${JSON.stringify(LANG_COOKIE)};
    const themeButtons = Array.from(document.querySelectorAll('[data-theme-value]'));
    const menuToggle = document.querySelector('[data-menu-toggle]');
    const menuPopover = document.querySelector('[data-menu-popover]');
    const langSelect = document.querySelector('[data-lang-select]');

    const setCookie = (name, value) => {
      document.cookie = name + '=' + encodeURIComponent(value) + '; Path=/; Max-Age=31536000; SameSite=Lax';
    };

    const setTheme = (theme) => {
      document.documentElement.dataset.theme = theme;
      setCookie(themeKey, theme);
      try { localStorage.setItem(themeKey, theme); } catch {}
      themeButtons.forEach((button) => {
        const active = button.dataset.themeValue === theme;
        button.classList.toggle('active', active);
        button.setAttribute('aria-pressed', active ? 'true' : 'false');
      });
    };

    const initialTheme = document.documentElement.dataset.theme || localStorage.getItem(themeKey) || 'warm';
    setTheme(initialTheme);

    const closeMenu = () => {
      if (!menuPopover || !menuToggle) return;
      menuPopover.hidden = true;
      menuToggle.setAttribute('aria-expanded', 'false');
    };

    const openMenu = () => {
      if (!menuPopover || !menuToggle) return;
      menuPopover.hidden = false;
      menuToggle.setAttribute('aria-expanded', 'true');
    };

    menuToggle?.addEventListener('click', (event) => {
      event.preventDefault();
      if (!menuPopover) return;
      menuPopover.hidden ? openMenu() : closeMenu();
    });

    document.addEventListener('click', (event) => {
      if (!menuPopover || !menuToggle) return;
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (!menuPopover.contains(target) && !menuToggle.contains(target)) closeMenu();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu();
    });

    themeButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const theme = button.dataset.themeValue;
        if (theme) setTheme(theme);
      });
    });

    langSelect?.addEventListener('change', () => {
      const value = langSelect.value;
      setCookie(langKey, value);
      try { localStorage.setItem(langKey, value); } catch {}
      window.location.reload();
    });

    const storedLang = localStorage.getItem(langKey);
    if (storedLang && langSelect && langSelect.value !== storedLang) {
      langSelect.value = storedLang;
    }
  })();`;
}

function renderPage(options: {
  title: string;
  lang: Lang;
  theme: Theme;
  body: string;
  script?: string;
}): string {
  const pageDescription = options.lang === "zh" ? SITE_SUBTITLE_ZH : SITE_SUBTITLE;
  return `<!doctype html>
<html lang="${options.lang}" data-theme="${options.theme}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="light dark" />
    <meta name="description" content="${htmlEscape(pageDescription)}" />
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
        --button-bg: #2f2922;
        --button-text: #ffffff;
        --button-secondary-bg: var(--panel-strong);
        --button-secondary-text: var(--text);
        --pill-active-bg: #2f2922;
        --pill-active-text: #ffffff;
      }
      * { box-sizing: border-box; }
      html[data-theme="warm"] { color-scheme: light; }
      html[data-theme="paper"] { color-scheme: light; --bg: #f8f3e6; --panel: rgba(255, 251, 242, 0.84); --panel-strong: #fffdf8; --text: #1f1d1b; --muted: #766b5f; --line: rgba(79, 59, 32, 0.14); --shadow: 0 18px 50px rgba(72, 49, 10, 0.08); }
      html[data-theme="dark"] { color-scheme: dark; --bg: #0e1116; --panel: rgba(17, 21, 29, 0.84); --panel-strong: #141926; --text: #f1efe8; --muted: #98a2b3; --line: rgba(255, 255, 255, 0.12); --shadow: 0 24px 60px rgba(0, 0, 0, 0.38); --accent: #f0e7d7; --button-bg: #f0e7d7; --button-text: #171411; --button-secondary-bg: rgba(255, 255, 255, 0.08); --button-secondary-text: var(--text); --pill-active-bg: #f0e7d7; --pill-active-text: #171411; }
      html, body { margin: 0; padding: 0; background: radial-gradient(circle at top, color-mix(in srgb, var(--bg) 78%, white) 0, var(--bg) 54%); color: var(--text); font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
      html:lang(zh) body { font-size: 14.5px; }
      html:lang(zh) .brand h1 { font-size: clamp(24px, 2.55vw, 38px); }
      html:lang(zh) .panel h1 { font-size: clamp(32px, 3.6vw, 52px); line-height: 1.08; letter-spacing: -0.03em; }
      html:lang(zh) .admin-panel h1 { font-size: clamp(21px, 1.9vw, 28px); line-height: 1.12; letter-spacing: -0.03em; }
      html:lang(zh) .pill,
      html:lang(zh) .button,
      html:lang(zh) .lang-select,
      html:lang(zh) .menu-item,
      html:lang(zh) .menu-link { font-size: 0.93em; }
      html:lang(zh) .card-title { font-size: 14px; line-height: 1.22; }
      html:lang(zh) pre.prompt,
      html:lang(zh) .admin-panel label,
      html:lang(zh) .admin-panel .helper,
      html:lang(zh) .status { font-size: 13px; }
      body { min-height: 100vh; }
      a { color: inherit; }
      .shell { width: min(1720px, calc(100vw - 24px)); margin: 0 auto; }
      .topbar { position: sticky; top: 0; z-index: 20; backdrop-filter: blur(18px); background: color-mix(in srgb, var(--bg) 84%, white 16%); border-bottom: 1px solid var(--line); }
      html[data-theme="dark"] .topbar { background: rgba(10, 13, 18, 0.76); }
      .topbar-inner { width: min(1720px, calc(100vw - 24px)); margin: 0 auto; display: grid; grid-template-columns: 1fr auto; gap: 16px; padding: 18px 0; align-items: center; }
      .brand { display: flex; flex-direction: column; gap: 6px; }
      .brand-home {
        color: inherit;
        text-decoration: none;
        display: inline-flex;
        align-items: baseline;
        width: fit-content;
      }
      .brand-home:hover { opacity: 0.88; }
      .brand h1 { margin: 0; font-size: clamp(28px, 3vw, 44px); letter-spacing: -0.04em; }
      .brand p { margin: 0; color: var(--muted); font-size: 15px; }
      .toolbar { display: flex; gap: 10px; flex-wrap: wrap; justify-content: flex-end; align-items: center; }
      .top-actions { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }
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
      .button { cursor: pointer; font-weight: 700; background: var(--button-bg); color: var(--button-text); border-color: var(--button-bg); }
      .button.secondary { background: var(--button-secondary-bg); color: var(--button-secondary-text); }
      .button.danger { background: #a63324; border-color: #a63324; }
      .toolbar .search { min-width: min(56vw, 620px); }
      .icon-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 46px;
        height: 46px;
        border-radius: 50%;
        border: 1px solid var(--line);
        background: var(--panel-strong);
        color: var(--text);
        box-shadow: none;
        text-decoration: none;
      }
      .lang-select {
        min-width: 96px;
        height: 46px;
        border-radius: 999px;
        border: 1px solid var(--line);
        background: var(--panel-strong);
        color: var(--text);
        padding: 0 12px;
        font: inherit;
      }
      .menu-wrap { position: relative; }
      .menu-popover {
        position: absolute;
        top: 56px;
        right: 0;
        width: min(290px, calc(100vw - 24px));
        padding: 16px;
        border-radius: 28px;
        border: 1px solid var(--line);
        background: var(--panel-strong);
        box-shadow: var(--shadow);
        z-index: 30;
      }
      .menu-section-title {
        margin: 4px 6px 12px;
        color: var(--muted);
        font-size: 13px;
        font-weight: 700;
        letter-spacing: 0.04em;
        text-transform: uppercase;
      }
      .menu-list { display: grid; gap: 8px; }
      .menu-item {
        display: flex;
        align-items: center;
        gap: 12px;
        width: 100%;
        padding: 14px 16px;
        border: 0;
        border-radius: 18px;
        background: transparent;
        color: var(--text);
        text-align: left;
        font: inherit;
        font-weight: 700;
        cursor: pointer;
      }
      .menu-item.active { background: color-mix(in srgb, var(--bg) 72%, white); }
      .menu-item svg, .icon-button svg { flex: 0 0 auto; }
      .menu-divider { margin: 14px 8px; border: 0; border-top: 1px solid var(--line); }
      .menu-link {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 14px 16px;
        border-radius: 18px;
        color: var(--text);
        text-decoration: none;
        font-weight: 700;
      }
      .menu-link.logout { color: #df5b31; }
      .hero { padding: 24px 0 18px; display: flex; flex-wrap: wrap; align-items: center; gap: 12px; }
      .pill { display: inline-flex; align-items: center; gap: 8px; padding: 12px 16px; border-radius: 999px; background: color-mix(in srgb, var(--panel-strong) 84%, var(--bg) 16%); border: 1px solid var(--line); color: var(--text); text-decoration: none; font-weight: 600; box-shadow: var(--shadow); }
      .pill.active { background: var(--pill-active-bg); color: var(--pill-active-text); border-color: var(--pill-active-bg); }
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
        background: color-mix(in srgb, var(--panel-strong) 76%, var(--bg) 24%);
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
        grid-template-columns: minmax(0, 6fr) minmax(0, 4fr);
        gap: 30px;
        padding: 24px 0 44px;
        align-items: start;
      }
      .viewer, .panel, .admin-panel {
        border: 1px solid var(--line);
        background: color-mix(in srgb, var(--panel-strong) 80%, var(--bg) 20%);
        border-radius: var(--radius);
        box-shadow: var(--shadow);
      }
      .viewer {
        overflow: hidden;
        padding: 18px;
        position: relative;
        background:
          radial-gradient(circle at top left, color-mix(in srgb, var(--panel-strong) 88%, var(--bg) 12%) 0%, color-mix(in srgb, var(--panel-strong) 70%, var(--bg) 30%) 52%, color-mix(in srgb, var(--bg) 78%, white 22%) 100%);
      }
      .viewer::before {
        content: "";
        position: absolute;
        inset: 10px;
        border-radius: calc(var(--radius) - 6px);
        pointer-events: none;
        border: 1px solid color-mix(in srgb, var(--line) 70%, transparent);
      }
      .main-image {
        display: block;
        width: 100%;
        height: auto;
        border-radius: 18px;
        background: color-mix(in srgb, var(--bg) 80%, white 20%);
        box-shadow: 0 1px 0 rgba(255,255,255,0.24), 0 18px 40px rgba(0,0,0,0.06);
        cursor: zoom-in;
      }
      .viewer-nav {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        z-index: 2;
        width: 46px;
        height: 46px;
        background: color-mix(in srgb, var(--panel-strong) 88%, var(--bg) 12%);
        box-shadow: 0 8px 24px rgba(0,0,0,0.08);
      }
      .viewer-nav-prev { left: 30px; }
      .viewer-nav-next { right: 30px; }
      .viewer-actions {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
        justify-content: center;
        margin: 14px 0 8px;
      }
      .icon-action {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 44px;
        height: 44px;
        border-radius: 50%;
        border: 1px solid var(--line);
        background: var(--panel-strong);
        color: var(--text);
        text-decoration: none;
        box-shadow: none;
      }
      .icon-action.buttonless {
        padding: 0;
        cursor: pointer;
      }
      .icon-action.danger {
        color: #c03b2d;
      }
      .icon-action.danger:hover {
        background: color-mix(in srgb, #c03b2d 12%, var(--panel-strong));
      }
      .image-caption {
        display: grid;
        gap: 8px;
        padding: 12px 4px 4px;
      }
      .image-title {
        font-size: 18px;
        font-weight: 800;
        letter-spacing: -0.03em;
        line-height: 1.2;
      }
      .image-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        align-items: center;
        color: var(--muted);
        font-size: 13px;
      }
      .image-category {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        align-items: center;
      }
      .image-meta .dot {
        width: 4px;
        height: 4px;
        border-radius: 999px;
        background: currentColor;
        opacity: 0.3;
      }
      .image-tags { display: flex; flex-wrap: wrap; gap: 8px; }
      .panel, .admin-panel { padding: 20px; }
      .panel { max-width: 100%; }
      .eyebrow { color: #6b5fbe; font-weight: 700; font-size: 14px; margin-bottom: 8px; }
      .section { margin-top: 24px; }
      .section h2 { font-size: 14px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted); margin: 0 0 10px; }
      pre.prompt {
        margin: 0;
        white-space: pre-wrap;
        word-break: break-word;
        background: color-mix(in srgb, var(--panel-strong) 84%, var(--bg) 16%);
        border: 1px solid var(--line);
        border-radius: 18px;
        padding: 16px;
        font-size: 15px;
        line-height: 1.6;
        max-height: 40vh;
        overflow: auto;
      }
      .actions { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 16px; }
      .actions.icon-row { justify-content: flex-start; }
      .chips { display: flex; flex-wrap: wrap; gap: 10px; }
      .chip { display: inline-flex; align-items: center; padding: 8px 12px; border-radius: 999px; background: var(--panel-strong); border: 1px solid var(--line); font-size: 14px; font-weight: 600; color: var(--text); text-decoration: none; }
      .remark {
        padding: 16px;
        border-radius: 18px;
        background: color-mix(in srgb, var(--panel-strong) 88%, var(--bg) 12%);
        border: 1px solid var(--line);
        color: var(--text);
        line-height: 1.6;
        white-space: pre-wrap;
      }
      .admin-detail-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin: 14px 0 0;
      }
      .admin-detail-actions .button {
        display: inline-flex;
        align-items: center;
        gap: 8px;
      }
      .admin-panel-heading {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 12px;
      }
      .admin-panel-heading h1 {
        margin: 0;
      }
      .delete-modal-card {
        width: min(92vw, 720px);
        max-height: none;
      }
      .delete-modal-window {
        position: relative;
        width: 100%;
        border-radius: 28px;
        border: 1px solid var(--line);
        background: var(--panel-strong);
        box-shadow: var(--shadow);
        padding: 26px;
      }
      .delete-modal-close {
        position: absolute;
        top: 14px;
        right: 14px;
      }
      .delete-modal-hero {
        display: grid;
        justify-items: center;
        gap: 14px;
        padding: 16px 0 22px;
        text-align: center;
      }
      .delete-modal-kicker {
        color: var(--muted);
        font-size: 13px;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }
      .delete-modal-title-row {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        flex-wrap: wrap;
        justify-content: center;
      }
      .delete-modal-title-row h2 {
        margin: 0;
        font-size: 28px;
        line-height: 1.2;
        letter-spacing: -0.03em;
      }
      .delete-modal-copy {
        display: grid;
        gap: 10px;
        justify-items: center;
      }
      .delete-modal-icon {
        display: grid;
        place-items: center;
        width: 56px;
        height: 56px;
        border-radius: 18px;
        background: color-mix(in srgb, #c03b2d 12%, var(--panel));
        color: #c03b2d;
      }
      .delete-modal-hint {
        margin: 0;
        color: var(--muted);
        font-size: 14px;
        line-height: 1.5;
      }
      .delete-modal-label {
        display: grid;
        gap: 8px;
        margin-top: 8px;
      }
      .delete-modal-label span {
        color: var(--muted);
        font-size: 14px;
        font-weight: 600;
      }
      .delete-modal-input {
        width: 100%;
      }
      .delete-modal-actions {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        margin-top: 18px;
        flex-wrap: wrap;
      }
      .delete-modal-status {
        min-height: 20px;
        margin-top: 12px;
        color: var(--muted);
        font-size: 14px;
      }
      .modal {
        position: fixed;
        inset: 0;
        z-index: 50;
        display: grid;
        place-items: center;
        padding: 24px;
        background: rgba(0, 0, 0, 0.72);
        backdrop-filter: blur(10px);
      }
      .modal[hidden] { display: none; }
      .modal-card {
        position: relative;
        width: min(92vw, 1280px);
        max-height: 92vh;
        display: grid;
        place-items: center;
      }
      .modal-image {
        max-width: 100%;
        max-height: 92vh;
        object-fit: contain;
        border-radius: 18px;
        box-shadow: 0 24px 80px rgba(0, 0, 0, 0.45);
        background: #111;
      }
      .modal-close {
        position: absolute;
        top: -12px;
        right: -12px;
        width: 44px;
        height: 44px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        border: 1px solid rgba(255,255,255,0.18);
        background: rgba(10, 10, 10, 0.82);
        color: #fff;
        cursor: pointer;
      }
      .admin-layout { display: block; padding: 24px 0 44px; }
      .admin-compose-detail { display: grid; grid-template-columns: minmax(0, 6fr) minmax(360px, 4fr); gap: 30px; min-width: 0; align-items: start; }
      .admin-compose-main { display: grid; gap: 16px; min-width: 0; }
      .admin-canvas {
        position: relative;
        min-height: 520px;
        padding: 18px;
      }
      .admin-canvas.dragover {
        border-color: color-mix(in srgb, var(--button-bg) 54%, var(--line));
        box-shadow: 0 0 0 2px color-mix(in srgb, var(--button-bg) 18%, transparent), var(--shadow);
      }
      .admin-canvas .main-image {
        max-height: 66vh;
        object-fit: contain;
        background: color-mix(in srgb, var(--bg) 82%, white 18%);
      }
      .admin-canvas-actions {
        position: absolute;
        top: 22px;
        right: 22px;
        z-index: 2;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 10px;
        flex-wrap: nowrap;
        margin: 0;
      }
      .admin-drop-empty {
        position: absolute;
        inset: 18px;
        display: grid;
        place-items: center;
        gap: 12px;
        padding: 20px;
        border-radius: 18px;
        border: 1px dashed color-mix(in srgb, var(--line) 85%, transparent);
        background: color-mix(in srgb, var(--panel-strong) 72%, var(--bg) 28%);
        color: var(--muted);
        text-align: center;
      }
      .admin-drop-empty[hidden] { display: none; }
      .admin-drop-empty p {
        margin: 0;
        max-width: 30ch;
        line-height: 1.5;
      }
      .admin-upload-button {
        display: inline-flex;
        align-items: center;
        gap: 10px;
      }
      .admin-meta-grid {
        display: grid;
        gap: 14px;
        grid-template-columns: minmax(0, 1.2fr) minmax(180px, 220px) minmax(0, 1fr);
        align-items: end;
      }
      .admin-meta-grid label {
        display: grid;
        gap: 8px;
        font-weight: 600;
        font-size: 14px;
        color: var(--muted);
      }
      .admin-meta-grid .input,
      .admin-meta-grid .select {
        min-width: 0;
        width: 100%;
      }
      .admin-meta-grid label:nth-child(2) .input,
      .admin-meta-grid label:nth-child(2) .select {
        max-width: 220px;
      }
      .stack { display: grid; gap: 16px; }
      .admin-panel label { display: grid; gap: 8px; font-weight: 600; font-size: 14px; color: var(--muted); }
      .admin-panel .input, .admin-panel .textarea, .admin-panel .select {
        width: 100%;
        border-radius: 18px;
        border: 1px solid var(--line);
        background: var(--panel-strong);
        padding: 14px 16px;
      }
      .admin-panel .textarea { min-height: 140px; resize: vertical; }
      .admin-panel .row { display: grid; gap: 14px; grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .admin-panel .row.one { grid-template-columns: 1fr; }
      .admin-panel .helper { color: var(--muted); font-size: 13px; line-height: 1.5; }
      .note-field { display: grid; gap: 8px; }
      .note-field .textarea { min-height: 120px; }
      .status { margin-top: 12px; color: var(--muted); font-size: 14px; min-height: 20px; }
      .footer-space { height: 30px; }
      @media (max-width: 980px) {
        .topbar-inner, .detail, .admin-compose-detail, .admin-meta-grid { grid-template-columns: 1fr; }
        .toolbar { justify-content: flex-start; }
        .top-actions { justify-content: flex-start; }
        .toolbar .search { min-width: min(100%, 560px); }
        .count { margin-left: 0; }
      }
      @media (max-width: 640px) {
        .shell, .topbar-inner { width: min(100vw - 20px, 1540px); }
        .cards { column-width: 100%; }
        .admin-panel .row { grid-template-columns: 1fr; }
      }
    </style>
  </head>
  <body>
    ${options.body}
    <script>${buildSharedScript()}</script>
    ${options.script ? `<script>${options.script}</script>` : ""}
  </body>
</html>`;
}

function renderTopBar(active: "home" | "admin", lang: Lang, theme: Theme, title: string, subtitle: string): string {
  const copy = ui(lang);
  const showLogout = active === "admin";
  return `<header class="topbar">
    <div class="topbar-inner">
      <div class="brand">
        <a class="brand-home" href="/" aria-label="${htmlEscape(title)}">
          <h1>${htmlEscape(title)}</h1>
        </a>
        <p>${htmlEscape(subtitle)}</p>
      </div>
      <div class="toolbar">
        <div class="top-actions">
          <a class="pill ${active === "home" ? "active" : ""}" href="/">${htmlEscape(copy.explore)}</a>
          <a class="pill ${active === "admin" ? "active" : ""}" href="/admin">${htmlEscape(copy.admin)}</a>
        </div>
        <div class="top-actions">
          <select class="lang-select" data-lang-select aria-label="${htmlEscape(copy.language)}">
            <option value="en" ${lang === "en" ? "selected" : ""}>EN</option>
            <option value="zh" ${lang === "zh" ? "selected" : ""}>中文</option>
          </select>
          <a class="icon-button" href="${htmlEscape(GITHUB_URL)}" target="_blank" rel="noreferrer" aria-label="${htmlEscape(copy.viewOnGitHub)}">${iconGithub()}</a>
          <div class="menu-wrap">
            <button class="icon-button" type="button" data-menu-toggle aria-label="${htmlEscape(copy.menu)}" aria-expanded="false">${iconDots()}</button>
            <div class="menu-popover" data-menu-popover hidden>
              <div class="menu-section-title">${htmlEscape(copy.theme)}</div>
              <div class="menu-list">
                <button class="menu-item ${theme === "paper" ? "active" : ""}" type="button" data-theme-value="paper" aria-pressed="${theme === "paper" ? "true" : "false"}">${iconPaper()}${htmlEscape(themeLabel(lang, "paper"))}</button>
                <button class="menu-item ${theme === "warm" ? "active" : ""}" type="button" data-theme-value="warm" aria-pressed="${theme === "warm" ? "true" : "false"}">${iconSun()}${htmlEscape(themeLabel(lang, "warm"))}</button>
                <button class="menu-item ${theme === "dark" ? "active" : ""}" type="button" data-theme-value="dark" aria-pressed="${theme === "dark" ? "true" : "false"}">${iconMoon()}${htmlEscape(themeLabel(lang, "dark"))}</button>
              </div>
              ${showLogout ? `<hr class="menu-divider" /><a class="menu-link logout" href="/cdn-cgi/access/logout">${htmlEscape(copy.logout)}</a>` : ""}
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>`;
}

function renderDeleteModal(copy: ReturnType<typeof ui>, lang: Lang): string {
  return `
      <div class="modal" data-delete-modal hidden>
        <div class="modal-card delete-modal-card" role="dialog" aria-modal="true" aria-labelledby="deleteModalTitle">
          <div class="delete-modal-window">
            <button class="modal-close delete-modal-close" type="button" data-delete-modal-close aria-label="${htmlEscape(copy.close)}">${iconClose()}</button>
            <div class="delete-modal-hero">
              <div class="delete-modal-icon">${iconTrash()}</div>
              <div class="delete-modal-copy">
                <div class="delete-modal-kicker">${htmlEscape(copy.deletePrompt)}</div>
                <div class="delete-modal-title-row">
                  <h2 id="deleteModalTitle" data-delete-modal-entry-title></h2>
                  <button class="icon-action buttonless" type="button" data-delete-copy-title aria-label="${htmlEscape(copy.copyPrompt)}">${iconCopy()}</button>
                </div>
                <p class="delete-modal-hint" data-delete-modal-hint>${htmlEscape(lang === "zh" ? "输入完整标题后才能删除。" : "Type the full title to enable delete.")}</p>
              </div>
            </div>
            <label class="delete-modal-label">
              <span>${htmlEscape(lang === "zh" ? "确认标题" : "Confirm title")}</span>
              <input class="input delete-modal-input" type="text" data-delete-modal-input autocomplete="off" spellcheck="false" />
            </label>
            <div class="delete-modal-actions">
              <button class="button secondary" type="button" data-delete-modal-close>${htmlEscape(copy.close)}</button>
              <button class="button danger" type="button" data-delete-modal-submit disabled>${htmlEscape(copy.delete)}</button>
            </div>
            <div class="delete-modal-status" data-delete-modal-status></div>
          </div>
        </div>
      </div>
    `;
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
      e.prompt_note,
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

  const details = await Promise.all(
    result.results.map(async (row) => {
      const detail = await loadEntryDetail(env, request, row.id, options.admin);
      return detail ? { ...detail, imageCount: detail.images.length } : null;
    }),
  );

  return details.filter((detail): detail is EntryListItem => Boolean(detail));
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
      SELECT id, title, prompt, prompt_note, category, tags_json, cover_image_key, created_at, updated_at, is_public
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
    note: entry.prompt_note,
    category: entry.category,
    tags: parseTags(entry.tags_json),
    coverImageKey: entry.cover_image_key,
    coverImageUrl: makePublicImageUrl(request, entry.cover_image_key),
    createdAt: entry.created_at,
    updatedAt: entry.updated_at,
    isPublic: entry.is_public === 1,
    images: images.results.map((image) => ({
      key: image.image_key,
      id: image.id,
      url: makePublicImageUrl(request, image.image_key),
      sortOrder: image.sort_order,
    })),
  };
}

function renderHomePage(request: Request, lang: Lang, theme: Theme, entries: EntryDetail[], categories: string[], q: string, category: string): string {
  const copy = ui(lang);
  const cards = entries.length
    ? entries
        .flatMap((entry) =>
          getDisplayImages(entry).map(
            (image, index) => `
            <a class="card" href="/entry/${encodeURIComponent(entry.id)}?image=${index}">
              <img src="${htmlEscape(image.url)}" alt="${attrEscape(entry.title)}" loading="lazy" />
              <div class="card-title">${htmlEscape(truncate(entry.title, 54))}</div>
            </a>
          `,
          ),
        )
        .join("")
    : `<div class="empty">${htmlEscape(copy.emptyState)}</div>`;
  const cardCount = entries.reduce((total, entry) => total + getDisplayImages(entry).length, 0);

  const categoryOptions = ["all", ...DEFAULT_CATEGORIES, ...categories]
    .filter((value, index, array) => array.indexOf(value) === index)
    .map(
      (value) =>
        `<option value="${attrEscape(value)}" ${value === category ? "selected" : ""}>${htmlEscape(value === "all" ? copy.allCategories : categoryLabel(lang, value))}</option>`,
    )
    .join("");

  const categoryPills = ["all", ...DEFAULT_CATEGORIES, ...categories]
    .filter((value, index, array) => array.indexOf(value) === index)
    .map(
      (value) =>
        `<a class="pill ${value === category ? "active" : ""}" href="/?q=${encodeURIComponent(q)}&category=${encodeURIComponent(value)}">${htmlEscape(value === "all" ? copy.all : categoryLabel(lang, value))}</a>`,
    )
    .join("");

  return renderPage({
    title: SITE_TITLE,
    lang,
    theme,
    body: `
      ${renderTopBar("home", lang, theme, SITE_TITLE, copy.subtitle)}
      <main class="shell">
        <section class="hero">
          <form class="toolbar" method="GET" action="/">
            <input class="field search" type="search" name="q" placeholder="${attrEscape(copy.searchPlaceholder)}" value="${attrEscape(q)}" />
            <select class="select" name="category">
              ${categoryOptions}
            </select>
            <button class="button" type="submit">${htmlEscape(copy.search)}</button>
          </form>
          <div class="count">${htmlEscape(formatCount(lang, cardCount))}</div>
        </section>
        <section class="hero" style="padding-top: 0;">${categoryPills}</section>
        <section class="cards">${cards}</section>
        <div class="footer-space"></div>
      </main>
    `,
  });
}

function renderDetailPage(request: Request, lang: Lang, theme: Theme, entry: EntryDetail, adminMode = false, initialImageIndex = 0): string {
  const copy = ui(lang);
  const canEdit = adminMode || hasAdminSession(request);
  const visibleImages = getDisplayImages(entry);
  const currentImageIndex = Math.min(Math.max(Number(initialImageIndex) || 0, 0), Math.max(visibleImages.length - 1, 0));
  const currentImage = visibleImages[currentImageIndex] || visibleImages[0];

  const tags = entry.tags
    .map((tag) => `<span class="chip">${htmlEscape(tag)}</span>`)
    .join("");
  const note = entry.note.trim();
  const metaTags = entry.tags
    .map((tag) => `<span class="chip">${htmlEscape(tag)}</span>`)
    .join("");

  return renderPage({
    title: `${entry.title} · ${SITE_TITLE}`,
    lang,
    theme,
    body: `
      ${renderTopBar("home", lang, theme, SITE_TITLE, copy.subtitle)}
      <main class="shell">
        <section class="detail">
          <article class="viewer">
            ${visibleImages.length > 1 ? `<button class="icon-action buttonless viewer-nav viewer-nav-prev" type="button" data-prev-image aria-label="${htmlEscape(lang === "zh" ? "上一张图片" : "Previous image")}">${iconChevronLeft()}</button>` : ""}
            <img id="mainImage" class="main-image" src="${htmlEscape(currentImage?.url || entry.coverImageUrl)}" alt="${attrEscape(entry.title)}" />
            ${visibleImages.length > 1 ? `<button class="icon-action buttonless viewer-nav viewer-nav-next" type="button" data-next-image aria-label="${htmlEscape(lang === "zh" ? "下一张图片" : "Next image")}">${iconChevronRight()}</button>` : ""}
            <div class="viewer-actions">
              <button class="icon-action buttonless" type="button" data-open-original aria-label="${htmlEscape(copy.viewOriginal)}">${iconOpen()}</button>
              <a class="icon-action" data-download-image href="${htmlEscape(currentImage?.url || entry.coverImageUrl)}" download aria-label="${htmlEscape(copy.download)}">${iconDownload()}</a>
            </div>
            <div class="image-caption">
              <div class="image-title">${htmlEscape(entry.title)}</div>
              <div class="image-category"><span class="chip">${htmlEscape(copy.category)} · ${htmlEscape(categoryLabel(lang, entry.category))}</span></div>
            <div class="image-meta">
                <span>${htmlEscape(entry.isPublic ? copy.detailPublic : copy.detailPrivate)}</span>
                <span class="dot"></span>
                <span>${htmlEscape(entry.createdAt.slice(0, 10))}</span>
                <span class="dot"></span>
                <span>${htmlEscape(copy.imageCount(entry.images.length))}</span>
              </div>
              ${metaTags ? `<div class="image-tags">${metaTags}</div>` : ""}
            </div>
            ${adminMode ? `<div class="admin-detail-actions"><a class="button secondary" href="/admin">${htmlEscape(lang === "zh" ? "返回后台" : "Back to admin")}</a></div>` : ""}
          </article>
          <aside class="panel">
            <div class="section">
              <div class="actions icon-row" style="margin-top:0; justify-content: space-between; align-items: center;">
                <h2 style="margin:0;">${htmlEscape(copy.prompt)}</h2>
                <div class="actions icon-row" style="margin:0; align-items:center;">
                  ${canEdit ? `<button class="icon-action buttonless danger" type="button" data-admin-delete aria-label="${htmlEscape(copy.deletePrompt)}">${iconTrash()}</button>` : ""}
                  ${canEdit ? `<button class="icon-action buttonless" type="button" data-admin-edit aria-label="${htmlEscape(copy.edit)}">${iconEdit()}</button>` : ""}
                  <button class="icon-action" type="button" data-copy-prompt aria-label="${htmlEscape(copy.copyPrompt)}">${iconCopy()}</button>
                </div>
              </div>
              <pre class="prompt" id="promptText">${htmlEscape(entry.prompt)}</pre>
            </div>
            <div class="section">
              <h2>${htmlEscape(copy.note)}</h2>
              <div class="remark">${note ? htmlEscape(note) : htmlEscape(copy.noNote)}</div>
            </div>
          </aside>
        </section>
      </main>
      <div class="modal" data-image-modal hidden>
        <div class="modal-card" role="dialog" aria-modal="true" aria-label="${htmlEscape(copy.viewOriginal)}">
          <button class="modal-close" type="button" data-close-modal aria-label="${htmlEscape(copy.close)}">${iconClose()}</button>
          <img class="modal-image" data-modal-image src="${htmlEscape(currentImage?.url || entry.coverImageUrl)}" alt="${attrEscape(entry.title)}" />
        </div>
      </div>
      ${adminMode || canEdit ? renderDeleteModal(copy, lang) : ""}
    `,
    script: `
      const mainImage = document.getElementById('mainImage');
      const modal = document.querySelector('[data-image-modal]');
      const modalImage = document.querySelector('[data-modal-image]');
      const openOriginalButton = document.querySelector('[data-open-original]');
      const closeModalButton = document.querySelector('[data-close-modal]');
      const prevImageButton = document.querySelector('[data-prev-image]');
      const nextImageButton = document.querySelector('[data-next-image]');
      const downloadImageButton = document.querySelector('[data-download-image]');
      const adminEditButton = document.querySelector('[data-admin-edit]');
      const adminDeleteButton = document.querySelector('[data-admin-delete]');
      const deleteModal = document.querySelector('[data-delete-modal]');
      const deleteModalTitle = document.querySelector('[data-delete-modal-entry-title]');
      const deleteModalInput = document.querySelector('[data-delete-modal-input]');
      const deleteModalSubmit = document.querySelector('[data-delete-modal-submit]');
      const deleteModalStatus = document.querySelector('[data-delete-modal-status]');
      const deleteModalHint = document.querySelector('[data-delete-modal-hint]');
      const deleteModalCopyTitle = document.querySelector('[data-delete-copy-title]');
      const deleteModalCloseButtons = document.querySelectorAll('[data-delete-modal-close]');
      const detailImages = ${JSON.stringify(visibleImages)};
      let currentImageIndex = ${currentImageIndex};
      const adminEditUrl = ${canEdit ? JSON.stringify(`/admin?edit=${encodeURIComponent(entry.id)}`) : 'null'};
      const deleteTarget = ${canEdit ? JSON.stringify({ id: entry.id, title: entry.title }) : 'null'};

      const deleteConfirmText = ${JSON.stringify(lang === "zh" ? "输入完整标题后才能删除。" : "Type the full title to enable delete.")};

      const clampIndex = (value) => {
        if (!detailImages.length) return 0;
        return Math.min(Math.max(Number(value) || 0, 0), detailImages.length - 1);
      };

      const syncCurrentImage = () => {
        currentImageIndex = clampIndex(currentImageIndex);
        const currentImage = detailImages[currentImageIndex] || detailImages[0];
        if (!currentImage || !mainImage) return;
        mainImage.src = currentImage.url;
        if (downloadImageButton instanceof HTMLAnchorElement) {
          downloadImageButton.href = currentImage.url;
        }
        if (modalImage instanceof HTMLImageElement) {
          modalImage.src = currentImage.url;
        }
        const url = new URL(window.location.href);
        url.searchParams.set('image', String(currentImageIndex));
        window.history.replaceState({}, '', url);
      };

      const openModal = () => {
        if (!modal || !modalImage || !mainImage) return;
        modalImage.src = mainImage.src;
        modal.hidden = false;
      };

      const closeModal = () => {
        if (!modal) return;
        modal.hidden = true;
      };

      const syncDeleteState = () => {
        if (!(deleteModalSubmit instanceof HTMLButtonElement) || !(deleteModalInput instanceof HTMLInputElement) || !deleteTarget) return;
        const matches = deleteModalInput.value.trim() === deleteTarget.title;
        deleteModalSubmit.disabled = !matches;
        if (deleteModalStatus instanceof HTMLElement) {
          deleteModalStatus.textContent = matches ? '' : '';
        }
      };

      const openDeleteModal = () => {
        if (!deleteModal || !(deleteModalInput instanceof HTMLInputElement) || !(deleteModalTitle instanceof HTMLElement) || !deleteTarget) return;
        deleteModalTitle.textContent = deleteTarget.title;
        deleteModalInput.value = '';
        if (deleteModalHint instanceof HTMLElement) {
          deleteModalHint.textContent = deleteConfirmText;
        }
        if (deleteModalStatus instanceof HTMLElement) {
          deleteModalStatus.textContent = '';
        }
        if (deleteModalSubmit instanceof HTMLButtonElement) {
          deleteModalSubmit.disabled = true;
        }
        deleteModal.hidden = false;
        window.setTimeout(() => deleteModalInput.focus(), 0);
      };

      const closeDeleteModal = () => {
        if (!deleteModal) return;
        deleteModal.hidden = true;
        if (deleteModalInput instanceof HTMLInputElement) {
          deleteModalInput.value = '';
        }
        if (deleteModalStatus instanceof HTMLElement) {
          deleteModalStatus.textContent = '';
        }
        if (deleteModalSubmit instanceof HTMLButtonElement) {
          deleteModalSubmit.disabled = true;
        }
      };

      const deletePrompt = async () => {
        if (!deleteTarget || !(deleteModalSubmit instanceof HTMLButtonElement)) return;
        deleteModalSubmit.disabled = true;
        if (deleteModalStatus instanceof HTMLElement) {
          deleteModalStatus.textContent = ${JSON.stringify(lang === "zh" ? "正在删除..." : "Deleting...")};
        }
        try {
          const response = await fetch('/api/admin/entries/' + encodeURIComponent(deleteTarget.id), { method: 'DELETE' });
          const payload = await response.json().catch(() => ({}));
          if (!response.ok) {
            throw new Error(payload.error || ${JSON.stringify(lang === "zh" ? "删除失败" : "Delete failed")});
          }
          window.location.href = '/admin';
        } catch (error) {
          if (deleteModalStatus instanceof HTMLElement) {
            deleteModalStatus.textContent = error instanceof Error ? error.message : ${JSON.stringify(lang === "zh" ? "删除失败" : "Delete failed.")};
          }
          if (deleteModalSubmit instanceof HTMLButtonElement && deleteModalInput instanceof HTMLInputElement) {
            deleteModalSubmit.disabled = deleteModalInput.value.trim() !== deleteTarget.title;
          }
        }
      };

      openOriginalButton?.addEventListener('click', openModal);
      prevImageButton?.addEventListener('click', () => {
        if (detailImages.length < 2) return;
        currentImageIndex = (currentImageIndex - 1 + detailImages.length) % detailImages.length;
        syncCurrentImage();
      });
      nextImageButton?.addEventListener('click', () => {
        if (detailImages.length < 2) return;
        currentImageIndex = (currentImageIndex + 1) % detailImages.length;
        syncCurrentImage();
      });
      adminEditButton?.addEventListener('click', () => {
        if (adminEditUrl) window.location.href = adminEditUrl + '&image=' + currentImageIndex;
      });
      adminDeleteButton?.addEventListener('click', openDeleteModal);
      closeModalButton?.addEventListener('click', closeModal);
      deleteModalCloseButtons.forEach((button) => button.addEventListener('click', closeDeleteModal));
      deleteModalInput?.addEventListener('input', syncDeleteState);
      deleteModalCopyTitle?.addEventListener('click', async () => {
        if (deleteTarget) {
          await navigator.clipboard.writeText(deleteTarget.title);
        }
      });
      deleteModalSubmit?.addEventListener('click', deletePrompt);
      modal?.addEventListener('click', (event) => {
        if (event.target === modal) closeModal();
      });
      deleteModal?.addEventListener('click', (event) => {
        if (event.target === deleteModal) closeDeleteModal();
      });
      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') closeModal();
      });
      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') closeDeleteModal();
      });
      syncCurrentImage();
      const promptText = document.getElementById('promptText');
      document.querySelector('[data-copy-prompt]')?.addEventListener('click', async () => {
        await navigator.clipboard.writeText(promptText?.textContent || ${JSON.stringify(entry.prompt)});
      });
    `,
  });
}

function renderAdminComposePage(request: Request, lang: Lang, theme: Theme, categories: string[]): string {
  const copy = ui(lang);
  const createdLabel = lang === "zh" ? "已创建。" : "Created.";
  const uploadLabel = lang === "zh" ? "上传图片" : "Upload images";
  const dropHint = lang === "zh" ? "拖拽图片到这里，或者点击上传。" : "Drag images here or click upload.";
  const emptyCanvasLabel = lang === "zh" ? "还没有图片" : "No image yet";
  const categoryOptions = [...DEFAULT_CATEGORIES, ...categories]
    .filter((value, index, array) => array.indexOf(value) === index)
    .map((value) => `<option value="${attrEscape(value)}">${htmlEscape(categoryLabel(lang, value))}</option>`)
    .join("");

  return renderPage({
    title: `${SITE_TITLE} · Admin`,
    lang,
    theme,
    body: `
      ${renderTopBar("admin", lang, theme, SITE_TITLE, copy.subtitle)}
      <main class="shell">
        <form id="entryForm" class="admin-layout" enctype="multipart/form-data">
          <input type="hidden" name="id" id="entryId" />
          <input type="hidden" name="remove_image_keys" id="removedImageKeys" />
          <section class="admin-compose-detail">
            <div class="admin-compose-main">
              <article class="viewer admin-canvas" data-dropzone>
                <button class="icon-action buttonless viewer-nav viewer-nav-prev" type="button" id="canvasPrevButton" hidden aria-label="${htmlEscape(lang === "zh" ? "上一张图片" : "Previous image")}">${iconChevronLeft()}</button>
                <button class="icon-action buttonless viewer-nav viewer-nav-next" type="button" id="canvasNextButton" hidden aria-label="${htmlEscape(lang === "zh" ? "下一张图片" : "Next image")}">${iconChevronRight()}</button>
                <img id="canvasPreviewImage" class="main-image" alt="" hidden />
                <div class="admin-canvas-actions">
                  <button class="icon-action buttonless" type="button" id="uploadTrigger" aria-label="${htmlEscape(uploadLabel)}">${iconUpload()}</button>
                  <a class="icon-action buttonless" id="downloadCurrentImageButton" hidden aria-label="${htmlEscape(copy.download)}" download>${iconDownload()}</a>
                  <button class="icon-action buttonless" type="button" id="clearImagesButton" aria-label="${htmlEscape(copy.clear)}">${iconClose()}</button>
                </div>
                <div class="admin-drop-empty" id="canvasEmptyState">
                  <p>${htmlEscape(dropHint)}</p>
                </div>
                <input id="imagesField" type="file" accept="image/*" multiple hidden />
                <div class="chip" id="canvasCountBadge" hidden></div>
              </article>
              <div class="admin-meta-grid">
                <label>${htmlEscape(copy.title)}
                  <input class="input" name="title" id="titleField" maxlength="120" placeholder="${htmlEscape(lang === "zh" ? "尽量短，一行即可" : "Short, one-line title")}" required />
                </label>
                <label>${htmlEscape(copy.category)}
                  <select class="select" name="category" id="categoryField" required>
                    ${categoryOptions}
                  </select>
                </label>
                <label>${htmlEscape(copy.tags)}
                  <input class="input" name="tags" id="tagsField" placeholder="${htmlEscape(lang === "zh" ? "信息图, 蓝色, 数学" : "infographic, blue, math")}" />
                </label>
              </div>
            </div>
          <aside class="panel admin-panel">
            <div class="admin-panel-heading">
              <h1>${htmlEscape(copy.addPrompt)}</h1>
            </div>
            <p class="helper">${htmlEscape(lang === "zh" ? "左侧是画布和基础信息，右侧填写提示词和备注。拖拽图片到左边，或者点击上传。" : "The left side is the canvas and basic info. Fill prompt and notes on the right. Drag images to the left or click upload.")}</p>
            <div class="stack">
              <label>${htmlEscape(copy.prompt)}
                <textarea class="textarea" name="prompt" id="promptField" placeholder="${htmlEscape(lang === "zh" ? "把完整提示词粘贴到这里" : "Paste the full prompt here")}" required></textarea>
              </label>
              <label class="note-field">${htmlEscape(copy.note)}
                <textarea class="textarea" name="note" id="noteField" placeholder="${htmlEscape(copy.notePlaceholder)}"></textarea>
              </label>
              <label style="display:flex;align-items:center;gap:10px;flex-direction:row;">
                <input type="checkbox" name="is_public" id="publicField" checked />
                <span>${htmlEscape(copy.allowPublic)}</span>
              </label>
              <div class="row one">
                <button class="button" id="submitButton" type="submit">${htmlEscape(copy.publish)}</button>
              </div>
              <div id="formStatus" class="status"></div>
            </div>
          </aside>
          </section>
        </form>
      </main>
    `,
    script: `
      const form = document.getElementById('entryForm');
      const status = document.getElementById('formStatus');
      const submitButton = document.getElementById('submitButton');
      const titleField = document.getElementById('titleField');
      const categoryField = document.getElementById('categoryField');
      const tagsField = document.getElementById('tagsField');
      const promptField = document.getElementById('promptField');
      const noteField = document.getElementById('noteField');
      const publicField = document.getElementById('publicField');
      const entryIdField = document.getElementById('entryId');
      const removedImageKeysField = document.getElementById('removedImageKeys');
      const deleteEntryButton = document.getElementById('deleteEntryButton');
      const deleteModal = document.querySelector('[data-delete-modal]');
      const deleteModalTitle = document.querySelector('[data-delete-modal-entry-title]');
      const deleteModalInput = document.querySelector('[data-delete-modal-input]');
      const deleteModalSubmit = document.querySelector('[data-delete-modal-submit]');
      const deleteModalStatus = document.querySelector('[data-delete-modal-status]');
      const deleteModalHint = document.querySelector('[data-delete-modal-hint]');
      const deleteModalCopyTitle = document.querySelector('[data-delete-copy-title]');
      const deleteModalCloseButtons = document.querySelectorAll('[data-delete-modal-close]');
      const imagesField = document.getElementById('imagesField');
      const canvasPreviewImage = document.getElementById('canvasPreviewImage');
      const canvasEmptyState = document.getElementById('canvasEmptyState');
      const canvasCountBadge = document.getElementById('canvasCountBadge');
      const uploadTrigger = document.getElementById('uploadTrigger');
      const downloadCurrentImageButton = document.getElementById('downloadCurrentImageButton');
      const clearImagesButton = document.getElementById('clearImagesButton');
      const canvasPrevButton = document.getElementById('canvasPrevButton');
      const canvasNextButton = document.getElementById('canvasNextButton');
      const dropzone = document.querySelector('[data-dropzone]');
      let selectedEntryId = '';
      let selectedEntryDetail = null;
      let selectedFiles = [];
      let selectedFileIndex = 0;
      let removalStaged = false;
      let removedImageKeys = [];
      let previewObjectUrl = '';
      let currentImageIndex = Number(new URLSearchParams(window.location.search).get('image') || 0);
      let deleteTarget = null;

      function setCanvasBadge(text) {
        if (!(canvasCountBadge instanceof HTMLElement)) return;
        canvasCountBadge.textContent = text;
        canvasCountBadge.hidden = !text;
      }

      function updateClearButton() {
        if (!(clearImagesButton instanceof HTMLButtonElement)) return;
        const shouldRestore = selectedEntryDetail && removalStaged && getVisibleEntryImages().length === 0;
        clearImagesButton.innerHTML = shouldRestore ? ${JSON.stringify(iconRestore())} : ${JSON.stringify(iconClose())};
        clearImagesButton.setAttribute(
          'aria-label',
          shouldRestore
            ? ${JSON.stringify(lang === "zh" ? "恢复图片" : "Restore image")}
            : ${JSON.stringify(lang === "zh" ? "删除当前图片" : "Delete current image")},
        );
        clearImagesButton.title = shouldRestore
          ? ${JSON.stringify(lang === "zh" ? "恢复图片" : "Restore image")}
          : ${JSON.stringify(lang === "zh" ? "删除当前图片" : "Delete current image")};
      }

      function updateDeleteEntryButton() {
        if (!(deleteEntryButton instanceof HTMLButtonElement)) return;
        deleteEntryButton.hidden = !selectedEntryDetail;
        deleteEntryButton.innerHTML = ${JSON.stringify(iconTrash())};
        deleteEntryButton.setAttribute('aria-label', ${JSON.stringify(lang === "zh" ? "删除提示词" : "Delete prompt")});
        deleteEntryButton.title = ${JSON.stringify(lang === "zh" ? "删除提示词" : "Delete prompt")};
      }

      function getSelectedImages() {
        if (!selectedEntryDetail) return [];
        const images = [
          { key: selectedEntryDetail.coverImageKey, id: selectedEntryDetail.id + '-cover', url: selectedEntryDetail.coverImageUrl, sortOrder: 0 },
        ];
        for (const image of selectedEntryDetail.images || []) {
          if (images.some((item) => item.key === image.key || item.url === image.url)) continue;
          images.push(image);
          if (images.length >= ${MAX_IMAGES_PER_ENTRY}) break;
        }
        return images.slice(0, ${MAX_IMAGES_PER_ENTRY});
      }

      function getVisibleEntryImages() {
        const images = getSelectedImages();
        if (!selectedEntryDetail || !removalStaged) {
          return images;
        }
        return images.filter((image) => !removedImageKeys.includes(image.key));
      }

      function clampImageIndex(index, length) {
        if (!length) return 0;
        return Math.min(Math.max(Number(index) || 0, 0), length - 1);
      }

      function updateCanvasNavigation() {
        const images = getVisibleEntryImages();
        const canNavigate = ((selectedFiles.length > 1) || (images.length > 1 && selectedFiles.length === 0));
        if (canvasPrevButton instanceof HTMLButtonElement) {
          canvasPrevButton.hidden = !canNavigate || (selectedEntryDetail && removalStaged && images.length === 0);
        }
        if (canvasNextButton instanceof HTMLButtonElement) {
          canvasNextButton.hidden = !canNavigate || (selectedEntryDetail && removalStaged && images.length === 0);
        }
        if (downloadCurrentImageButton instanceof HTMLAnchorElement) {
          const currentImage = selectedFiles.length > 0
            ? previewObjectUrl
            : (images[currentImageIndex]?.url || images[0]?.url || '');
          const canDownload = Boolean(currentImage);
          downloadCurrentImageButton.hidden = !canDownload;
          if (canDownload) {
            downloadCurrentImageButton.href = currentImage;
          }
        }
      }

      function renderSelectedFilePreview(index) {
        if (!selectedFiles.length) return;
        selectedFileIndex = clampImageIndex(index, selectedFiles.length);
        revokePreviewObjectUrl();
        previewObjectUrl = URL.createObjectURL(selectedFiles[selectedFileIndex]);
        if (canvasPreviewImage instanceof HTMLImageElement) {
          canvasPreviewImage.src = previewObjectUrl;
          canvasPreviewImage.alt = selectedFiles[selectedFileIndex].name || ${JSON.stringify(emptyCanvasLabel)};
          canvasPreviewImage.hidden = false;
        }
        if (canvasEmptyState instanceof HTMLElement) {
          canvasEmptyState.hidden = true;
        }
        updateCanvasNavigation();
        updateCanvasHint();
      }

      function syncCanvasImage() {
        const images = getVisibleEntryImages();
        if (!images.length) {
          setBlankCanvas();
          updateCanvasNavigation();
          return;
        }
        currentImageIndex = clampImageIndex(currentImageIndex, images.length);
        const image = images[currentImageIndex] || images[0];
        if (canvasPreviewImage instanceof HTMLImageElement) {
          canvasPreviewImage.src = image.url;
          canvasPreviewImage.alt = selectedEntryDetail?.title || ${JSON.stringify(emptyCanvasLabel)};
          canvasPreviewImage.hidden = false;
        }
        if (canvasEmptyState instanceof HTMLElement) {
          canvasEmptyState.hidden = true;
        }
        updateCanvasNavigation();
      }

      function revokePreviewObjectUrl() {
        if (previewObjectUrl) {
          URL.revokeObjectURL(previewObjectUrl);
          previewObjectUrl = '';
        }
      }

      function setBlankCanvas() {
        revokePreviewObjectUrl();
        selectedFileIndex = 0;
        if (canvasPreviewImage instanceof HTMLImageElement) {
          canvasPreviewImage.removeAttribute('src');
          canvasPreviewImage.alt = '';
          canvasPreviewImage.hidden = true;
        }
        if (canvasEmptyState instanceof HTMLElement) {
          canvasEmptyState.hidden = false;
        }
        setCanvasBadge('');
        if (dropzone instanceof HTMLElement) {
          dropzone.classList.remove('dragover');
        }
        updateCanvasNavigation();
      }

      function updateCanvasHint() {
        if (selectedFiles.length > 0) {
          if (selectedEntryDetail && removalStaged) {
            setCanvasBadge(${JSON.stringify(lang === "zh" ? "已标记删除 · 另有" : "Marked for deletion ·")} + ' ' + selectedFiles.length + ' ${lang === "zh" ? "张新图" : "new images"}');
          } else {
            setCanvasBadge(selectedFiles.length + ' ${lang === "zh" ? "张图" : "images"}');
          }
          return;
        }
        if (selectedEntryDetail && removalStaged) {
          const visibleImages = getVisibleEntryImages();
          if (visibleImages.length > 0) {
            setCanvasBadge(visibleImages.length + ' ${lang === "zh" ? "张图" : "images"} · ' + ${JSON.stringify(lang === "zh" ? "可继续删除当前图" : "You can keep deleting the current image.")});
          } else {
            setCanvasBadge(${JSON.stringify(lang === "zh" ? "已删除全部图片 · 点击恢复" : "All images removed · Click restore.")});
          }
          return;
        }
        if (selectedEntryDetail) {
          setCanvasBadge((getVisibleEntryImages().length || 1) + ' ${lang === "zh" ? "张图" : "images"}');
          return;
        }
        setCanvasBadge('');
      }

      function ensureCategoryOption(value) {
        if (!(categoryField instanceof HTMLSelectElement) || !value) return;
        const currentValue = value.trim();
        const exists = Array.from(categoryField.options).some((option) => option.value === currentValue);
        if (!exists) {
          const option = document.createElement('option');
          option.value = currentValue;
          option.textContent = currentValue;
          categoryField.appendChild(option);
        }
        categoryField.value = currentValue;
      }

      function syncRemovedImageKeysField() {
        if (removedImageKeysField instanceof HTMLInputElement) {
          removedImageKeysField.value = removedImageKeys.join(',');
        }
      }

      function setRemovedImageKeys(keys) {
        removedImageKeys = Array.from(new Set((keys || []).map((key) => key.trim()).filter(Boolean)));
        removalStaged = removedImageKeys.length > 0;
        syncRemovedImageKeysField();
      }

      function addRemovedImageKey(key) {
        const nextKey = String(key || '').trim();
        if (!nextKey || removedImageKeys.includes(nextKey)) return;
        setRemovedImageKeys([...removedImageKeys, nextKey]);
      }

      function clearRemovedImageKeys() {
        setRemovedImageKeys([]);
      }

      function getRemovedImageKeys() {
        return [...removedImageKeys];
      }

      function syncDeleteState() {
        if (!(deleteModalSubmit instanceof HTMLButtonElement) || !(deleteModalInput instanceof HTMLInputElement) || !deleteTarget) return;
        deleteModalSubmit.disabled = deleteModalInput.value.trim() !== deleteTarget.title;
      }

      function openDeleteModal() {
        if (!deleteModal || !(deleteModalInput instanceof HTMLInputElement) || !(deleteModalTitle instanceof HTMLElement) || !selectedEntryDetail) return;
        deleteTarget = { id: selectedEntryDetail.id, title: selectedEntryDetail.title };
        deleteModalTitle.textContent = deleteTarget.title;
        if (deleteModalHint instanceof HTMLElement) {
          deleteModalHint.textContent = ${JSON.stringify(lang === "zh" ? "输入完整标题后才能删除。" : "Type the full title to enable delete.")};
        }
        if (deleteModalStatus instanceof HTMLElement) {
          deleteModalStatus.textContent = '';
        }
        deleteModalInput.value = '';
        deleteModal.hidden = false;
        syncDeleteState();
        window.setTimeout(() => deleteModalInput.focus(), 0);
      }

      function closeDeleteModal() {
        if (!deleteModal) return;
        deleteModal.hidden = true;
        deleteTarget = null;
        if (deleteModalInput instanceof HTMLInputElement) {
          deleteModalInput.value = '';
        }
        if (deleteModalStatus instanceof HTMLElement) {
          deleteModalStatus.textContent = '';
        }
        if (deleteModalSubmit instanceof HTMLButtonElement) {
          deleteModalSubmit.disabled = true;
        }
      }

      async function submitDeletePrompt() {
        if (!deleteTarget || !(deleteModalSubmit instanceof HTMLButtonElement)) return;
        const confirmedTitle = deleteModalInput instanceof HTMLInputElement ? deleteModalInput.value.trim() : '';
        if (confirmedTitle !== deleteTarget.title) return;
        deleteModalSubmit.disabled = true;
        if (deleteModalStatus instanceof HTMLElement) {
          deleteModalStatus.textContent = ${JSON.stringify(lang === "zh" ? "正在删除..." : "Deleting...")};
        }
        try {
          const response = await fetch('/api/admin/entries/' + encodeURIComponent(deleteTarget.id), { method: 'DELETE' });
          const payload = await response.json().catch(() => ({}));
          if (!response.ok) {
            throw new Error(payload.error || ${JSON.stringify(lang === "zh" ? "删除失败" : "Delete failed")});
          }
          window.location.href = '/admin';
        } catch (error) {
          if (deleteModalStatus instanceof HTMLElement) {
            deleteModalStatus.textContent = error instanceof Error ? error.message : ${JSON.stringify(lang === "zh" ? "删除失败" : "Delete failed.")};
          }
          syncDeleteState();
        }
      }

      function renderCanvasForCurrentState() {
        if (selectedFiles.length > 0) {
          showSelectedFiles(selectedFiles);
          return;
        }
        if (selectedEntryDetail) {
          if (removalStaged && getVisibleEntryImages().length === 0) {
            setBlankCanvas();
            updateCanvasHint();
            updateClearButton();
          } else {
            showDetailCanvas(selectedEntryDetail);
          }
          return;
        }
        setBlankCanvas();
        updateCanvasHint();
      }

      function showDetailCanvas(detail) {
        revokePreviewObjectUrl();
        const visibleImages = getVisibleEntryImages();
        if (!visibleImages.length) {
          setBlankCanvas();
          updateCanvasHint();
          updateClearButton();
          return;
        }
        currentImageIndex = clampImageIndex(currentImageIndex, visibleImages.length || 1);
        syncCanvasImage();
        updateCanvasHint();
      }

      function showSelectedFiles(files) {
        const nextFiles = Array.from(files || []);
        const activeCount = selectedEntryDetail ? getVisibleEntryImages().length : 0;
        const remainingSlots = ${MAX_IMAGES_PER_ENTRY} - activeCount - selectedFiles.length;
        if (nextFiles.length > remainingSlots) {
          imagesField.value = '';
          status.textContent = ${JSON.stringify(lang === "zh" ? "最多只能保留 2 张图片。请先删除一张再添加。" : "You can keep at most 2 images. Delete one first, then add another.")};
          renderCanvasForCurrentState();
          updateCanvasHint();
          return;
        }
        const previousLength = selectedFiles.length;
        selectedFiles = [...selectedFiles, ...nextFiles];
        selectedFileIndex = previousLength;
        imagesField.value = '';
        revokePreviewObjectUrl();
        if (!selectedFiles.length) {
          if (selectedEntryDetail) {
            syncCanvasImage();
          } else {
            setBlankCanvas();
          }
          return;
        }
        renderSelectedFilePreview(selectedFileIndex);
      }

      function resetToCurrentEntry() {
        selectedFiles = [];
        selectedFileIndex = 0;
        imagesField.value = '';
        clearRemovedImageKeys();
        updateClearButton();
        updateDeleteEntryButton();
        if (selectedEntryDetail) {
          entryIdField.value = selectedEntryDetail.id;
          titleField.value = selectedEntryDetail.title;
          ensureCategoryOption(selectedEntryDetail.category);
          tagsField.value = (selectedEntryDetail.tags || []).join(', ');
          promptField.value = selectedEntryDetail.prompt;
          noteField.value = selectedEntryDetail.note || '';
          publicField.checked = Boolean(selectedEntryDetail.isPublic);
          submitButton.textContent = ${JSON.stringify(copy.saveChanges)};
          status.textContent = ${JSON.stringify(copy.editing)} + ' ' + selectedEntryDetail.title;
          showDetailCanvas(selectedEntryDetail);
        } else {
          form.reset();
          entryIdField.value = '';
          submitButton.textContent = ${JSON.stringify(copy.publish)};
          status.textContent = '';
          publicField.checked = true;
          selectedEntryId = '';
          setBlankCanvas();
        }
      }

      async function loadEntryForEdit(entryId) {
        const response = await fetch('/api/entries/' + encodeURIComponent(entryId) + '?admin=1');
        if (!response.ok) {
          status.textContent = ${JSON.stringify(lang === "zh" ? "条目不存在。" : "Entry not found.")};
          selectedEntryId = '';
          selectedEntryDetail = null;
          resetToCurrentEntry();
          return;
        }
        const detail = await response.json();
        selectedEntryId = detail.id;
        selectedEntryDetail = detail;
        entryIdField.value = detail.id;
        clearRemovedImageKeys();
        updateClearButton();
        updateDeleteEntryButton();
        currentImageIndex = clampImageIndex(currentImageIndex, getSelectedImages().length || 1);
        selectedFileIndex = 0;
        titleField.value = detail.title;
        ensureCategoryOption(detail.category);
        tagsField.value = (detail.tags || []).join(', ');
        promptField.value = detail.prompt;
        noteField.value = detail.note || '';
        publicField.checked = Boolean(detail.isPublic);
        submitButton.textContent = ${JSON.stringify(copy.saveChanges)};
        status.textContent = ${JSON.stringify(copy.editing)} + ' ' + detail.title;
        selectedFiles = [];
        imagesField.value = '';
        showDetailCanvas(detail);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }

      const editId = new URLSearchParams(window.location.search).get('edit');
      if (editId) {
        loadEntryForEdit(editId);
      } else {
        resetToCurrentEntry();
      }

      uploadTrigger?.addEventListener('click', () => {
        imagesField?.click();
      });
      canvasPrevButton?.addEventListener('click', () => {
        if (selectedFiles.length > 1) {
          renderSelectedFilePreview(selectedFileIndex - 1);
          return;
        }
        const images = getSelectedImages();
        if (images.length < 2 || selectedFiles.length > 0) return;
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        syncCanvasImage();
        updateCanvasHint();
      });
      canvasNextButton?.addEventListener('click', () => {
        if (selectedFiles.length > 1) {
          renderSelectedFilePreview(selectedFileIndex + 1);
          return;
        }
        const images = getSelectedImages();
        if (images.length < 2 || selectedFiles.length > 0) return;
        currentImageIndex = (currentImageIndex + 1) % images.length;
        syncCanvasImage();
        updateCanvasHint();
      });
      clearImagesButton?.addEventListener('click', () => {
        if (selectedFiles.length > 0) {
          selectedFiles = [];
          selectedFileIndex = 0;
          imagesField.value = '';
          updateCanvasHint();
          renderCanvasForCurrentState();
          return;
        }
        if (selectedEntryDetail) {
          const visibleImages = getVisibleEntryImages();
          const shouldRestore = removalStaged && visibleImages.length === 0;
          if (shouldRestore) {
            clearRemovedImageKeys();
            updateClearButton();
            showDetailCanvas(selectedEntryDetail);
          } else {
            const currentImage = visibleImages[currentImageIndex] || visibleImages[0] || getSelectedImages()[currentImageIndex] || getSelectedImages()[0];
            addRemovedImageKey(currentImage?.key || selectedEntryDetail.coverImageKey || '');
            updateClearButton();
            currentImageIndex = clampImageIndex(currentImageIndex, getVisibleEntryImages().length || 1);
            showDetailCanvas(selectedEntryDetail);
          }
          return;
        }
        setBlankCanvas();
      });

      deleteEntryButton?.addEventListener('click', openDeleteModal);
      deleteModalInput?.addEventListener('input', syncDeleteState);
      deleteModalCopyTitle?.addEventListener('click', async () => {
        if (selectedEntryDetail) {
          await navigator.clipboard.writeText(selectedEntryDetail.title);
        }
      });
      deleteModalSubmit?.addEventListener('click', submitDeletePrompt);
      deleteModalCloseButtons.forEach((button) => button.addEventListener('click', closeDeleteModal));
      deleteModal?.addEventListener('click', (event) => {
        if (event.target === deleteModal) closeDeleteModal();
      });
      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') closeDeleteModal();
      });

      imagesField?.addEventListener('change', () => {
        showSelectedFiles(imagesField.files ? Array.from(imagesField.files) : []);
      });
      dropzone?.addEventListener('dragover', (event) => {
        event.preventDefault();
        if (dropzone instanceof HTMLElement) {
          dropzone.classList.add('dragover');
        }
      });
      dropzone?.addEventListener('dragleave', () => {
        if (dropzone instanceof HTMLElement) {
          dropzone.classList.remove('dragover');
        }
      });
      dropzone?.addEventListener('drop', (event) => {
        event.preventDefault();
        if (dropzone instanceof HTMLElement) {
          dropzone.classList.remove('dragover');
        }
        const files = event.dataTransfer?.files ? Array.from(event.dataTransfer.files) : [];
        showSelectedFiles(files);
      });

      form.addEventListener('submit', async (event) => {
        event.preventDefault();
        status.textContent = ${JSON.stringify(copy.publishing)} + '...';
        submitButton.disabled = true;
        try {
          const formData = new FormData(form);
          if (!publicField.checked) {
            formData.delete('is_public');
          }
          const removedImageKeyList = getRemovedImageKeys();
          if (removedImageKeyList.length) {
            formData.set('remove_image_keys', removedImageKeyList.join(','));
          } else {
            formData.delete('remove_image_keys');
          }
          formData.delete('images');
          selectedFiles.forEach((file) => {
            formData.append('images', file);
          });
          const response = await fetch('/api/admin/entries', {
            method: 'POST',
            body: formData,
          });
          const payload = await response.json().catch(() => ({}));
          if (!response.ok) {
            throw new Error(payload.error || ${JSON.stringify(lang === "zh" ? "保存失败" : "Save failed")});
          }
          status.textContent = payload.mode === 'update' ? ${JSON.stringify(copy.saved)} : ${JSON.stringify(createdLabel)};
          if (payload.id) {
            window.location.href = '/admin/entry/' + encodeURIComponent(payload.id);
          }
        } catch (error) {
          status.textContent = error instanceof Error ? error.message : ${JSON.stringify(lang === "zh" ? "保存失败" : "Save failed.")};
        } finally {
          submitButton.disabled = false;
        }
      });

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
  const removeImageKeys = [
    ...getFormText(form, "remove_image_keys").split(","),
    ...getFormText(form, "remove_image_key").split(","),
  ]
    .map((value) => value.trim())
    .filter(Boolean);
  const title = getFormText(form, "title");
  const prompt = getFormText(form, "prompt");
  const note = getFormText(form, "note");
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

  if (files.length > MAX_IMAGES_PER_ENTRY) {
    return Response.json({ error: `At most ${MAX_IMAGES_PER_ENTRY} images are allowed.` }, { status: 400 });
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
    if (!entryId) {
      const images = files.length ? await uploadImages(env, id, files, 0) : [];
      uploadedKeys = images.map((image) => image.imageKey);
      const coverKey = images[0]?.imageKey;
      if (!coverKey) {
        return Response.json({ error: "Cover image is required." }, { status: 400 });
      }

      await env.image_prompt_wall_db.batch([
        env.image_prompt_wall_db
          .prepare(
            `
            INSERT INTO entries (
              id, title, prompt, prompt_note, category, tags_json, cover_image_key, created_at, updated_at, is_public
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
          )
          .bind(id, title, prompt, note, category, JSON.stringify(tags), coverKey, now, now, isPublic),
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

    const existingImages = await env.image_prompt_wall_db
      .prepare(
        `
        SELECT id, image_key, sort_order
        FROM entry_images
        WHERE entry_id = ?
        ORDER BY sort_order ASC, created_at ASC
        `,
      )
      .bind(id)
      .all<{ id: string; image_key: string; sort_order: number }>();

    const removeTargets = removeImageKeys.length
      ? existingImages.results.filter((image) => removeImageKeys.includes(image.image_key))
      : [];

    if (removeImageKeys.length && removeTargets.length !== removeImageKeys.length) {
      return Response.json({ error: "Image not found." }, { status: 404 });
    }

    const remainingImages = removeTargets.length
      ? existingImages.results.filter((image) => !removeImageKeys.includes(image.image_key))
      : existingImages.results;

    if (remainingImages.length + files.length > MAX_IMAGES_PER_ENTRY) {
      return Response.json({ error: `At most ${MAX_IMAGES_PER_ENTRY} images are allowed.` }, { status: 400 });
    }

    if (remainingImages.length === 0 && files.length === 0) {
      return Response.json({ error: "At least one image is required." }, { status: 400 });
    }

    const startSortOrder = remainingImages.reduce((max, image) => Math.max(max, Number(image.sort_order)), -1) + 1;
    const images = files.length ? await uploadImages(env, id, files, startSortOrder) : [];
    uploadedKeys = images.map((image) => image.imageKey);

    const coverKey = remainingImages[0]?.image_key || images[0]?.imageKey;

    if (!coverKey) {
      return Response.json({ error: "At least one image is required." }, { status: 400 });
    }

    await env.image_prompt_wall_db
      .batch([
        env.image_prompt_wall_db
          .prepare(
            `
            UPDATE entries
            SET title = ?, prompt = ?, prompt_note = ?, category = ?, tags_json = ?, cover_image_key = ?, is_public = ?, updated_at = ?
            WHERE id = ?
            `,
          )
          .bind(title, prompt, note, category, JSON.stringify(tags), coverKey, isPublic, now, id),
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
        ...removeTargets.map((image) =>
          env.image_prompt_wall_db
            .prepare("DELETE FROM entry_images WHERE entry_id = ? AND image_key = ?")
            .bind(id, image.image_key),
        ),
      ]);

    if (removeTargets.length) {
      await deleteEntryImages(env, removeTargets.map((image) => image.image_key));
    }

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
      const lang = getLang(request);
      const theme = getTheme(request);

      if (pathname === "/") {
        const q = (url.searchParams.get("q") || "").trim();
        const category = (url.searchParams.get("category") || "all").trim() || "all";
        const [entries, categories] = await Promise.all([
          loadEntries(env, request, { q: q || undefined, category: category || undefined }),
          getCategories(env),
        ]);
        return new Response(renderHomePage(request, lang, theme, entries, categories, q, category), {
          headers: { "content-type": "text/html; charset=utf-8" },
        });
      }

      if (pathname.startsWith("/admin/entry/")) {
        const id = decodeURIComponent(pathname.slice("/admin/entry/".length).replace(/\/$/, ""));
        const image = Number(url.searchParams.get("image") || 0);
        const entry = await loadEntryDetail(env, request, id, true);
        if (!entry) return new Response("Not found", { status: 404 });
        return new Response(renderDetailPage(request, lang, theme, entry, true, image), {
          headers: { "content-type": "text/html; charset=utf-8" },
        });
      }

      if (pathname === "/admin" || pathname === "/admin/") {
        const categories = await getCategories(env);
        return new Response(renderAdminComposePage(request, lang, theme, categories), {
          headers: { "content-type": "text/html; charset=utf-8" },
        });
      }

      if (pathname.startsWith("/entry/")) {
        const id = decodeURIComponent(pathname.slice("/entry/".length));
        const image = Number(url.searchParams.get("image") || 0);
        const entry = await loadEntryDetail(env, request, id, false);
        if (!entry) return new Response("Not found", { status: 404 });
        return new Response(renderDetailPage(request, lang, theme, entry, false, image), {
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
