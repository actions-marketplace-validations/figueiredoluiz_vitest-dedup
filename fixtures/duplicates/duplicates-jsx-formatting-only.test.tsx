// The first `.tsx` fixture this gate has ever been able to assert, and it exists to prove that.
//
// Until the enumeration was widened, `checkTarget` listed `*.test.ts` only. A `.test.tsx` file was
// COPIED into the solo run -- so it analyzed, and could be named as a participant -- but never
// enumerated, so its directive block was never parsed and the expectations below were never checked.
//
// The hole was narrower than it first looked, and the difference is worth recording. Narrow the
// enumeration back with this fixture in place and the gate still FAILS -- the unclaimed-finding sweep
// sees a `duplicate-test` nothing declared and says so. So a fixture expecting a FINDING was never
// fully invisible. One expecting SILENCE was: no finding, nothing unclaimed, directive block
// unparsed, and the gate reporting one fewer fixture than the directory holds. That is the shape
// that could have sat here indefinitely looking asserted, and the reason the enumeration is the fix
// rather than the sweep.
//
// The shape is the one C2 fixed: the same element reindented across several lines. Same component,
// same props, same single text child, so nothing about what renders differs and one of the two
// tests is deletable. Before structured JSX this reported nothing at all -- `ser_expr` serialized
// JSX as the verbatim source slice, so the comparison was textual and reformatting broke it.
//
// Named weakening: change `size` on one element and the finding must disappear.
// @vitest-dedup:extracted 2
// @vitest-dedup:expect rule=duplicate-test verdict=redundant severity=error
// @vitest-dedup:participant L29 "renders the save button"
// @vitest-dedup:participant L34 "renders the save button reformatted"
import { expect, test } from 'vitest'
import { render } from './jsx-render'
import { Button } from './jsx-widgets'

test('renders the save button', () => {
  const el = render(<Button variant="primary" size="large">Save</Button>)
  expect(el.textContent).toBe('Save')
})

test('renders the save button reformatted', () => {
  const el = render(
    <Button variant="primary" size="large">
      Save
    </Button>,
  )
  expect(el.textContent).toBe('Save')
})
