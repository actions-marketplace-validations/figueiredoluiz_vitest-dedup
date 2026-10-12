// Identical fixture and assertion under two sibling `describe` blocks labelled for unrelated UI
// affordances. Expected verdict: duplicate-test.
//
// The enclosing describes carry no hooks and bind nothing, so the context is genuinely equivalent
// and the differing suite path does not make these different tests.
//
// Counterpart to `not-duplicates-sibling-describes-shadowed-const.test.ts`, which has the same
// outward shape but whose describes bind different values. Together they pin down that a suite
// path never decides the verdict on its own.
// @vitest-dedup:extracted 2
// @vitest-dedup:expect rule=duplicate-test verdict=redundant severity=error
// @vitest-dedup:participant L18 "edit link > renders the row action"
// @vitest-dedup:participant L24 "delete button > renders the row action"
import { describe, test, expect } from 'vitest'
import { render } from './render'

describe('edit link', () => {
  test('renders the row action', () => {
    expect(render({ id: 7 }).find('[data-test="row-action"]').exists()).toBe(true)
  })
})

describe('delete button', () => {
  test('renders the row action', () => {
    expect(render({ id: 7 }).find('[data-test="row-action"]').exists()).toBe(true)
  })
})
