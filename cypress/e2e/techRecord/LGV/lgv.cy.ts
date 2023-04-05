import { randomString } from '../../../support/functions';

describe('LGV technical record', () => {
  beforeEach(() => {
    cy.loginToAAD();
    cy.visit('');
    cy.get('#search-for-technical-record-link', { timeout: 10000 }).should('be.visible');
  });
  it('should create a new LGV', () => {
    const vin = randomString(10);
    cy.intercept('POST', '/develop/vehicles').as('create-vehicle');
    cy.get('#create-new-technical-record-link').click();
    cy.get('#input-vin').type(vin);
    cy.get('#generate-c-t-z-num-true-checkbox').click();
    cy.get('#change-vehicle-type-select').select('2: lgv');
    cy.get(':nth-child(6) > #create-record-continue').click();
    cy.get('.govuk-accordion__show-all-text').click();
    cy.get('#reasonForCreation').type('testing create');
    cy.get('#vehicleSubclass-l-checkbox').click();
    cy.wait(400);
    cy.get('app-button > #submit-record-continue').click();
    cy.get('@create-vehicle').its('response', { timeout: 12000 }).should('have.property', 'statusCode', 201);
  });
});
