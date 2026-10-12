// A cluster of tests whose titles each promise a distinct behavior while every body only mounts
// the component and asserts that it exists.
// Expected verdict: duplicate-test, reported as a cluster.
//
// None of these observes the behavior its title claims, so they are not merely redundant -- they
// are tests that assert nothing, wearing descriptive names. Reporting them is the point of the
// rule, and the remedy is to write the missing assertions rather than to delete the extras.
// @vitest-dedup:extracted 3
// @vitest-dedup:expect rule=duplicate-test verdict=redundant severity=error
// @vitest-dedup:participant L19 "DocumentPanel > saves the document"
// @vitest-dedup:participant L24 "DocumentPanel > handles a save error"
// @vitest-dedup:expect rule=duplicate-test verdict=redundant severity=error
// @vitest-dedup:participant L24 "DocumentPanel > handles a save error"
// @vitest-dedup:participant L29 "DocumentPanel > requests a presigned URL"
import { describe, test, expect } from 'vitest'
import { createWrapper } from './helpers'

describe('DocumentPanel', () => {
  test('saves the document', () => {
    const wrapper = createWrapper()
    expect(wrapper.exists()).toBe(true)
  })

  test('handles a save error', () => {
    const wrapper = createWrapper()
    expect(wrapper.exists()).toBe(true)
  })

  test('requests a presigned URL', () => {
    const wrapper = createWrapper()
    expect(wrapper.exists()).toBe(true)
  })
})
