/**
 * markdown.js — Pure Markdown parser (CommonMark-like subset)
 * Zero dependencies. Handles block and inline elements.
 */

/**
 * Escape HTML special characters.
 * @param {string} text
 * @returns {string}
 */
export function escapeHTML(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Parse inline Markdown (bold, italic, code, links, images).
 * @param {string} text
 * @returns {string}
 */
export function parseInline(text) {
  // Images: ![alt](src)
  text = text.replace(/!\[([^\]]*)\]\(([^)]*)\)/g, (_, alt, src) => {
    return `<img src="${escapeHTML(src)}" alt="${escapeHTML(alt)}">`;
  });

  // Links: [text](url)
  text = text.replace(/\[([^\]]+)\]\(([^)]*)\)/g, (_, label, href) => {
    return `<a href="${escapeHTML(href)}">${label}</a>`;
  });

  // Inline code: `code`
  text = text.replace(/`([^`]+)`/g, (_, code) => {
    return `<code>${escapeHTML(code)}</code>`;
  });

  // Bold+Italic: ***text***
  text = text.replace(/\*\*\*(.+?)\*\*\*/g, (_, t) => `<strong><em>${t}</em></strong>`);

  // Bold: **text** or __text__
  text = text.replace(/\*\*(.+?)\*\*/g, (_, t) => `<strong>${t}</strong>`);
  text = text.replace(/__(.+?)__/g, (_, t) => `<strong>${t}</strong>`);

  // Italic: *text* or _text_
  text = text.replace(/\*(.+?)\*/g, (_, t) => `<em>${t}</em>`);
  text = text.replace(/_([^_]+)_/g, (_, t) => `<em>${t}</em>`);

  // Strikethrough: ~~text~~
  text = text.replace(/~~(.+?)~~/g, (_, t) => `<del>${t}</del>`);

  return text;
}

/**
 * Parse a Markdown table block.
 * @param {string[]} lines - Lines that form the table
 * @returns {string} HTML table
 */
function parseTable(lines) {
  if (lines.length < 2) return lines.map(l => `<p>${parseInline(escapeHTML(l))}</p>`).join('\n');

  const parseRow = (line) =>
    line.replace(/^\||\|$/g, '').split('|').map(cell => cell.trim());

  const headers = parseRow(lines[0]);
  // lines[1] is the separator row (---|---|...)
  const alignRow = parseRow(lines[1]);
  const aligns = alignRow.map(cell => {
    if (/^:-+:$/.test(cell)) return 'center';
    if (/^-+:$/.test(cell)) return 'right';
    if (/^:-+$/.test(cell)) return 'left';
    return '';
  });

  const headerHTML = headers
    .map((h, i) => {
      const align = aligns[i] ? ` style="text-align:${aligns[i]}"` : '';
      return `<th${align}>${parseInline(h)}</th>`;
    })
    .join('');

  const bodyHTML = lines
    .slice(2)
    .map(line => {
      const cells = parseRow(line);
      const cellsHTML = cells
        .map((c, i) => {
          const align = aligns[i] ? ` style="text-align:${aligns[i]}"` : '';
          return `<td${align}>${parseInline(c)}</td>`;
        })
        .join('');
      return `<tr>${cellsHTML}</tr>`;
    })
    .join('');

  return `<table><thead><tr>${headerHTML}</tr></thead><tbody>${bodyHTML}</tbody></table>`;
}

/**
 * Parse full Markdown text into HTML.
 * @param {string} md
 * @returns {string}
 */
export function parseMarkdown(md) {
  if (!md || md.trim() === '') return '';

  const lines = md.split('\n');
  const blocks = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Blank line
    if (line.trim() === '') {
      i++;
      continue;
    }

    // Setext-style H1 (===) or H2 (---)
    if (i + 1 < lines.length) {
      const nextLine = lines[i + 1];
      if (/^=+\s*$/.test(nextLine) && line.trim() !== '') {
        blocks.push(`<h1>${parseInline(line.trim())}</h1>`);
        i += 2;
        continue;
      }
      if (/^-+\s*$/.test(nextLine) && line.trim() !== '' && !/^[-*_]{3,}\s*$/.test(line)) {
        blocks.push(`<h2>${parseInline(line.trim())}</h2>`);
        i += 2;
        continue;
      }
    }

    // ATX Headers: # to ######
    const headerMatch = line.match(/^(#{1,6})\s+(.*)/);
    if (headerMatch) {
      const level = headerMatch[1].length;
      const text = headerMatch[2].trim();
      blocks.push(`<h${level}>${parseInline(text)}</h${level}>`);
      i++;
      continue;
    }

    // Horizontal rule: ---, ***, ___
    if (/^(\*{3,}|-{3,}|_{3,})\s*$/.test(line.trim())) {
      blocks.push('<hr>');
      i++;
      continue;
    }

    // Fenced code block: ```lang
    if (line.startsWith('```')) {
      const lang = escapeHTML(line.slice(3).trim());
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      const langAttr = lang ? ` class="language-${lang}"` : '';
      blocks.push(`<pre><code${langAttr}>${escapeHTML(codeLines.join('\n'))}</code></pre>`);
      continue;
    }

    // Indented code block (4 spaces or 1 tab)
    if (line.startsWith('    ') || line.startsWith('\t')) {
      const codeLines = [];
      while (i < lines.length && (lines[i].startsWith('    ') || lines[i].startsWith('\t') || lines[i].trim() === '')) {
        codeLines.push(lines[i].startsWith('    ') ? lines[i].slice(4) : lines[i].slice(1));
        i++;
      }
      // Remove trailing blank lines
      while (codeLines.length > 0 && codeLines[codeLines.length - 1].trim() === '') {
        codeLines.pop();
      }
      blocks.push(`<pre><code>${escapeHTML(codeLines.join('\n'))}</code></pre>`);
      continue;
    }

    // Blockquote: > text
    if (line.startsWith('> ') || line === '>') {
      const quoteLines = [];
      while (i < lines.length && (lines[i].startsWith('> ') || lines[i] === '>')) {
        quoteLines.push(lines[i].startsWith('> ') ? lines[i].slice(2) : '');
        i++;
      }
      blocks.push(`<blockquote>${parseMarkdown(quoteLines.join('\n'))}</blockquote>`);
      continue;
    }

    // Unordered list: - item, * item, + item
    if (/^[-*+] /.test(line)) {
      const items = [];
      while (i < lines.length && /^[-*+] /.test(lines[i])) {
        items.push(parseInline(lines[i].slice(2)));
        i++;
      }
      blocks.push('<ul>' + items.map(it => `<li>${it}</li>`).join('') + '</ul>');
      continue;
    }

    // Ordered list: 1. item
    if (/^\d+\.\s/.test(line)) {
      const items = [];
      const startMatch = line.match(/^(\d+)\./);
      const start = startMatch ? parseInt(startMatch[1], 10) : 1;
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(parseInline(lines[i].replace(/^\d+\.\s/, '')));
        i++;
      }
      const startAttr = start !== 1 ? ` start="${start}"` : '';
      blocks.push(`<ol${startAttr}>` + items.map(it => `<li>${it}</li>`).join('') + '</ol>');
      continue;
    }

    // Table: must have | and a separator row
    if (line.includes('|') && i + 1 < lines.length && /^\|?[\s|:-]+\|/.test(lines[i + 1])) {
      const tableLines = [];
      while (i < lines.length && lines[i].includes('|')) {
        tableLines.push(lines[i]);
        i++;
      }
      blocks.push(parseTable(tableLines));
      continue;
    }

    // Paragraph: collect until blank line or block element
    const paraLines = [];
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !lines[i].startsWith('#') &&
      !lines[i].startsWith('```') &&
      !lines[i].startsWith('> ') &&
      !lines[i].startsWith('    ') &&
      !lines[i].startsWith('\t') &&
      !/^[-*+] /.test(lines[i]) &&
      !/^\d+\.\s/.test(lines[i]) &&
      !/^(\*{3,}|-{3,}|_{3,})\s*$/.test(lines[i].trim()) &&
      !lines[i].includes('|')
    ) {
      // Check for setext headings — next line is === or ---
      if (i + 1 < lines.length && /^[=\-]+\s*$/.test(lines[i + 1])) break;
      paraLines.push(lines[i]);
      i++;
    }
    if (paraLines.length > 0) {
      // Join with <br> for soft line breaks, then parse inline
      const content = paraLines.map(l => parseInline(l)).join('<br>\n');
      blocks.push(`<p>${content}</p>`);
    }
  }

  return blocks.join('\n');
}
