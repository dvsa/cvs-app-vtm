/// <reference types="cypres" /
describe('VTM Detail - HGV+TRL Tech Record View', () => {
  beforeEach(() => {
    // cy.visit('http://localhost:4200');
    // cy.get('input[formcontrolname=loginfmt]').type('Vtm-Admin1@dvsagov.onmicrosoft.com');
    // cy.get('inout[type=submit]').click();
    // cy.get('input[formcontrolname=passwd]').type('Vtm-Admin1@dvsagov.onmicrosoft.com');
    // cy.get('input[formcontrolname=password]').type('Vtmadmin!1');
    // cy.get('input[type=submit]').click();
  });

  context('AC1: After searching, technical record with status "current" is displayed if it exists for this vehicle in DynamoDB', () => {

    // tslint:disable-next-line:max-line-length
    const techRecordHistoryTable = '<td _ngcontent-c5="" class="govuk-table__cell" id="test-statusCode-0"> Current </td><td _ngcontent-c5="" class="govuk-table__cell" id="test-reasonForCreation-0"> New Vehicle</td><td _ngcontent-c5="" class="govuk-table__cell" id="test-createdByName-0"> -</td><td _ngcontent-c5="" class="govuk-table__cell" id="test-createdAt-0"> 24/06/2019</td><td _ngcontent-c5="" class="govuk-table__cell"></td><td _ngcontent-c5="" class="govuk-table__cell"></td>';
    it('I have searched for a HGV/TRL', () => {
      cy.visit('http://localhost:4200');
      cy.get('#searchIdentifier').type('P012301230123').should('have.value', 'P012301230123');
      cy.get('.govuk-button').click();
    });

    it('the technical record with status "CURRENT" is displayed', () => {
      cy.get('#test-status').should('have.text', ' Current ');
    });

    it('the remaining technical records for this vehicle are summarised within the "Technical record history" section', () => {
      cy.get('#mat-expansion-panel-header-8 > .mat-content > .mat-expansion-panel-header-title > .item-technical-record')
        .should('have.text', ' Technical record history ');
      cy.get('#mat-expansion-panel-header-8 > .mat-content > .mat-expansion-panel-header-title > .item-technical-record').click();
    });

    it('the remaining technical records in this section are displayed in descending order based on the "createdAt" attribute', () => {
      cy.get('#cdk-accordion-child-8 > .mat-expansion-panel-body > .govuk-table > .govuk-table__body > .govuk-table__row')
        .should('have.html', techRecordHistoryTable);
    });
  });

  context('AC2: After searching, technical record with status "provisional" is displayed, ' +
    'if this vehicle does not have a technical record with status "current" in DynamoDB', () => {

    // tslint:disable-next-line:max-line-length
    const techRecordHistoryTable = '<td _ngcontent-c5="" class="govuk-table__cell" id="test-statusCode-0"> Provisional </td><td _ngcontent-c5="" class="govuk-table__cell" id="test-reasonForCreation-0"> New Vehicle</td><td _ngcontent-c5="" class="govuk-table__cell" id="test-createdByName-0"> -</td><td _ngcontent-c5="" class="govuk-table__cell" id="test-createdAt-0"> 24/06/2019</td><td _ngcontent-c5="" class="govuk-table__cell"></td><td _ngcontent-c5="" class="govuk-table__cell"></td>';
    it('I have searched for a HGV/TRL', () => {
      cy.visit('http://localhost:4200');
      cy.get('#searchIdentifier').type('P012301270123').should('have.value', 'P012301270123');
      cy.get('.govuk-button').click();
    });

    it('the technical record with status "PROVISIONAL" is displayed', () => {
      cy.get('#test-status').should('have.text', ' Provisional ');
    });

    it('the remaining technical records for this vehicle are summarised within the "Technical record history" section', () => {
      cy.get('#mat-expansion-panel-header-8 > .mat-content > .mat-expansion-panel-header-title > .item-technical-record')
        .should('have.text', ' Technical record history ');
      cy.get('#mat-expansion-panel-header-8 > .mat-content > .mat-expansion-panel-header-title > .item-technical-record').click();
    });

    it('the remaining technical records in this section are displayed in descending order based on the "createdAt" attribute', () => {
      cy.get('#cdk-accordion-child-8 > .mat-expansion-panel-body > .govuk-table > .govuk-table__body > .govuk-table__row')
        .should('have.html', techRecordHistoryTable);
    });
  });

  context('AC3: After searching, the technical record with status "archived" and most recent "createdAt" is displayed' +
    ', if this vehicle only has technical records with status "archived" in DynamoDB', () => {

    // tslint:disable-next-line:max-line-length
    const techRecordHistoryTable = '<td _ngcontent-c5="" class="govuk-table__cell" id="test-statusCode-0"> Archived </td><td _ngcontent-c5="" class="govuk-table__cell" id="test-reasonForCreation-0"> New Trailer</td><td _ngcontent-c5="" class="govuk-table__cell" id="test-createdByName-0"> -</td><td _ngcontent-c5="" class="govuk-table__cell" id="test-createdAt-0"> 24/06/2019</td><td _ngcontent-c5="" class="govuk-table__cell"></td><td _ngcontent-c5="" class="govuk-table__cell"></td>';

    it('I have searched for a HGV/TRL', () => {
      cy.visit('http://localhost:4200');
      cy.get('#searchIdentifier').type('T13541234').should('have.value', 'T13541234');
      cy.get('.govuk-button').click();
    });

    it('this vehicle has at least one technical record with status "ARCHIVED" in DynamoDB', () => {
      cy.get('#test-status').should('have.text', ' Archived ');
    });

    it('the remaining technical records for this vehicle are summarised within the "Technical record history" section', () => {
      cy.get('#mat-expansion-panel-header-8 > .mat-content > .mat-expansion-panel-header-title > .item-technical-record')
        .should('have.text', ' Technical record history ');
      cy.get('#mat-expansion-panel-header-8 > .mat-content > .mat-expansion-panel-header-title > .item-technical-record').click();
    });

    it('the remaining technical records in this section are displayed in descending order based on the "createdAt" attribute', () => {
      cy.get('#cdk-accordion-child-8 > .mat-expansion-panel-body > .govuk-table > .govuk-table__body > .govuk-table__row')
        .should('have.html', techRecordHistoryTable);
    });
  });

  context('AC4: HGV/TRL tech records are structured correctly', () => {

    it('I have searched for a HGV/TRL', () => {
      cy.visit('http://localhost:4200');
      cy.get('#searchIdentifier').type('T13541234').should('have.value', 'T13541234');
      cy.get('.govuk-button').click();
    });

    it('the correct technical record is displayed', () => {
      cy.get('#test-vin').should('have.text', ' T13541234 ');
    });

    it('the status code of this tech record appears at the top', () => {
      cy.get('.grid-container-technical-record-status').should('be.visible').should('have.text', 'Status Archived ');
    });

    // tslint:disable-next-line:max-line-length
    it('the expandable headings are named "Vehicle summary, "Body", "Weights", "Tyres", "Dimensions", "Additional details", "Test history", "Technical Record history"', () => {
      cy.get('#mat-expansion-panel-header-0 > .mat-content > .mat-expansion-panel-header-title > .item-technical-record')
        .should('have.text', ' Vehicle summary ');
      cy.get('.mat-elevation-z0 > .item-technical-record')
        .should('have.text', ' Body ');
      cy.get('#mat-expansion-panel-header-2 > .mat-content > .mat-expansion-panel-header-title > .item-technical-record')
        .should('have.text', ' Weights ');
      cy.get('#mat-expansion-panel-header-3 > .mat-content > .mat-expansion-panel-header-title > .item-technical-record')
        .should('have.text', ' Tyres ');
      cy.get('#mat-expansion-panel-header-4 > .mat-content > .mat-expansion-panel-header-title > .item-technical-record')
        .should('have.text', ' Dimensions ');
      cy.get('#mat-expansion-panel-header-5 > .mat-content > .mat-expansion-panel-header-title > .item-technical-record')
        .should('have.text', ' ADR ');
      cy.get('#mat-expansion-panel-header-7 > .mat-content > .mat-expansion-panel-header-title > .item-technical-record')
        .should('have.text', ' Test history ');
      cy.get('#mat-expansion-panel-header-8 > .mat-content > .mat-expansion-panel-header-title > .item-technical-record')
        .should('have.text', ' Technical record history ');
    });

    it('there is a call to action to "Open all" heading', () => {
      cy.get('.govuk-link').should('have.text', 'Open all').click();
    });
  });

  context('AC5: User expands one heading', () => {

    it('I have searched for a HGV/TRL', () => {
      cy.visit('http://localhost:4200');
      cy.get('#searchIdentifier').type('P012301230123').should('have.value', 'P012301230123');
      cy.get('.govuk-button').click();
    });

    it('I click the "+" to expand one heading', () => {
      cy.get('#mat-expansion-panel-header-8 > .mat-content > .mat-expansion-panel-header-title > .item-technical-record')
        .click();
    });

    it('all the keys/values under that heading are displayed', () => {
      // tslint:disable-next-line:max-line-length
      const techRecordHistoryTable = '<td _ngcontent-c5="" class="govuk-table__cell" id="test-statusCode-0"> Current </td><td _ngcontent-c5="" class="govuk-table__cell" id="test-reasonForCreation-0"> New Vehicle</td><td _ngcontent-c5="" class="govuk-table__cell" id="test-createdByName-0"> -</td><td _ngcontent-c5="" class="govuk-table__cell" id="test-createdAt-0"> 24/06/2019</td><td _ngcontent-c5="" class="govuk-table__cell"></td><td _ngcontent-c5="" class="govuk-table__cell"></td>';

      cy.get('#cdk-accordion-child-8 > .mat-expansion-panel-body > .govuk-table > .govuk-table__body > .govuk-table__row')
        .should('have.html', techRecordHistoryTable);
    });

    it('the remaining heading are not expanded (since i only clicked the "+" on one particular heading', () => {
      // tslint:disable-next-line:max-line-length
      const plusIcon = '<svg aria-hidden="true" focusable="false" data-prefix="fa" data-icon="plus" class="svg-inline--fa fa-plus fa-w-14 fa-lg" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"></path></svg>';
      cy.get('#mat-expansion-panel-header-1 > .mat-content > .mat-expansion-panel-header-description > .expansion-icon > .ng-fa-icon')
        .should('have.html', plusIcon);
      cy.get('#mat-expansion-panel-header-2 > .mat-content > .mat-expansion-panel-header-description > .expansion-icon > .ng-fa-icon')
        .should('have.html', plusIcon);
      cy.get('#mat-expansion-panel-header-3 > .mat-content > .mat-expansion-panel-header-description > .expansion-icon > .ng-fa-icon')
        .should('have.html', plusIcon);
      cy.get('#mat-expansion-panel-header-4 > .mat-content > .mat-expansion-panel-header-description > .expansion-icon > .ng-fa-icon')
        .should('have.html', plusIcon);
      cy.get('#mat-expansion-panel-header-5 > .mat-content > .mat-expansion-panel-header-description > .expansion-icon > .ng-fa-icon')
        .should('have.html', plusIcon);
      cy.get('#mat-expansion-panel-header-6 > .mat-content > .mat-expansion-panel-header-description > .expansion-icon > .ng-fa-icon')
        .should('have.html', plusIcon);
    });
  });

  context('AC6: User clicks the call to action to "open all" headings', () => {

    it('I have searched for a HGV/TRL', () => {
      cy.visit('http://localhost:4200');
      cy.get('#searchIdentifier').type('P012301230123').should('have.value', 'P012301230123');
      cy.get('.govuk-button').click();
    });

    it('I click the call to action to "open all"', () => {
      cy.get('.govuk-link').should('have.text', 'Open all').click();
    });

    it('all the headings are expanded', () => {
      // tslint:disable-next-line:max-line-length
      const minusIcon = '<svg aria-hidden="true" focusable="false" data-prefix="fa" data-icon="minus" class="svg-inline--fa fa-minus fa-w-14 fa-lg" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M416 208H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"></path></svg>';
      cy.get('#mat-expansion-panel-header-1 > .mat-content > .mat-expansion-panel-header-description > .expansion-icon > .ng-fa-icon')
        .should('have.html', minusIcon);
      cy.get('#mat-expansion-panel-header-2 > .mat-content > .mat-expansion-panel-header-description > .expansion-icon > .ng-fa-icon')
        .should('have.html', minusIcon);
      cy.get('#mat-expansion-panel-header-3 > .mat-content > .mat-expansion-panel-header-description > .expansion-icon > .ng-fa-icon')
        .should('have.html', minusIcon);
      cy.get('#mat-expansion-panel-header-4 > .mat-content > .mat-expansion-panel-header-description > .expansion-icon > .ng-fa-icon')
        .should('have.html', minusIcon);
      cy.get('#mat-expansion-panel-header-5 > .mat-content > .mat-expansion-panel-header-description > .expansion-icon > .ng-fa-icon')
        .should('have.html', minusIcon);
      cy.get('#mat-expansion-panel-header-6 > .mat-content > .mat-expansion-panel-header-description > .expansion-icon > .ng-fa-icon')
        .should('have.html', minusIcon);
      cy.get('#mat-expansion-panel-header-7 > .mat-content > .mat-expansion-panel-header-description > .expansion-icon > .ng-fa-icon')
        .should('have.html', minusIcon);
    });

    it('the call to action now says "Close all"', () => {
      cy.get('.govuk-link').should('have.text', 'Close all');
    });
  });

  context('AC7: User clicks the call to action to "close all" headings', () => {

    it('I have searched for a HGV/TRL', () => {
      cy.visit('http://localhost:4200');
      cy.get('#searchIdentifier').type('P012301230123').should('have.value', 'P012301230123');
      cy.get('.govuk-button').click();
    });

    it('I click the call to action to "open all"', () => {
      cy.get('.govuk-link').should('have.text', 'Open all').click();
    });

    it('the call to action now says "close all"', () => {
      cy.get('.govuk-link').should('have.text', 'Close all');
    });

    it('I click the call to action to "close all"', () => {
      cy.get('.govuk-link').should('have.text', 'Close all').click();
    });

    it('all the headings are expanded', () => {
      // tslint:disable-next-line:max-line-length
      const plusIcon = '<svg aria-hidden="true" focusable="false" data-prefix="fa" data-icon="plus" class="svg-inline--fa fa-plus fa-w-14 fa-lg" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"></path></svg>';
      cy.get('#mat-expansion-panel-header-1 > .mat-content > .mat-expansion-panel-header-description > .expansion-icon > .ng-fa-icon')
        .should('have.html', plusIcon);
      cy.get('#mat-expansion-panel-header-2 > .mat-content > .mat-expansion-panel-header-description > .expansion-icon > .ng-fa-icon')
        .should('have.html', plusIcon);
      cy.get('#mat-expansion-panel-header-3 > .mat-content > .mat-expansion-panel-header-description > .expansion-icon > .ng-fa-icon')
        .should('have.html', plusIcon);
      cy.get('#mat-expansion-panel-header-4 > .mat-content > .mat-expansion-panel-header-description > .expansion-icon > .ng-fa-icon')
        .should('have.html', plusIcon);
      cy.get('#mat-expansion-panel-header-5 > .mat-content > .mat-expansion-panel-header-description > .expansion-icon > .ng-fa-icon')
        .should('have.html', plusIcon);
      cy.get('#mat-expansion-panel-header-6 > .mat-content > .mat-expansion-panel-header-description > .expansion-icon > .ng-fa-icon')
        .should('have.html', plusIcon);
      cy.get('#mat-expansion-panel-header-7 > .mat-content > .mat-expansion-panel-header-description > .expansion-icon > .ng-fa-icon')
        .should('have.html', plusIcon);
    });

    it('the call to action now says "open all"', () => {
      cy.get('.govuk-link').should('have.text', 'Open all');
    });
  });

  context('AC8: "-" is displayed, when an attribute has a value of "null" or space within DynamoDB', () => {

    it('I have searched for a HGV/TRL', () => {
      cy.visit('http://localhost:4200');
      cy.get('#searchIdentifier').type('T12765432').should('have.value', 'T12765432');
      cy.get('.govuk-button').click();
    });

    it('I have been presented with a technical record', () => {
      cy.get('#test-vin').should('have.text', ' T12765432 ');
    });

    it('at least one attribute within this technical record has a value of "null" or space, within DynamoDB', () => {

    });

    it('this field appears on the VTM front end', () => {
      cy.get('#mat-expansion-panel-header-6 > .mat-content > .mat-expansion-panel-header-title > .item-technical-record')
        .should('have.text', ' Notes ');
    });

    it('this "null" or space is represented as a "-" on the VTM front end', () => {
      cy.get('#test-notes').should('have.html', '-');
    });

  });

});
