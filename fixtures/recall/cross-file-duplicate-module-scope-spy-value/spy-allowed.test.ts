// RECALL known false positive -- module-scope ambient state, case 2 of 3, and the sharpest.
//
// The two tests run under OPPOSITE values of the same feature flag: one spies `isEnabled` to
// `true`, the sibling to `false`. The mocked value is the whole difference between them, and the
// analyzer reports `cross-file-duplicate` describing the pair as "under an equivalent context".
//
// Sharper than the timer case because this is the ordinary way to stub a single module export
// without `vi.mock`, and because the thing not captured is a VALUE, not a mode: two tests can be
// made to differ arbitrarily here while still comparing equal.
//
// MECHANISM: `Context`'s mock fold is over hoisted `vi.mock` registrations. `vi.spyOn` is not
// hoisted and is not a registration -- it is an ordinary call evaluated at module scope -- so it
// reaches neither the mock fold nor `module_setup`, which takes only AWAITED module-scope calls.
// `not-duplicates-different-mocks` already pins the `vi.mock` half of this; nothing pinned the
// spy half.
//
// Named weakening: give both files the same `mockReturnValue` and the finding becomes correct.
import { expect, test, vi } from 'vitest'
import * as flags from './flags'
import { checkout } from './checkout'

vi.spyOn(flags, 'isEnabled').mockReturnValue(true)

test('checks out with the flag on', () => {
  expect(checkout({ id: 'c1' }).status).toBe('ok')
})
