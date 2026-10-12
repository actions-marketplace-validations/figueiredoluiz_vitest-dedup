// RECALL negative -- parameterization-candidate, on the literal-KIND axis.
//
// The two bodies have the same shape and differ only in their literals -- which is the rule's
// trigger -- but the literals differ in KIND, not value: the number `1` against the string `'1'`.
// A table over those two rows would not be consolidating two cases of one behavior; the pair is
// precisely a test that the coercion boundary is observed, and merging them would delete the
// distinction the tests exist to make.
//
// This is the corpus's most expensive lesson turned into a recall case. `Serializer::literal`
// originally dropped a literal's kind, so `true == 'true'` and `[''] == []` compared equal, and the
// fixture that was supposed to guard it compared two NUMBERS -- same kind, different values -- so
// it passed on the broken implementation. This case varies the kind, which is the thing an
// implementation might collapse, rather than the value.
//
// Load-bearing: change `'1'` to `1` in the second test and the pair becomes an error-severity
// `duplicate-test` (identical bodies), so the silence here cannot be the rule having been deleted.
// Both contexts resolve, so it is `distinct`, not `not-compared`.
import { expect, test } from 'vitest'
import { coerce } from './coerce'

test('coerces the number one', () => {
  const parsed = coerce(1)
  expect(parsed).toBe(1)
})

test('coerces the string one', () => {
  const parsed = coerce('1')
  expect(parsed).toBe('1')
})
