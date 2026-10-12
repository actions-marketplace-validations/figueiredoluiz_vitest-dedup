// 1 test with .fails modifier. Test is expected to fail.
import { test } from 'vitest'

test.fails('this test is expected to fail', () => {
  throw new Error('intentional')
})
