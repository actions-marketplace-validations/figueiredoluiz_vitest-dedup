// 1 test with dynamic template literal title (runtime variable), must degrade to dynamic handling
import { test, expect } from 'vitest'

const runtimeVar = 'value'

test(`title with ${runtimeVar} substitution`, () => {
  expect(runtimeVar).toBe('value')
})
