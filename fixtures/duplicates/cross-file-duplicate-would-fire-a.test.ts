// Pair with cross-file-duplicate-would-fire-b.test.ts. Identical, non-trivial bodies and an
// identical title across two files -- exactly the shape `cross-file-duplicate` exists to report,
// and NOT reachable by `duplicate-test`, which is file-scoped by design.
//
// This pair was a placeholder for most of its life, and the name it still carries ("would fire")
// records that: while the rule shipped Off, the expectation it could state was SILENCE, for a
// POLICY reason rather than a content reason, and silence is also what a deleted rule produces.
// Two separate blockers stood in the way of the real positive, and both are gone:
//
//   1. `lib/fixture-directives.mjs`'s `VERDICT_RULE` paired no verdict with
//      `cross-file-duplicate`, so `@vitest-dedup:expect rule=cross-file-duplicate ...` was a parse
//      error at any severity. `redundant` accepts it now -- the remedy is "one side can go, or
//      both call one shared helper", never a merge into a table.
//   2. The rule shipped `Severity::Off`. It ships `Warning` since 2026-09-23, on an exhaustive
//      adjudication of its 9 findings over 15,980 tests of pinned external corpus, all 9
//      `redundant`.
//
// So the expectation below is a real positive under the DEFAULT config: `check-duplicates-corpus.
// mjs`'s `TARGETS` passes no `--rule cross-file-duplicate=warning` for this directory or any
// other. Revert the severity table and this fixture fails, which is the property the silent
// version never had.
//
// The content-based precondition (a differing Context blocks the rule even when it is enabled) is
// covered separately, and it is NOT a new fixture: `not-duplicates-different-mocks-a.test.ts` /
// `-b.test.ts` already isolate `context` (a `vi.mock` factory returning a different value per
// file) and were manually verified, ad hoc, against this binary with
// `--rule cross-file-duplicate=warning` -- silent as authored, and firing once the two factories
// are edited to return the same value. This pair was tried first with a per-file local variable
// plus a `beforeEach` instead of a shared import, and that version stayed silent even after its
// two seeded values were made to match, which would have made the `isolates context` claim false;
// it was discarded rather than kept with a claim the binary does not support.
// @vitest-dedup:extracted 1
// @vitest-dedup:expect rule=cross-file-duplicate verdict=redundant severity=warning
// @vitest-dedup:participant L39 "computes the order total"
// @vitest-dedup:participant cross-file-duplicate-would-fire-b.test.ts#L13 "computes the order total"
import { test, expect } from 'vitest'
import { computeTotal } from './shared-cart'

test('computes the order total', () => {
  const total = computeTotal([10, 20, 30])
  expect(total).toBe(60)
})
