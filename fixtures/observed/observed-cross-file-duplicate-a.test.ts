// Pair with observed-cross-file-duplicate-b.test.ts. This is the corpus's only ASSERTED
// `cross-file-duplicate` positive, and it exists to close a gap another review found rather than
// to distil an external observation.
//
// THE GAP THIS CLOSED: while `cross-file-duplicate` shipped Off, its only two fixtures
// (`fixtures/duplicates/cross-file-duplicate-would-fire-*.test.ts`) pinned SILENCE under the
// default config. Silence is also what a rule that had been deleted would produce. Worse, the
// positive could not even be written down: `lib/fixture-directives.mjs`'s `VERDICT_RULE` admitted
// no verdict for the rule id, so `@vitest-dedup:expect rule=cross-file-duplicate ...` was a parse
// error, and the gate never enabled the rule the way it enables `subsumed-test`. The only rule
// shipping Off with a real cross-file remedy had no asserted positive anywhere.
//
// Both halves are fixed: `redundant` accepts `cross-file-duplicate` (the remedy is "one side can
// go, or both call one shared helper" -- no merge into a table), and the rule itself now ships
// `Warning` on an exhaustive adjudication, so the expectation below needs no `--rule` override at
// all -- it is an assertion about the shipped default. This is no longer the corpus's ONLY
// asserted positive either: `fixtures/duplicates/` declares eight more.
//
// SHAPE: identical, non-trivial bodies under an equivalent context, in two files, under two
// different titles -- so no `duplicate-test-name` and, because `duplicate-test` is file-scoped by
// design, no `duplicate-test` either. This finding is reachable by no other rule.
// @vitest-dedup:extracted 1
// @vitest-dedup:expect rule=cross-file-duplicate verdict=redundant severity=warning
// @vitest-dedup:participant L29 "totals the line items"
// @vitest-dedup:participant observed-cross-file-duplicate-b.test.ts#L11 "adds the line items up"
import { test, expect } from 'vitest'
import { computeTotal } from './cart'

test('totals the line items', () => {
  const total = computeTotal([10, 20, 30])
  expect(total).toBe(60)
})
