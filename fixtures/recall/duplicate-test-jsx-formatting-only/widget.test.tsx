// RECALL known miss -- the same element, written across several lines instead of one.
//
// Same component, same props, same single text child. A formatter moving one of these onto
// multiple lines does not change what renders, so the two tests are the same case and one is
// deletable. The analyzer reports NOTHING (measured against the release binary).
//
// The mechanism, and why this is a miss rather than a disagreement: `ser_expr`'s catch-all
// serializes JSX via `opaque(span)` -- the verbatim source slice -- so the comparison is textual.
// Reindenting changes the slice, and two bodies that render identically stop matching. That makes
// it a RECALL loss driven entirely by formatting, which is the least defensible reason for a tool
// like this to stay silent.
//
// The cost is not hypothetical: reformatting is what a repository-wide Prettier run does to every
// component test at once.
//
// Named weakening: collapse the second element back onto one line and the finding appears, which
// is also the check that the two bodies really are the same case.
import { expect, test } from 'vitest'
import { render } from './render'
import { Button } from './widgets'

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
