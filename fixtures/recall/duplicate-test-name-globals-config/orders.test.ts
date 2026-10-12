// Ambient globals only. Two tests share a title and do different work: a name collision, not a
// duplicate. `-t` filtering and the reporter both key on the title, so the collision is real.
import { place, refund } from './orders'

test('handles a rejected card', () => {
  expect(place({ card: 'rejected' }).status).toBe('declined')
})

test('handles a rejected card', () => {
  expect(refund('order-1')).rejects.toThrow('already refunded')
})
