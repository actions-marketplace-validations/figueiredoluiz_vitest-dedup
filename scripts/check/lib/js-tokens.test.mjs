#!/usr/bin/env node
// Unit coverage for `findCallback`'s header boundary.
//
// THE DEFECT
// ----------
// `depths[i]` (built in `findCallback`) records a token's bracket depth BEFORE that token's own
// effect is applied, so an opener token's recorded depth is one less than the scope it opens. The
// header search walked backward for a depth-1 `,` OR `(`, meaning to stop at the outer call's
// argument separator -- but the callback's OWN parameter-list `(` is *also* recorded at depth 1
// (one token before it opens the depth-2 parameter scope), so it matched first and the header was
// truncated to start there, dropping `async`, or a `function` keyword and name, that came before
// it. Fixed by requiring depth 1 for the comma (an unambiguous argument separator) and depth 0 for
// the paren (the outer call's own opening paren, only relevant when the callback is the first
// argument and no comma precedes it).
//
// Run directly: `node --test scripts/check/lib/js-tokens.test.mjs`.
import assert from 'node:assert/strict'
import { test } from 'node:test'
import { findCallback, tokenize } from './js-tokens.mjs'

/** Header (or body) as a plain space-joined string of token values, for readable assertions. */
function headerOf(source, line = 1) {
  const callback = findCallback(tokenize(source), line)
  assert.equal(callback.error, undefined, callback.error)
  return callback.header.map((token) => token.value).join(' ')
}

test('async arrow keeps `async` in the header', () => {
  const source = "test('a', async () => {\n  doThing()\n})"
  assert.equal(headerOf(source), 'async ( ) =>')
})

test('a plain arrow header differs from an async one -- the bug made them identical', () => {
  const asyncHeader = headerOf("test('a', async () => {\n  doThing()\n})")
  const plainHeader = headerOf("test('b', () => {\n  doThing()\n})")
  assert.equal(plainHeader, '( ) =>')
  assert.notEqual(asyncHeader, plainHeader)
})

test('a named function expression keeps its keyword and name', () => {
  const source = "test('c', function named() {\n  doThing()\n})"
  assert.equal(headerOf(source), 'function named ( )')
})

test('a callback as the first (and only) argument uses the call\'s own opening paren', () => {
  const source = 'it(() => {\n  doThing()\n})'
  assert.equal(headerOf(source), '( ) =>')
})

test('a named function expression as the first argument keeps its keyword and name too', () => {
  const source = "test(function named() {\n  doThing()\n})"
  assert.equal(headerOf(source), 'function named ( )')
})

test('a chained call (`test.each(table)(title, fn)`) still finds the depth-1 separator', () => {
  const source = "test.each([1, 2])('row %s', (n) => {\n  expect(n).toBeGreaterThan(0)\n})"
  assert.equal(headerOf(source), '( n ) =>')
})
