import type { Token, TokenType } from '../types';
import { getMappingByTokenType } from '../data/colorDatabase';

// Keywords for JS/TS
const KEYWORDS = new Set([
  'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break', 'continue', 'return',
  'function', 'class', 'const', 'let', 'var', 'import', 'export', 'from', 'default',
  'new', 'this', 'super', 'extends', 'implements', 'interface', 'type', 'enum',
  'async', 'await', 'try', 'catch', 'finally', 'throw', 'yield', 'typeof',
  'instanceof', 'in', 'of', 'as', 'is', 'public', 'private', 'protected', 'static',
  'readonly', 'abstract', 'namespace', 'module', 'declare', 'void', 'null', 'undefined',
  'true', 'false', 'get', 'set', 'using',
]);

// Python keywords
const PYTHON_KEYWORDS = new Set([
  'def', 'class', 'if', 'elif', 'else', 'for', 'while', 'break', 'continue', 'return',
  'import', 'from', 'as', 'try', 'except', 'finally', 'raise', 'with', 'yield',
  'lambda', 'pass', 'and', 'or', 'not', 'in', 'is', 'True', 'False', 'None',
  'async', 'await', 'global', 'nonlocal', 'assert', 'del',
]);

// Build full keyword set
const ALL_KEYWORDS = new Set([...KEYWORDS, ...PYTHON_KEYWORDS]);

// Built-in types (TS + general)
const BUILTIN_TYPES = new Set([
  'string', 'number', 'boolean', 'any', 'unknown', 'never', 'object',
  'Array', 'Map', 'Set', 'Promise', 'Date', 'RegExp', 'Error',
  'int', 'float', 'str', 'bool', 'list', 'dict', 'tuple', 'set',
  'String', 'Number', 'Boolean', 'Symbol', 'BigInt',
]);

interface RawToken {
  type: TokenType;
  value: string;
  start: number;
  end: number;
}

