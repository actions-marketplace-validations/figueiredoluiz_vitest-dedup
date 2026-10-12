// Each case stages content in a temporary repository and asks gitleaks whether it would block it.

import assert from 'node:assert/strict'
import test from 'node:test'

import { ALLOWLISTED_PATH, CACHE_KEY_LINE, plantedKey, runCases, scanStaged } from './check-secret-scan.mjs'

test('a planted fake key staged in a source file makes gitleaks exit non-zero', () => {
  const { status, output } = scanStaged({ 'src/config.env': `AWS_ACCESS_KEY_ID=${plantedKey()}\n` })
  assert.notEqual(status, 0, output)
})

test('a clean staged file makes gitleaks exit zero', () => {
  const { status, output } = scanStaged({ 'README.md': 'Plain text with no credentials.\n' })
  assert.equal(status, 0, output)
})

test('the allowlist does not hide a planted key at the allowlisted path', () => {
  const { status, output } = scanStaged({ [ALLOWLISTED_PATH]: `AWS_ACCESS_KEY_ID=${plantedKey()}\n` })
  assert.notEqual(status, 0, output)
})

test('the allowlisted cache key passes at its path', () => {
  const { status, output } = scanStaged({ [ALLOWLISTED_PATH]: CACHE_KEY_LINE })
  assert.equal(status, 0, output)
})

test('a missing gitleaks binary fails with the install pointer', () => {
  assert.throws(
    () => scanStaged({ 'README.md': 'x\n' }, { gitleaks: '/nonexistent/vitest-dedup-gitleaks' }),
    /brew install gitleaks/,
  )
})

test('every gate case behaves as the configuration requires', () => {
  const results = runCases()
  assert.equal(results.length, 4, 'the gate must run all four cases')
  const failed = results.filter((result) => !result.passed).map((result) => result.name)
  assert.deepEqual(failed, [])
})
