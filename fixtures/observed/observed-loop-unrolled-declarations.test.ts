// OBSERVED IN REAL CODE: a large public React/TypeScript monorepo --
// `for (const key of ['Shift', 'Control']) { describe(...) { it(...) } }`. Twelve of the thirteen
// `duplicate-each-row` findings on the pinned corpus were this one shape.
//
// SHAPE: a plain JavaScript loop around a `describe`/`it` pair. The loop body declares tests once
// per iteration, so several cases share one declaration location; the enclosing `describe` title
// is a constant, so the iterations also share a full title; and the loop variable is never
// substituted into the body, so the branch that distinguishes the iterations does not fold and
// both cases fingerprint identically. Same location, same title, same body -- everything a rule
// keying on "several cases at one declaration" looks for.
//
// WHAT THE ANALYZER DID WRONG: it reported a duplicated `test.each` row in a file containing no
// table at all, and the remedy it proposed -- delete the duplicate row -- would have deleted the
// `Control` coverage. `TestCase::is_table_row` is now set only by real `test.each`/`test.for` row
// expansion, and the rule keys on that marker rather than on a shared location.
//
// WHAT IT MUST DO NOW: nothing. Note what this fixture does NOT claim: the two iterations really
// are different cases, so silence is the correct verdict rather than a concession. It is
// `distinct`, not `not-compared` -- the gate checks this file's solo run completed without an
// unresolved context, so the pair was genuinely compared rather than skipped.
//
// Kin: `fixtures/duplicates/not-duplicate-each-row-loop-unroll.test.ts` guards the same marker
// from the rule's side. This one is the observed-corpus record of where the defect came from.
// @vitest-dedup:extracted 2
// @vitest-dedup:expect rule=none verdict=distinct severity=none
// @vitest-dedup:isolates not-isolable the two participants are iterations of one `for...of` and --emit-test-fingerprints reports them as IDENTICAL in all six fields, so no assertion here could fail -- which is the point: duplicate-each-row must not treat loop iterations as table rows. Load-bearing instead by a manual two-step weakening, both run against this binary: (1) loop over two IDENTICAL values, so the iterations are indistinguishable by any means -- still silent, which is the guard; (2) the same file with `for...of` replaced by `it.each` over that same pair of identical values -- duplicate-each-row fires. Loop vs table is the only variable between them.
// @vitest-dedup:participant L33 "dragging to select > selects the shape under the cursor"
// @vitest-dedup:participant L33 "dragging to select > selects the shape under the cursor"
import { describe, it, expect } from 'vitest'

for (const pointer of ['mouse', 'pen']) {
  describe('dragging to select', () => {
    it('selects the shape under the cursor', () => {
      editor.pointerDown(50, 50, { pointerType: pointer })
      if (pointer === 'mouse') {
        expect(editor.getSelectedShapeIds()).toEqual([ids.box1])
      } else {
        expect(editor.getSelectedShapeIds()).toEqual([])
      }
    })
  })
}
