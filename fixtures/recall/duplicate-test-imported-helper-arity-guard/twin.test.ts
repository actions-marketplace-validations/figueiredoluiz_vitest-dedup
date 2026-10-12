// RECALL negative -- duplicate-test must NOT fire, and for the right reason.
//
// The helper bodies are equivalent (same-module variant's shapes), but each call passes one
// argument to a two-parameter helper. Without exact arity the second parameter has no argument
// to substitute, so inlining is refused wholesale and the calls keep their export-identity
// rendering: the pair is distinct. Loosening the guard to inline anyway (binding the missing
// parameter to nothing, or ignoring extras) would collapse this pair and this case goes red.
import { test } from 'vitest'
import { assertNonEmpty, checkActive } from './helpers'

test('accepts a plain label', () => {
  checkActive('dashboard')
})

test('accepts a plain label, again', () => {
  assertNonEmpty('dashboard')
})
