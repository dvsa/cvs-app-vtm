import { randomString } from '../../../support/functions';

describe('TRL tests', () => {
  beforeEach(() => {
    cy.loginToAAD();
    cy.visit('');
    cy.get('#search-for-technical-record-link', { timeout: 10000 }).should('be.visible');
  });

  it('should create an annual test', () => {
    const vin = randomString(10);
    cy.createVehicle('trl-testable', vin, 'current', randomString(7));
    cy.get('#search-for-technical-record-link').click();
    cy.get('#search-term').type(vin + '{enter}');
    cy.get('a').contains('Select technical record').click();
    cy.get('#create-test').click();
    cy.get('#test-list-item-94').click();
    cy.get('#countryOfRegistration').type('g');
    cy.get('#countryOfRegistration__option--1').click();
    cy.get('#euVehicleCategory').select('9: o3');
    cy.get('#contingencyTestNumber').type('123456');
    cy.get('#testTypeStartTimestamp-day').type('14');
    cy.get('#testTypeStartTimestamp-month').type('02');
    cy.get('#testTypeStartTimestamp-year').type(new Date().getFullYear().toString());
    cy.get('#testTypeStartTimestamp-hour').type('14');
    cy.get('#testTypeStartTimestamp-minute').type('14');
    cy.get('#testTypeEndTimestamp-day').type('14');
    cy.get('#testTypeEndTimestamp-month').type('02');
    cy.get('#testTypeEndTimestamp-year').type(new Date().getFullYear().toString());
    cy.get('#testTypeEndTimestamp-hour').type('14');
    cy.get('#testTypeEndTimestamp-minute').type('15');
    cy.get('#testStationPNumber').type('a');
    cy.get('#testStationPNumber__option--1').click();
    cy.get('#testerStaffId').type('a');
    cy.get('#testerStaffId__option--1').click();
    cy.get('#reasonForCreation').type('testing create annual trl test');
    cy.wait(400);
    cy.get('#review-test-result').click();
    cy.get('#submit-test-result').click();
    cy.get('#test-record-summary-name-0').should('have.text', 'Annual test');
  });

  it('should create an abandoned annual test', () => {
    const vin = randomString(10);
    cy.createVehicle('trl-testable', vin, 'current', randomString(7));
    cy.get('#search-for-technical-record-link').click();
    cy.get('#search-term').type(vin + '{enter}');
    cy.get('a').contains('Select technical record').click();
    cy.get('#create-test').click();
    cy.get('#test-list-item-94').click();
    cy.get('#countryOfRegistration').type('g');
    cy.get('#countryOfRegistration__option--1').click();
    cy.get('#euVehicleCategory').select('9: o3');
    cy.get('#contingencyTestNumber').type('123456');
    cy.get('#testTypeStartTimestamp-day').type('14');
    cy.get('#testTypeStartTimestamp-month').type('02');
    cy.get('#testTypeStartTimestamp-year').type(new Date().getFullYear().toString());
    cy.get('#testTypeStartTimestamp-hour').type('14');
    cy.get('#testTypeStartTimestamp-minute').type('14');
    cy.get('#testTypeEndTimestamp-day').type('14');
    cy.get('#testTypeEndTimestamp-month').type('02');
    cy.get('#testTypeEndTimestamp-year').type(new Date().getFullYear().toString());
    cy.get('#testTypeEndTimestamp-hour').type('14');
    cy.get('#testTypeEndTimestamp-minute').type('15');
    cy.get('#testStationPNumber').type('a');
    cy.get('#testStationPNumber__option--1').click();
    cy.get('#testerStaffId').type('a');
    cy.get('#testerStaffId__option--1').click();
    cy.get('#reasonForCreation').type('testing create an abandoned annual trl test');
    cy.wait(400);
    cy.get('[type="button"] > #abandon-test-result').click();
    cy.get('input[type="checkbox"]').first().click();
    cy.get('#additionalCommentsForAbandon').type('Cypress testing abandoning');
    cy.wait(400);
    cy.get('.govuk-button-group > :nth-child(1) > #confirm').click();
    cy.get('#test-record-summary-name-0').should('have.text', 'Annual test');
    cy.get('#test-record-summary-result-0').should('have.text', 'abandoned');
  });
});
