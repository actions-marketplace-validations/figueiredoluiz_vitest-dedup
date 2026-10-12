// Same call, same matcher, same expected value -- `fetchUser(1)` compared with `toEqual({ id: 1 })`
// through `await expect(...)`. Only the promise outcome being observed differs: `.resolves` reads
// the fulfillment value of the call, `.rejects` reads the rejection reason of the very same call.
// They watch mutually exclusive outcomes of one operation and must never be merged.
// @vitest-dedup:extracted 2
// @vitest-dedup:expect rule=none verdict=distinct severity=none
// @vitest-dedup:isolates identifier,literal
// @vitest-dedup:participant L13 "resolves with the fetched user"
// @vitest-dedup:participant L17 "rejects with the same shaped value"
import { test, expect } from 'vitest'
import { fetchUser } from './users'

test('resolves with the fetched user', async () => {
  await expect(fetchUser(1)).resolves.toEqual({ id: 1 })
})

test('rejects with the same shaped value', async () => {
  await expect(fetchUser(1)).rejects.toEqual({ id: 1 })
})
