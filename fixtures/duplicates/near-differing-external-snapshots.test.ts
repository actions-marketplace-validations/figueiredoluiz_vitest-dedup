// Two near-identical `toMatchSnapshot()` calls whose STORED snapshots differ. The analyzer never
// reads `__snapshots__/*.snap` -- it only sees the call shape `expect(render(subject)).
// toMatchSnapshot()` -- so this pair must stay distinct on the strength of the subjects being two
// different free bindings (not literals), never on inspecting snapshot content that isn't there.
// @vitest-dedup:extracted 2
// @vitest-dedup:expect rule=none verdict=distinct severity=none
// @vitest-dedup:isolates identifier
// @vitest-dedup:participant L14 "renders the compact card"
// @vitest-dedup:participant L18 "renders the expanded card"
import { test, expect } from 'vitest'
import { render } from './card'
import { compactSubject, expandedSubject } from './fixtures-data'

test('renders the compact card', () => {
  expect(render(compactSubject)).toMatchSnapshot()
})

test('renders the expanded card', () => {
  expect(render(expandedSubject)).toMatchSnapshot()
})
