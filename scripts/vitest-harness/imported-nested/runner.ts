import { describe, test, expect } from 'vitest'
import { leaf } from './leaf'
import { aliasedLeaf } from './barrel'

/** Declares a suite, then forwards its label to an imported runner. */
export function outer(label: string) {
  describe(label, () => { test('own', () => { expect(label).toBe(label) }) })
  leaf(label)
}

/** Reaches the imported runner through a helper local to this file. */
function viaLocal() { leaf('local') }
export function mixed() {
  viaLocal()
  aliasedLeaf('alias')
}
