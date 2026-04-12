/**
 * main.js — DOM, events, editor/preview orchestration
 */

import { parseMarkdown } from './markdown.js';
import { THEMES, DEFAULT_THEME } from './themes.js';
import { TRANSLATIONS, DEFAULT_LANG, t } from './i18n.js';

// ── Constants ──────────────────────────────────────────────────────────────

const STORAGE_KEY = 'markdown-live-content';
const STORAGE_THEME = 'markdown-live-theme';
const STORAGE_LANG = 'markdown-live-lang';
const STORAGE_SCROLL_SYNC = 'markdown-live-scroll-sync';

const DEFAULT_CONTENT = `# Welcome to Markdown Live

A live Markdown editor with **GitHub**, **Qiita**, and **Zenn** themes.

## Features

- Live preview as you type
- 3 beautiful themes
- Auto-save to localStorage
- Word count & character count
- Download as HTML

## Markdown Support

### Text Formatting

**Bold text**, *italic text*, ***bold italic***, ~~strikethrough~~

### Code

Inline \`code\` and fenced code blocks:

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}
\`\`\`

### Links & Images

[Visit GitHub](https://github.com) — click to open

### Blockquote

> Markdown is a lightweight markup language with plain-text formatting syntax.

### Lists

- Item one
- Item two
- Item three

1. First
2. Second
3. Third

### Table

| Name     | Language | Stars |
|----------|----------|------:|
| React    | JS       | 220k  |
| Vue      | JS       | 207k  |
| Svelte   | JS       | 76k   |

---

Try switching themes using the selector above!
`;

// ── State ──────────────────────────────────────────────────────────────────

let currentTheme = localStorage.getItem(STORAGE_THEME) || DEFAULT_THEME;
let currentLang = localStorage.getItem(STORAGE_LANG) || DEFAULT_LANG;
let scrollSyncEnabled = localStorage.getItem(STORAGE_SCROLL_SYNC) !== 'false';
let saveTimer = null;
let isSyncing = false;

// ── DOM References ─────────────────────────────────────────────────────────

const editor = document.getElementById('editor');
const previewContent = document.getElementById('preview-content');
const themeStyleTag = document.getElementById('theme-style');
const themeSelect = document.getElementById('theme-select');
const wordCount = document.getElementById('word-count');
const charCount = document.getElementById('char-count');
const lineCount = document.getElementById('line-count');
const saveStatus = document.getElementById('save-status');
const btnDownload = document.getElementById('btn-download');
const btnCopyHTML = document.getElementById('btn-copy-html');
const btnClear = document.getElementById('btn-clear');
const btnLang = document.getElementById('btn-lang');
const scrollSyncToggle = document.getElementById('scroll-sync-toggle');
const editorLabel = document.getElementById('editor-label');
const previewLabel = document.getElementById('preview-label');
const mobileEditorTab = document.getElementById('tab-editor');
const mobilePreviewTab = document.getElementById('tab-preview');
const editorPane = document.getElementById('editor-pane');
const previewPane = document.getElementById('preview-pane');

// ── Render ─────────────────────────────────────────────────────────────────

function renderPreview() {
  const md = editor.value;
  previewContent.innerHTML = parseMarkdown(md);
}

function applyTheme(name) {
  const theme = THEMES[name];
  if (!theme) return;
  themeStyleTag.textContent = theme.css;
  currentTheme = name;
  localStorage.setItem(STORAGE_THEME, name);
  // Update select if needed
  if (themeSelect.value !== name) themeSelect.value = name;
}

function updateStats() {
  const text = editor.value;
  const chars = text.length;
  const lines = text === '' ? 0 : text.split('\n').length;
  const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;

  wordCount.textContent = `${words} ${t(currentLang, 'words')}`;
  charCount.textContent = `${chars} ${t(currentLang, 'chars')}`;
  lineCount.textContent = `${lines} ${t(currentLang, 'lines')}`;
}

// ── Auto-save ──────────────────────────────────────────────────────────────

function scheduleSave() {
  clearTimeout(saveTimer);
  saveStatus.textContent = '';
  saveTimer = setTimeout(() => {
    localStorage.setItem(STORAGE_KEY, editor.value);
    saveStatus.textContent = t(currentLang, 'saved');
    setTimeout(() => { saveStatus.textContent = ''; }, 1500);
  }, 800);
}

// ── Download HTML ──────────────────────────────────────────────────────────

