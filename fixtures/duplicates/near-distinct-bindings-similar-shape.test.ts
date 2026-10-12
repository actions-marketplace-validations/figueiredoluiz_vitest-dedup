// Two tests that look like they call "the same helper" with the same shape, but one calls the
// module's IMPORTED export and the other calls a LOCAL function that shadows it with a different
// implementation. Same call site shape (`formatLabel(x)`, same matcher) resolves to two different
// bindings -- the free-identifier identity must key on the binding, not the name (companion case to
// not-duplicates-sibling-describes-shadowed-const.test.ts, which guards the same principle for
// `describe`-scoped constants).
// @vitest-dedup:extracted 2
// @vitest-dedup:expect rule=none verdict=distinct severity=none
// @vitest-dedup:isolates binding
// @vitest-dedup:participant L16 "shared formatter > formats a label using the shared formatter"
// @vitest-dedup:participant L26 "local override > formats a label using the local override"
import { test, expect, describe } from 'vitest'
import { formatLabel } from './format'

describe('shared formatter', () => {
  test('formats a label using the shared formatter', () => {
    expect(formatLabel('x')).toBe('X')
  })
})

describe('local override', () => {
  function formatLabel(value: string) {
    return `<${value}>`
  }

  test('formats a label using the local override', () => {
    expect(formatLabel('x')).toBe('X')
  })
})
