// The sibling of `timers-fake.test.ts`: same imports, same body, same assertion, real timers.
// Kept in the SAME directory deliberately -- `./retry` must resolve to one module for the two
// tests to be eligible for comparison at all. Split across directories the specifier would name
// two different modules and the pair would be correctly incomparable for an unrelated reason,
// which would make this case pass while proving nothing.
import { expect, test, vi } from 'vitest'
import { scheduleRetry } from './retry'

vi.useRealTimers()

test('schedules a retry under real timers', () => {
  const handle = scheduleRetry(1000)
  expect(handle.pending).toBe(true)
})
