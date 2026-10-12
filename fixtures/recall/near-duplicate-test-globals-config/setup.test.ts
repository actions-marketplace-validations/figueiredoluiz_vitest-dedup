// Ambient globals only. The same two calls in the opposite order, same assertion: the behaviour
// is equivalent, the source order is not.
import { configure, isReady, seed } from './setup'

test('configures then seeds', () => {
  configure({ mode: 'test' })
  seed({ users: 3 })
  expect(isReady()).toBe(true)
})

test('seeds then configures', () => {
  seed({ users: 3 })
  configure({ mode: 'test' })
  expect(isReady()).toBe(true)
})
