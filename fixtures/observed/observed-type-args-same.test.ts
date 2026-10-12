// OBSERVED IN REAL CODE: the same suite as observed-type-args-differ.test.ts -- this is that
// fixture's POSITIVE twin, and the reason the type-argument fix is a fingerprint change rather
// than "compare the source text of the angle brackets".
//
// SHAPE: two type-level tests whose type arguments are the SAME type, written differently --
// one on a single line, one broken across lines with extra spacing. Prettier and a hand edit
// produce this pair routinely.
//
// WHAT IT MUST DO: report ONE `duplicate-test` at error severity. A fix that kept the raw
// type-argument text verbatim would silence this pair too, and silence is what a precision fix
// looks like from the outside -- so the negative twin alone cannot tell "stopped over-reporting"
// from "stopped reporting". The same fix normalizes the text (whitespace runs deleted unless they
// separate two identifier characters, so `keyof T` can never become `keyofT`), which is what
// makes this pair still a duplicate while the other fixture's pairs are not.
// @vitest-dedup:extracted 2
// @vitest-dedup:expect rule=duplicate-test verdict=redundant severity=error
// @vitest-dedup:participant L22 "accepts the widened union"
// @vitest-dedup:participant L27 "accepts the widened union, restated"
import { test, expectTypeOf } from 'vitest'
import { parseWidened } from './branding'

test('accepts the widened union', () => {
  const parsed = parseWidened('abc')
  expectTypeOf(parsed).toEqualTypeOf<Branded | Widened>()
})

test('accepts the widened union, restated', () => {
  const parsed = parseWidened('abc')
  expectTypeOf(parsed).toEqualTypeOf<
    Branded | Widened
  >()
})
