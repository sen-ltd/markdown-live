/**
 * markdown.test.js — Tests for markdown.js
 * Run: node --test tests/markdown.test.js
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { parseMarkdown, parseInline, escapeHTML } from '../src/markdown.js';

// ── escapeHTML ─────────────────────────────────────────────────────────────

describe('escapeHTML', () => {
  it('escapes ampersand', () => {
    assert.equal(escapeHTML('a & b'), 'a &amp; b');
  });

  it('escapes less-than', () => {
    assert.equal(escapeHTML('<script>'), '&lt;script&gt;');
  });

  it('escapes double quotes', () => {
    assert.equal(escapeHTML('"hello"'), '&quot;hello&quot;');
  });

  it('escapes single quotes', () => {
    assert.equal(escapeHTML("it's"), 'it&#39;s');
  });

  it('returns empty string for empty input', () => {
    assert.equal(escapeHTML(''), '');
  });

  it('leaves plain text unchanged', () => {
    assert.equal(escapeHTML('hello world'), 'hello world');
  });
});

// ── parseInline ────────────────────────────────────────────────────────────

describe('parseInline', () => {
  it('renders bold with **', () => {
    assert.equal(parseInline('**bold**'), '<strong>bold</strong>');
  });

  it('renders bold with __', () => {
    assert.equal(parseInline('__bold__'), '<strong>bold</strong>');
  });

  it('renders italic with *', () => {
    assert.equal(parseInline('*italic*'), '<em>italic</em>');
  });

  it('renders italic with _', () => {
    assert.equal(parseInline('_italic_'), '<em>italic</em>');
  });

  it('renders strikethrough with ~~', () => {
    assert.equal(parseInline('~~del~~'), '<del>del</del>');
  });

  it('renders inline code', () => {
    assert.equal(parseInline('`code`'), '<code>code</code>');
  });

  it('escapes HTML in inline code', () => {
    const result = parseInline('`<b>`');
    assert.equal(result, '<code>&lt;b&gt;</code>');
  });

  it('renders link', () => {
    assert.equal(parseInline('[GitHub](https://github.com)'), '<a href="https://github.com">GitHub</a>');
  });

  it('renders image', () => {
    assert.equal(parseInline('![alt](img.png)'), '<img src="img.png" alt="alt">');
  });

  it('renders bold and italic together', () => {
    const result = parseInline('**bold** and *italic*');
    assert.equal(result, '<strong>bold</strong> and <em>italic</em>');
  });

  it('renders bold+italic with ***', () => {
    assert.equal(parseInline('***both***'), '<strong><em>both</em></strong>');
  });

  it('returns empty string for empty input', () => {
    assert.equal(parseInline(''), '');
  });
});

// ── parseMarkdown: Headers ─────────────────────────────────────────────────

describe('parseMarkdown - headers', () => {
  it('renders h1', () => {
    assert.equal(parseMarkdown('# Hello'), '<h1>Hello</h1>');
  });

  it('renders h2', () => {
    assert.equal(parseMarkdown('## Hello'), '<h2>Hello</h2>');
  });

  it('renders h3', () => {
    assert.equal(parseMarkdown('### Hello'), '<h3>Hello</h3>');
  });

  it('renders h4', () => {
    assert.equal(parseMarkdown('#### Hello'), '<h4>Hello</h4>');
  });

  it('renders h5', () => {
    assert.equal(parseMarkdown('##### Hello'), '<h5>Hello</h5>');
  });

  it('renders h6', () => {
    assert.equal(parseMarkdown('###### Hello'), '<h6>Hello</h6>');
  });

  it('renders header with inline formatting', () => {
    assert.equal(parseMarkdown('# Hello **World**'), '<h1>Hello <strong>World</strong></h1>');
  });

  it('renders setext h1 (===)', () => {
    const result = parseMarkdown('Title\n=====');
    assert.equal(result, '<h1>Title</h1>');
  });

  it('renders setext h2 (---)', () => {
    const result = parseMarkdown('Title\n-----');
    assert.equal(result, '<h2>Title</h2>');
  });
});

// ── parseMarkdown: Paragraphs ──────────────────────────────────────────────

describe('parseMarkdown - paragraphs', () => {
  it('wraps plain text in <p>', () => {
    assert.equal(parseMarkdown('Hello world'), '<p>Hello world</p>');
  });

  it('returns empty string for empty input', () => {
    assert.equal(parseMarkdown(''), '');
  });

  it('returns empty string for whitespace-only input', () => {
    assert.equal(parseMarkdown('   \n\n   '), '');
  });

  it('separates two paragraphs with blank line', () => {
    const result = parseMarkdown('First\n\nSecond');
    assert.ok(result.includes('<p>First</p>'));
    assert.ok(result.includes('<p>Second</p>'));
  });

  it('renders inline formatting in paragraphs', () => {
    const result = parseMarkdown('Hello **bold** world');
    assert.equal(result, '<p>Hello <strong>bold</strong> world</p>');
  });
});

// ── parseMarkdown: Code blocks ─────────────────────────────────────────────

describe('parseMarkdown - fenced code blocks', () => {
  it('renders fenced code block', () => {
    const md = '```\nconst x = 1;\n```';
    const result = parseMarkdown(md);
    assert.ok(result.includes('<pre><code>'));
    assert.ok(result.includes('const x = 1;'));
    assert.ok(result.includes('</code></pre>'));
  });

  it('renders fenced code block with language', () => {
    const md = '```javascript\nconst x = 1;\n```';
    const result = parseMarkdown(md);
    assert.ok(result.includes('class="language-javascript"'));
    assert.ok(result.includes('const x = 1;'));
  });

  it('escapes HTML inside code block', () => {
    const md = '```\n<script>alert(1)</script>\n```';
    const result = parseMarkdown(md);
    assert.ok(result.includes('&lt;script&gt;'));
    assert.ok(!result.includes('<script>'));
  });

  it('renders multiline fenced code block', () => {
    const md = '```\nline1\nline2\nline3\n```';
    const result = parseMarkdown(md);
    assert.ok(result.includes('line1\nline2\nline3'));
  });
});

describe('parseMarkdown - indented code blocks', () => {
  it('renders indented code block (4 spaces)', () => {
    const md = '    const x = 1;';
    const result = parseMarkdown(md);
    assert.ok(result.includes('<pre><code>'));
    assert.ok(result.includes('const x = 1;'));
  });

  it('renders indented code block (tab)', () => {
    const md = '\tconst x = 1;';
    const result = parseMarkdown(md);
    assert.ok(result.includes('<pre><code>'));
    assert.ok(result.includes('const x = 1;'));
  });

  it('escapes HTML in indented code block', () => {
    const md = '    <b>test</b>';
    const result = parseMarkdown(md);
    assert.ok(result.includes('&lt;b&gt;'));
  });
});

// ── parseMarkdown: Inline code ─────────────────────────────────────────────

describe('parseMarkdown - inline code', () => {
  it('renders inline code in a paragraph', () => {
    const result = parseMarkdown('Use `npm install` to install');
    assert.ok(result.includes('<code>npm install</code>'));
  });
});

// ── parseMarkdown: Blockquote ──────────────────────────────────────────────

describe('parseMarkdown - blockquotes', () => {
  it('renders a simple blockquote', () => {
    const result = parseMarkdown('> Hello world');
    assert.ok(result.includes('<blockquote>'));
    assert.ok(result.includes('Hello world'));
    assert.ok(result.includes('</blockquote>'));
  });

  it('renders multiline blockquote', () => {
    const md = '> Line one\n> Line two';
    const result = parseMarkdown(md);
    assert.ok(result.includes('<blockquote>'));
    assert.ok(result.includes('Line one'));
    assert.ok(result.includes('Line two'));
  });
});

// ── parseMarkdown: Lists ───────────────────────────────────────────────────

describe('parseMarkdown - unordered lists', () => {
  it('renders unordered list with -', () => {
    const result = parseMarkdown('- Item one\n- Item two\n- Item three');
    assert.ok(result.includes('<ul>'));
    assert.ok(result.includes('<li>Item one</li>'));
    assert.ok(result.includes('<li>Item two</li>'));
    assert.ok(result.includes('<li>Item three</li>'));
    assert.ok(result.includes('</ul>'));
  });

  it('renders unordered list with *', () => {
    const result = parseMarkdown('* Alpha\n* Beta');
    assert.ok(result.includes('<ul>'));
    assert.ok(result.includes('<li>Alpha</li>'));
  });

  it('renders inline formatting in list items', () => {
    const result = parseMarkdown('- **Bold** item');
    assert.ok(result.includes('<strong>Bold</strong>'));
  });
});

describe('parseMarkdown - ordered lists', () => {
  it('renders ordered list', () => {
    const result = parseMarkdown('1. First\n2. Second\n3. Third');
    assert.ok(result.includes('<ol>'));
    assert.ok(result.includes('<li>First</li>'));
    assert.ok(result.includes('<li>Second</li>'));
    assert.ok(result.includes('<li>Third</li>'));
    assert.ok(result.includes('</ol>'));
  });

  it('renders ordered list with custom start', () => {
    const result = parseMarkdown('5. Item A\n6. Item B');
    assert.ok(result.includes('start="5"'));
  });
});

// ── parseMarkdown: Horizontal rule ────────────────────────────────────────

describe('parseMarkdown - horizontal rules', () => {
  it('renders hr with ---', () => {
    assert.ok(parseMarkdown('---').includes('<hr>'));
  });

  it('renders hr with ***', () => {
    assert.ok(parseMarkdown('***').includes('<hr>'));
  });

  it('renders hr with ___', () => {
    assert.ok(parseMarkdown('___').includes('<hr>'));
  });

  it('renders hr with longer dashes', () => {
    assert.ok(parseMarkdown('------').includes('<hr>'));
  });
});

// ── parseMarkdown: Tables ──────────────────────────────────────────────────

describe('parseMarkdown - tables', () => {
  it('renders a basic table', () => {
    const md = '| Name | Age |\n|------|-----|\n| Alice | 30 |\n| Bob | 25 |';
    const result = parseMarkdown(md);
    assert.ok(result.includes('<table>'));
    assert.ok(result.includes('<thead>'));
    assert.ok(result.includes('<tbody>'));
    assert.ok(result.includes('<th'));
    assert.ok(result.includes('Name'));
    assert.ok(result.includes('Age'));
    assert.ok(result.includes('<td'));
    assert.ok(result.includes('Alice'));
    assert.ok(result.includes('Bob'));
  });

  it('applies right alignment', () => {
    const md = '| N | Val |\n|---|----:|\n| x | 100 |';
    const result = parseMarkdown(md);
    assert.ok(result.includes('text-align:right'));
  });

  it('applies center alignment', () => {
    const md = '| N | Val |\n|---|:---:|\n| x | y |';
    const result = parseMarkdown(md);
    assert.ok(result.includes('text-align:center'));
  });
});

// ── parseMarkdown: Links and Images ───────────────────────────────────────

describe('parseMarkdown - links', () => {
  it('renders a link in a paragraph', () => {
    const result = parseMarkdown('[GitHub](https://github.com)');
    assert.ok(result.includes('<a href="https://github.com">GitHub</a>'));
  });
});

describe('parseMarkdown - images', () => {
  it('renders an image', () => {
    const result = parseMarkdown('![alt text](image.png)');
    assert.ok(result.includes('<img src="image.png" alt="alt text">'));
  });
});

// ── parseMarkdown: HTML escape safety ─────────────────────────────────────

describe('parseMarkdown - HTML escape safety', () => {
  it('escapes HTML in code blocks', () => {
    const md = '```\n<script>alert("xss")</script>\n```';
    const result = parseMarkdown(md);
    assert.ok(!result.includes('<script>'));
    assert.ok(result.includes('&lt;script&gt;'));
  });
});

// ── parseMarkdown: Edge cases ──────────────────────────────────────────────

describe('parseMarkdown - edge cases', () => {
  it('handles empty string', () => {
    assert.equal(parseMarkdown(''), '');
  });

  it('handles only newlines', () => {
    assert.equal(parseMarkdown('\n\n\n'), '');
  });

  it('handles mixed content', () => {
    const md = '# Title\n\nParagraph with **bold**.\n\n- Item A\n- Item B';
    const result = parseMarkdown(md);
    assert.ok(result.includes('<h1>Title</h1>'));
    assert.ok(result.includes('<p>'));
    assert.ok(result.includes('<strong>bold</strong>'));
    assert.ok(result.includes('<ul>'));
  });

  it('handles multiple consecutive headers', () => {
    const md = '# H1\n## H2\n### H3';
    const result = parseMarkdown(md);
    assert.ok(result.includes('<h1>'));
    assert.ok(result.includes('<h2>'));
    assert.ok(result.includes('<h3>'));
  });
});
