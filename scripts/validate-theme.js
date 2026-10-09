/**
 * Theme Validator for Super Productivity Themes
 * Direct implementation of Super Productivity's core theme validation logic
 * (src/app/core/theme/validate-theme-css.util.ts & theme-contract.const.ts)
 */

const fs = require('fs');
const path = require('path');

const THEME_CONTRACT = [
  // Required — minimum viable theme.
  { name: '--surface-1', tier: 'required' },
  { name: '--surface-2', tier: 'required' },
  { name: '--ink', tier: 'required' },
  { name: '--ink-on-channel', tier: 'required' },

  // Recommended — fills out the surface ladder + ink contract + separators.
  { name: '--surface-0', tier: 'recommended' },
  { name: '--surface-3', tier: 'recommended' },
  { name: '--surface-4', tier: 'recommended' },
  { name: '--ink-strong', tier: 'recommended' },
  { name: '--ink-muted', tier: 'recommended' },
  { name: '--separator', tier: 'recommended' },
  { name: '--divider', tier: 'recommended' },
  { name: '--scrim', tier: 'recommended' },
];

const MAX_THEME_CSS_SIZE = 500 * 1024;

function stripCssComments(css, isRawSource = false) {
  let out = '';
  let i = 0;
  let inString = null;
  let inUrl = false;
  while (i < css.length) {
    const ch = css[i];

    if (inString) {
      out += ch;
      if (isRawSource && (ch === '\n' || ch === '\r' || ch === '\f')) {
        inString = null;
        i++;
        continue;
      }
      if (ch === '\\' && i + 1 < css.length) {
        const escapeLength = isRawSource ? rawCssEscapeLength(css, i) : 2;
        out += css.slice(i + 1, i + escapeLength);
        i += escapeLength;
        continue;
      }
      if (ch === inString) inString = null;
      i++;
      continue;
    }

    if (inUrl) {
      out += ch;
      if (ch === ')') inUrl = false;
      else if (ch === '"' || ch === "'") {
        inUrl = false;
        inString = ch;
      }
      i++;
      continue;
    }

    if (isRawSource && ch === '\\') {
      const escapeLength = rawCssEscapeLength(css, i);
      if (escapeLength > 0) {
        out += css.slice(i, i + escapeLength);
        i += escapeLength;
        continue;
      }
    }

    if (ch === '"' || ch === "'") {
      inString = ch;
      out += ch;
      i++;
      continue;
    }

    if (
      !isRawSource &&
      (ch === 'u' || ch === 'U') &&
      i + 3 < css.length &&
      (css[i + 1] === 'r' || css[i + 1] === 'R') &&
      (css[i + 2] === 'l' || css[i + 2] === 'L') &&
      css[i + 3] === '('
    ) {
      out += css.slice(i, i + 4);
      i += 4;
      inUrl = true;
      continue;
    }

    if (ch === '/' && css[i + 1] === '*') {
      const end = css.indexOf('*/', i + 2);
      if (end < 0) {
        return { ok: false, error: 'Theme CSS has an unterminated /* comment' };
      }
      out += ' ';
      i = end + 2;
      continue;
    }

    out += ch;
    i++;
  }
  return { ok: true, css: out };
}

function rawCssEscapeLength(css, index) {
  const match = /^\\(?:[0-9a-fA-F]{1,6}(?:[ \t\n\f]|\r\n?)?|\r\n|[\s\S])/.exec(css.slice(index));
  return match ? match[0].length : 0;
}

function decodeCssEscapes(css) {
  return css.replace(
    /\\([0-9a-fA-F]{1,6})(?:[ \t\n\f]|\r\n?)?|\\(\r\n|[\n\r\f])|\\([\s\S])/g,
    (_m, hex, continuation, lit) => {
      if (continuation !== undefined) return '';
      if (lit !== undefined) return lit;
      const cp = parseInt(hex, 16);
      return cp === 0 || cp > 0x10ffff ? '' : String.fromCodePoint(cp);
    }
  );
}

function classifyThemeUrl(arg) {
  if (!arg) return 'relative';
  if (arg.startsWith('#')) return null;
  if (/^https?:/i.test(arg)) return 'remote';
  if (arg.startsWith('//')) return 'remote';
  if (/^data:/i.test(arg)) return 'data';
  if (/^[a-z][a-z0-9+.-]*:/i.test(arg)) return 'remote';
  return 'relative';
}

function formatUrlError(kind, raw, reason, source, index) {
  const line = source.slice(0, index).split('\n').length;
  let why;
  switch (reason) {
    case 'remote':
      why = 'remote URLs are blocked in theme CSS';
      break;
    case 'data':
      why = 'data: URIs are not allowed in theme CSS';
      break;
    case 'relative':
      why = 'bundled assets are not supported in theme CSS (v1)';
      break;
  }
  return `Line ${line}: ${kind} ${raw.trim()} — ${why}`;
}

function blankStringAndUrlContents(css) {
  const out = [];
  let i = 0;
  let inString = null;
  let inUrl = false;
  while (i < css.length) {
    const ch = css[i];
    if (inString) {
      if (ch === '\\' && i + 1 < css.length) {
        out.push('  ');
        i += 2;
        continue;
      }
      if (ch === inString) {
        out.push(ch);
        inString = null;
      } else {
        out.push(' ');
      }
      i++;
      continue;
    }
    if (inUrl) {
      if (ch === ')') {
        out.push(ch);
        inUrl = false;
      } else if (ch === '"' || ch === "'") {
        out.push(ch);
        inUrl = false;
        inString = ch;
      } else {
        out.push(' ');
      }
      i++;
      continue;
    }
    if (ch === '"' || ch === "'") {
      inString = ch;
      out.push(ch);
      i++;
      continue;
    }
    if (
      (ch === 'u' || ch === 'U') &&
      i + 3 < css.length &&
      (css[i + 1] === 'r' || css[i + 1] === 'R') &&
      (css[i + 2] === 'l' || css[i + 2] === 'L') &&
      css[i + 3] === '('
    ) {
      out.push(css.slice(i, i + 4));
      i += 4;
      inUrl = true;
      continue;
    }
    out.push(ch);
    i++;
  }
  return out.join('');
}

