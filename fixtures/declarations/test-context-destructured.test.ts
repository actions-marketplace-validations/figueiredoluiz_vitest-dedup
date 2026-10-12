// 1 test with destructured TestContext parameters ({expect, skip, task})
import { test } from 'vitest'

test('destructured context', ({ expect, skip, task }) => {
  expect(task.name).toBe('destructured context')
})
