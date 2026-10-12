// RECALL pending -- type tests are not discovered, so duplicated ones are invisible.
//
// Two identical type tests. Under `--typecheck` Vitest runs both and one is deletable, exactly as
// for a runtime duplicate. The analyzer extracts ZERO tests from this directory: `.test-d.ts` does
// not match the default `include`, and `typecheck.include` in the sibling config is not consulted.
//
// The run is at least HONEST about it -- `AnalysisResult::incomplete` is set and the report says
// "absence of a finding below is not proof they are duplicate-free" -- so this is a discovery gap
// rather than a silent wrong answer, and that distinction is why this is `pending` rather than a
// known miss. A known miss claims a finding should exist among tests that were compared; here
// nothing was compared at all.
//
// `pending` is the right marker for precisely this shape, and the gate's own documentation names
// it: "an extraction floor of 2 tests over a file the analyzer cannot yet discover, say". The case
// declares `expectedTests: 2` and holds as a one-way ratchet: while the file stays undiscovered
// the case is counted and printed, and the day discovery starts working every assertion passes and
// the gate FAILS, demanding the marker come off so the expectations become hard.
//
// Named weakening: rename this file to `parse.test.ts` and both tests are found and reported as a
// duplicate at error severity -- which is the proof that the only thing missing is discovery, not
// anything about the comparison.
import { assertType, expectTypeOf, test } from 'vitest'
import { parse } from './parse'

test('parses to a string', () => {
  expectTypeOf(parse('a')).toEqualTypeOf<string>()
  assertType<string>(parse('a'))
})

test('also parses to a string', () => {
  expectTypeOf(parse('a')).toEqualTypeOf<string>()
  assertType<string>(parse('a'))
})
