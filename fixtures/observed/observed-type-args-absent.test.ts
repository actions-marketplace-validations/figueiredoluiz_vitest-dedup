// OBSERVED IN REAL CODE: a public Vue composable library -- "should trigger event with no
// params" against "should pass union type" in one event-hook suite, reported as
// `near-duplicate-test`.
//
// SHAPE: the same helper called with and without an explicit type argument. The second test
// exists *because* of the type argument: `createEventHook<number | string>()` is the entire
// point of it, and the runtime steps around it are deliberately the same as the untyped test's.
//
// WHAT THE ANALYZER DID WRONG: with type arguments erased the two calls serialized identically,
// so the pair came out as a near-duplicate -- a Warning rather than the sibling fixture's Error,
// erasure, and the more insidious half of it: a reviewer who deletes "the redundant one" deletes
// the only test covering the typed call. The type-argument fix renders the type-argument list into the
// behavior events too (`near-duplicate-test` and `subsumed-test` key on those, not on `alpha`),
// which is what silences this.
//
// WHAT IT MUST DO NOW: nothing.
//
// This pair is the presence/absence spelling of the difference. `check-fixture-isolation.mjs`
// checks it as `type-arguments` (`DIMENSIONS['type-arguments']`): `contextKey` and `modifierKey`
// must agree, and `alpha`/`structural` must differ -- the explicit type-argument list is part of
// the call expression the serializer records, so a call carrying one and a call without it
// diverge there even though the runtime steps around each call are otherwise identical.
// @vitest-dedup:extracted 2
// @vitest-dedup:expect rule=none verdict=distinct severity=none
// @vitest-dedup:isolates type-arguments
// @vitest-dedup:participant L32 "createEventHook > triggers with no declared payload type"
// @vitest-dedup:participant L40 "createEventHook > triggers with an explicit payload type"
import { describe, it, expect } from 'vitest'
import { createEventHook } from './event-hook'

describe('createEventHook', () => {
  it('triggers with no declared payload type', () => {
    let timesFired = 0
    const { on: onResult, trigger } = createEventHook()
    onResult(() => timesFired++)
    trigger()
    expect(timesFired).toBe(1)
  })

  it('triggers with an explicit payload type', () => {
    let timesFired = 0
    const { on: onResult, trigger } = createEventHook<number | string>()
    onResult(() => timesFired++)
    trigger()
    expect(timesFired).toBe(1)
  })
})
