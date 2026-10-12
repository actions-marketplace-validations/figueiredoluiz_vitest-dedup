// RECALL negative -- near-duplicate-test where the reordering precondition is VIOLATED.
//
// Same shape as the positive next door: two statements swapped, same events, same assertion. The
// difference is that these two statements share state -- `enable()` reads the flag `select()` sets
// -- so the order is load-bearing and the two tests observe different things. The test titles say
// so.
//
// The rule must stay silent, and the reason it does is worth stating exactly, because it is a
// limitation and not a proof: `near-duplicate-test` bridges reordering only, and multiset equality
// is an exact gate over behavior events, so the differing `expect` VALUES (`true` vs `false`) are
// what make the multisets unequal here. The analyzer is not verifying independence -- it cannot --
// and a variant of this pair whose observable outcome happened to coincide would be reported.
// Recording that honestly is the difference between a negative case and a claim the tool cannot
// make.
//
// Load-bearing: make both assertions expect `true` and the pair becomes a `near-duplicate-test`
// warning, so the silence here is discriminating rather than the rule being absent.
import { expect, test } from 'vitest'
import { enable, isActive, select } from './flags'

test('enabling after selecting activates the flag', () => {
  select('beta')
  enable()
  expect(isActive('beta')).toBe(true)
})

test('enabling before selecting leaves the flag inactive', () => {
  enable()
  select('beta')
  expect(isActive('beta')).toBe(false)
})
