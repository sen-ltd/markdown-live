/**
 * themes.js — CSS theme definitions for the preview pane.
 * Three themes: GitHub, Qiita, Zenn
 */

export const THEMES = {
  github: {
    label: 'GitHub',
    css: `
      .preview-content {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
        font-size: 16px;
        line-height: 1.5;
        color: #24292f;
        background: #ffffff;
        padding: 20px 24px;
        max-width: 800px;
        margin: 0 auto;
      }
      .preview-content h1, .preview-content h2 {
        padding-bottom: 0.3em;
        border-bottom: 1px solid #d0d7de;
        margin-top: 24px;
        margin-bottom: 16px;
        font-weight: 600;
      }
      .preview-content h1 { font-size: 2em; }
      .preview-content h2 { font-size: 1.5em; }
      .preview-content h3 { font-size: 1.25em; margin-top: 24px; margin-bottom: 16px; }
      .preview-content h4, .preview-content h5, .preview-content h6 { margin-top: 24px; margin-bottom: 16px; }
      .preview-content p { margin-top: 0; margin-bottom: 16px; }
      .preview-content a { color: #0969da; text-decoration: none; }
      .preview-content a:hover { text-decoration: underline; }
      .preview-content code {
        background: #f6f8fa;
        border-radius: 6px;
        font-size: 85%;
        padding: 0.2em 0.4em;
        font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
        color: #953800;
      }
      .preview-content pre {
        background: #f6f8fa;
        border-radius: 6px;
        padding: 16px;
        overflow: auto;
        font-size: 85%;
        line-height: 1.45;
        margin-bottom: 16px;
      }
      .preview-content pre code {
        background: transparent;
        border-radius: 0;
        padding: 0;
        color: #24292f;
      }
      .preview-content blockquote {
        margin: 0 0 16px;
        padding: 0 1em;
        color: #57606a;
        border-left: 0.25em solid #d0d7de;
      }
      .preview-content ul, .preview-content ol {
        margin-top: 0;
        margin-bottom: 16px;
        padding-left: 2em;
      }
      .preview-content li + li { margin-top: 4px; }
      .preview-content table {
        border-collapse: collapse;
        width: 100%;
        margin-bottom: 16px;
        display: block;
        overflow: auto;
      }
      .preview-content th, .preview-content td {
        padding: 6px 13px;
        border: 1px solid #d0d7de;
      }
      .preview-content th { font-weight: 600; background: #f6f8fa; }
      .preview-content tr:nth-child(2n) { background: #f6f8fa; }
      .preview-content hr {
        border: none;
        border-top: 2px solid #d0d7de;
        margin: 24px 0;
      }
      .preview-content img { max-width: 100%; height: auto; }
      .preview-content del { color: #57606a; }
    `
  },

  qiita: {
    label: 'Qiita',
    css: `
      .preview-content {
        font-family: "Helvetica Neue", Arial, "Hiragino Kaku Gothic ProN", "Hiragino Sans", Meiryo, sans-serif;
        font-size: 16px;
        line-height: 1.7;
        color: #333;
        background: #fff;
        padding: 24px;
        max-width: 820px;
        margin: 0 auto;
      }
      .preview-content h1 {
        font-size: 1.75em;
        border-bottom: 2px solid #55c500;
        padding-bottom: 4px;
        margin-top: 2em;
        margin-bottom: 1em;
        color: #333;
      }
      .preview-content h2 {
        font-size: 1.4em;
        border-bottom: 1px solid #ddd;
        padding-bottom: 4px;
        margin-top: 2em;
        margin-bottom: 0.8em;
      }
      .preview-content h3 { font-size: 1.2em; margin-top: 1.5em; margin-bottom: 0.6em; }
      .preview-content h4, .preview-content h5, .preview-content h6 { margin-top: 1.2em; margin-bottom: 0.5em; }
      .preview-content p { margin-bottom: 1em; }
      .preview-content a { color: #4078c0; text-decoration: none; }
      .preview-content a:hover { text-decoration: underline; }
      .preview-content code {
        background: #f0f0f0;
        border-radius: 3px;
        font-size: 85%;
        padding: 1px 6px;
        font-family: Consolas, "Courier New", monospace;
        color: #d73a49;
      }
      .preview-content pre {
        background: #1e1e1e;
        border-radius: 4px;
        padding: 16px;
        overflow: auto;
        margin-bottom: 1.2em;
        position: relative;
      }
      .preview-content pre code {
        background: transparent;
        padding: 0;
        color: #d4d4d4;
        font-size: 14px;
        line-height: 1.6;
      }
      .preview-content blockquote {
        border-left: 4px solid #55c500;
        margin: 0 0 1em;
        padding: 4px 16px;
        color: #666;
        background: #f9ffd6;
      }
      .preview-content ul, .preview-content ol {
        margin-bottom: 1em;
        padding-left: 1.8em;
      }
      .preview-content li { margin-bottom: 4px; }
      .preview-content table {
        border-collapse: collapse;
        width: 100%;
        margin-bottom: 1.2em;
      }
      .preview-content th {
        background: #f0f0f0;
        border: 1px solid #ccc;
        padding: 8px 12px;
        font-weight: bold;
      }
      .preview-content td {
        border: 1px solid #ccc;
        padding: 8px 12px;
      }
      .preview-content tr:nth-child(even) { background: #f8f8f8; }
      .preview-content hr {
        border: none;
        border-top: 1px dashed #ccc;
        margin: 2em 0;
      }
      .preview-content img { max-width: 100%; height: auto; border-radius: 4px; }
      .preview-content del { color: #999; }
    `
  },

  zenn: {
    label: 'Zenn',
    css: `
      .preview-content {
        font-family: "Lato", "Noto Sans JP", "Helvetica Neue", Arial, sans-serif;
        font-size: 16px;
        line-height: 1.8;
        color: #1a202c;
        background: #fff;
        padding: 24px 32px;
        max-width: 760px;
        margin: 0 auto;
      }
      .preview-content h1 {
        font-size: 1.8em;
        font-weight: 700;
        border-bottom: 3px solid #3b82f6;
        padding-bottom: 8px;
        margin-top: 2em;
        margin-bottom: 1em;
        color: #1a202c;
      }
      .preview-content h2 {
        font-size: 1.4em;
        font-weight: 700;
        border-left: 4px solid #3b82f6;
        padding-left: 12px;
        margin-top: 2em;
        margin-bottom: 0.8em;
      }
      .preview-content h3 {
        font-size: 1.2em;
        font-weight: 600;
        color: #2d3748;
        margin-top: 1.5em;
        margin-bottom: 0.6em;
      }
      .preview-content h4, .preview-content h5, .preview-content h6 {
        font-weight: 600;
        margin-top: 1.2em;
        margin-bottom: 0.5em;
      }
      .preview-content p { margin-bottom: 1.2em; }
      .preview-content a { color: #3b82f6; text-decoration: none; border-bottom: 1px solid #bfdbfe; }
      .preview-content a:hover { border-bottom-color: #3b82f6; }
      .preview-content code {
        background: #eff6ff;
        border-radius: 4px;
        font-size: 85%;
        padding: 2px 6px;
        font-family: "JetBrains Mono", "Fira Code", Consolas, monospace;
        color: #2563eb;
        border: 1px solid #bfdbfe;
      }
      .preview-content pre {
        background: #1e293b;
        border-radius: 8px;
        padding: 20px;
        overflow: auto;
        margin-bottom: 1.5em;
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      }
      .preview-content pre code {
        background: transparent;
        border: none;
        padding: 0;
        color: #e2e8f0;
        font-size: 14px;
        line-height: 1.7;
      }
      .preview-content blockquote {
        border-left: 4px solid #3b82f6;
        margin: 0 0 1.2em;
        padding: 8px 20px;
        background: #eff6ff;
        border-radius: 0 8px 8px 0;
        color: #374151;
      }
      .preview-content ul { list-style: none; margin-bottom: 1.2em; padding-left: 1.2em; }
      .preview-content ul li::before {
        content: "•";
        color: #3b82f6;
        font-weight: bold;
        display: inline-block;
        width: 1em;
        margin-left: -1em;
      }
      .preview-content ol { margin-bottom: 1.2em; padding-left: 1.8em; }
      .preview-content li { margin-bottom: 4px; }
      .preview-content table {
        border-collapse: collapse;
        width: 100%;
        margin-bottom: 1.5em;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 1px 4px rgba(0,0,0,0.1);
      }
      .preview-content th {
        background: #3b82f6;
        color: white;
        padding: 10px 16px;
        font-weight: 600;
        text-align: left;
      }
      .preview-content td {
        border: 1px solid #e2e8f0;
        padding: 10px 16px;
      }
      .preview-content tr:nth-child(even) { background: #f8fafc; }
      .preview-content hr {
        border: none;
        border-top: 2px solid #e2e8f0;
        margin: 2em 0;
      }
      .preview-content img { max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
      .preview-content del { color: #9ca3af; }
    `
  }
};

export const THEME_NAMES = Object.keys(THEMES);
export const DEFAULT_THEME = 'github';
