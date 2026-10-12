// Mocha test: ambient describe/it with before/after (not beforeAll/afterAll). No vitest import.
// Must NOT be extracted as Vitest.
describe('Mocha suite', () => {
  before(() => {})
  after(() => {})

  it('mocha test', () => {
    // assertion
  })
})
