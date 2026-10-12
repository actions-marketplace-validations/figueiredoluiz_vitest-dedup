// RECALL variant -- duplicate-test and an inline `.skipIf` comparison. Both tests carry
// byte-identical bodies under one context and the same condition. This guards the expression
// identity path: the analyzer compares exact syntax plus referenced symbol identities without
// evaluating the condition, so equal expressions remain comparable while same-spelled expressions
// over different local bindings do not collide.
import { expect, test } from 'vitest'
import { resolvePath } from './platform'

test.skipIf(process.platform === 'win32')('resolves a relative path', () => {
  const resolved = resolvePath('./a/b')
  expect(resolved).toBe('/root/a/b')
})

test.skipIf(process.platform === 'win32')('resolves a dotted path', () => {
  const resolved = resolvePath('./a/b')
  expect(resolved).toBe('/root/a/b')
})
