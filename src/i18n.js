/**
 * i18n.js — Japanese/English UI translations
 */

export const TRANSLATIONS = {
  ja: {
    appTitle: 'Markdown Live',
    theme: 'テーマ',
    themeGithub: 'GitHub',
    themeQiita: 'Qiita',
    themeZenn: 'Zenn',
    downloadHTML: 'HTML保存',
    copyHTML: 'HTMLコピー',
    clearEditor: 'クリア',
    words: '単語',
    chars: '文字',
    lines: '行',
    editorPlaceholder: 'ここに Markdown を入力...',
    editor: 'エディタ',
    preview: 'プレビュー',
    langToggle: 'EN',
    saved: '保存済',
    copied: 'コピー完了',
    clearConfirm: 'テキストをすべて削除しますか？',
    scrollSync: 'スクロール同期',
  },
  en: {
    appTitle: 'Markdown Live',
    theme: 'Theme',
    themeGithub: 'GitHub',
    themeQiita: 'Qiita',
    themeZenn: 'Zenn',
    downloadHTML: 'Save HTML',
    copyHTML: 'Copy HTML',
    clearEditor: 'Clear',
    words: 'words',
    chars: 'chars',
    lines: 'lines',
    editorPlaceholder: 'Type Markdown here...',
    editor: 'Editor',
    preview: 'Preview',
    langToggle: 'JA',
    saved: 'Saved',
    copied: 'Copied!',
    clearConfirm: 'Clear all text?',
    scrollSync: 'Scroll sync',
  }
};

export const DEFAULT_LANG = 'en';

/**
 * Get translation string.
 * @param {string} lang - 'ja' or 'en'
 * @param {string} key
 * @returns {string}
 */
export function t(lang, key) {
  return (TRANSLATIONS[lang] || TRANSLATIONS.en)[key] || key;
}
