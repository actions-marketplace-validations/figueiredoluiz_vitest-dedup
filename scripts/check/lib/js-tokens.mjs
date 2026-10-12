#!/usr/bin/env node
// A deliberately small TypeScript/JavaScript tokenizer, used only to compare fixture sources to
// each other.
//
// WHY THIS STILL EXISTS
// ---------------------
// It used to carry `check-fixture-isolation.mjs`, which approximated the analyzer's fingerprints by
// erasing a declared dimension from two tokenized callbacks and comparing what was left. That gate
// now reads the analyzer's real fingerprints off `--emit-test-fingerprints` and needs none of this.
//
// One consumer remains, and it is the one that must NOT use fingerprints:
// `check-duplicates-corpus.mjs`'s textual-distinctness sweep, which asserts that every positive
// `near-duplicate-test` / `subsumed-test` expectation links participants whose RAW token streams
// differ. That is the tool-agnostic form of "a copy-paste detector would not flag these", and its
// whole value is that it is computed WITHOUT the analyzer -- checking it against the analyzer's own normalized views would assert only that
// the analyzer agrees with itself. So this file is not dead code left behind by that migration; it
// is the deliberately independent half of the corpus gate.
//
// Doing that with regular expressions would be the fragile version everyone rightly distrusts:
// `.toBe(false)` and the `false` inside a string literal are the same characters. Tokenizing first
// makes the comparison exact for the language subset these fixtures actually use, and the failure
// mode of anything outside that subset is a *louder* gate, never a quieter one -- an unrecognized
// construct produces different tokens and therefore a reported difference, not a silent pass.
//
// KNOWN LIMITS, stated rather than discovered later:
//   - Regular-expression literals are not recognized; `/` always lexes as punctuation. No fixture
//     in this corpus contains one. A fixture that did would tokenize oddly and, at worst, fail the
//     distinctness check -- which is a visible failure a human then reads.
//   - A template literal (including any `${...}` interpolation) is one opaque token. Two templates
//     therefore compare equal only when their whole text matches, which is the conservative answer.
//   - TypeScript type annotations tokenize as ordinary identifiers and punctuation. That is enough
//     for the comparison, which never needs to know a type from a value.

/** Multi-character operators, longest first so `===` never lexes as `==` followed by `=`. */
const OPERATORS = [
  '>>>=',
  '...',
  '===',
  '!==',
  '**=',
  '<<=',
  '>>=',
  '>>>',
  '&&=',
  '||=',
  '??=',
  '=>',
  '==',
  '!=',
  '<=',
  '>=',
  '&&',
  '||',
  '??',
  '?.',
  '++',
  '--',
  '+=',
  '-=',
  '*=',
  '/=',
  '%=',
  '&=',
  '|=',
  '^=',
  '**',
  '<<',
  '>>',
]

/** Identifier-shaped tokens that are literal VALUES rather than names. */
export const LITERAL_KEYWORDS = new Set(['true', 'false', 'null', 'undefined', 'NaN', 'Infinity'])

/**
 * Reserved words that must never be treated as renameable identifiers. `this` is in here
 * deliberately: it is the one "identifier" whose meaning is fixed by the enclosing function form,
 * which is precisely the variable the arrow-vs-`function` fixture isolates.
 */
export const RESERVED = new Set([
  'as',
  'async',
  'await',
  'break',
  'case',
  'catch',
  'class',
  'const',
  'continue',
  'debugger',
  'declare',
  'default',
  'delete',
  'do',
  'else',
  'enum',
  'export',
  'extends',
  'finally',
  'for',
  'from',
  'function',
  'get',
  'if',
  'implements',
  'import',
  'in',
  'instanceof',
  'interface',
  'keyof',
  'let',
  'new',
  'of',
  'readonly',
  'return',
  'satisfies',
  'set',
  'static',
  'super',
  'switch',
  'this',
  'throw',
  'try',
  'type',
  'typeof',
  'var',
  'void',
  'while',
  'yield',
])

