// RECALL negative -- the control for the three module-scope known false positives beside it.
//
// Same arrangement as those three: two files in one directory, byte-identical test bodies, one
// module-scope call apart. The only difference is that the call here is AWAITED, so
// `Context::module_setup` captures it, the two contexts stop comparing equal, and the finding
// correctly does not appear.
//
// That is what makes this case load-bearing rather than decorative. On its own, "no finding" is
// the same observation as a rule that has stopped working. Read against its three siblings it says
// something a single case cannot: the contexts CAN be told apart, the machinery for telling them
// apart exists and runs, and what the other three are missing is specifically the un-awaited call
// -- not module-scope state in general. A fix that starts capturing synchronous module-scope calls
// must keep this silent, and a fix that captures nothing at all fails the other three.
//
// Named weakening: drop the `await` from both files and this case joins the false positives -- the
// single edit that turns the control into the defect, which is the cheapest demonstration that the
// two halves really do differ by exactly that.
import { expect, test } from 'vitest'
import { loadSeed, rowCount } from './seed'

await loadSeed('users')

test('counts the seeded rows', () => {
  expect(rowCount()).toBe(3)
})
