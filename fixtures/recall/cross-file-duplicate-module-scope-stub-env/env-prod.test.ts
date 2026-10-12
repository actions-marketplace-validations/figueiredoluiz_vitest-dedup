// RECALL known false positive -- module-scope ambient state, case 3 of 3.
//
// Same defect through a third API: `vi.stubEnv` at module scope. The two tests build a URL under
// `MODE=production` and `MODE=development`, which is the difference an environment stub exists to
// create, and the analyzer calls the two contexts equivalent.
//
// Three cases rather than one because this repository's most repeated defect is a fix applied to
// the reported site and not its siblings. `useFakeTimers`, `spyOn` and `stubEnv` share one cause
// and one remedy, and a fix that lands for whichever is reported first should fail the other two
// here rather than look complete. `vi.stubGlobal` is the fourth member of the family and is not
// given its own case: it is the same call shape as `stubEnv`, so a fix that handles one and not
// the other would be a strange shape of mistake -- recorded here rather than covered, so the
// choice is visible.
//
// Named weakening: give both files the same `MODE` and the finding becomes correct.
import { expect, test, vi } from 'vitest'
import { buildUrl } from './url'

vi.stubEnv('MODE', 'production')

test('builds a url in production', () => {
  expect(buildUrl('/a')).toContain('/a')
})
