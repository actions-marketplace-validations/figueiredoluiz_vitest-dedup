// MIXED: S7's false-positive shape and S7's true positive, in one file, at two declarations.
//
// FIRST DECLARATION (loop-enclosed, title interpolates the loop variable): the observed
// config-merge shape. `${scope}` cannot fold, so iteration `user` and iteration
// `team` produce rows the analyzer cannot tell apart, and it links them. Every row VALUE is
// distinct; the cases are not. This half must go silent.
//
// SECOND DECLARATION (no loop, renderable title, `['a', 1]` written twice): the hono
// `aws-lambda/handler.test.ts` 102/104 shape -- a literally repeated table row. This half must
// keep firing.
//
// WHY THE PAIRING: the cheap fix for S7 is to stop comparing rows of a declaration whose title
// will not render. That fix passes every negative in `fixtures/duplicates/` and would also pass
// here if this file held only the first declaration. The second declaration is what refuses a
// fix that reaches too far -- the discrimination has to be on row VALUES, not on whether the
// title renders.
//
// An earlier draft put both shapes in ONE declaration. It was discarded: the analyzer reports
// every row of a collapsed declaration at the declaration's line, so the genuine pair and the
// collapsed pairs were indistinguishable by participant and neither half could be asserted
// separately. Two declarations is not cosmetic here; it is what makes the file checkable.
//
// Named weakening for the pending half: hoist the `for` so `${scope}` folds into the title. The
// cross-iteration links disappear and only the second declaration's repeat survives.
// @vitest-dedup:extracted 7
// @vitest-dedup:expect rule=duplicate-each-row verdict=redundant severity=warning
// @vitest-dedup:participant L50 "counts a"
// @vitest-dedup:participant L50 "counts a"
// ONE expectation where there used to be two: the `a`/`b` rows stopped being distinguishable
// titles once the renderer declined the unresolvable `${scope}`.
//
// The contrast with the L50 expectation above is this fixture's whole point and survives intact:
// the REAL duplicate row, whose title renders, is still reported, while the template-title rows
// are not. A fix that silenced both would pass a fixture checking only the silence.
// @vitest-dedup:expect rule=none verdict=not-compared severity=none
// @vitest-dedup:isolates not-isolable the two iterations' rows are indistinguishable by construction -- the loop variable folds into neither the title nor the body, so every emitted field agrees and no relation between participants could fail; the guard is the corpus gate's silence assertion plus the named weakening in the header
// @vitest-dedup:participant L42 "`resolves ${scope} %s`"
// @vitest-dedup:participant L42 "`resolves ${scope} %s`"
import { it, expect } from 'vitest'

for (const scope of ['user', 'team']) {
  it.each([
    ['a', 1],
    ['b', 2],
  ])(`resolves ${scope} %s`, (key, expected) => {
    expect(lookup(scope, key)).toBe(expected)
  })
}

it.each([
  ['a', 1],
  ['b', 2],
  ['a', 1],
])('counts %s', (key, expected) => {
  expect(tally(key)).toBe(expected)
})
