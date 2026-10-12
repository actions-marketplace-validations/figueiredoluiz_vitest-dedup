// RECALL mixed -- a reordered pair and a redundant nested hook in one file.
//
// near-duplicate-test groups tests under an equivalent context, and the hook chain is part of
// that context, so the redundant hook sits inside the comparison the reorder finding rests on.
// Both findings must appear independently.
//
// Expected, independently:
//   near-duplicate-test warning, the two setup bodies perform the same events reordered
//   redundant-hook       warning, the inner beforeEach repeats the outer one verbatim
//
// Named weakening: restore the statement order of one setup body and near-duplicate-test must go
// while redundant-hook stays; change the inner hook body and the reverse.
import { beforeEach, describe, expect, test } from 'vitest'
import { configure, isReady, seed } from './setup'

beforeEach(() => {
  process.env.SETUP_MODE = 'fresh'
})

describe('setup', () => {
  beforeEach(() => {
    process.env.SETUP_MODE = 'fresh'
  })

  test('configures then seeds', () => {
    configure({ mode: 'test' })
    seed({ users: 3 })
    expect(isReady()).toBe(true)
  })

  test('seeds then configures', () => {
    seed({ users: 3 })
    configure({ mode: 'test' })
    expect(isReady()).toBe(true)
  })
})
