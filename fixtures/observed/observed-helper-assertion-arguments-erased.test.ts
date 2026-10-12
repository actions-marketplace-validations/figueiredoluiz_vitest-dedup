// OBSERVED IN REAL CODE: a large public React/TypeScript monorepo -- a state-machine tool test
// asserting one entry state, reported as subsumed by a sibling test asserting a different
// terminal state. The two observe different states, so the subsumption claim was wrong; it was
// hand-adjudicated `distinct` on 2026-09-17, inside a deterministic 40-finding sample of the
// external corpus. The same shape appeared again in a sibling tool test in that repository, and
// in five instances in the single-file-component compiler suite of a public Vue framework, where
// every test reads `const { content } = compile(<a different SFC source>);` followed by
// `assertCode(content)` -- the helper, not the test body, carries what is being observed.
//
// SHAPE: a project whose tests make their observation through a PROJECT-OWNED assertion helper
// (`editor.expectToBeIn(state)`, `assertCode(content)`, `expectMethodMatch(schema)`) rather than
// through `expect(...)`. The helper's argument is the entire content of the assertion.
//
// WHAT WENT WRONG: a call event in `body.behavior` recorded the callee path and nothing about the
// arguments. `expect(x).toBe('a')` vs `expect(x).toBe('b')` DO differ in `behavior` -- an
// assertion argument is a behavior-event payload, which `scripts/check/lib/isolation.mjs`'s
// `literal` dimension documents as deliberate -- but `check('a')` vs `check('b')` do not. So for
// the pair below, `subsumed-test` reports that the smaller test's events are a strict ordered
// subset of the larger's, and its message offers that "the smaller test may add no coverage". The
// offer is false: the smaller test's ONLY observation is that the state is `frame.pointing`, and
// the larger test never observes that -- it observes `select.idle`. Nothing in the larger test
// covers the smaller, so deleting it loses real coverage.
//
// WHY IT MATTERS BEYOND ONE PAIR: subsumption is a subset relation, so this erasure is quadratic
// wherever a house style routes observations through one helper. It is the single largest source
// of wrong `subsumed-test` findings measured: 7 of the 12 `distinct` verdicts in the 40-finding
// sample turn on it, and the one file it hits hardest -- that compiler suite, where every test is
// `compile(<a different SFC source>); assertCode(content)` -- produces 277 of
// that project's 653 findings on its own. It is one half of why `subsumed-test` stays Off; the
// other is the volume in `observed-homogeneous-parametric-suite.test.ts`, where the pairing is
// defensible but quadratic.
//
// FIXED: ordinary call events now carry canonical argument shapes, so the two helper observations
// differ in behavior just as the two native `expect` observations do. The representation is
// shared by `near-duplicate-test` and `subsumed-test`, so this fixture pins both against regressing.
//
// The contrast pair below -- the two `... through expect` tests -- pins the other side of the
// boundary: written with a real `expect`, the same difference in observation keeps the two tests
// apart and the rule is correctly silent. If a change ever makes THAT pair fire, the erasure has
// spread from calls to assertions and this fixture fails.
//
// FIXED 2026-09-21. A call event now carries its data arguments, so `expectToBeIn('frame.pointing')`
// and `expectToBeIn('select.idle')` are different events and neither test's behaviour is a subset
// of the other's. This fixture was `pending` -- it pinned a `subsumed-test` finding the
// adjudicator had ruled `distinct` -- and the expectation below is now the adjudicated verdict
// rather than a record of what the binary happened to do.
//
// The contrast the file was built around has collapsed in the good direction: the helper pair and
// the `expect` pair are both silent now, because the helper pair no longer behaves differently
// from the `expect` pair. What still fails if the erasure returns is the first expectation.
// @vitest-dedup:extracted 4
// @vitest-dedup:expect rule=none verdict=distinct severity=none
// @vitest-dedup:isolates not-isolable the claim is that a project-owned assertion helper no longer erases its argument, so the two tests are told apart by WHAT they observe. That is a property of one pair's behaviour events, not a relation this vocabulary names. Load-bearing instead: revert the argument fragment in `walk_call` and this expectation fails, reporting subsumed-test between exactly these two participants
// @vitest-dedup:participant L63 "enters the pointing state on pointer down"
// @vitest-dedup:participant L69 "returns to idle when the interaction completes"
// @vitest-dedup:expect rule=none verdict=distinct severity=none
// @vitest-dedup:isolates not-isolable the contrast pair deliberately differs in TWO variables -- the asserted literal and one extra action -- because it is the pair above rewritten to observe through `expect`, and the extra action is what makes the erased-call version subsume. Isolating one variable would destroy the shape being contrasted. What carries this expectation instead is the pair above, which used to fire and no longer does: the two pairs differ only in whether the observation goes through a helper call or through `expect`, and since the helper's argument stopped being erased they agree. Both silent is the correct answer for both, and the first expectation is the one that fails if the erasure returns.
// @vitest-dedup:participant L76 "observes the pointing state through expect"
// @vitest-dedup:participant L82 "observes the idle state through expect"
import { expect, test } from 'vitest'
import { makeEditor } from './editor-harness'

test('enters the pointing state on pointer down', () => {
	const editor = makeEditor()
	editor.setCurrentTool('frame')
	editor.expectToBeIn('frame.pointing')
})

test('returns to idle when the interaction completes', () => {
	const editor = makeEditor()
	editor.setCurrentTool('frame')
	editor.pointerUp(100, 100)
	editor.expectToBeIn('select.idle')
})

test('observes the pointing state through expect', () => {
	const editor = makeEditor()
	editor.setCurrentTool('geo')
	expect(editor.getPath()).toBe('geo.pointing')
})

test('observes the idle state through expect', () => {
	const editor = makeEditor()
	editor.setCurrentTool('geo')
	editor.pointerUp(100, 100)
	expect(editor.getPath()).toBe('select.idle')
})
