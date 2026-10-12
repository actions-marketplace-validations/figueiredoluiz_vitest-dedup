// The positive counterpart to `not-duplicates-fails-modifier.test.ts`. `.fails` has two spellings
// -- the chained `test.fails(...)` and the options-object `test('x', { fails: true }, fn)`, which
// `docs/vitest-surface.md`'s "Signature variants" records as equivalent. Now that `Fails`
// participates in the modifier key, that equivalence has to hold at the *analysis* layer too:
// two identical bodies reaching the same polarity by different spellings are still one duplicated
// test. Were only the chained form to produce `Modifier::Fails`, these two would key apart.
// NOTE: bodies must be non-trivial, or the triviality guard excludes them from comparison.
// @vitest-dedup:extracted 2
// @vitest-dedup:expect rule=duplicate-test verdict=redundant severity=error
// @vitest-dedup:participant L23 "rejects a malformed amount, chained"
// @vitest-dedup:participant L28 "rejects a malformed amount, options object"
// CROSS-FILE COLLISION (declared, not dodged): the `.fails` test below is body-identical, under
// an equivalent context and the same modifier key, to not-duplicates-fails-modifier.test.ts's
// `.fails` half -- both spell the same inverted-polarity test -- so `cross-file-duplicate` links
// the two files. True by the rule's criteria; no remedy follows, both fixtures are load-bearing.
// `fixtures/README.md`, "Incidental cross-file collisions", explains why it is declared.
// @vitest-dedup:expect rule=cross-file-duplicate verdict=redundant severity=warning
// @vitest-dedup:participant L23 "rejects a malformed amount, chained"
// @vitest-dedup:participant not-duplicates-fails-modifier.test.ts#L28 "rejects a malformed amount under fails"
import { test, expect } from 'vitest'
import { parseAmount } from './parse-amount'

test.fails('rejects a malformed amount, chained', () => {
  const parsed = parseAmount('12,00.5')
  expect(parsed.currency).toBe('GBP')
})

test('rejects a malformed amount, options object', { fails: true }, () => {
  const parsed = parseAmount('12,00.5')
  expect(parsed.currency).toBe('GBP')
})
