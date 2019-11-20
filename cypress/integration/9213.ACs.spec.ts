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
      cy.get('#test-vin').should('have.text', ' ABCDEFGH777777 ');
    });

    it('AND this technical record could already have ADR details on it', () => {
      cy.get('#test-ADR-type').should('have.text', ' Centre axle tank ');
    });

    it('WHEN I click the call to action to "change technical record" (as per the designs)', () => {
      cy.get('.govuk-button').click();
    });

    it('THEN I am able to update the attributes on this technical record', () => {
      cy.get('#mat-expansion-panel-header-6 > .mat-content > .mat-expansion-panel-header-title > .item-technical-record')
        .click();
      cy.get('#name').type('Dorel Grigore').should('have.value', 'Dorel Grigore');
    });

    it('AND there is a call to action to \'cancel\' my change', () => {
      cy.get('#cancel').should('have.text', 'Cancel');
    });
  });

  context('AC2. User clicks the call to action to cancel the change', () => {

    it('GIVEN I have clicked the call to action to "change technical record" (as per the designs)', () => {
      cy.get('.govuk-grid-column-one-thirds > .govuk-button').should('have.text', ' Save technical record ');
    });

    it('AND there is a call to action to \'cancel\' my change', () => {
      cy.get('#cancel').should('have.text', 'Cancel');
    });

    it('AND I could have updated some values', () => {
      cy.get('#name').type(' Banciu').should('have.value', 'Dorel Grigore Banciu');
    });

    it('WHEN I click the call to action to \'cancel\' my change', () => {
      cy.get('#cancel').click();
    });

    it('THEN I am returned to the "view technical record page" for my technical record', () => {
      cy.get('#name').should('not.be.visible');
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
      cy.get('#test-vin').should('have.text', ' P012301230123 ');
      cy.get('.govuk-grid-column-one-thirds > .govuk-button').click();
    });

    it('AND this technical record DOES NOT already have ADR details on it', () => {
      cy.get('#mat-expansion-panel-header-6 > .mat-content > .mat-expansion-panel-header-title > .item-technical-record')
        .click();
      cy.get('#test-aplicantDetails-name').should('not.be.visible');
    });

    it('WHEN I set the \'Able to carry dangerous goods\' radio button to yes', () => {
      cy.get('#hasADR').check();
    });

    it('THEN I am able to add ADR details on this technical record', () => {
      cy.get('#name').type('Dorel Grigore').should('have.value', 'Dorel Grigore');
    });
  });

  context('AC4 Technical record DOES already have ADR details on it', () => {

    it('GIVEN I have clicked the call to action to change this technical record', () => {
      cy.visit('http://localhost:4200');
      cy.get('#searchIdentifier').type('ABCDEFGH777777').should('have.value', 'ABCDEFGH777777');
      cy.get('.govuk-button').click();
      cy.get('#test-vin').should('have.text', ' ABCDEFGH777777 ');
      cy.get('.govuk-grid-column-one-thirds > .govuk-button').click();
    });

    it('AND this technical record DOES already have ADR details on it', () => {
      cy.get('#mat-expansion-panel-header-6 > .mat-content > .mat-expansion-panel-header-title > .item-technical-record')
        .click();
      cy.get('#name').should('be.visible');
    });

    it('WHEN I scroll to the ADR details section on this screen', () => {
      cy.get('#mat-expansion-panel-header-6 > .mat-content > .mat-expansion-panel-header-title > .item-technical-record')
        .scrollIntoView();
      cy.get('#name').type('Dorel Grigore').should('have.value', 'Dorel Grigore');
    });

    it('THEN the Able to carry dangerous goods radio button is already set to yes', () => {
      cy.get('#hasADR').should('be.checked');
    });

    it('AND I am already able to update ADR details on this technical record', () => {
      cy.get('#street').type('Dorel Grigore').should('have.value', 'Dorel Grigore');
    });
  });

  context('AC5. User is presented with the applicant details for updating', () => {

    it('GIVEN am able to update the ADR details on this technical record', () => {
      cy.get('.govuk-grid-column-one-thirds > .govuk-button').should('have.text', ' Save technical record ');
    });

    it('WHEN I scroll to the ADR details section (to update the ADR details)', () => {
      cy.get('#mat-expansion-panel-header-6 > .mat-content > .mat-expansion-panel-header-title > .item-technical-record')
        .scrollIntoView();
    });

    it('THEN I must first enter the applicant details as per the design (name, street, town, city, post code)', () => {
      cy.get('#city').type('Dorel Grigore').should('have.value', 'Dorel Grigore');
      cy.get('#town').type('Dorel Grigore').should('have.value', 'Dorel Grigore');
      cy.get('#postcode').type('Dorel Grigore').should('have.value', 'Dorel Grigore');
    });

    it('AND I am able to select one vehicle type from the list ', () => {
      cy.get('#type').select('Rigid tank').should('have.value', 'Rigid tank');
    });
  });

  context('AC6. User enters the remaining details for their vehicle type', () => {

    it('GIVEN I am updating the ADR details on this technical record', () => {
      cy.get('.govuk-grid-column-one-thirds > .govuk-button').should('have.text', ' Save technical record ');
    });

    it('AND I have entered the applicant details and WHEN I select a vehicle type', () => {
      cy.get('#mat-expansion-panel-header-6 > .mat-content > .mat-expansion-panel-header-title > .item-technical-record')
        .scrollIntoView();
      cy.get('#type').should('have.value', 'Rigid tank');
    });

    it('THEN I must complete all mandatory attributes for my vehicle type', () => {
      cy.get('#city').should('have.value', 'Dorel Grigore');
      cy.get('#town').should('have.value', 'Dorel Grigore');
      cy.get('#postcode').should('have.value', 'Dorel Grigore');
    });

    it('AND I am able to complete any of the optional fields for my vehicle type, if I wish to', () => {
      cy.get('#day').type('22').should('have.value', '22');
      cy.get('#month').type('10').should('have.value', '10');
      cy.get('#year').type('2019').should('have.value', '2019');
      cy.get('#permittedDangerousGoods').select('1: \'1A\'');
      cy.get('#adrTypeApprovalNo').type('123456').should('have.value', '123456');
      cy.get('#tankManufacturer').type('123456').should('have.value', '123456');
      cy.get('#yearOfManufacture').type('123456').should('have.value', '123456');
      cy.get('#tankManufacturerSerialNo').type('123456').should('have.value', '123456');
      cy.get('#tankTypeAppNo').type('123456').should('have.value', '123456');
      cy.get('#tankCode').type('123456').should('have.value', '123456');
      cy.get('#productListRefNo').type('123456').should('have.value', '123456');
      cy.get('#classUN').check();
      cy.get('#isStatement').check();
      cy.get('#specialProvisions').type('ADR more details').should('have.value', 'ADR more details');
      cy.get('#productList').type('ADR more details').should('have.value', 'ADR more details');
      cy.get('#tc2IntermediateApprovalNo').type('123456').should('have.value', '123456');
      cy.get('#tc2Type').select('initial').should('have.value', 'initial');
      cy.get('#dayExpiry').type('22').should('have.value', '22');
      cy.get('#monthExpiry').type('10').should('have.value', '10');
      cy.get('#yearExpiry').type('2020').should('have.value', '2020');
      cy.get('#isMemo').check();
      cy.get('#applicable').check();
      cy.get('#declarationsSeen').check();
      cy.get('#yesCert').check();
      cy.get('#adr-more-detail').type('ADR more details').should('have.value', 'ADR more details');

    });

    it('AND the attributes that are marked as NA for my vehicle type do not even appear for entry', () => {
      cy.get('#test-listStatementApplicable').should('not.be.visible');
    });

    it('AND I am unable to enter an erroneous date', () => {
      cy.get('#day').clear().type('100').should('have.value', '10');
      cy.get('#month').clear().type('100').should('have.value', '10');
      cy.get('#year').clear().type('20188').should('have.value', '2018');
    });
  });

  // context('AC7. User clicks the call to action to save the ADR details, ' +
  //   'is presented with "Enter reason for changing technical record" modal', () => {
  //
  //   it('GIVEN I have completed all the mandatory ADR fields for my vehicle type', () => {
  //     cy.get('#applicantDetailsName').should('have.value', 'Dorel Grigore');
  //     cy.get('#applicantDetailsCity').should('have.value', 'Dorel Grigore');
  //     cy.get('#applicantDetailsTown').should('have.value', 'Dorel Grigore');
  //     cy.get('#applicantDetailsPostcode').should('have.value', 'Dorel Grigore');
  //     cy.get('#approvalDate-day').should('have.value', '22');
  //     cy.get('#approvalDate-month').should('have.value', '10');
  //     cy.get('#approvalDate-year').should('have.value', '2019');
  //     cy.get('#adrTypeApprovalNo').should('have.value', '123456');
  //   });
  //
  //   it('AND I could have completed the optional ADR fields for my vehicle type', () => {
  //     cy.get('#adr-more-detail').should('have.value', 'ADR more details');
  //   });
  //
  //   it('AND I could have attached documents to my ADR record', () => {
  //   });
  //
  //   it('WHEN I click the call to action to save my ADR record', () => {
  //     cy.get('.govuk-button').should('have.text', ' Save technical record ');
  //     cy.get('.govuk-button').click();
  //   });
  //
  //   it('THEN I am presented with a modal window which asks me to enter the "Enter reason for changing technical record"', () => {
  //     cy.get('#modalIdHere').should('be.visible');
  //   });
  // });

  context('AC8. User actually saves the ADR details (New technical record is created' +
    ', existing technical record gets archived, audit fields get set on both)', () => {

    it('GIVEN I am presented with the "Enter reason for changing technical record" modal', () => {
      // functionality was not implemented at the time this test was written.
      cy.get('#functionality-not-implemented-yet').should('be.visible');
    });

    it('AND I have entered a reason into this modal', () => {

    });

    it('WHEN I click the call to action to save', () => {

    });

    it('THEN a new technical record is created for this vehicle', () => {

    });

    it('AND this new technical record consists of all the fields on the existing (queried) technical record,' +
      ' plus the updated ADR details, plus the updated "reasonForCreation"', () => {

    });

    it('AND the relevant audit fields (as per CVSB-7244 + CVSB-8677) are automatically' +
      ' set on this new technical record (createdByName, createdById, createdAt)', () => {

    });

    it('AND the existing technical record (with the "old" adrDetails{} object,' +
      ' or no adrDetails{} object on it at all) has it\'s statusCode set to \'archived\'', () => {

    });

    it('AND the relevant audit fields (as per CVSB-7244 + CVSB-8677) are automatically set ' +
      'on this archived technical record (lastUpdatedByName, lastUpdatedById, updateType, lastUpdatedAt)', () => {

    });

    it('AND any dates entered in the front end are converted into YYYY-MM-DD format (to comply with the API)', () => {

    });

    it('AND the \'weight\' that I entered (in kg) gets converted to tonnes (i.e, divide by 1000) ', () => {

    });

    it('AND all other fields on these technical records are unaffected', () => {

    });

    it('AND all other technical records for this vehicle are unaffected', () => {

    });

    it('AND any attached documents are stored against my ADR record (see CVSB-9214 for details)', () => {

    });

    it('AND I am presented with the "tech record view" screen of my new record', () => {

    });
  });

  context('AC9. User backs out of actually saving the ADR details, ' +
    'after being presented with "Enter reason for changing technical record" modal', () => {

    it('GIVEN I am presented with the "Enter reason for changing technical record" modal', () => {
      // functionality was not implemented at the time this test was written.
      cy.get('#functionality-not-implemented-yet').should('be.visible');
    });

    it('WHEN I click the call to action to cancel\n', () => {
    });

    it('THEN I am taken back to ADR update screen\n', () => {
    });

    it('AND the values that I was updating are still present on this front end screen', () => {
    });
  });

});

