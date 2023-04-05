import { randomString } from '../../../support/functions';

describe('LGV technical record', () => {
  beforeEach(() => {
    cy.loginToAAD();
    cy.visit('');
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

  it.only('should create a DBA', () => {
    const vin = randomString(10);
    cy.createVehicle('lgv', vin, 'current', randomString(7));
    cy.get('#search-for-technical-record-link').click();
    cy.get('#search-term').type(vin + '{enter}');
    cy.get('a').contains('Select technical record').click();
    cy.get('#create-test', { timeout: 12000 }).click();
    cy.get('#test-list-item-400', { timeout: 20000 }).click();
    cy.get('#browse-list-item-413').click();
    cy.get('#browse-list-item-433').click();
    cy.get('#reasonForCreation', { timeout: 15000 }).type('testing create DBA');
    cy.get('#certificateNumber').type('123456');
    cy.wait(400);
    cy.get('#review-test-result').click();
    cy.get('#submit-test-result').click();
    cy.get('#test-record-summary-name-0', { timeout: 10000 }).should('have.text', 'IVA17 Appeal for IVA');
  });

  it('should amend the test result', () => {
    const vin = randomString(10);
    cy.createVehicle('lgv', vin, 'current', randomString(7));
    cy.get('#search-for-technical-record-link').click();
    cy.get('#search-term').type(vin + '{enter}');
    cy.get('a').contains('Select technical record').click();
    cy.get('#view-test-1').click();
    cy.get('.govuk-tag--green', { timeout: 10000 }).should('have.text', 'Pass');
    cy.get('#amend-test').click();
    cy.get('#submit').click();
    cy.get('.govuk-accordion__show-all-text').click();
    cy.get('#reasonForCreation', { timeout: 15000 }).type('testing amend DBA');
    cy.get('#testResult-fail-radio').click();
    cy.wait(400);
    cy.get('#review-test-result').click();
    cy.get('#save-test-result').click();
    cy.get('.govuk-tag--red', { timeout: 10000 }).should('have.text', 'Fail');
  });
});
