// Two sibling `describe` blocks, each declaring its OWN constants of the same names with DIFFERENT
// values. The test bodies are textually identical but resolve to different bindings, so they
// exercise genuinely different scenarios.
// Expected verdict: NOT a duplicate.
//
// Regression guard for free-identifier identity keyed on `<file>:<name>`, which collapsed all the
// same-named bindings in one file into a single identity. Identity must derive from the binding
// itself (its declaration span), not from its name.
//
// This is the counterpart to `duplicates-same-fixture-different-label.test.ts`, where sibling
// describes bind nothing and identical bodies ARE duplicates. Read the two together: the suite
// path alone never decides the verdict -- what the bodies resolve to does.
// @vitest-dedup:extracted 2
// @vitest-dedup:expect rule=none verdict=distinct severity=none
// @vitest-dedup:isolates binding
// @vitest-dedup:participant L25 "first page > index == 2"
// @vitest-dedup:participant L34 "later page > index == 2"
import { describe, test, expect } from 'vitest'
import { createWrapper, moveUp } from './helpers'

describe('first page', () => {
  const PAGE = 1
  const commonParams = { itemsLength: 5, page: PAGE, lastPage: PAGE + 1 }

  test('index == 2', () => {
    expect(moveUp(createWrapper({ ...commonParams, index: 2 }))).toBe(true)
  })
})

describe('later page', () => {
  const PAGE = 2
  const commonParams = { itemsLength: 5, page: PAGE, lastPage: PAGE + 1 }

  test('index == 2', () => {
    expect(moveUp(createWrapper({ ...commonParams, index: 2 }))).toBe(true)
  })
})
