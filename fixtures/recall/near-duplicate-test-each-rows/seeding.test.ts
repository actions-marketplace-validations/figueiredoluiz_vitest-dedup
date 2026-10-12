// RECALL variant -- near-duplicate-test between a `.each` ROW and a hand-written test.
//
// The `.each` declaration expands into one `TestCase` per row whose body has the row's value
// substituted in (`row_substitution`), so a row is a real comparison participant and not a
// placeholder. The hand-written test below performs the same two setup calls in the opposite
// order with the row's literal spelled out.
//
// Expected: ONE `near-duplicate-test` warning linking the single row to the hand-written test, at
// `similar-uncertain`. Every other near case in this corpus compares two hand-written tests; a
// substitution step that produced a body the behavior multiset could not match -- or that marked
// the row incomparable -- would leave all of them green while this whole shape went undetected,
// and `.each` tables are exactly where duplicated cases accumulate.
//
// The table has a single row on purpose: a second row would introduce row-to-row relations and
// stop this case from isolating the row-versus-hand-written comparison.
import { expect, test } from 'vitest'
import { configure, isReady, seed } from './setup'

test.each([[3]])('seeds %i users then configures', (users) => {
  seed({ users })
  configure({ mode: 'test' })
  expect(isReady()).toBe(true)
})

test('configures then seeds three users', () => {
  configure({ mode: 'test' })
  seed({ users: 3 })
  expect(isReady()).toBe(true)
})
