import { randomString } from '../../../support/functions';

let vin: string;
describe('PSV technical record', () => {
  beforeEach(() => {
    cy.loginToAAD();
    cy.visit('');
  });

  it('should create a new PSV', () => {
    vin = randomString(10);
    cy.intercept('POST', '/develop/vehicles').as('create-vehicle');
    cy.get('#create-new-technical-record-link').click();
    cy.get('#input-vin').type(vin);
    cy.get('#generate-c-t-z-num-true-checkbox').click();
    cy.get('#change-vehicle-type-select').select('3: psv');
    cy.get(':nth-child(6) > #create-record-continue').click();
    cy.get('.govuk-accordion__show-all-text').click();
    cy.get('#reasonForCreation').type('testing create');
    cy.get('#vehicleClassDescription').select('2: not applicable');
    cy.get('#dtpNumber').type('00');
    cy.get('#dtpNumber__option--1').click();
    cy.wait(400);
    cy.get('app-button > #submit-record-continue').click();
    cy.get('@create-vehicle').its('response', { timeout: 12000 }).should('have.property', 'statusCode', 201);
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

  it('should amend the vrm', () => {
    const newVrm = randomString(7);
    cy.get('#search-for-technical-record-link').click();
    cy.get('#search-term').type(vin + '{enter}');
    cy.get('a').contains('Select technical record').click();
    cy.get('app-button > #change-vrm-link').click();
    cy.get('.govuk-input').type(newVrm);
    cy.get('#-true-radio').click();
    cy.get('#submit-vrm').click();
    cy.get('#current-vrm-span').should(vrm => {
      const vrmSplit = newVrm.slice(0, newVrm.length - 3) + ' ' + newVrm.slice(newVrm.length - 3);
      expect(vrm).to.contain(vrmSplit.toUpperCase());
    });
  });

  it('should promote the record', () => {
    cy.get('#search-for-technical-record-link').click();
    cy.get('#search-term').type(vin + '{enter}');
    cy.get('a').contains('Select technical record').click();
    cy.get(':nth-child(2) > #promote-link').click();
    cy.get('#reason').type('testing promote');
    cy.get('#submit-change-status').click();
    cy.get('#status-code').should('have.text', 'Current');
  });

  it('should amend the vehicle approval type', () => {
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
    cy.wait(400);
    cy.get('.govuk-button-group > :nth-child(1) > #submit').click();
    cy.intercept('GET', '/develop/vehicles/**').as('get-vehicle');
    cy.wait('@get-vehicle');
    cy.get('.govuk-accordion__show-all-text').click();
    cy.get('#test-approvalType').should('have.text', ' NTA ');
  });
});
