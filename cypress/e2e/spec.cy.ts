describe('View the home page', () => {

  beforeEach(() => {
    cy.loginToAAD('email', 'special info')
    cy.visit('')
  })

  it('passes', () => {
    cy.get('#search-for-technical-record-link').click()
  })
})
