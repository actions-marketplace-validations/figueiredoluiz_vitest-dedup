// RECALL negative -- the DYNAMIC twin of cross-file-duplicate-same-specifier-different-module.
//
// Byte-identical bodies in two directories, each `await import('./recipes')`-ing its OWN module.
// The static form of this was already discriminated (import_origins anchors the specifier through
// specifier_identity); the dynamic form fell through ser_expr's catch-all to a verbatim source
// slice, so the two compared EQUAL and cross-file-duplicate linked them. 380 of the corpus's
// 13,781 test files contain `await import(`.
//
// The extraction floor is the other half of the assertion: if either file stopped being analyzed
// this case would go silent for the wrong reason.
import { it, expect } from 'vitest'

it('renders the servings field', async () => {
  const { servings } = await import('./recipes')
  expect(servings).toBeGreaterThan(0)
})
