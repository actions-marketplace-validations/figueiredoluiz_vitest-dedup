// Precondition-violating twin for the "arrow vs function expression" transformation. The
// transformation's precondition is that the body uses NEITHER `this` NOR `arguments`; here both
// bodies use `this`, so the callbacks are NOT interchangeable: the `function` form binds `this` at
// its own call site, while the arrow form closes over the enclosing module's `this`. Same body
// text, different `this`, different behavior -- so `distinct`.
//
// HOW THIS FIXTURE FOUND A REAL DEFECT
// ------------------------------------
// The previous version could not fail for its stated reason. Its two bodies were
// `let value = 0; value = 5; expect(value).toBe(5)` (arrow) versus `this.value = 5;
// expect(this.value).toBe(5)` (function). Those differ in CONTENT, not only in `this` binding:
// their fingerprints diverged because one declared a local and the other wrote a member, which has
// nothing to do with `this`. A regression collapsing lexical and dynamic `this` would have left the
// old `rule=none` assertion green. `scripts/check/check-fixture-isolation.mjs` is the gate that
// now catches that shape, and this file is the first fixture it was written against.
//
// Rewritten so both callbacks carry the SAME `this`-using body and differ only in arrow versus
// `function`, it immediately failed: the analyzer reported `duplicate-test` at ERROR severity on
// this pair. `Serializer::ser_callable` emitted the same `(fn (params) body)` for both forms
// unconditionally. That collapse is correct and desirable in general -- rewriting an arrow as a
// `function` is the most common cosmetic difference between two copies of one test, and
// `near-arrow-vs-function-equivalence.test.ts` pins it -- but it is only sound while the body uses
// neither `this` nor `arguments`, the two constructs an arrow does not bind. The serializer now
// records the callback's form only when the body actually reads one of them, so the collapse
// survives everywhere it was right and stops exactly where it was wrong.
//
// NOT RUNNABLE UNDER VITEST, DELIBERATELY
// ---------------------------------------
// `this` at module scope in strict ESM is `undefined`, so `this.value = 5` throws in the arrow
// form. These fixtures are analyzed, never executed, so that is acceptable -- but it is declared
// machine-readably below for the open idea of running fixtures under real Vitest as an oracle.
//
// A variant that is both isolating AND runnable does not exist. Vitest passes the test context as
// the first ARGUMENT, never as `this`, so the two forms differ observably only when the `function`
// form receives a non-`undefined` `this`, which never happens. Any runnable pair either writes to
// `this` and throws in the arrow form, or merely reads `this`, sees `undefined` in both, and stops
// isolating. `arguments` fails earlier still: an arrow has no `arguments` binding, so the pair
// cannot even be written. That is a property of the language, not of this fixture.
// @vitest-dedup:not-runnable `this` at module scope is undefined in strict ESM; the arrow form throws
// @vitest-dedup:extracted 2
// @vitest-dedup:expect rule=none verdict=distinct severity=none
// @vitest-dedup:isolates callback-form
// @vitest-dedup:participant L47 "records a value on this, arrow form"
// @vitest-dedup:participant L52 "records a value on this, function expression form"
import { test, expect } from 'vitest'

test('records a value on this, arrow form', () => {
  this.value = 5
  expect(this.value).toBe(5)
})

test('records a value on this, function expression form', function () {
  this.value = 5
  expect(this.value).toBe(5)
})