export function tokenize(code: string): Token[] {
  const rawTokens: RawToken[] = [];
  let i = 0;

  while (i < code.length) {
    // Whitespace
    if (/\s/.test(code[i])) {
      const start = i;
      while (i < code.length && /\s/.test(code[i])) i++;
      rawTokens.push({ type: 'other', value: code.slice(start, i), start, end: i });
      continue;
    }

    // Single-line comment //
    if (code[i] === '/' && code[i + 1] === '/') {
      const start = i;
      while (i < code.length && code[i] !== '\n') i++;
      rawTokens.push({ type: 'comment', value: code.slice(start, i), start, end: i });
      continue;
    }

    // Multi-line comment /* */
    if (code[i] === '/' && code[i + 1] === '*') {
      const start = i;
      i += 2;
      while (i < code.length && !(code[i] === '*' && code[i + 1] === '/')) i++;
      if (i < code.length) i += 2;
      rawTokens.push({ type: 'comment', value: code.slice(start, i), start, end: i });
      continue;
    }

    // Python comment #
    if (code[i] === '#') {
      const start = i;
      while (i < code.length && code[i] !== '\n') i++;
      rawTokens.push({ type: 'comment', value: code.slice(start, i), start, end: i });
      continue;
    }

    // HTML comment <!-- -->
    if (code[i] === '<' && code.slice(i, i + 4) === '<!--') {
      const start = i;
      i += 4;
      while (i < code.length && code.slice(i, i + 3) !== '-->') i++;
      if (i < code.length) i += 3;
      rawTokens.push({ type: 'comment', value: code.slice(start, i), start, end: i });
      continue;
    }

    // Template string `...`
    if (code[i] === '`') {
      const start = i;
      i++;
      while (i < code.length && code[i] !== '`') {
        if (code[i] === '\\') i++;
        if (code[i] === '$' && code[i + 1] === '{') {
          rawTokens.push({ type: 'string', value: code.slice(start, i), start, end: i });
          rawTokens.push({ type: 'bracket', value: '${', start: i, end: i + 2 });
          i += 2;
          let braceDepth = 1;
          const innerStart = i;
          while (i < code.length && braceDepth > 0) {
            if (code[i] === '{') braceDepth++;
            if (code[i] === '}') braceDepth--;
            if (code[i] === '`') break;
            i++;
          }
          // recursively handle inner expression
          const innerCode = code.slice(innerStart, i - 1);
          const innerTokens = tokenize(innerCode);
          for (const t of innerTokens) {
            rawTokens.push({
              type: t.type,
              value: t.value,
              start: innerStart + t.start,
              end: innerStart + t.end,
            });
          }
          rawTokens.push({ type: 'bracket', value: '}', start: i - 1, end: i });
          const resumeStart = i;
          while (i < code.length && code[i] !== '`') {
            if (code[i] === '\\') i++;
            i++;
          }
          rawTokens.push({ type: 'string', value: code.slice(resumeStart, i), start: resumeStart, end: i });
          if (i < code.length) {
            rawTokens.push({ type: 'other', value: '`', start: i, end: i + 1 });
            i++;
          }
          break;
        }
        i++;
      }
      if (i < code.length) i++;
      if (!rawTokens.length || rawTokens[rawTokens.length - 1].end !== i) {
        rawTokens.push({ type: 'string', value: code.slice(start, i), start, end: i });
      }
      continue;
    }

    // String literals "..." or '...'
    if (code[i] === '"' || code[i] === "'") {
      const quote = code[i];
      const start = i;
      i++;
      while (i < code.length && code[i] !== quote) {
        if (code[i] === '\\') i++;
        i++;
      }
      if (i < code.length) i++;
      rawTokens.push({ type: 'string', value: code.slice(start, i), start, end: i });
      continue;
    }

    // Number
    if (/\d/.test(code[i]) || (code[i] === '.' && i + 1 < code.length && /\d/.test(code[i + 1]))) {
      const start = i;
      if (code[i] === '0' && (code[i + 1] === 'x' || code[i + 1] === 'X' || code[i + 1] === 'b' || code[i + 1] === 'o')) {
        i += 2;
        while (i < code.length && /[0-9a-fA-F_]/.test(code[i])) i++;
      } else {
        while (i < code.length && /[\d.eE_+-]/.test(code[i])) i++;
      }
      rawTokens.push({ type: 'number', value: code.slice(start, i), start, end: i });
      continue;
    }

    // Brackets
    if ('{}()[]'.includes(code[i])) {
      rawTokens.push({ type: 'bracket', value: code[i], start: i, end: i + 1 });
      i++;
      continue;
    }

    // Operators
    if ('+-*/%=<>!&|^~?:;,.'.includes(code[i])) {
      const start = i;
      // Two-char operators
      if ('=!<>+-*/&|'.includes(code[i]) && code[i + 1] === '=') {
        i += 2;
      } else if (code[i] === '>' && code[i + 1] === '>') {
        i += code[i + 2] === '>' ? 3 : 2;
      } else if (code[i] === '<' && code[i + 1] === '<') {
        i += 2;
      } else if (code[i] === '&' && code[i + 1] === '&') {
        i += 2;
      } else if (code[i] === '|' && code[i + 1] === '|') {
        i += 2;
      } else if (code[i] === '?' && code[i + 1] === '?') {
        i += 2;
      } else if (code[i] === '.' && code[i + 1] === '.' && code[i + 2] === '.') {
        i += 3;
      } else if ((code[i] === '-' && code[i + 1] === '>') || (code[i] === '=' && code[i + 1] === '>')) {
        i += 2;
      } else {
        i++;
      }
      rawTokens.push({ type: 'operator', value: code.slice(start, i), start, end: i });
      continue;
    }

    // Identifier / keyword
    if (/[a-zA-Z_$]/.test(code[i])) {
      const start = i;
      while (i < code.length && /[a-zA-Z0-9_$]/.test(code[i])) i++;
      const word = code.slice(start, i);
      
      if (ALL_KEYWORDS.has(word)) {
        rawTokens.push({ type: 'keyword', value: word, start, end: i });
      } else if (BUILTIN_TYPES.has(word)) {
        rawTokens.push({ type: 'type', value: word, start, end: i });
      } else if (i < code.length && code[i] === '(') {
        rawTokens.push({ type: 'function', value: word, start, end: i });
      } else {
        rawTokens.push({ type: 'variable', value: word, start, end: i });
      }
      continue;
    }

    // HTML tags
    if (code[i] === '<' && /[a-zA-Z]/.test(code[i + 1] || '')) {
      const start = i;
      i++;
      while (i < code.length && /[a-zA-Z0-9_-]/.test(code[i])) i++;
      rawTokens.push({ type: 'keyword', value: code.slice(start, i), start, end: i });
      continue;
    }

    // CSS properties
    if (code[i] === '.' || code[i] === '#') {
      const start = i;
      i++;
      while (i < code.length && /[a-zA-Z0-9_-]/.test(code[i])) i++;
      rawTokens.push({ type: 'variable', value: code.slice(start, i), start, end: i });
      continue;
    }

    // Fallback
    rawTokens.push({ type: 'other', value: code[i], start: i, end: i + 1 });
    i++;
  }

  // Convert to Token with color info
  return rawTokens.map((rt) => {
    const mapping = getMappingByTokenType(rt.type);
    return {
      type: rt.type,
      value: rt.value,
      start: rt.start,
      end: rt.end,
      colorHex: mapping.colorHex,
      colorId: mapping.colorId,
    };
  });
}
