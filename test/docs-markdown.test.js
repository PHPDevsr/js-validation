import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'fs';
import { join, resolve } from 'path';

const docsDir = resolve(import.meta.dirname, '..', 'docs');

/**
 * Get all Markdown files in the docs/ directory.
 */
function getMarkdownFiles() {
  return readdirSync(docsDir)
    .filter((file) => file.endsWith('.md'))
    .map((file) => ({
      name: file,
      path: join(docsDir, file),
      content: readFileSync(join(docsDir, file), 'utf-8')
    }));
}

/**
 * Returns an array of booleans indicating whether each line is inside a fenced code block.
 */
function getCodeBlockMask(lines) {
  const mask = [];
  let inCodeBlock = false;
  for (const line of lines) {
    if (/^```/.test(line)) {
      mask.push(true);
      inCodeBlock = !inCodeBlock;
    } else {
      mask.push(inCodeBlock);
    }
  }
  return mask;
}

const mdFiles = getMarkdownFiles();

describe('Docs Markdown formatting', () => {
  it('should have at least one Markdown file in docs/', () => {
    expect(mdFiles.length).toBeGreaterThan(0);
  });

  describe.each(mdFiles)('$name', ({ name, content }) => {
    const lines = content.split('\n');
    const codeMask = getCodeBlockMask(lines);

    it('should start with an H1 heading', () => {
      const firstNonEmpty = lines.find((line) => line.trim() !== '');
      expect(firstNonEmpty).toMatch(/^# .+/);
    });

    it('should have only one H1 heading', () => {
      const h1Lines = lines.filter((line, i) => !codeMask[i] && /^# [^#]/.test(line));
      expect(h1Lines.length).toBe(1);
    });

    it('should end with a newline', () => {
      expect(content.endsWith('\n')).toBe(true);
    });

    it('should not have trailing whitespace on lines', () => {
      const linesWithTrailing = lines
        .map((line, idx) => ({ line, num: idx + 1 }))
        .filter(({ line }) => /[^\S\n\r]+$/.test(line));
      expect(linesWithTrailing).toEqual([]);
    });

    it('should not have consecutive blank lines (more than 2 newlines in a row)', () => {
      const hasTripleNewline = /\n{3,}/.test(content);
      expect(hasTripleNewline).toBe(false);
    });

    it('should have a blank line before headings', () => {
      for (let i = 1; i < lines.length; i++) {
        if (codeMask[i]) continue;
        if (/^#{1,6} /.test(lines[i]) && lines[i - 1].trim() !== '') {
          expect.fail(
            `Line ${i + 1}: heading "${lines[i].trim()}" is not preceded by a blank line`
          );
        }
      }
    });

    it('should have a blank line after headings', () => {
      for (let i = 0; i < lines.length - 1; i++) {
        if (codeMask[i]) continue;
        if (/^#{1,6} /.test(lines[i]) && lines[i + 1].trim() !== '') {
          expect.fail(
            `Line ${i + 1}: heading "${lines[i].trim()}" is not followed by a blank line`
          );
        }
      }
    });

    it('should use ATX-style headings (# not underline)', () => {
      const setextHeaders = lines.filter((line, i) => {
        if (codeMask[i]) return false;
        // Only match setext-style underlines (=== or ---) that follow non-empty text
        if (!/^[=-]{3,}$/.test(line.trim())) return false;
        // A setext header underline must follow a non-empty line
        return i > 0 && lines[i - 1].trim() !== '' && !codeMask[i - 1];
      });
      expect(setextHeaders).toEqual([]);
    });

    it('should have proper heading hierarchy (no skipping levels)', () => {
      let lastLevel = 0;
      for (let i = 0; i < lines.length; i++) {
        if (codeMask[i]) continue;
        const match = lines[i].match(/^(#{1,6}) /);
        if (match) {
          const level = match[1].length;
          if (lastLevel > 0 && level > lastLevel + 1) {
            expect.fail(
              `Line ${i + 1}: heading level skipped from H${lastLevel} to H${level}`
            );
          }
          lastLevel = level;
        }
      }
    });

    it('should have fenced code blocks properly closed', () => {
      let inCodeBlock = false;
      for (let i = 0; i < lines.length; i++) {
        if (/^```/.test(lines[i])) {
          inCodeBlock = !inCodeBlock;
        }
      }
      expect(inCodeBlock).toBe(false);
    });

    it('should have language identifier on fenced code blocks', () => {
      for (let i = 0; i < lines.length; i++) {
        if (lines[i] === '```') {
          // Check if this is an opening fence (not a closing one)
          let fencesBefore = 0;
          for (let j = 0; j < i; j++) {
            if (/^```/.test(lines[j])) fencesBefore++;
          }
          // Opening fences are at even indices (0, 2, 4...)
          if (fencesBefore % 2 === 0) {
            expect.fail(
              `Line ${i + 1}: code block opening fence missing language identifier`
            );
          }
        }
      }
    });

    it('should have valid internal links (references to existing files)', () => {
      const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
      let match;
      while ((match = linkRegex.exec(content)) !== null) {
        const href = match[2];
        // Skip external links and anchors
        if (href.startsWith('http') || href.startsWith('#')) continue;
        // Resolve relative to docs dir
        const target = href.replace(/#.*$/, ''); // Remove fragment
        if (!target) continue;
        const targetPath = resolve(docsDir, target);
        const exists = (() => {
          try {
            readFileSync(targetPath);
            return true;
          } catch {
            return false;
          }
        })();
        expect(exists, `Broken link in ${name}: "${href}" -> "${targetPath}"`).toBe(true);
      }
    });

    it('should have tables with proper alignment (header separator row)', () => {
      for (let i = 0; i < lines.length; i++) {
        if (codeMask[i]) continue;
        if (/^\|.*\|$/.test(lines[i].trim()) && i + 1 < lines.length) {
          const nextLine = lines[i + 1].trim();
          if (/^\|[\s\-:|]+\|$/.test(nextLine)) {
            // This is a table header row followed by separator - valid
            // Check that separator uses dashes
            const cells = nextLine.split('|').filter((c) => c.trim() !== '');
            for (const cell of cells) {
              expect(cell.trim()).toMatch(/^:?-{3,}:?$/);
            }
          }
        }
      }
    });
  });
});
