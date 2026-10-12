// RECALL mixed -- a redundant nested hook and a cross-file copy in one run.
//
// redundant-hook compares hook bodies inside one hook chain, which is per-file state;
// cross-file-duplicate compares test bodies across files under an equivalent context -- and a
// hook chain is part of that context. The copied declaration therefore sits at the top level,
// OUTSIDE the describes that carry the hooks: under them its context would differ from the
// copy's and cross-file-duplicate would be correctly silent, which is itself a fact worth
// pinning beside the finding that must appear.
//
// Expected, independently:
//   redundant-hook       warning, the inner beforeEach repeats the outer one verbatim
//   cross-file-duplicate warning, the integration copy against the top-level email declaration
//
// Named weakening: change the inner hook body and redundant-hook must go while
// cross-file-duplicate stays; delete the integration file and the reverse; move the copied test
// inside the outer describe and cross-file-duplicate must go while redundant-hook stays.
import { beforeEach, describe, expect, test } from 'vitest'
import { normalizeEmail } from './email'
import { readMeter } from './meter'

test('lowercases the domain', () => {
  const normalized = normalizeEmail('User@Example.COM')
  expect(normalized).toBe('user@example.com')
})

describe('reporting', () => {
  beforeEach(() => {
    process.env.REPORT_MODE = 'quiet'
  })

  describe('meters', () => {
    beforeEach(() => {
      process.env.REPORT_MODE = 'quiet'
    })

    test('reads the meter', () => {
      expect(readMeter()).toBe(1)
    })
  })
})
