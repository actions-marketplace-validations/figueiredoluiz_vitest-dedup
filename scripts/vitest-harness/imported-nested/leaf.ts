import { beforeEach, test, expect } from 'vitest'

/** Installs a hook and one test whose title reads the label forwarded by the caller. */
export function leaf(label: string) {
  beforeEach(() => { (globalThis as any).leafHook = true })
  test(`leaf ${label}`, () => { expect((globalThis as any).leafHook).toBe(true) })
}
