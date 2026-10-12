// MIXED: S7 (loop-enclosed `.each` collapsing on an unrenderable title) x S5 (a nested hook
// repeating non-idempotent work), with no configuration involved -- both defects in one file,
// each with its own cause and its own fix.
//
// The requirement is stricter than "both stay silent". Each silence must arrive for its OWN
// reason: an S7 fix must not be what quiets the hook pair, and an S5 fix must not be what quiets
// the rows. A file holding only one of the two cannot state that, which is why this one exists.
//
// S7 half: the `.each` sits inside `for (const region of ...)` and interpolates the loop
// variable, so no row title renders and the two iterations' rows are linked.
// S5 half: the nested `beforeEach` repeats the ancestor's `ledger.push(...)`, an append, which
// is not idempotent -- running it twice is not running it once.
//
// Named weakenings, one per half: (S7) hoist the `for` so `${region}` folds into the title;
// (S5) change both pushes to `ledger.length = 0`, which is idempotent, and `redundant-hook`
// starts firing for a correct reason.
// @vitest-dedup:extracted 4
// ONE expectation where there used to be two. Before S7 the title template rendered per row, so
// `q1` and `q2` were distinguishable titles needing an entry each. The renderer now declines an
// unresolvable `${...}`, so all four rows carry the single unrendered pattern and there is one
// claim to make.
// @vitest-dedup:expect rule=none verdict=not-compared severity=none
// @vitest-dedup:isolates not-isolable the two iterations' rows are indistinguishable by construction -- the loop variable folds into neither the title nor the body -- so no relation between participants could fail; the guard is the corpus gate's silence assertion plus the named weakening in the header
// @vitest-dedup:participant L62 "regional > `totals for ${region} %s`"
// @vitest-dedup:participant L62 "regional > `totals for ${region} %s`"
//
// The hook expectation below is held by TWO independent reasons, and this paragraph exists so a
// reader does not credit the wrong one. It was written when only the first had landed, and said
// "S5 stays open: `redundant-hook` still does not check idempotence" -- true when written, false
// since, which is the prose-vs-behaviour drift this repository keeps catching. Corrected.
//
//   1. The rows are unresolved. The S7 renderer change makes every row here
//      `Title::Parameterized`, F5 marks a parameterized title unresolved, and
//      `emit_redundant_hook` scans only tests whose context `is_comparable()` -- so these hooks
//      are never reached. Measured: reverting only the renderer decline restores
//      `redundant-hook L52,L57` on this file.
//   2. The bodies are not idempotent. S5 HAS landed: `emit_redundant_hook` now requires
//      `outer.idempotent && inner.idempotent`, and `ledger.push('open')` is an ordinary call --
//      `hook_body_is_idempotent` admits only a constant overwrite, a guarded initialization, or
//      a framework reset resolved through the import graph.
//
// Either alone would silence this pair, so neither can be verified by deleting the other. The
// fixtures that check reason 2 on its own are the `not-redundant-hook-*` negatives, whose rows
// render normally and whose contexts resolve.
// @vitest-dedup:expect rule=none verdict=not-compared severity=none
// @vitest-dedup:isolates not-isolable the two hooks are byte-identical, so idempotence is a property of the one shared body rather than a relation between participants -- no dimension could fail; the guard is the corpus gate's silence assertion plus the named weakening in the header
// @vitest-dedup:participant L52 "beforeEach"
// @vitest-dedup:participant L57 "beforeEach"
import { describe, it, expect, beforeEach } from 'vitest'
import { ledger, regionalTotal } from './shared-ledger'

beforeEach(() => {
  ledger.push('open')
})

describe('regional', () => {
  beforeEach(() => {
    ledger.push('open')
  })

  for (const region of ['north', 'south']) {
    it.each([['q1', 10], ['q2', 20]])(`totals for ${region} %s`, (quarter, expected) => {
      expect(regionalTotal(region, quarter)).toBe(expected)
    })
  }
})
