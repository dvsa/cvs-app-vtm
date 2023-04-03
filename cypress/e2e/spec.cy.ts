describe('View the home page', () => {

  beforeEach(() => {
    cy.loginToAAD()
    cy.visit('')
  })

  
  it('create a new vehicle', () => {
    cy.intercept('POST', '/develop/vehicles').as('create-vehicle')
    cy.get('#create-new-technical-record-link').click()
    cy.get('#input-vin').type(randomString())
    cy.get('#generate-c-t-z-num-true-checkbox').click()
    cy.get('#change-vehicle-type-select').select('3: psv')
    cy.get(':nth-child(6) > #create-record-continue').click()
    cy.get('.govuk-accordion__show-all-text').click()
    cy.get('#reasonForCreation').type("testing create")
    cy.get('#vehicleClassDescription').select("2: not applicable")
    cy.get('#dtpNumber').click()
    cy.get('#dtpNumber__option--2').click()
    cy.wait(400)
    cy.get('app-button > #submit-record-continue').click()
    cy.get('@create-vehicle', {timeout: 10000}).its('response').should('have.property', 'statusCode', 201)
  })
})

const randomString = () => {
  return (Math.random() + 1).toString(36).substring(7);
}