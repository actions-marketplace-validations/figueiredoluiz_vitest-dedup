// RECALL variant -- a `describe.each` table with a repeated row. Rows 1 and 3 bind the
// same canonical value, so the table registers `admin permissions` and both nested tests twice.
// This guards suite-row ownership in `duplicate-each-row`: extraction assigns exact row equality
// classes within the declaration, while `duplicate-suite` continues collapsing generated suite
// instances by their shared declaration location.
import { describe, expect, test } from 'vitest'
import { permissions, roleLabel } from './roles'

describe.each([['admin'], ['editor'], ['admin']])('%s permissions', (role) => {
  test('resolves a permission set', () => {
    expect(permissions(role).length).toBeGreaterThan(0)
  })

  test('renders a label', () => {
    expect(roleLabel(role)).toMatch(/^[a-z]+$/)
  })
})
