// Positive half of the "arrow vs function expression" transformation. Precondition: the body
// uses neither `this` nor `arguments`. The precondition-violating twin now lives at
// fixtures/near/near-arrow-vs-function-this-twin.test.ts: it moved out of this directory once it
// was rewritten to isolate `this` honestly, because the analyzer reports that pair as a
// duplicate-test at error severity -- a false positive this file's collapse is the direct cause of.
// Read the two together: this file pins the collapse where it is CORRECT (no `this`, no
// `arguments`, so the two forms really are interchangeable), and the twin records where the same
// collapse is wrong. Here neither body touches `this`/`arguments`.
//
// Originally written expecting this to require the not-yet-built `near-duplicate-test` rule (the
// same way the other four transformation positives in fixtures/near/ do). Empirically it does not:
// the existing `duplicate-test` rule ALREADY normalizes arrows and function expressions to one
// alpha-equivalence class when neither uses `this`/`arguments`, and fires at error severity today.
// Moved here instead of fixtures/near/ once that was confirmed, so the corpus gate protects the
// behavior rather than leaving a working case undeclared.
// @vitest-dedup:extracted 2
// @vitest-dedup:expect rule=duplicate-test verdict=redundant severity=error
// @vitest-dedup:participant L23 "doubles a number, arrow form"
// @vitest-dedup:participant L27 "doubles a number, function expression form"
import { test, expect } from 'vitest'
import { double } from './math'

test('doubles a number, arrow form', () => {
  expect(double(3)).toBe(6)
})

test('doubles a number, function expression form', function () {
  expect(double(3)).toBe(6)
})
