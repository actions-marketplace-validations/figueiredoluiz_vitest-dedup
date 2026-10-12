// Same subject expression, same expected value -- `getFreshConfig()` called twice, where each call
// returns a structurally-equal but reference-distinct object. Only the matcher decides the pair:
// `toBe` (reference identity) rejects it, `toEqual` (structural equality) accepts the very same
// pair. That disagreement is the entire reason the two matchers exist as separate primitives, and
// it is the one thing this fixture pins down.
// @vitest-dedup:extracted 2
// @vitest-dedup:expect rule=none verdict=distinct severity=none
// @vitest-dedup:isolates identifier,literal
// @vitest-dedup:participant L14 "toBe rejects a fresh structurally-equal pair"
// @vitest-dedup:participant L18 "toEqual accepts the same fresh structurally-equal pair"
import { test, expect } from 'vitest'
import { getFreshConfig } from './config'

test('toBe rejects a fresh structurally-equal pair', () => {
  expect(getFreshConfig()).toBe(getFreshConfig())
})

test('toEqual accepts the same fresh structurally-equal pair', () => {
  expect(getFreshConfig()).toEqual(getFreshConfig())
})
