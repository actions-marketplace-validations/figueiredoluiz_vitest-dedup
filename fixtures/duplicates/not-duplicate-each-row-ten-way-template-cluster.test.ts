// OBSERVED IN REAL CODE: a public headless-component library's pagination helpers -- the largest single false
// positive of the 2026-09-27 scan: TEN distinct rows (single-element arrays of objects) collapsed
// by the template title `` `should return ${expected} for ${JSON.stringify(args)}` ``, which
// cannot fold and therefore renders identically for every row. Exists as its own row because a
// fix verified on a PAIR may not hold at cluster size ten: the pairwise suppression that clears a
// two-member group can still let a spanning-set emitter rebuild a cluster here.
// `duplicate-each-row` links these rows today, so the expectation is pending until the S7 fix
// lands. Named weakening: reduce the table to two rows with literally identical data.
// @vitest-dedup:extracted 10
// @vitest-dedup:expect rule=none verdict=distinct severity=none
// @vitest-dedup:isolates not-isolable the property is over a CLUSTER, not a relation between two participants -- the ten rows share one unrendered title and indistinguishable bodies, so no pair-level dimension could fail; the guard is the corpus gate's silence assertion plus the named weakening in the header
// @vitest-dedup:participant L16 "should return ${expected} for ${JSON.stringify(args)}"
// @vitest-dedup:participant L16 "should return ${expected} for ${JSON.stringify(args)}"
import { it, expect } from 'vitest'

it.each([
  [{ total: 10, page: 1, expected: '1,...,10' }],
  [{ total: 10, page: 2, expected: '1,2,...,10' }],
  [{ total: 10, page: 3, expected: '1,...,3,...,10' }],
  [{ total: 10, page: 4, expected: '1,...,4,...,10' }],
  [{ total: 10, page: 7, expected: '1,...,7,...,10' }],
  [{ total: 10, page: 8, expected: '1,...,8,9,10' }],
  [{ total: 5, page: 3, expected: '1,2,3,4,5' }],
  [{ total: 6, page: 4, expected: '1,2,3,4,5,6' }],
  [{ total: 7, page: 4, expected: '1,...,3,4,5,...,7' }],
  [{ total: 3, page: 2, expected: '1,2,3' }],
])('should return ${expected} for ${JSON.stringify(args)}', ([{ total, page, expected }]) => {
  expect(render(total, page)).toBe(expected)
})