function downloadHTML() {
  const theme = THEMES[currentTheme];
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Markdown Export</title>
<style>
body { margin: 0; padding: 0; background: #f5f5f5; }
${theme.css}
</style>
</head>
<body>
<div class="preview-content">
${previewContent.innerHTML}
</div>
</body>
</html>`;
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'markdown-export.html';
  a.click();
  URL.revokeObjectURL(url);
}

// ── Copy HTML ──────────────────────────────────────────────────────────────

async function copyHTML() {
  try {
    await navigator.clipboard.writeText(previewContent.innerHTML);
    const orig = btnCopyHTML.textContent;
    btnCopyHTML.textContent = t(currentLang, 'copied');
    setTimeout(() => { btnCopyHTML.textContent = orig; }, 1500);
  } catch (e) {
    // Fallback
    const ta = document.createElement('textarea');
    ta.value = previewContent.innerHTML;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  }
}

// ── Scroll Sync ────────────────────────────────────────────────────────────

function syncScrollEditorToPreview() {
  if (!scrollSyncEnabled || isSyncing) return;
  isSyncing = true;
  const ratio = editor.scrollTop / (editor.scrollHeight - editor.clientHeight || 1);
  const preview = previewPane;
  preview.scrollTop = ratio * (preview.scrollHeight - preview.clientHeight);
  requestAnimationFrame(() => { isSyncing = false; });
}

function syncScrollPreviewToEditor() {
  if (!scrollSyncEnabled || isSyncing) return;
  isSyncing = true;
  const preview = previewPane;
  const ratio = preview.scrollTop / (preview.scrollHeight - preview.clientHeight || 1);
  editor.scrollTop = ratio * (editor.scrollHeight - editor.clientHeight);
  requestAnimationFrame(() => { isSyncing = false; });
}

// ── i18n ───────────────────────────────────────────────────────────────────

function applyLang(lang) {
  currentLang = lang;
  localStorage.setItem(STORAGE_LANG, lang);

  btnDownload.textContent = t(lang, 'downloadHTML');
  btnCopyHTML.textContent = t(lang, 'copyHTML');
  btnClear.textContent = t(lang, 'clearEditor');
  btnLang.textContent = t(lang, 'langToggle');
  editor.placeholder = t(lang, 'editorPlaceholder');
  scrollSyncToggle.title = t(lang, 'scrollSync');
  if (editorLabel) editorLabel.textContent = t(lang, 'editor');
  if (previewLabel) previewLabel.textContent = t(lang, 'preview');
  if (mobileEditorTab) mobileEditorTab.textContent = t(lang, 'editor');
  if (mobilePreviewTab) mobilePreviewTab.textContent = t(lang, 'preview');

  updateStats();
}

// ── Mobile tabs ────────────────────────────────────────────────────────────

function switchTab(tab) {
  if (tab === 'editor') {
    mobileEditorTab.classList.add('active');
    mobilePreviewTab.classList.remove('active');
    editorPane.classList.add('active');
    previewPane.classList.remove('active');
  } else {
    mobilePreviewTab.classList.add('active');
    mobileEditorTab.classList.remove('active');
    previewPane.classList.add('active');
    editorPane.classList.remove('active');
  }
}

// ── Resizable divider ──────────────────────────────────────────────────────

function initResizer() {
  const resizer = document.getElementById('resizer');
  const container = document.getElementById('main-split');
  if (!resizer || !container) return;

  let startX = 0;
  let startLeftWidth = 0;

  resizer.addEventListener('mousedown', (e) => {
    startX = e.clientX;
    startLeftWidth = editorPane.getBoundingClientRect().width;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    const onMove = (e) => {
      const dx = e.clientX - startX;
      const containerWidth = container.getBoundingClientRect().width;
      const newLeft = Math.min(Math.max(startLeftWidth + dx, 200), containerWidth - 200);
      const pct = (newLeft / containerWidth * 100).toFixed(2);
      editorPane.style.flex = `0 0 ${pct}%`;
      previewPane.style.flex = `1 1 0`;
    };

    const onUp = () => {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  });
}

// ── Init ───────────────────────────────────────────────────────────────────

function init() {
  // Load saved content
  const saved = localStorage.getItem(STORAGE_KEY);
  editor.value = saved !== null ? saved : DEFAULT_CONTENT;

  // Apply theme
  applyTheme(currentTheme);

  // Apply language
  applyLang(currentLang);

  // Initial render
  renderPreview();
  updateStats();

  // Scroll sync state
  scrollSyncToggle.checked = scrollSyncEnabled;

  // Events
  editor.addEventListener('input', () => {
    renderPreview();
    updateStats();
    scheduleSave();
  });

  themeSelect.addEventListener('change', (e) => {
    applyTheme(e.target.value);
  });

  btnDownload.addEventListener('click', downloadHTML);
  btnCopyHTML.addEventListener('click', copyHTML);

  btnClear.addEventListener('click', () => {
    if (editor.value === '') return;
    if (confirm(t(currentLang, 'clearConfirm'))) {
      editor.value = '';
      renderPreview();
      updateStats();
      scheduleSave();
    }
  });

  btnLang.addEventListener('click', () => {
    applyLang(currentLang === 'ja' ? 'en' : 'ja');
  });

  scrollSyncToggle.addEventListener('change', () => {
    scrollSyncEnabled = scrollSyncToggle.checked;
    localStorage.setItem(STORAGE_SCROLL_SYNC, scrollSyncEnabled);
  });

  editor.addEventListener('scroll', syncScrollEditorToPreview);
  previewPane.addEventListener('scroll', syncScrollPreviewToEditor);

  if (mobileEditorTab) mobileEditorTab.addEventListener('click', () => switchTab('editor'));
  if (mobilePreviewTab) mobilePreviewTab.addEventListener('click', () => switchTab('preview'));

  initResizer();
}

init();
