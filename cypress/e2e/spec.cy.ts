let vin: string;
describe('View the home page', () => {
  beforeEach(() => {
    cy.loginToAAD();
    cy.visit('');
  });

  it('should create a new vehicle', () => {
    vin = randomString();
    cy.intercept('POST', '/develop/vehicles').as('create-vehicle');
    cy.get('#create-new-technical-record-link').click();
    cy.get('#input-vin').type(vin);
    cy.get('#generate-c-t-z-num-true-checkbox').click();
    cy.get('#change-vehicle-type-select').select('3: psv');
    cy.get(':nth-child(6) > #create-record-continue').click();
    cy.get('.govuk-accordion__show-all-text').click();
    cy.get('#reasonForCreation').type('testing create');
    cy.get('#vehicleClassDescription').select('2: not applicable');
    cy.get('#dtpNumber').click();
    cy.get('#dtpNumber__option--2').click();
    cy.wait(400);
    cy.get('app-button > #submit-record-continue').click();
    cy.get('@create-vehicle', { timeout: 10000 }).its('response', { timeout: 10000 }).should('have.property', 'statusCode', 201);
  });

  it('should amend the vehicle type', () => {
    cy.get('#search-for-technical-record-link').click();
    cy.get('#search-term').type(vin + '{enter}');
    cy.get('a').contains('Select technical record').click();
    cy.get('#vehicleType').should('have.text', ' PSV ');
    cy.get('app-button > #change-type-link').click();
    cy.get('#change-vehicle-type-select').select('1: hgv');
    cy.get('button').contains('Confirm and continue').click();
    cy.get('.govuk-accordion__show-all-text').click();
    cy.get('#reasonForCreation').type('amending vehicle type');
    cy.get('.govuk-button-group > :nth-child(1) > #submit').click();
    cy.intercept('GET', '/develop/vehicles/**').as('get-vehicle');
    cy.wait('@get-vehicle');
    cy.get('#vehicleType').should('have.text', ' HGV ');
  });
});

const randomString = () => {
  return (Math.random() + 1).toString(36).substring(3);
};
