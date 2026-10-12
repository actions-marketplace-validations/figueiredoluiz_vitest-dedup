// Cypress test: ambient describe/it + cy.* commands. No vitest import. Must NOT be extracted.
describe('Cypress suite', () => {
  it('cypress test', () => {
    cy.visit('https://example.com')
    cy.get('button').click()
  })
})
