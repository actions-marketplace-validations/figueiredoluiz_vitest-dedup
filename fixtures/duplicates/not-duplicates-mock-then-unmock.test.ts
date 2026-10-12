// @vitest-dedup:extracted 1
// @vitest-dedup:expect rule=none verdict=distinct severity=none
// @vitest-dedup:isolates context
// @vitest-dedup:participant L35 "reads the mocked value"
// @vitest-dedup:participant not-duplicates-mock-then-unmock-b.test.ts#L31 "reads the real value"
//
// Pairs with not-duplicates-mock-then-unmock-b.test.ts. This file mocks './m' and leaves it
// mocked; the sibling mocks the same specifier with the same factory and then unmocks it. Same
// title-independent body, same everything the analyzer fingerprints -- except the ambient mock
// state, which is the one variable this pair isolates.
//
// Expected verdict: NOT a duplicate, and reached by COMPARISON rather than by exclusion. The
// analyzer models module-top-level `vi.mock`/`vi.unmock` as hoisted registration events folded
// last-in-source-order-wins per specifier (see `collect_mocked_modules` in
// src/frontend/extract.rs), so this file's context carries './m' and the sibling's does not, and
// `--emit-test-fingerprints` reports two different contextKeys. Both files stay comparable; the
// silence is a verdict, not an abstention.
//
// Regression guard for a defect found by auditing docs/vitest-surface.md against Vitest's own
// documentation, rather than by any fixture. `collect_mocked_modules` once scanned only `vi.mock`
// and `vi.doMock`, so the unmocking call was invisible and both files recorded an identical
// mocked context -- an error-severity false duplicate. The first fix traded that for a taint on
// any unmocking call, which silenced the pair by removing the sibling from comparison entirely;
// this fixture's own isolation marker recorded that the isolation was real in the source and
// absent from the model until the modelling landed.
//
// The spec gap is the real lesson: `vi.mock` appeared only in a fixture-plan table, never as
// prose describing the mocking family, so no fixture derived from that spec could have covered
// `unmock`. A specification cannot reveal its own omissions.
import { test, expect, vi } from 'vitest'
import { value } from './m'

vi.mock('./m', () => ({ value: 1 }))

test('reads the mocked value', () => {
  expect(value).toBeGreaterThan(0)
})
