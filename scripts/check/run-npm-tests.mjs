#!/usr/bin/env node
// Runs the npm distribution's test suite and fails if it did not actually run tests.
//
// Same wrapper, same reason, as `run-action-tests.mjs`: `node --test <dir>` once resolved a
// directory to its entry point and reported "pass 1" over zero real tests, and a shell glob in an
// npm script does not expand at all under cmd.exe, so the Windows leg of CI would have run the
// suite over a literal `npm/test/*.test.mjs` path. Both failures look exactly like success.
//
// Files are enumerated here and passed explicitly, and the run is held to a floor on how many
// tests actually executed.
import { execFileSync } from 'node:child_process'
import { readdirSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..')
const directory = join(root, 'npm', 'test')

const files = readdirSync(directory)
  .filter((name) => name.endsWith('.test.mjs'))
  .sort()
  .map((name) => join('npm', 'test', name))

const MIN_FILES = 7
const MIN_TESTS = 40 // 50 today; a floor that catches wholesale loss, not every added test.

if (files.length < MIN_FILES) {
  console.error(`found ${files.length} npm test file(s) in ${directory}, expected >= ${MIN_FILES}`)
  process.exit(1)
}

let output
let failed = false
try {
  output = execFileSync(process.execPath, ['--test', ...files], { cwd: root, encoding: 'utf8' })
} catch (error) {
  if (error.stdout === undefined) throw error
  output = error.stdout
  failed = true
}
process.stdout.write(output)

const count = (label) => Number(output.match(new RegExp(`^. ${label} (\\d+)$`, 'm'))?.[1] ?? NaN)
const pass = count('pass')
const skipped = count('skip')
const fail = count('fail')

if (!Number.isFinite(pass) || !Number.isFinite(fail)) {
  console.error('\ncould not read a pass/fail summary from the test output')
  process.exit(1)
}
if (failed || fail > 0) {
  console.error(`\n${fail} npm test(s) failed`)
  process.exit(1)
}

// Skipped counts toward the floor: the install simulation legitimately skips without a release
// build, and it must not be able to drag the suite below its floor by doing so.
const ran = pass + (Number.isFinite(skipped) ? skipped : 0)
if (ran < MIN_TESTS) {
  console.error(`\nonly ${ran} npm test(s) ran, expected at least ${MIN_TESTS}`)
  process.exit(1)
}
console.log(`\nok: ${files.length} npm test files, ${pass} passed, ${skipped || 0} skipped`)
