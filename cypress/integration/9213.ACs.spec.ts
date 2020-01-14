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

    it('GIVEN I have searched for an existing HGV/TRL technical record in VTM', () => {
      cy.visit('http://localhost:4200');
      cy.get('#searchIdentifier').type('ABCDEFGH777777').should('have.value', 'ABCDEFGH777777');
      cy.get('.govuk-button').click();
    });

    it('AND I am presented with one technical record for my vehicle (as per the tech record selection logic in CVSB-7239)', () => {
      cy.get('body > vtm-app > vtm-shell > div > div.main > vtm-technical-record > div > div > div > div:nth-child(2) > dl > div:nth-child(1) > dd:nth-child(2)').should('have.text', ' ABCDEFGH777777 ');
    });

    it('AND this technical record could already have ADR details on it', () => {
      cy.get('#test-ADR-type').should('have.text', ' Centre axle battery ');
    });

    it('WHEN I click the call to action to "change technical record" (as per the designs)', () => {
      cy.get('.govuk-button').click();
    });

    it('THEN I am able to update the attributes on this technical record', () => {
      cy.get('#mat-expansion-panel-header-5 > .mat-content > .mat-expansion-panel-header-title > .item-technical-record')
        .click();
      cy.get('#adrDetails\\.name').clear() .type('Dorel Grigore').should('have.value', 'Dorel Grigore');
    });

    it('AND there is a call to action to \'cancel\' my change', () => {
      cy.get('#cancel2').should('have.text', 'Cancel');
    });
  });

  context('AC2. User clicks the call to action to cancel the change', () => {

    it('GIVEN I have clicked the call to action to "change technical record" (as per the designs)', () => {
      cy.get('#test-save-btn').should('have.text', ' Save technical record ');
    });

    it('AND there is a call to action to \'cancel\' my change', () => {
      cy.get('#cancel2').should('have.text', 'Cancel');
    });

    it('AND I could have updated some values', () => {
      cy.get('#adrDetails\\.name').type(' Banciu').should('have.value', 'Dorel Grigore Banciu');
    });

    it('WHEN I click the call to action to \'cancel\' my change', () => {
      cy.get('#cancel2').click();
    });

    it('THEN I am returned to the "view technical record page" for my technical record', () => {
      cy.get('#adrDetails\\.name').should('not.be.visible');
    });

    it('AND none of the values that I updated are committed', () => {
      cy.get('#test-aplicantDetails-name').should('have.text', ' string ');
    });
  });

  context('AC3. Technical record DOES NOT already have ADR details on it', () => {

    it('GIVEN I have clicked the call to action to change this technical record', () => {
      cy.visit('http://localhost:4200');
      cy.get('#searchIdentifier').type('P012301230123').should('have.value', 'P012301230123');
      cy.get('.govuk-button').click();
      cy.get('body > vtm-app > vtm-shell > div > div.main > vtm-technical-record > div > div > div > div:nth-child(2) > dl > div:nth-child(1) > dd:nth-child(2)').should('have.text', ' P012301230123 ');
      cy.get('#test-change-btn').click();
    });

    it('AND this technical record DOES NOT already have ADR details on it', () => {
      cy.get('#mat-expansion-panel-header-5 > .mat-content > .mat-expansion-panel-header-title > .item-technical-record')
        .click();
      cy.get('#test-aplicantDetails-name').should('not.be.visible');
    });

    it('WHEN I set the \'Able to carry dangerous goods\' radio button to yes', () => {
      cy.get('#hasADR').check();
    });

    it('THEN I am able to add ADR details on this technical record', () => {
      cy.get('#adrDetails\\.name').type('Dorel Grigore').should('have.value', 'Dorel Grigore');
    });
  });

  context('AC4 Technical record DOES already have ADR details on it', () => {

    it('GIVEN I have clicked the call to action to change this technical record', () => {
      cy.visit('http://localhost:4200');
      cy.get('#searchIdentifier').type('ABCDEFGH777777').should('have.value', 'ABCDEFGH777777');
      cy.get('.govuk-button').click();
      cy.get('body > vtm-app > vtm-shell > div > div.main > vtm-technical-record > div > div > div > div:nth-child(2) > dl > div:nth-child(1) > dd:nth-child(2)').should('have.text', ' ABCDEFGH777777 ');
      cy.get('#test-change-btn').click();
    });

    it('AND this technical record DOES already have ADR details on it', () => {
      cy.get('#mat-expansion-panel-header-5 > .mat-content > .mat-expansion-panel-header-title > .item-technical-record')
        .click();
      cy.get('#adrDetails\\.name').should('be.visible');
    });

    it('WHEN I scroll to the ADR details section on this screen', () => {
      cy.get('#mat-expansion-panel-header-5 > .mat-content > .mat-expansion-panel-header-title > .item-technical-record')
        .scrollIntoView();
      cy.get('#adrDetails\\.name').clear().type('Dorel Grigore').should('have.value', 'Dorel Grigore');
    });

    it('THEN the Able to carry dangerous goods radio button is already set to yes', () => {
      cy.get('#hasADR').should('be.checked');
    });

    it('AND I am already able to update ADR details on this technical record', () => {
      cy.get('#adrDetails\\.street').clear().type('Dorel Grigore').should('have.value', 'Dorel Grigore');
    });
  });

  context('AC5. User is presented with the applicant details for updating', () => {

    it('GIVEN am able to update the ADR details on this technical record', () => {
      cy.get('#test-save-btn').should('have.text', ' Save technical record ');
    });

    it('WHEN I scroll to the ADR details section (to update the ADR details)', () => {
      cy.get('#mat-expansion-panel-header-5 > .mat-content > .mat-expansion-panel-header-title > .item-technical-record')
        .scrollIntoView();
    });

    it('THEN I must first enter the applicant details as per the design (name, street, town, city, post code)', () => {
      cy.get('#adrDetails\\.city').clear().type('Dorel Grigore').should('have.value', 'Dorel Grigore');
      cy.get('#adrDetails\\.town').clear().type('Dorel Grigore').should('have.value', 'Dorel Grigore');
      cy.get('#adrDetails\\.postcode').clear().type('Dorel Grigore').should('have.value', 'Dorel Grigore');
    });

    it('AND I am able to select one vehicle type from the list ', () => {
      cy.get('#adrDetails\\.type').select('Rigid tank').should('have.value', '3');
    });
  });

  context('AC6. User enters the remaining details for their vehicle type', () => {

    it('GIVEN I am updating the ADR details on this technical record', () => {
      cy.get('#test-save-btn').should('have.text', ' Save technical record ');
    });

    it('AND I have entered the applicant details and WHEN I select a vehicle type', () => {
      cy.get('#mat-expansion-panel-header-5 > .mat-content > .mat-expansion-panel-header-title > .item-technical-record')
        .scrollIntoView();
      cy.get('#adrDetails\\.type').should('have.value', '3');
    });

    it('THEN I must complete all mandatory attributes for my vehicle type', () => {
      cy.get('#adrDetails\\.city').should('have.value', 'Dorel Grigore');
      cy.get('#adrDetails\\.town').should('have.value', 'Dorel Grigore');
      cy.get('#adrDetails\\.postcode').should('have.value', 'Dorel Grigore');
    });

    it('AND I am able to complete any of the optional fields for my vehicle type, if I wish to', () => {
      cy.get('#adrDetails\\.approvalDate\\.day').clear().type('22').should('have.value', '22');
      cy.get('#adrDetails\\.approvalDate\\.month').clear().type('10').should('have.value', '10');
      cy.get('#adrDetails\\.approvalDate\\.year').clear().type('2019').should('have.value', '2019');
      cy.get('#adrDetails\\.permittedDangerousGoods\\.FP\\ \\<61\\ \\(FL\\)').check();
      cy.get('#adrDetails\\.adrTypeApprovalNo').clear().type('123456').should('have.value', '123456');
      cy.get('#adrDetails\\.tankManufacturer').clear().type('123456').should('have.value', '123456');
      cy.get('#adrDetails\\.yearOfManufacture').clear().type('123456').should('have.value', '123456');
      cy.get('#adrDetails\\.tankManufacturerSerialNo').clear().type('123456').should('have.value', '123456');
      cy.get('#adrDetails\\.tankTypeAppNo').clear().type('123456').should('have.value', '123456');
      cy.get('#adrDetails\\.tankCode').clear().type('123456').should('have.value', '123456');
      cy.get('#adrDetails\\.productListRefNo').clear().type('123456').should('have.value', '123456');
      cy.get('#cdk-accordion-child-5 > div > dl > div.ng-star-inserted > vtm-adr-details-form > div > div > fieldset > form > div.ng-star-inserted > div.govuk-inset-text > div > fieldset > div > div:nth-child(1) > input').check();
      cy.get('#adrDetails\\.specialProvisions').clear().type('ADR more details').should('have.value', 'ADR more details');
      cy.get('#adrDetails\\.tc2IntermediateApprovalNo').clear().type('123456').should('have.value', '123456');
      cy.get('#adrDetails\\.tc2Type').select('0').should('have.value', '0');
      cy.get('#adrDetails\\.tc2IntermediateExpiryDate\\.day').clear().type('22').should('have.value', '22');
      cy.get('#adrDetails\\.tc2IntermediateExpiryDate\\.month').clear().type('10').should('have.value', '10');
      cy.get('#adrDetails\\.tc2IntermediateExpiryDate\\.year').clear().type('2020').should('have.value', '2020');
      cy.get('#cdk-accordion-child-5 > div > dl > div.ng-star-inserted > vtm-adr-details-form > div > div > fieldset > form > div.ng-star-inserted > div:nth-child(13) > fieldset > div > div:nth-child(1) > input').check();
      cy.get('#cdk-accordion-child-5 > div > dl > div.ng-star-inserted > vtm-adr-details-form > div > div > fieldset > form > div.ng-star-inserted > div.govuk-inset-text > div > fieldset > div > div:nth-child(1) > input').check();
      cy.get('#adrDetails\\.brakeDeclarationsSeen').check();
      cy.get('#cdk-accordion-child-5 > div > dl > div.ng-star-inserted > vtm-adr-details-form > div > div > fieldset > form > div:nth-child(12) > fieldset > div > div:nth-child(1) > input').check();
      cy.get('#adrDetails\\.adrMoreDetail').clear().type('ADR more details').should('have.value', 'ADR more details');

    });

    it('AND the attributes that are marked as NA for my vehicle type do not even appear for entry', () => {
      cy.get('#test-listStatementApplicable').should('not.be.visible');
    });

    it('AND I am unable to enter an erroneous date', () => {
      cy.get('#adrDetails\\.approvalDate\\.day').clear().type('10').should('have.value', '10');
      cy.get('#adrDetails\\.approvalDate\\.month').clear().type('10').should('have.value', '10');
      cy.get('#adrDetails\\.approvalDate\\.year').clear().type('2018').should('have.value', '2018');
    });
  });

  context('AC7. User clicks the call to action to save the ADR details, ' +
    'is presented with "Enter reason for changing technical record" modal', () => {

    it('GIVEN I have completed all the mandatory ADR fields for my vehicle type', () => {
      cy.get('#adrDetails\\.name').should('have.value', 'Dorel Grigore');
      cy.get('#adrDetails\\.city').should('have.value', 'Dorel Grigore');
      cy.get('#adrDetails\\.town').should('have.value', 'Dorel Grigore');
      cy.get('#adrDetails\\.postcode').should('have.value', 'Dorel Grigore');
      cy.get('#adrDetails\\.approvalDate\\.day').should('have.value', '10');
      cy.get('#adrDetails\\.approvalDate\\.month').should('have.value', '10');
      cy.get('#adrDetails\\.approvalDate\\.year').should('have.value', '2018');
      cy.get('#adrDetails\\.adrTypeApprovalNo').should('have.value', '123456');
    });

    it('AND I could have completed the optional ADR fields for my vehicle type', () => {
      cy.get('#adrDetails\\.adrMoreDetail').should('have.value', 'ADR more details');
    });

    it('WHEN I click the call to action to save my ADR record', () => {
      cy.get('#test-save-btn').should('have.text', ' Save technical record ');
      cy.get('#test-save-btn').click();
    });

    it('THEN I am presented with a modal window which asks me to enter the "Enter reason for changing technical record"', () => {
      cy.get('#mat-dialog-0').should('be.visible');
    });
  });

  context('AC8. User actually saves the ADR details (New technical record is created' +
    ', existing technical record gets archived, audit fields get set on both)', () => {

    it('GIVEN I am presented with the "Enter reason for changing technical record" modal', () => {
      cy.get('#mat-dialog-0').scrollIntoView().should('be.visible');
    });

    it('AND I have entered a reason into this modal', () => {
      cy.get('#reasonForCreation').type('My reason');
    });

    it('WHEN I click the call to action to save', () => {
// to be completed when saving finished
    });

    it('THEN a new technical record is created for this vehicle', () => {
// to be completed when saving finished
    });

    it('AND I am presented with the "tech record view" screen of my new record', () => {
// to be completed when saving finished
    });
  });

  context('AC9. User backs out of actually saving the ADR details, ' +
    'after being presented with "Enter reason for changing technical record" modal', () => {

    it('GIVEN I am presented with the "Enter reason for changing technical record" modal', () => {
      cy.get('#mat-dialog-0').scrollIntoView().should('be.visible');
    });

    it('WHEN I click the call to action to cancel\n', () => {
      cy.get('#mat-dialog-0 > vtm-adr-reason-modal > a').click();
    });

    it('THEN I am taken back to ADR update screen\n', () => {
      cy.get('#mat-dialog-0').scrollIntoView().should('not.exist');
    });

    it('AND the values that I was updating are still present on this front end screen', () => {

    });
  });

});

