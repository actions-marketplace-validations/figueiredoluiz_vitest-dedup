// OBSERVED IN REAL CODE: a private 24,147-test Vue/TypeScript codebase, 2026-09-21. 45 of its 273
// `near-duplicate-test` findings and 51 of its 753 `subsumed-test` findings were this one shape,
// all of them in `composables/**/__tests__/`. Two examples adjudicated by reading the pairs:
// one pair in an edit-modal composable (one test destructures the editing copy, the other the
// stored original, and each asserts about the one it took) and a second pair in a bulk-action
// composable's suite (two different disabled-state flags read off the same
// composable). Neither pair shares an observation.
//
// SHAPE: a factory-style helper returning an object of named values -- a Vue composable, a
// `setup()` harness, a hook-testing wrapper -- where each test destructures the ONE value it is
// about and asserts on it. `const { isEveryTag } = useThing()` against
// `const { isSameAsInitial } = useThing()`.
//
// WHAT WENT WRONG: the destructured local is declared inside the body, so alpha-renaming collapses
// it to a positional `L`-number, and `behavior` had nowhere else to keep the property key -- the
// two bodies emitted the byte-identical event list. `alpha` and `structural` both keep the key
// (they serialize the binding pattern), so `duplicate-test` and `parameterization-candidate` were
// never exposed; the erasure reached exactly the two rules that key on `behavior`. The
// "destructuring to member access" canonicalization does not cover it: that transform requires
// the destructured object to be a plain identifier resolving outside the body, and `useThing()`
// is a call, so the gate declines and the key was dropped rather than relocated into an
// `object.property` rendering.
//
// FIXED 2026-09-21. A read of a destructured local now renders as `id:L0:prop:isEveryTag`, in the
// assertion-shape position and in the callee position alike (`DataflowSubst::DestructuredProperty`). A symbol the
// member-access transform already claimed keeps that claim, so `const { a } = o; use(a)` still
// matches `use(o.a)` -- see `near-destructure-vs-member-positive.test.ts` in this
// same directory.
//
// The third pair is the positive twin: same destructuring shape, same property key on both
// sides, independent setup reordered. It fires, and it must keep firing -- a precision fix and a
// deleted rule produce identical silence, so a change that quieted the two negatives by weakening
// the rule rather than by telling the property keys apart would silence this one too.
// @vitest-dedup:extracted 6
// @vitest-dedup:expect rule=none verdict=distinct severity=none
// @vitest-dedup:isolates not-isolable the claim is that two tests destructuring DIFFERENT keys off the same factory call no longer share a behavior event list. The vocabulary's nearest dimension, `identifier`, constrains only `alpha` and `structural` -- both of which already differed here before the fix and would still differ after reverting it, so declaring it would assert something no regression in this area can break. Load-bearing instead: revert the `DataflowSubst::DestructuredProperty` registration in `analyze_dataflow` and this expectation fails, reporting near-duplicate-test between exactly these two participants
// @vitest-dedup:participant L51 "exposes whether every tag is selected"
// @vitest-dedup:participant L56 "exposes whether the selection is unchanged"
// @vitest-dedup:expect rule=none verdict=distinct severity=none
// @vitest-dedup:isolates not-isolable the same claim in the callee position rather than the assertion-subject position: the destructured binding is CALLED, so the key has to reach `call_path`, not `shape`. One dimension cannot name two rendering sites, and `identifier` is no more load-bearing here than above. Load-bearing instead: revert `call_path`'s `path_identity` arm to a bare `self.reference(ident)` and this expectation fails, reporting near-duplicate-test between exactly these two participants while the pair above stays silent
// @vitest-dedup:participant L61 "fetches a user by id"
// @vitest-dedup:participant L67 "deletes a user by id"
// @vitest-dedup:expect rule=near-duplicate-test verdict=similar-uncertain severity=warning
// @vitest-dedup:participant L73 "reads the disabled flag after priming the options"
// @vitest-dedup:participant L79 "primes the options after reading the disabled flag"
import { test, expect } from 'vitest'
import { useTagSelection } from './tag-selection'
import { useUserApi, apiCalls } from './user-api'
import { useDeliveryOptions, primeOptions } from './delivery-options'

test('exposes whether every tag is selected', () => {
  const { isEveryTag } = useTagSelection()
  expect(isEveryTag.value).toBe(true)
})

test('exposes whether the selection is unchanged', () => {
  const { isSameAsInitial } = useTagSelection()
  expect(isSameAsInitial.value).toBe(true)
})

test('fetches a user by id', async () => {
  const { fetchUser } = useUserApi()
  await fetchUser(1)
  expect(apiCalls).toBe(1)
})

test('deletes a user by id', async () => {
  const { deleteUser } = useUserApi()
  await deleteUser(1)
  expect(apiCalls).toBe(1)
})

test('reads the disabled flag after priming the options', () => {
  primeOptions()
  const { isDisabled } = useDeliveryOptions()
  expect(isDisabled.value).toBe(false)
})

test('primes the options after reading the disabled flag', () => {
  const { isDisabled } = useDeliveryOptions()
  primeOptions()
  expect(isDisabled.value).toBe(false)
})
