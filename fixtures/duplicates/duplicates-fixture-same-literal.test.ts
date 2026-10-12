// Positive control for not-duplicates-fixture-literal-kind.test.ts: two tests under fixtures bound
// to the SAME literal of the SAME kind, with identical bodies. Expected verdict: duplicate-test.
//
// Without this control, the kind-tagging fix could be "passed" by an implementation that simply
// made every fixture context compare unequal, which would silence the rule entirely.
// @vitest-dedup:extracted 2
// @vitest-dedup:expect rule=duplicate-test verdict=redundant severity=error
// @vitest-dedup:participant L23 "reads the mode one way"
// @vitest-dedup:participant L27 "reads the mode another way"
// CROSS-FILE COLLISION (declared, not dodged): the first test below runs under a `test.extend`
// fixture bound to the numeric literal 1000, which is exactly the context of
// not-duplicates-fixture-literal-kind.test.ts's numeric half, and the bodies match, so
// `cross-file-duplicate` links them. True by the rule's criteria; both fixtures are needed.
// `fixtures/README.md`, "Incidental cross-file collisions", explains why it is declared.
// @vitest-dedup:expect rule=cross-file-duplicate verdict=redundant severity=warning
// @vitest-dedup:participant L23 "reads the mode one way"
// @vitest-dedup:participant not-duplicates-fixture-literal-kind.test.ts#L31 "reads a numeric mode"
import { test, expect } from 'vitest'

const withModeA = test.extend({ mode: 1000 })
const withModeB = test.extend({ mode: 1000 })

withModeA('reads the mode one way', ({ mode }) => {
  expect(mode).toBeDefined()
})

withModeB('reads the mode another way', ({ mode }) => {
  expect(mode).toBeDefined()
})
