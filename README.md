# Markdown Live

A zero-dependency Markdown live preview editor with a custom parser and three theme modes — GitHub, Qiita, and Zenn.

**Demo**: [https://sen.ltd/portfolio/markdown-live/](https://sen.ltd/portfolio/markdown-live/)

## Features

- **Split-pane interface** — editor on the left, rendered preview on the right
- **Resizable panes** — drag the divider to adjust the split
- **Live preview** — preview updates on every keystroke
- **Custom Markdown parser** — built from scratch, no external libraries
- **3 themes** — GitHub, Qiita, Zenn (different typography and colors)
- **Auto-save** — content persists in localStorage across sessions
- **Word / character / line count** in the status bar
- **Download as HTML** — export the rendered page with the active theme's CSS
- **Copy HTML** — copy rendered HTML to clipboard
- **Scroll sync** — editor and preview scroll in tandem (toggle on/off)
- **Mobile-friendly** — tab-based layout on narrow screens
- **Japanese/English UI** — switch via the JA/EN button

## Markdown Support

| Feature              | Syntax                         |
|----------------------|--------------------------------|
| ATX Headers          | `# H1` to `###### H6`         |
| Setext Headers       | `Title\n===` / `Title\n---`    |
| Bold                 | `**text**` or `__text__`       |
| Italic               | `*text*` or `_text_`           |
| Bold + Italic        | `***text***`                   |
| Strikethrough        | `~~text~~`                     |
| Inline code          | `` `code` ``                   |
| Fenced code block    | ` ```lang ... ``` `            |
| Indented code block  | 4 spaces or 1 tab              |
| Blockquote           | `> text`                       |
| Unordered list       | `- item` / `* item` / `+ item` |
| Ordered list         | `1. item`                      |
| Table                | Pipe-separated with header     |
| Horizontal rule      | `---` / `***` / `___`          |
| Link                 | `[text](url)`                  |
| Image                | `![alt](src)`                  |

## Getting Started

No build step required.

```bash
# Clone the repository
git clone https://github.com/masaru87/markdown-live.git
cd markdown-live

# Start a local server
npm run serve
# Open http://localhost:8080
```

## Run Tests

```bash
node --test tests/markdown.test.js
```

## Architecture

```
src/
├── main.js       — DOM wiring, events, auto-save, scroll sync
├── markdown.js   — Pure Markdown parser (block + inline)
├── themes.js     — CSS theme definitions (GitHub / Qiita / Zenn)
└── i18n.js       — JA/EN translations
```

The parser (`markdown.js`) is a line-based state machine for block elements (headers, lists, code blocks, tables, blockquotes, paragraphs), with a separate inline pass for emphasis, code, links, and images.

## License

MIT — Copyright (c) 2026 SEN LLC (SEN 合同会社)

<!-- sen-publish:links -->
## Links

- 🌐 Demo: https://sen.ltd/portfolio/markdown-live/
- 📝 dev.to: https://dev.to/sendotltd/writing-a-markdown-parser-from-scratch-with-github-qiita-and-zenn-theme-modes-48g4
<!-- /sen-publish:links -->
