// RECALL negative -- `expect.soft` and `expect` are not the same assertion.
//
// A soft assertion records a failure and lets the test continue; a hard one stops it. Two tests
// that differ only in which they use therefore fail differently, report differently, and are not
// interchangeable -- so neither is deletable.
//
// This is a correct-behaviour case with nothing previously guarding it: `expect.soft` appeared
// nowhere in the corpus, and the property chain is the only thing separating these two bodies.
// The machinery that makes it work is the chain-aware behaviour event; pinned here so that
// collapsing a property chain back to its root -- the obvious simplification if someone is
// optimising the serializer -- fails a test instead of silently merging every `.soft`,
// `.resolves` and `.rejects` variant into its plain form.
//
// The second pair is the same claim for inline snapshots, which were also absent: two tests with
// one body and two different `toMatchInlineSnapshot` literals assert two different expected
// values. The literal is an ordinary argument, so this already works -- what it guards against is
// a serializer that starts treating snapshot arguments as incidental.
//
// Named weakening: make both assertions in either pair identical and that pair becomes a genuine
// duplicate-test at error severity.
import { expect, test } from 'vitest'
import { format, summarize } from './report'

test('formats the header softly', () => {
  expect.soft(format('header')).toBe('HEADER')
})

test('formats the header strictly', () => {
  expect(format('header')).toBe('HEADER')
})

test('summarizes one row', () => {
  expect(summarize(['a'])).toMatchInlineSnapshot(`"1 row"`)
})

test('summarizes many rows', () => {
  expect(summarize(['a'])).toMatchInlineSnapshot(`"many rows"`)
})
