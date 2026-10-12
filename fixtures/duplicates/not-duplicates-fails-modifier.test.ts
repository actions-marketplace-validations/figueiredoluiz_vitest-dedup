// Two tests with byte-identical bodies where one carries `.fails`.
// `.fails` inverts which outcome counts as correct: the plain test passes only if the body
// throws nothing, the `.fails` twin passes only if it throws. They assert opposite things,
// so they are not duplicates -- unlike `.skip`/`.only`/`.todo`, which change only whether the
// test runs (see fixtures/duplicates/duplicates-one-skipped.test.ts for that contrast).
// NOTE: bodies must be non-trivial, or the triviality guard excludes them from comparison.
// @vitest-dedup:extracted 2
// @vitest-dedup:expect rule=none verdict=distinct severity=none
// @vitest-dedup:isolates modifier
// @vitest-dedup:participant L23 "rejects a malformed amount"
// @vitest-dedup:participant L28 "rejects a malformed amount under fails"
// CROSS-FILE COLLISION (declared, not dodged): the `.fails` test below is body-identical, under
// an equivalent context and the same modifier key, to duplicates-fails-both-spellings.test.ts's
// chained `.fails` test, so `cross-file-duplicate` links the two files. The plain test above it
// is NOT part of that finding -- a different modifier key -- which is this fixture's own claim.
// `fixtures/README.md`, "Incidental cross-file collisions", explains why it is declared.
// @vitest-dedup:expect rule=cross-file-duplicate verdict=redundant severity=warning
// @vitest-dedup:participant duplicates-fails-both-spellings.test.ts#L23 "rejects a malformed amount, chained"
// @vitest-dedup:participant L28 "rejects a malformed amount under fails"
import { test, expect } from 'vitest'
import { parseAmount } from './parse-amount'

test('rejects a malformed amount', () => {
  const parsed = parseAmount('12,00.5')
  expect(parsed.currency).toBe('GBP')
})

test.fails('rejects a malformed amount under fails', () => {
  const parsed = parseAmount('12,00.5')
  expect(parsed.currency).toBe('GBP')
})
