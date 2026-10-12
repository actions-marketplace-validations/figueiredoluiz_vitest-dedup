import { it, expect } from 'vitest'

for (const key of ['width', 'height']) {
  it.each([1, 2])(`reports default ${key} as %p`, (value) => {
    expect(defaults({ [key]: value }, { [key]: value })).toEqual({ [key]: value })
  })
}
