#!/usr/bin/env node
// Gate: gitleaks must block a planted key, and pass the allowlisted cache key and clean content.
import { spawnSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..')
export const CONFIG = join(root, '.gitleaks.toml')
export const ALLOWLISTED_PATH = '.github/workflows/mutants.yml'
export const CACHE_KEY_LINE = '          key: cargo-mutants-27.1.0\n'

/** Fake AWS key, built at runtime so this file contains no literal that gitleaks flags. */
export function plantedKey() {
  return ['AKIA', 'Q7X3M2NRT5VBJKZ6'].join('')
}

/** Stage files in a fresh repository and run gitleaks over the index, as the pre-commit hook does. */
export function scanStaged(files, { gitleaks = 'gitleaks' } = {}) {
  const env = Object.fromEntries(Object.entries(process.env).filter(([name]) => !name.startsWith('GIT_')))
  const dir = mkdtempSync(join(tmpdir(), 'vitest-dedup-secret-scan-'))
  try {
    const git = (args) => spawnSync('git', args, { cwd: dir, env, encoding: 'utf8' })
    if (git(['init', '-q']).status !== 0) throw new Error('git init failed in the scan fixture')
    for (const [path, content] of Object.entries(files)) {
      mkdirSync(dirname(join(dir, path)), { recursive: true })
      writeFileSync(join(dir, path), content)
    }
    if (git(['add', '--all']).status !== 0) throw new Error('git add failed in the scan fixture')
    const run = spawnSync(gitleaks, ['protect', '--staged', '--config', CONFIG, '--redact', '--no-banner', '--exit-code', '1'], {
      cwd: dir,
      env,
      encoding: 'utf8',
    })
    if (run.error?.code === 'ENOENT') {
      throw new Error('gitleaks is required for secret scanning. Install it with: brew install gitleaks')
    }
    if (run.error) throw run.error
    return { status: run.status, output: `${run.stdout}${run.stderr}` }
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
}

export const CASES = [
  {
    name: 'planted key in a source file is blocked',
    files: { 'src/config.env': `AWS_ACCESS_KEY_ID=${plantedKey()}\n` },
    blocked: true,
  },
  {
    name: 'planted key at the allowlisted path is still blocked',
    files: { [ALLOWLISTED_PATH]: `AWS_ACCESS_KEY_ID=${plantedKey()}\n` },
    blocked: true,
  },
  {
    name: 'allowlisted cache key passes',
    files: { [ALLOWLISTED_PATH]: CACHE_KEY_LINE },
    blocked: false,
  },
  {
    name: 'clean content passes',
    files: { 'README.md': 'Plain text with no credentials.\n' },
    blocked: false,
  },
]

/** Run every gate case and report whether each behaved as its `blocked` flag requires. */
export function runCases(options) {
  const results = CASES.map((testCase) => {
    const { status, output } = scanStaged(testCase.files, options)
    const blocked = status !== 0
    return { ...testCase, blocked, status, passed: blocked === testCase.blocked, output }
  })
  return results
}

/** Run the gate from the command line and exit non-zero when any case misbehaves. */
function main() {
  let results
  try {
    results = runCases()
  } catch (error) {
    console.error(error.message)
    process.exit(1)
  }
  const failed = results.filter((result) => !result.passed)
  for (const result of results) {
    console.log(`${result.passed ? 'ok  ' : 'FAIL'} ${result.name} (gitleaks exit ${result.status})`)
  }
  if (failed.length) {
    console.error(`${failed.length} secret-scan case(s) do not behave as the configuration requires.`)
    process.exit(1)
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main()
