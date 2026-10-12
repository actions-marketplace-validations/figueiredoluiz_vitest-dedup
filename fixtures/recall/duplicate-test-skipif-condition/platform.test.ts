// RECALL variant -- duplicate-test and `.skipIf` conditions the extractor CAN vouch for.
//
// `condition_fingerprint` resolves a `.skipIf`/`.runIf` argument to a symbol-scoped identity when
// it is an identifier and to a kind-tagged value when it is a literal; `Modifier::SkipIf` carries
// that fingerprint and IS part of `ModifierKey`, because two opposite run conditions are different
// behavior even under byte-identical bodies.
//
// Two claims, and they must hold together:
//   POSITIVE: the first pair carries the SAME condition symbol, so it is still ONE error-severity
//             `duplicate-test`. A key that dropped resolved conditions entirely would also pass
//             this half -- hence the negative.
//   NEGATIVE (distinct, not not-compared): the second pair carries two DIFFERENT condition
//             symbols, so the tests run on different platforms and are not interchangeable. Both
//             conditions resolve, so the run is NOT incomplete and the silence is a real verdict.
//
// The second pair deliberately uses a different callee, matcher, and argument shape from the
// first, so the only relation between the two pairs is "unrelated": that keeps
// `parameterization-candidate` out of this directory and leaves the `.skipIf` condition as the one
// variable under test.
import { expect, test } from 'vitest'
import { normalize, resolvePath } from './platform'

const isWindows = process.platform === 'win32'
const isLinux = process.platform === 'linux'

test.skipIf(isWindows)('resolves a relative path', () => {
  const resolved = resolvePath('./a/b')
  expect(resolved).toBe('/root/a/b')
})

test.skipIf(isWindows)('resolves a dotted path', () => {
  const resolved = resolvePath('./a/b')
  expect(resolved).toBe('/root/a/b')
})

test.skipIf(isWindows)('normalizes a drive letter', () => {
  expect(normalize('C:\\a\\b')).toEqual({ drive: 'C', path: '/a/b' })
})

test.skipIf(isLinux)('normalizes a drive letter on posix', () => {
  expect(normalize('C:\\a\\b')).toEqual({ drive: 'C', path: '/a/b' })
})
