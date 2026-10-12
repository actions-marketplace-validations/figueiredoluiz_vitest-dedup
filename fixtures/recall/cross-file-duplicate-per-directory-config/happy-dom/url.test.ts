import { expect, test } from 'vitest'

test('resolves a relative link', () => {
  expect(normalize('/a/b', './c')).toBe('/a/c')
})
