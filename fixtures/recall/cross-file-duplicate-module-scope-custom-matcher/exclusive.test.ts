// The sibling of `inclusive.test.ts`: the same matcher name, the exclusive comparison. For the
// value under test the two matchers disagree, so exactly one of these two tests passes.
import { expect, test } from 'vitest'
import { parseRange } from './api'

expect.extend({
  toBeWithin(received: number, low: number, high: number) {
    return { pass: received > low && received < high, message: () => 'out of range' }
  },
})

test('accepts a boundary value', () => {
  expect(parseRange('1-9').start).toBeWithin(1, 9)
})
