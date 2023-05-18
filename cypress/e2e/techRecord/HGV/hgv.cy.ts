import { randomString } from '../../../support/functions';

describe('HGV technical record', () => {
  beforeEach(() => {
    cy.loginToAAD();
    cy.visit('');
    cy.get('#search-for-technical-record-link', { timeout: 10000 }).should('be.visible');
  });

  it('should amend the vehicle', () => {
    const vin = randomString(10);
    cy.createVehicle('hgv-testable', vin, 'current', randomString(7));
    cy.get('#search-for-technical-record-link').click();
    cy.get('#search-term').type(vin + '{enter}');
    cy.get('a').contains('Select technical record').click();
    cy.get('.govuk-accordion__show-all-text').click();
    cy.get('#test-approvalType').should('have.text', ' - ');
    cy.get('#test-approvalType').should('not.have.text', ' NTA ');
    cy.get('app-button > #edit').click();
    cy.get('#reason-correcting-an-error-radio').click();
    cy.get('#submit').click();
    cy.get('.govuk-accordion__show-all-text').click();
    cy.get('#reasonForCreation').type('amending approval type');
    cy.get('#approvalType').select('1: NTA');
    cy.get('#dtpNumber').type('00');
    cy.wait(400);
    cy.get('.govuk-button-group > :nth-child(1) > #submit').click();
    cy.intercept('GET', '/develop/vehicles/**').as('get-vehicle');
    cy.wait('@get-vehicle');
    cy.get('.govuk-accordion__show-all-text').click();
    cy.get('#test-approvalType').should('have.text', ' NTA ');
  });
});
