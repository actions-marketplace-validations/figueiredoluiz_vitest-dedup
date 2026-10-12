// 1 test with bench as TestContext fixture (v5 shape), destructured from callback
import { test } from 'vitest'

test('bench v5 fixture', ({ bench }) => {
  bench('operation', () => {
    const x = 1 + 1
  })
})
