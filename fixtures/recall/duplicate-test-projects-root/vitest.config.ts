// RECALL variant -- S3 sub-mechanism 1 (an observed router package's shape): a `test.projects` entry setting
// `root:` while inheriting default includes. The entry's `root:` becomes the project's base
// directory, so the inherited defaults run from `pkg/` rather than the repository root and
// legacy/old.spec.ts is NOT swept in: 2 tests and 1 finding, not 4 and 2.
//
// Over-inclusion is what this case measures, and it is why the case discriminates at all. A
// fixture that only checked the project's own files would have passed before the fix too --
// `pkg/arith.spec.ts` was always found; what was wrong was everything found ALONGSIDE it. Delete
// legacy/old.spec.ts and this case stops being able to fail.
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: [{ test: { name: 'pkg', root: './pkg' } }],
  },
})
