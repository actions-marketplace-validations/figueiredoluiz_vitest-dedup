// 1 test with whole TestContext object (ctx), accessing ctx.skip() and ctx.expect()
import { test } from 'vitest'

test('whole context object', (ctx) => {
  ctx.expect(ctx.task.name).toBe('whole context object')
})
