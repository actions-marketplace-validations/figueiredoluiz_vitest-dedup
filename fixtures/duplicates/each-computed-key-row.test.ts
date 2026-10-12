// Two `.each` tables whose only object-row member sits behind a *computed* key (`{ [name]: v }`).
// A computed key defeats static naming, so the row's data cannot be read -- but the unnamed member
// used to be dropped from the row *silently*, leaving `RowCells::Named([])`: a row that reports
// itself fully known while carrying none of its data. These two tables hold different data ('GBP'
// and 'USD') yet both reduce to that same empty known row, so the declarations compare equal and
// are reported as a `duplicate-test` at Error severity.
//
// Expected verdict: not-compared. As in `each-unresolved-table.test.ts`, silence here proves
// nothing about whether these are really duplicates, so the corpus gate asserts the solo run's
// `incomplete` flag rather than merely the absence of a finding -- the pre-fix behavior was not
// only the false duplicate above but also `incomplete: false`, which is `not-compared` laundered
// into `distinct`.
// @vitest-dedup:extracted 2
// @vitest-dedup:expect rule=none verdict=not-compared severity=none
// @vitest-dedup:isolates not-isolable this expectation has no isolation claim to make: the fixture's entire content is that a computed key defeats static row naming, which is what its not-compared verdict records. --emit-test-fingerprints marks both participants `comparable: false` (their context never resolved), so "isolates modifier" was never true and no assertion over their fingerprints could fail. The guard is check-duplicates-corpus.mjs's eligibility assertion: not-compared fails unless the solo run reports an unresolved context
// @vitest-dedup:participant L24 "formats an amount from a computed row"
// @vitest-dedup:participant L28 "formats another amount from a computed row"
import { test, expect } from 'vitest'
import { describeAmount } from './describe-amount'

const currencyKey = 'currency'
const otherCurrencyKey = 'currency'

test.each([{ [currencyKey]: 'GBP' }])('formats an amount from a computed row', ({ currency }) => {
  expect(describeAmount(currency)).toContain('GBP')
})

test.each([{ [otherCurrencyKey]: 'USD' }])('formats another amount from a computed row', ({ currency }) => {
  expect(describeAmount(currency)).toContain('GBP')
})
