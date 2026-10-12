// RECALL mixed -- duplicate-test-name and near-duplicate-test on the SAME pair of participants.
//
// The two tests share a full title AND are reordered copies of one body: the title rule and the
// behavior-multiset rule both have claims on exactly these two declarations, and both must fire.
// This is the tightest co-occurrence the two rules admit -- duplicate-test stays silent because
// `alpha` differs, and that boundary is pinned here rather than assumed.
//
// Expected, independently:
//   duplicate-test-name warning, both render `syncs configuration`
//   near-duplicate-test warning, same behavior events in a different order
//
// Named weakening: rename one test and duplicate-test-name must go while near-duplicate-test
// stays; restore the original statement order and near-duplicate-test must go while
// duplicate-test-name stays.
import { expect, test } from 'vitest'
import { configure, isReady, seed } from './setup'

test('syncs configuration', () => {
  configure({ mode: 'test' })
  seed({ users: 3 })
  expect(isReady()).toBe(true)
})

test('syncs configuration', () => {
  seed({ users: 3 })
  configure({ mode: 'test' })
  expect(isReady()).toBe(true)
})
