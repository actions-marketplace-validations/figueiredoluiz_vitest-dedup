// RECALL negative -- redundant-hook where the nested hook does DIFFERENT work.
//
// Same kind, same chain, same shape -- two statements, both calls -- but the inner hook seeds
// fixtures rather than repeating the migration. Nothing is repeated, so nothing may be reported.
// This is the layered-setup arrangement almost every real suite uses, and reporting it would make
// the rule unusable.
//
// Load-bearing: replace the inner body with the outer one and the pair becomes one
// `redundant-hook` warning -- `redundant-hook-positive` is that edit, already made. The context
// resolves, so the silence is `distinct`.
import { beforeEach, describe, expect, test, vi } from 'vitest'
import { rowCount, seedFixtures, seedIndexes } from './db'

beforeEach(() => {
  vi.clearAllMocks()
  vi.resetModules()
})

describe('queries', () => {
  beforeEach(() => {
    seedFixtures()
    seedIndexes()
  })

  test('starts from the seeded rows', () => {
    expect(rowCount()).toBe(3)
  })
})
