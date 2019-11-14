/// <reference types="cypres" /
describe('VTM ADR Ticket 1: Updating And Saving Core ADR Details', () => {
  beforeEach(() => {
    // cy.visit('http://localhost:4200');
    // cy.get('input[formcontrolname=loginfmt]').type('Vtm-Admin1@dvsagov.onmicrosoft.com');
    // cy.get('inout[type=submit]').click();
    // cy.get('input[formcontrolname=passwd]').type('Vtm-Admin1@dvsagov.onmicrosoft.com');
    // cy.get('input[formcontrolname=password]').type('Vtmadmin!1');
    // cy.get('input[type=submit]').click();
  });

  context('AC1. User clicks the call to action to change the technical record', () => {

    it('I have searched for an existing HGV/TRL technical record in VTM', () => {
      cy.visit('http://localhost:4200');
      cy.get('.searchbar-input').type('ABCDEFGH777777').should('have.value', 'ABCDEFGH777777');
      cy.get('.searchbar-input').type('{enter}');
    });

    it('I am presented with one technical record for my vehicle (as per the tech record selection logic in CVSB-7239)', () => {
      cy.get('#test-vin').should('have.text', ' ABCDEFGH777777 ');
    });

    it('this technical record could already have ADR details on it', () => {
      cy.get('#test-ADR-type').should('have.text', ' Centre axle tank ');
    });

    it('I click the call to action to "change technical record" (as per the designs)', () => {
      cy.get('.govuk-button').click();
    });

    it('I am able to update the attributes on this technical record', () => {
      cy.get('#mat-expansion-panel-header-6 > .mat-content > .mat-expansion-panel-header-title > .item-technical-record')
        .click();
      cy.get('#applicantDetailsName').type('Dorel Grigore').should('have.value', 'Dorel Grigore');
    });

    it('there is a call to action to \'cancel\' my change', () => {
      cy.get('#cancel_link').should('have.text', 'Cancel');
    });
  });

  context('AC2. User clicks the call to action to cancel the change', () => {

    it('I have clicked the call to action to "change technical record" (as per the designs)', () => {
      cy.get('.govuk-button').should('have.text', ' Save technical record ');
    });

    it('there is a call to action to \'cancel\' my change', () => {
      cy.get('#cancel_link').should('have.text', 'Cancel');
    });

    it('I could have updated some values', () => {
      cy.get('#applicantDetailsName').type(' Banciu').should('have.value', 'Dorel Grigore Banciu');
    });

    it('I click the call to action to \'cancel\' my change', () => {
      cy.get('#cancel_link').click();
    });

    it('I am returned to the "view technical record page" for my technical record', () => {
      cy.get('#applicantDetailsName').should('not.be.visible');
    });

    it('none of the values that I updated are committed', () => {
      cy.get('#test-aplicantDetails-name').should('have.text', ' string ');
    });
  });

  context('AC3. Technical record DOES NOT already have ADR details on it', () => {

    it('I have clicked the call to action to change this technical record', () => {
      cy.visit('http://localhost:4200');
      cy.get('.searchbar-input').type('P012301230123').should('have.value', 'P012301230123');
      cy.get('.searchbar-input').type('{enter}');
      cy.get('#test-vin').should('have.text', ' P012301230123 ');
      cy.get('.govuk-button').click();
    });

    it('this technical record DOES NOT already have ADR details on it', () => {
      cy.get('#mat-expansion-panel-header-6 > .mat-content > .mat-expansion-panel-header-title > .item-technical-record')
        .click();
      cy.get('#test-aplicantDetails-name').should('not.be.visible');
    });

    it('I set the \'Able to carry dangerous goods\' radio button to yes', () => {
      cy.get('#changed-name').check();
    });

    it('I am able to add ADR details on this technical record', () => {
      cy.get('#applicantDetailsName').type('Dorel Grigore').should('have.value', 'Dorel Grigore');
    });
  });

  context('AC4 Technical record DOES already have ADR details on it', () => {

    it('I have clicked the call to action to change this technical record', () => {
      cy.visit('http://localhost:4200');
      cy.get('.searchbar-input').type('ABCDEFGH777777').should('have.value', 'ABCDEFGH777777');
      cy.get('.searchbar-input').type('{enter}');
      cy.get('#test-vin').should('have.text', ' ABCDEFGH777777 ');
      cy.get('.govuk-button').click();
    });

    it('this technical record DOES already have ADR details on it', () => {
      cy.get('#mat-expansion-panel-header-6 > .mat-content > .mat-expansion-panel-header-title > .item-technical-record')
        .click();
    });

    it('I scroll to the ADR details section on this screen', () => {
      cy.get('#applicantDetailsName').type('Dorel Grigore').should('have.value', 'Dorel Grigore');
    });

    it('the \'Able to carry dangerous goods\' radio button (located in the ADR details section, as per the design) is already set to \'yes\'', () => {
      cy.get('#changed-name').should('be.checked');
    });

    it('I am already able to update ADR details on this technical record', () => {
      cy.get('#applicantDetailsStreet').type('Dorel Grigore').should('have.value', 'Dorel Grigore');
    });
  });

});