const IDENT_START = /[A-Za-z_$]/
const IDENT_PART = /[A-Za-z0-9_$]/
const DIGIT = /[0-9]/

/**
 * Tokenizes a whole source file.
 *
 * @param {string} source
 * @returns {{kind: 'ident'|'number'|'string'|'punct', value: string, line: number}[]} tokens in
 *   source order, with comments and whitespace removed. `line` is 1-based, matching the line
 *   numbers `@vitest-dedup:participant` directives use.
 */
export function tokenize(source) {
  const tokens = []
  let index = 0
  let line = 1

  const readDelimited = (open, close, allowEscapes) => {
    const start = index
    index += open.length
    while (index < source.length) {
      const char = source[index]
      if (allowEscapes && char === '\\') {
        if (source[index + 1] === '\n') line += 1
        index += 2
        continue
      }
      if (char === '\n') line += 1
      if (source.startsWith(close, index)) {
        index += close.length
        return source.slice(start, index)
      }
      index += 1
    }
    return source.slice(start, index)
  }

  while (index < source.length) {
    const char = source[index]

    if (char === '\n') {
      line += 1
      index += 1
      continue
    }
    if (char === ' ' || char === '\t' || char === '\r') {
      index += 1
      continue
    }
    if (source.startsWith('//', index)) {
      while (index < source.length && source[index] !== '\n') index += 1
      continue
    }
    if (source.startsWith('/*', index)) {
      readDelimited('/*', '*/', false)
      continue
    }
    if (char === "'" || char === '"') {
      const startLine = line
      tokens.push({ kind: 'string', value: readDelimited(char, char, true), line: startLine })
      continue
    }
    if (char === '`') {
      // One opaque token, `${...}` included -- see the limits note at the top. Brace depth is
      // tracked so a `}` inside an interpolation does not end the template early.
      const startLine = line
      const start = index
      index += 1
      let depth = 0
      while (index < source.length) {
        const current = source[index]
        if (current === '\\') {
          index += 2
          continue
        }
        if (current === '\n') line += 1
        if (source.startsWith('${', index)) {
          depth += 1
          index += 2
          continue
        }
        if (current === '}' && depth > 0) {
          depth -= 1
          index += 1
          continue
        }
        if (current === '`' && depth === 0) {
          index += 1
          break
        }
        index += 1
      }
      tokens.push({ kind: 'string', value: source.slice(start, index), line: startLine })
      continue
    }
    if (DIGIT.test(char) || (char === '.' && DIGIT.test(source[index + 1] ?? ''))) {
      const start = index
      while (index < source.length && /[0-9a-fA-FxXoObBeE._n+-]/.test(source[index])) {
        // `+`/`-` only continue a number as an exponent sign (`1e-3`), never as an operator.
        if ((source[index] === '+' || source[index] === '-') && !/[eE]/.test(source[index - 1])) break
        index += 1
      }
      tokens.push({ kind: 'number', value: source.slice(start, index), line })
      continue
    }
    if (IDENT_START.test(char)) {
      const start = index
      while (index < source.length && IDENT_PART.test(source[index])) index += 1
      tokens.push({ kind: 'ident', value: source.slice(start, index), line })
      continue
    }

    const operator = OPERATORS.find((op) => source.startsWith(op, index))
    if (operator) {
      tokens.push({ kind: 'punct', value: operator, line })
      index += operator.length
      continue
    }
    tokens.push({ kind: 'punct', value: char, line })
    index += 1
  }

  return tokens
}

const OPENERS = new Set(['(', '[', '{'])
const CLOSERS = new Set([')', ']', '}'])

/** Whether a token opens a bracketed group. */
export const isOpener = (token) => token.kind === 'punct' && OPENERS.has(token.value)
/** Whether a token closes a bracketed group. */
export const isCloser = (token) => token.kind === 'punct' && CLOSERS.has(token.value)

