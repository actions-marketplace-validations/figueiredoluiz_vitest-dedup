// The platform packages are generated, so what is worth testing is the generator's agreement with
// the three things that must never disagree: the target manifest, npm's own metadata vocabulary,
// and the launcher's `optionalDependencies`.
import assert from 'node:assert/strict'
import test from 'node:test'
import { mkdtemp, readFile, writeFile, chmod, mkdir, rm } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { TARGETS } from '../lib/targets.mjs'
import { platformManifest, renderPlatformReadme } from '../../scripts/release/platform-package.mjs'
import { prepareAll, writePlatformPackage } from '../../scripts/release/prepare-npm-packages.mjs'

const rootManifest = JSON.parse(await readFile(new URL('../../package.json', import.meta.url), 'utf8'))

test('a generated manifest exists for every target and nothing else', () => {
  const names = Object.values(TARGETS).map((target) => target.packageName)
  assert.equal(names.length, 8)
  assert.deepEqual(Object.keys(rootManifest.optionalDependencies).sort(), [...names].sort())
  for (const name of names) {
    assert.equal(rootManifest.optionalDependencies[name], rootManifest.version)
  }
})

test('generated manifests use npm metadata, not Rust target vocabulary', () => {
  for (const target of Object.values(TARGETS)) {
    const manifest = platformManifest(target, '1.2.3')
    assert.equal(manifest.name, target.packageName)
    assert.equal(manifest.version, '1.2.3')
    assert.deepEqual(manifest.os, [target.platform])
    assert.deepEqual(manifest.cpu, [target.arch])
    // npm spells these `glibc`/`musl`; the manifest spells them `gnu`/`musl` because that is the
    // Rust triple. Publishing `gnu` here makes npm match no host at all.
    if (target.libc === 'gnu') assert.deepEqual(manifest.libc, ['glibc'])
    else if (target.libc === 'musl') assert.deepEqual(manifest.libc, ['musl'])
    else assert.equal(manifest.libc, undefined)
    assert.deepEqual(manifest.files, [`bin/${target.binaryName}`, 'README.md', 'LICENSE'])
    assert.equal(manifest.license, 'MIT')
    // A platform package that pulled anything at install time would defeat the whole design.
    assert.equal(manifest.dependencies, undefined)
    assert.equal(manifest.scripts, undefined)
  }
})

test('an unknown libc is refused rather than guessed', () => {
  assert.throws(
    () => platformManifest({ ...TARGETS['linux-x64-gnu'], libc: 'uclibc' }, '1.0.0'),
    /no npm libc value/,
  )
})

test('the platform README steers users to the launcher package', () => {
  const manifest = platformManifest(TARGETS['linux-x64-musl'], '1.2.3')
  const readme = renderPlatformReadme(manifest)
  assert.match(readme, /^# vitest-dedup-linux-x64-musl$/m)
  assert.match(readme, /Do not install this package directly/)
  assert.match(readme, /npm install --save-dev vitest-dedup/)
  assert.match(readme, /npm audit signatures/)
  assert.match(readme, /no install scripts/)
})

test('preparing a package writes exactly the allowlisted files, binary executable', async (t) => {
  const root = await mkdtemp(join(tmpdir(), 'vitest-dedup-prepare-'))
  t.after(() => rm(root, { recursive: true, force: true }))
  await writeFile(join(root, 'LICENSE'), 'MIT\n')
  const source = join(root, 'built-binary')
  await writeFile(source, '#!/bin/sh\nexit 0\n')

  const target = TARGETS['linux-x64-gnu']
  const packageRoot = await writePlatformPackage({ root, target, version: '9.9.9', binary: source })

  const written = JSON.parse(await readFile(join(packageRoot, 'package.json'), 'utf8'))
  assert.deepEqual(written, platformManifest(target, '9.9.9'))
  for (const entry of written.files) {
    assert.ok(existsSync(join(packageRoot, entry)), `${entry} must exist`)
  }
  if (process.platform !== 'win32') {
    const { mode } = await import('node:fs/promises').then((fs) =>
      fs.stat(join(packageRoot, 'bin', target.binaryName)))
    assert.equal(mode & 0o111, 0o111, 'the published binary must be executable')
  }
})

test('an incomplete build refuses to produce a publishable set', async (t) => {
  const root = await mkdtemp(join(tmpdir(), 'vitest-dedup-partial-'))
  const artifacts = await mkdtemp(join(tmpdir(), 'vitest-dedup-artifacts-'))
  t.after(() => Promise.all([root, artifacts].map((p) => rm(p, { recursive: true, force: true }))))
  await writeFile(join(root, 'LICENSE'), 'MIT\n')

  // One leg of the matrix succeeded; the other seven did not.
  const present = TARGETS['darwin-arm64']
  await mkdir(join(artifacts, `binary-${present.rustTarget}`), { recursive: true })
  const binary = join(artifacts, `binary-${present.rustTarget}`, present.binaryName)
  await writeFile(binary, '#!/bin/sh\nexit 0\n')
  await chmod(binary, 0o755)

  await assert.rejects(
    prepareAll({ root, artifacts, version: '9.9.9' }),
    /missing native binaries for 7 of 8 targets/,
  )
})
