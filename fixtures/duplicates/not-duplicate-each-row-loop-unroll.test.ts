// A `for...of` over a literal array is unrolled per iteration (so per-iteration titles can
// fold), producing several cases that share one declaration location -- but they are loop
// iterations, not rows of a table, and the loop variable is not substituted into the body.
// Expected verdict: silence from duplicate-each-row -- a body that branches on the loop
// variable guards different coverage per iteration, and deleting one "row" would delete it.
// This is the React-monorepo shape from the external-corpus review that found the bug.
// @vitest-dedup:extracted 2
// @vitest-dedup:expect rule=none verdict=distinct severity=none
// @vitest-dedup:isolates not-isolable the two participants are iterations of one `for...of` and --emit-test-fingerprints reports them as IDENTICAL in all six fields (the loop variable is not substituted into the body), so they are indistinguishable to the analyzer by construction and no assertion here could fail. That indistinguishability IS the fixture's content: duplicate-each-row must not treat loop iterations as table rows. The guard is the corpus gate's silence assertion plus the manual weakening recorded above
// @vitest-dedup:participant L16 "when additive+selecting > adds shapes to the selection"
// @vitest-dedup:participant L16 "when additive+selecting > adds shapes to the selection"
import { describe, it, expect } from 'vitest'

for (const key of ['Shift', 'Control']) {
  describe('when additive+selecting', () => {
    it('adds shapes to the selection', () => {
      editor.keyDown(key)
      if (key === 'Shift') {
        expect(editor.getSelectedShapeIds()).toEqual([ids.box1, ids.box3])
      } else {
        expect(editor.getSelectedShapeIds()).toEqual([ids.box1])
      }
    })
  })
}
