// Two tests with identical bodies under DIFFERENT describe blocks that carry NO hooks.
// Expected verdict: duplicate-test. The suite path differs but nothing about behavior does.
// NOTE: bodies must be non-trivial. `expect(true).toBe(true)` is a recognized stub and is
// excluded from comparison, which would make this fixture silently untestable.
// @vitest-dedup:extracted 2
// @vitest-dedup:expect rule=duplicate-test verdict=redundant severity=error
// @vitest-dedup:participant L13 "Suite A > renders button in A"
// @vitest-dedup:participant L20 "Suite B > renders button in B"
import { test, expect, describe } from 'vitest'
import { render } from './render'

describe('Suite A', () => {
  test('renders button in A', () => {
    const element = render('button')
    expect(element.tagName).toBe('BUTTON')
  })
})

describe('Suite B', () => {
  test('renders button in B', () => {
    const element = render('button')
    expect(element.tagName).toBe('BUTTON')
  })
})