const DECLARATION_PATTERN = /(?:^|[^\w-])(--[\w-]+)\s*:/gm;

function scanThemeContract(stripped) {
  const scanView = blankStringAndUrlContents(stripped);
  const declared = new Set();
  for (const m of scanView.matchAll(DECLARATION_PATTERN)) {
    declared.add(m[1]);
  }
  const warnings = [];
  for (const spec of THEME_CONTRACT) {
    if (!declared.has(spec.name)) {
      warnings.push({ token: spec.name, tier: spec.tier });
    }
  }
  return warnings;
}

function validateThemeCss(css) {
  const errors = [];
  if (typeof css !== 'string') {
    return { isValid: false, errors: ['Theme CSS payload is missing'] };
  }

  const byteLength = Buffer.byteLength(css, 'utf8');
  if (byteLength > MAX_THEME_CSS_SIZE) {
    errors.push(
      `Theme CSS is too large (${(byteLength / 1024).toFixed(1)} KB; max ${(
        MAX_THEME_CSS_SIZE / 1024
      ).toFixed(0)} KB)`
    );
    return { isValid: false, errors };
  }

  const rawCommentResult = stripCssComments(css, true);
  if (!rawCommentResult.ok) {
    errors.push(rawCommentResult.error);
    return { isValid: false, errors };
  }

  const decoded = decodeCssEscapes(css);
  const stripResult = stripCssComments(decoded);
  if (!stripResult.ok) {
    errors.push(stripResult.error);
    return { isValid: false, errors };
  }
  const stripped = stripResult.css;

  const importMatch = /@import\b/i.exec(stripped);
  if (importMatch) {
    const line = stripped.slice(0, importMatch.index).split('\n').length;
    errors.push(`Line ${line}: @import is not supported in theme CSS`);
    return { isValid: false, errors };
  }

  const scan = (pattern, label) => {
    let match;
    while ((match = pattern.exec(decoded)) !== null) {
      const arg = (match[1] ?? match[2] ?? match[3] ?? '').trim();
      const reason = classifyThemeUrl(arg);
      if (reason) {
        errors.push(formatUrlError(label, match[0], reason, decoded, match.index));
      }
    }
  };
  scan(/url\s*\(\s*(?:"([^"]*)"|'([^']*)'|([^)]*))\s*\)/gi, 'url(...)');
  scan(/src\s*\(\s*(?:"([^"]*)"|'([^']*)'|([^)]*))\s*\)/gi, 'src(...)');

  const unterminatedUrl = /(?:url|src)\s*\([^)]*$/i.exec(decoded);
  if (unterminatedUrl) {
    const line = decoded.slice(0, unterminatedUrl.index).split('\n').length;
    errors.push(`Line ${line}: unterminated url() — remove the incomplete rule`);
  }

  const imageFunctionRegex = /(^|[^\w-])image\(/gim;
  let imageMatch;
  while ((imageMatch = imageFunctionRegex.exec(stripped)) !== null) {
    const index = imageMatch.index + imageMatch[1].length;
    const line = stripped.slice(0, index).split('\n').length;
    errors.push(`Line ${line}: image(...) is not supported in theme CSS`);
  }

  const imageSetMatch = /image-set\(/i.exec(stripped);
  if (imageSetMatch) {
    const line = stripped.slice(0, imageSetMatch.index).split('\n').length;
    errors.push(`Line ${line}: image-set(...) is not supported in theme CSS`);
  }

  if (errors.length > 0) {
    return { isValid: false, errors };
  }

  const warnings = scanThemeContract(stripped);
  return {
    isValid: true,
    errors: [],
    warnings,
  };
}

// CLI runner
if (require.main === module) {
  const targetFiles = process.argv.slice(2);
  if (targetFiles.length === 0) {
    console.log('Usage: node scripts/validate-theme.js <file1.css> [file2.css ...]');
    process.exit(1);
  }

  let allPassed = true;
  for (const file of targetFiles) {
    const fullPath = path.resolve(file);
    if (!fs.existsSync(fullPath)) {
      console.error(`File not found: ${file}`);
      allPassed = false;
      continue;
    }

    const content = fs.readFileSync(fullPath, 'utf8');
    const result = validateThemeCss(content);

    console.log(`\nValidating: ${file} (${(Buffer.byteLength(content, 'utf8') / 1024).toFixed(1)} KB)`);
    if (!result.isValid) {
      console.error(`❌ FAILED validation:`);
      result.errors.forEach((e) => console.error(`  - ${e}`));
      allPassed = false;
    } else {
      console.log(`✅ Valid theme CSS`);
      if (result.warnings && result.warnings.length > 0) {
        console.warn(`⚠️  Warnings (${result.warnings.length}):`);
        result.warnings.forEach((w) => console.warn(`  - [${w.tier}] Missing token: ${w.token}`));
      } else {
        console.log(`✨ 100% contract compliant! Zero missing tokens.`);
      }
    }
  }

  process.exit(allPassed ? 0 : 1);
}

module.exports = { validateThemeCss, scanThemeContract, THEME_CONTRACT };
