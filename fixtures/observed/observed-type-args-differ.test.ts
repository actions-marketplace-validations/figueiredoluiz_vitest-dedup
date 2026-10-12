// OBSERVED IN REAL CODE: a public TypeScript schema-validation library -- the four
// `brand direction: ...` tests, carried in both its classic and its minimal entry points.
//
// SHAPE: a type-level suite where the *only* thing that differs between two tests is an explicit
// type argument -- the type argument IS the assertion, because a type-level test says nothing
// else at all.
//
// WHAT THE ANALYZER DID WRONG: `Serializer::ser_call` built its output from callee, arguments and
// `optional` and never consulted `type_arguments`, so every such pair serialized identically and
// was reported as `duplicate-test` at ERROR severity -- on correct code, at the one severity that
// fails other people's builds. Five of that project's twelve errors were this. Fixed ("Keep
// type arguments in the fingerprint"), which renders the type-argument list into `exact`, `alpha`
// and `structural`, and into the call/assertion behavior events.
//
// WHAT IT MUST DO NOW: nothing, for both spellings of the difference below.
//
// The first pair differs in a type-argument NAME (`expectTypeOf<Input>` vs `<Output>`), the
// second in type-argument ARITY (`.brand<"A">()` vs `.brand<"A", "out">()`). They are kept
// in one file because a fix that handled one and not the other would look green on either alone.
//
// Note on the first pair's `isolates identifier`: this pair differs in a type-argument NAME, not
// arity, which is exactly `identifier`'s shape (`DIMENSIONS['identifier']`) rather than
// `type-arguments`'s (`DIMENSIONS['type-arguments']`, reserved for an arity/presence difference --
// see the second pair below). `Input` and `Output` are free identifiers the serializer keeps
// through `alpha` (a free identifier's binding identity survives it), so swapping one for the
// other diverges `alpha` and `structural` while `contextKey`/`modifierKey` stay equal -- exactly
// the relation `check-fixture-isolation.mjs` checks against --emit-test-fingerprints for
// `identifier`.
// @vitest-dedup:extracted 4
// @vitest-dedup:expect rule=none verdict=distinct severity=none
// @vitest-dedup:isolates identifier
// @vitest-dedup:participant L41 "brands the output side"
// @vitest-dedup:participant L46 "brands the input side"
// @vitest-dedup:expect rule=none verdict=distinct severity=none
// @vitest-dedup:isolates type-arguments
// @vitest-dedup:participant L51 "brand direction: out (default)"
// @vitest-dedup:participant L55 "brand direction: out (explicit)"
import { test, expectTypeOf } from 'vitest'
import { brandedString, type Input, type Output } from './branding'

test('brands the output side', () => {
  const schema = brandedString()
  expectTypeOf<Output<typeof schema>>().toEqualTypeOf<Branded>()
})

test('brands the input side', () => {
  const schema = brandedString()
  expectTypeOf<Input<typeof schema>>().toEqualTypeOf<Branded>()
})

test('brand direction: out (default)', () => {
  expectTypeOf(brandedString().brand<'A'>()).not.toBeNever()
})

test('brand direction: out (explicit)', () => {
  expectTypeOf(brandedString().brand<'A', 'out'>()).not.toBeNever()
})
