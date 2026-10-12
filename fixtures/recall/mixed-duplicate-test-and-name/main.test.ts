// RECALL mixed -- duplicate-test and duplicate-test-name on the SAME pair of participants.
//
// The two tests are alpha-equal AND share a full title, so both rules must fire on exactly the
// same two declarations. This is the one arrangement where a precedence change -- one rule
// starting to suppress the other when both apply -- would be visible, and no single-rule case can
// observe it: every `-positive` holds exactly one defect.
//
// Expected, independently:
//   duplicate-test      error, the two bodies are identical under the same context
//   duplicate-test-name warning, the two declarations render the same full title
//
// Named weakening: rename one test and only duplicate-test may remain; change one literal in one
// body and only duplicate-test-name may remain.
import { expect, test } from 'vitest'
import { balance, settle } from './ledger'

test('settles the balance', () => {
  settle('order-1')
  expect(balance('order-1')).toBe(0)
})

test('settles the balance', () => {
  settle('order-1')
  expect(balance('order-1')).toBe(0)
})
