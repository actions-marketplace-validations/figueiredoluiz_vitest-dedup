// The sibling of `spy-allowed.test.ts`, identical but for the spied return value.
import { expect, test, vi } from 'vitest'
import * as flags from './flags'
import { checkout } from './checkout'

vi.spyOn(flags, 'isEnabled').mockReturnValue(false)

test('checks out with the flag off', () => {
  expect(checkout({ id: 'c1' }).status).toBe('ok')
})
