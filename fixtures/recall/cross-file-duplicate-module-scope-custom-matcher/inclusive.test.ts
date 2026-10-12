// RECALL known false positive -- module-scope ambient state, case 4, and the starkest.
//
// Both files register a custom matcher called `toBeWithin` and then use it identically. One
// defines it INCLUSIVE (`>=`, `<=`), the sibling EXCLUSIVE (`>`, `<`). For the value under test --
// `parseRange('1-9').start`, which is 1 -- the inclusive matcher PASSES and the exclusive one
// FAILS. The two tests could not be more different, and the analyzer reports
// `cross-file-duplicate` saying they are "under an equivalent context".
//
// Distinct from the three `vi.*` cases beside it, and kept separate for that reason. Those stub a
// dependency: the test still means what it says, and something underneath it was swapped. This one
// redefines what the ASSERTION means. The body is identical, the dependency is identical, and the
// predicate applied to the result is not -- so no amount of looking at the test or at what it
// calls can distinguish the two. That makes it the case most likely to survive a partial fix aimed
// at the `vi.*` family.
//
// MECHANISM: same root. `expect.extend` is a synchronous module-scope call, so it reaches neither
// `Context::module_setup` (awaited calls only) nor the mock fold (hoisted `vi.mock` only).
//
// Named weakening: give both files the same comparison operators and the finding becomes correct.
import { expect, test } from 'vitest'
import { parseRange } from './api'

expect.extend({
  toBeWithin(received: number, low: number, high: number) {
    return { pass: received >= low && received <= high, message: () => 'out of range' }
  },
})

test('accepts a boundary value', () => {
  expect(parseRange('1-9').start).toBeWithin(1, 9)
})