/**
 * Locates one test declaration's callback in a tokenized file.
 *
 * Moved here from `isolation.mjs` when that module stopped reading source at all. Its only caller
 * is `check-duplicates-corpus.mjs`'s textual-distinctness sweep, which needs the raw token stream
 * of a participant's callback and nothing else.
 *
 * `line` is the 1-based line an `@vitest-dedup:participant` directive names, i.e. the line the
 * declaration starts on. The declaration is taken to run from the first token on that line until
 * bracket depth returns to zero and the next token does not continue the expression (`(` for the
 * second call of `test.each(table)(title, fn)`, `.` for a member chain).
 *
 * The callback is the LAST brace block at depth 1 inside the declaration -- the test body. A `.each`
 * table's object rows sit deeper (inside the table's own brackets) and a destructured parameter
 * sits inside the parameter parens, so neither is mistaken for the body.
 *
 * @returns {{header: object[], body: object[]}|{error: string}}
 */
export function findCallback(tokens, line) {
  const start = tokens.findIndex((token) => token.line === line)
  if (start === -1) return { error: `no token on line ${line}` }

  let depth = 0
  let opened = false
  let end = -1
  for (let i = start; i < tokens.length; i += 1) {
    const token = tokens[i]
    if (isOpener(token)) {
      depth += 1
      opened = true
    } else if (isCloser(token)) {
      depth -= 1
      if (depth === 0 && opened) {
        const next = tokens[i + 1]
        const continues = next && next.kind === 'punct' && (next.value === '(' || next.value === '.')
        if (!continues) {
          end = i
          break
        }
      }
    }
  }
  if (end === -1) return { error: `unterminated declaration starting on line ${line}` }

  const slice = tokens.slice(start, end + 1)
  const depths = []
  let current = 0
  for (const token of slice) {
    depths.push(current)
    if (isOpener(token)) current += 1
    else if (isCloser(token)) current -= 1
  }

  let braceIndex = -1
  for (let i = slice.length - 1; i >= 0; i -= 1) {
    if (depths[i] === 1 && slice[i].kind === 'punct' && slice[i].value === '{') {
      braceIndex = i
      break
    }
  }
  if (braceIndex === -1) {
    return { error: `no callback body block found in the declaration starting on line ${line}` }
  }

  let closeIndex = -1
  let braceDepth = 0
  for (let i = braceIndex; i < slice.length; i += 1) {
    if (isOpener(slice[i])) braceDepth += 1
    else if (isCloser(slice[i])) {
      braceDepth -= 1
      if (braceDepth === 0) {
        closeIndex = i
        break
      }
    }
  }
  if (closeIndex === -1) return { error: `unterminated callback body on line ${line}` }

  // `depths[i]` is recorded BEFORE token `i`'s own effect is applied (see the loop above), so an
  // opener token's recorded depth is the depth OUTSIDE it, one less than the scope it opens. A
  // depth-1 comma is unambiguous: it can only be the outer call's own argument separator, since
  // nothing at depth 1 that isn't a separator is a bare `,` token. But a depth-1 `(` is exactly
  // what the callback's OWN parameter list looks like from here -- e.g. `test('a', async () => {`
  // has the arrow's `(` recorded at depth 1, one token before it opens the depth-2 parameter
  // scope -- so matching depth 1 on `(` truncates the header to just that paren onward, dropping
  // `async` (or a `function` keyword and name) before it.
  //
  // The outer call's own opening paren is instead at depth 0 (nothing has opened yet when it is
  // reached), which is only the right boundary when the callback is the declaration's FIRST
  // argument (no comma separates it from an earlier one). Scanning backward and taking whichever
  // boundary is hit first -- a depth-1 comma or a depth-0 `(` -- gives the right start in both
  // cases without special-casing which argument position the callback is in.
  let headerStart = 0
  for (let i = braceIndex - 1; i >= 0; i -= 1) {
    if (slice[i].kind !== 'punct') continue
    if (depths[i] === 1 && slice[i].value === ',') {
      headerStart = i + 1
      break
    }
    if (depths[i] === 0 && slice[i].value === '(') {
      headerStart = i + 1
      break
    }
  }

  return {
    header: slice.slice(headerStart, braceIndex),
    body: slice.slice(braceIndex + 1, closeIndex),
  }
}
