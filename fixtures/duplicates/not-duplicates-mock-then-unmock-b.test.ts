// @vitest-dedup:extracted 1
// @vitest-dedup:expect rule=none verdict=distinct severity=none
// @vitest-dedup:isolates context
// @vitest-dedup:participant L31 "reads the real value"
// @vitest-dedup:participant not-duplicates-mock-then-unmock.test.ts#L35 "reads the mocked value"
//
// Pairs with not-duplicates-mock-then-unmock.test.ts. Same specifier, same factory, then unmocked.
//
// Expected verdict: `distinct`. Both hoisted calls name './m', and hoisted calls keep their
// relative source order, so the `vi.unmock` below is the last word and every test in this file
// sees the real module. `collect_mocked_modules` folds the two events accordingly and this file's
// modelled mock set comes out EMPTY, which is a different contextKey from the sibling's -- the
// pair is compared and found different.
//
// It read `not-compared` until the modelling landed: the first fix for the unmock defect tainted
// any file containing an unmocking call, so this one was excluded from comparison rather than
// understood, and the fixture recorded that weaker guarantee rather than claiming an
// understanding the analyzer did not have. What made the stronger claim possible was verifying
// the ordering against a real Vitest 5 run instead of assuming it: with the two calls in the
// opposite order the MOCK wins, so "unmock always wins" would have been a wrong model that
// happened to give the right answer for this file.
//
// Still outside the model, and still tainting: `vi.doMock`/`vi.doUnmock` (not hoisted, so no
// file-wide answer exists) and any of the four called somewhere other than module top level.
import { test, expect, vi } from 'vitest'
import { value } from './m'

vi.mock('./m', () => ({ value: 1 }))
vi.unmock('./m')

test('reads the real value', () => {
  expect(value).toBeGreaterThan(0)
})
