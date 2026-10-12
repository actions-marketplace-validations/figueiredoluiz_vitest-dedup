// RECALL variant -- duplicate-test across `.concurrent` and `.sequential`.
//
// Byte-identical bodies under one context, differing only in a concurrency modifier.
// `ModifierKey::new` deliberately EXCLUDES `Concurrent` and `Sequential`: they change whether,
// when, or in what order a test runs, never which outcome counts as correct. So the pair is still
// the same behavior duplicated, and the expectation is ONE error-severity `duplicate-test` -- the
// same position `duplicates-one-skipped` pins for `.skip`.
//
// This is the falsifiable half of that design decision. `.fails` is the excluded-from-exclusion
// case (it inverts the pass condition and IS in the key); a change that moved `Concurrent` to the
// `.fails` side of the line would be a recall regression with no fixture to catch it before now.
import { expect, test } from 'vitest'
import { drain } from './queue'

test.concurrent('drains a queue of three', async () => {
  const queue = [1, 2, 3]
  await expect(drain(queue)).resolves.toBe(3)
})

test.sequential('drains a queue of three, sequentially', async () => {
  const queue = [1, 2, 3]
  await expect(drain(queue)).resolves.toBe(3)
})
