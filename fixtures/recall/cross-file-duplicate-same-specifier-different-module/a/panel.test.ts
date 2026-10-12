// RECALL negative -- S6: the same specifier TEXT ('./recipes') resolving to a DIFFERENT module in
// each subdirectory (two files named recipes.ts cannot share one directory, which is why this is
// a recall case, not a flat fixture). One-edit weakening: point both imports at one shared module
// -- the contexts genuinely merge and `cross-file-duplicate` fires. Anchored import resolution
// keeps this pair unlinked today, and this case pins that the S6 fix may not regress it.
import { expect, test } from 'vitest'
import { servings } from './recipes'

test('renders the servings field', () => {
  const panel = buildPanel()
  expect(panel.servings).toBe(servings)
})
