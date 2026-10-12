// OBSERVED IN REAL CODE: a public TypeScript schema-validation library -- a
// `passthrough drops __proto__` / `catchall(unknown) drops __proto__` pair reported as
// `near-duplicate-test`. The finding was wrong; it is gone, and this fixture is why it stays
// gone.
//
// SHAPE: two tests that build DIFFERENT subjects into a `const`, read that `const` exactly once,
// and then run the same assertions on the result. The observed pair builds
// `schema.object({ name: schema.string() }).passthrough()` on one side and
// `schema.object({ name: schema.string() }).catchall(schema.unknown())` on the other.
//
// WHAT USED TO GO WRONG: `near-duplicate-test` keys on the SORTED multiset of `body.behavior`
// events, and its message asserts the two tests "execute the same behavior events, in a different
// order". Dataflow canonicalization's single-use local inlining (`fingerprint.rs`, the "Dataflow
// canonicalization" section) makes `BehaviorCollector::walk_stmt` skip a fully-inlined
// declarator's initializer, on the premise that the local's one READ accounts for it instead. Only
// half of that premise existed: the rendering half (`BehaviorCollector::shape`) covers a read
// standing in an assertion's subject or expected value, and nothing at all covered a read standing
// anywhere else. Here the read is the receiver of `subject.run()`, so the entire subject
// construction vanished from `behavior` and two tests building unrelated subjects collided on a
// fingerprint claiming they execute the same events.
//
// WHAT HAPPENS NOW: `BehaviorCollector::walk_inlined_read` supplies the missing half, re-emitting
// the initializer's own events at the read site -- the position the inlined expression would have
// occupied, so the event ORDER matches the inlined form too, which `subsumed-test`'s ordered
// subsequence needs and `near-duplicate-test`'s sorted multiset would not have caught. The two
// bodies below now differ at `behavior` exactly where they differ in source: one calls
// `buildFrom` with three arguments, the other calls `buildEmpty` with none.
//
// WHY THIS FIXTURE STILL DISCRIMINATES: `buildFrom` and `buildEmpty` are deliberately unrelated --
// different callee, different arity -- so the pair is `distinct` for a reason, not by coincidence,
// and it goes back to firing the moment the initializer's events stop being accounted for. The
// boundary is pinned from the other two directions by unit tests in `fingerprint.rs`
// (`dataflow_local_read_twice_outside_an_assertion_stays_distinct`, which shows inlining rather
// than the bodies is the trigger, and `dataflow_inlined_read_as_assertion_subject_is_not_double_counted`,
// which shows the read-site emission does not double-count the direction that already worked);
// `fixtures/duplicates/near-extracted-local-positive.test.ts` pins that single-use inlining still
// converges the pair it exists to converge.
// @vitest-dedup:extracted 2
// @vitest-dedup:expect rule=none verdict=distinct severity=none
// @vitest-dedup:isolates identifier
// @vitest-dedup:participant L46 "builds the subject from three inputs"
// @vitest-dedup:participant L53 "builds an empty subject"
import { expect, test } from 'vitest'
import { buildEmpty, buildFrom } from './subject-builders'

test('builds the subject from three inputs', () => {
	const subject = buildFrom(1, 2, 3)
	const result = subject.run()
	expect(result).toBe(1)
	expect(result).toEqual(2)
})

test('builds an empty subject', () => {
	const subject = buildEmpty()
	const result = subject.run()
	expect(result).toBe(1)
	expect(result).toEqual(2)
})
