// Twin of not-redundant-hook-append-log.test.ts: the same shape with `setLevel('info')` -- an
// idempotent configuration write -- in place of `console.log('beforeAll')`. The pair MUST fire,
// today and after the S5 fix: setting the same level twice changes nothing the second time, so
// the nested registration truly is repeated setup.
// @vitest-dedup:extracted 2
// @vitest-dedup:expect rule=redundant-hook verdict=redundant severity=warning
// @vitest-dedup:participant L11 "beforeAll"
// @vitest-dedup:participant L20 "beforeAll"
import { describe, it, expect, beforeAll, vi } from 'vitest'

beforeAll(() => {
  vi.unstubAllEnvs()
})

it('sees the info level', () => {
  expect(level()).toBe('info')
})

describe('nested', () => {
  beforeAll(() => {
    vi.unstubAllEnvs()
  })

  it('still sees the info level', () => {
    const current = level()
    expect(current).toBe('info')
  })
})
