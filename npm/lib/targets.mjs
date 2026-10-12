// Single source of truth for the platform matrix.
//
// The release workflow, the npm launcher, and the GitHub Action all resolve targets through this
// module. A second hand-maintained copy would let a newly built platform go unpublished, or a
// published one go undownloadable, with nothing reporting the mismatch.
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))

/** @type {{schemaVersion: number, targets: Record<string, object>}} */
const manifest = JSON.parse(readFileSync(join(here, '..', 'prebuilt-targets.json'), 'utf8'))

export const TARGETS = manifest.targets

/**
 * Resolves a Node platform/arch/libc triple to its release target.
 *
 * Returns `undefined` rather than throwing or guessing: callers report an unsupported platform by
 * name, which is far more actionable than downloading a binary that cannot run.
 */
export function targetFor(platform, arch, libc, targets = TARGETS) {
  for (const [key, target] of Object.entries(targets)) {
    if (target.platform !== platform || target.arch !== arch) continue
    // libc only discriminates on Linux; other platforms omit it entirely.
    if (target.libc !== undefined && target.libc !== libc) continue
    return { key, ...target }
  }
  return undefined
}
