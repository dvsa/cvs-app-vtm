import { randomString } from '../../../support/functions';

describe('TRL technical record', () => {
  beforeEach(() => {
    cy.loginToAAD();
    cy.visit('');
    cy.get('#search-for-technical-record-link', { timeout: 10000 }).should('be.visible');
  });
  it('should create a new TRL', () => {
    const vin = randomString(10);
    cy.intercept('POST', '/develop/vehicles').as('create-vehicle');
    cy.get('#create-new-technical-record-link').click();
    cy.get('#input-vin').type(vin);
    cy.get('#generate-c-t-z-num-true-checkbox').click();
    cy.get('#change-vehicle-type-select').select('4: trl');
    cy.get(':nth-child(6) > #create-record-continue').click();
    cy.get('.govuk-accordion__show-all-text').click();
    cy.get('#reasonForCreation').type('testing create');
    cy.get('#vehicleClassDescription').select('5: trailer');
    cy.get('#bodyType').select('6: flat');
    cy.wait(400);
    cy.get('app-button > #submit-record-continue').click();
    cy.get('@create-vehicle').its('response', { timeout: 12000 }).should('have.property', 'statusCode', 201);
  });
});
