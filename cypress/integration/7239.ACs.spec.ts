describe('VTM Detail - HGV+TRL Tech Record View', () => {
  context('AC1: After searching, technical record with status "current" is displayed if it exists for this vehicle in DynamoDB', () => {

    const techRecordHistoryTable = '<td _ngcontent-c2="" class="govuk-table__cell">Current</td><td _ngcontent-c2="" class="govuk-table__cell">New Vehicle</td><td _ngcontent-c2="" class="govuk-table__cell">-</td><td _ngcontent-c2="" class="govuk-table__cell">24/06/2019</td><td _ngcontent-c2="" class="govuk-table__cell"></td><td _ngcontent-c2="" class="govuk-table__cell"></td>';
    it('I have searched for a HGV/TRL', () => {
      cy.visit('/home');
      cy.get('.searchbar-input').type('P012301230123').should('have.value', 'P012301230123');
      cy.get('.searchbar-input').type('{enter}');
    });

    it('the technical record with status "CURRENT" is displayed', () => {
      cy.get('.record-search-title-text').should('have.text', 'Technical records from searched (vin/vrm) P012301230123');
      cy.get('.grid-container-technical-record-status').should('have.text', 'Status Current ');
    });

    it('the remaining technical records for this vehicle are summarised within the "Technical record history" section', () => {
      cy.get('#mat-expansion-panel-header-7 > .mat-content > .mat-expansion-panel-header-title > .item-technical-record')
        .should('have.text', ' Technical record history ');
      cy.get('#mat-expansion-panel-header-7 > .mat-content > .mat-expansion-panel-header-title > .item-technical-record').click();
    });

    it('the remaining technical records in this section are displayed in descending order based on the "createdAt" attribute', () => {
      cy.get('#cdk-accordion-child-7 > .mat-expansion-panel-body > .govuk-table > .govuk-table__body > .govuk-table__row')
        .should('have.html', techRecordHistoryTable);
    });
  });

  context('AC2: After searching, technical record with status "provisional" is displayed, ' +
    'if this vehicle does not have a technical record with status "current" in DynamoDB', () => {

    const techRecordHistoryTable = '<td _ngcontent-c2="" class="govuk-table__cell">Provisional</td><td _ngcontent-c2="" class="govuk-table__cell">New Vehicle</td><td _ngcontent-c2="" class="govuk-table__cell">-</td><td _ngcontent-c2="" class="govuk-table__cell">24/06/2019</td><td _ngcontent-c2="" class="govuk-table__cell"></td><td _ngcontent-c2="" class="govuk-table__cell"></td>';
    it('I have searched for a HGV/TRL', () => {
      cy.visit('/home');
      cy.get('.searchbar-input').type('P012301270123').should('have.value', 'P012301270123');
      cy.get('.searchbar-input').type('{enter}');
    });

    it('the technical record with status "PROVISIONAL" is displayed', () => {
      cy.get('.record-search-title-text').should('have.text', 'Technical records from searched (vin/vrm) P012301270123');
      cy.get('.grid-container-technical-record-status').should('have.text', 'Status Provisional ');
    });

    it('the remaining technical records for this vehicle are summarised within the "Technical record history" section', () => {
      cy.get('#mat-expansion-panel-header-7 > .mat-content > .mat-expansion-panel-header-title > .item-technical-record')
        .should('have.text', ' Technical record history ');
      cy.get('#mat-expansion-panel-header-7 > .mat-content > .mat-expansion-panel-header-title > .item-technical-record').click();
    });

    it('the remaining technical records in this section are displayed in descending order based on the "createdAt" attribute', () => {
      cy.get('#cdk-accordion-child-7 > .mat-expansion-panel-body > .govuk-table > .govuk-table__body > .govuk-table__row')
        .should('have.html', techRecordHistoryTable);
    });
  });

  context('AC3: After searching, the technical record with status "archived" and most recent "createdAt" is displayed' +
    ', if this vehicle only has technical records with status "archived" in DynamoDB', () => {

    const techRecordHistoryTable = '<th _ngcontent-c2="" class="govuk-table__cell govuk-!-font-weight-bold">Gross</th><td _ngcontent-c2="" class="govuk-table__cell">-</td><td _ngcontent-c2="" class="govuk-table__cell">-</td><td _ngcontent-c2="" class="govuk-table__cell"></td><td _ngcontent-c2="" class="govuk-table__cell"></td><td _ngcontent-c2="" class="govuk-table__cell"></td>';
    it('I have searched for a HGV/TRL', () => {
      cy.visit('/home');
      cy.get('.searchbar-input').type('T13541234').should('have.value', 'T13541234');
      cy.get('.searchbar-input').type('{enter}');
    });

    it('this vehicle has at least one technical record with status "ARCHIVED" in DynamoDB', () => {
      cy.get('.record-search-title-text').should('have.text', 'Technical records from searched (vin/vrm) T13541234');
      cy.get('.grid-container-technical-record-status').should('have.text', 'Status Archived ');
    });

    it('the remaining technical records for this vehicle are summarised within the "Technical record history" section', () => {
      cy.get(':nth-child(8) > .custom-header > .disable_ripple > .mat-content > .mat-expansion-panel-header-title > .item-technical-record')
        .should('have.text', ' Technical record history ');
      cy.get(':nth-child(8) > .custom-header > .disable_ripple > .mat-content > .mat-expansion-panel-header-title > .item-technical-record')
        .click();
    });

    it('the remaining technical records in this section are displayed in descending order based on the "createdAt" attribute', () => {
      cy.get('.govuk-table__body > .govuk-table__row')
        .should('have.html', techRecordHistoryTable);
    });
  });

  context('AC4: HGV/TRL tech records are structured correctly', () => {

    it('I have searched for a HGV/TRL', () => {
      cy.visit('/home');
      cy.get('.searchbar-input').type('T13541234').should('have.value', 'T13541234');
      cy.get('.searchbar-input').type('{enter}');
    });

    it('the correct technical record is displayed', () => {
      cy.get('.record-search-title-text').should('have.text', 'Technical records from searched (vin/vrm) T13541234');
    });

    it('the status code of this tech record appears at the top', () => {
      cy.get('.grid-container-technical-record-status').should('be.visible').should('have.text', 'Status Archived ');
    });

    it('the expandable headings are named "Vehicle summary, "Body", "Weights", "Tyres", "Dimensions", "Additional details", "Test history", "Technical Record history"', () => {
      cy.get('#mat-expansion-panel-header-1 > .mat-content > .mat-expansion-panel-header-title > .item-technical-record')
        .should('have.text', ' Vehicle summary ');
      cy.get(':nth-child(2) > .custom-header > .disable_ripple > .mat-content > .mat-expansion-panel-header-title > .item-technical-record')
        .should('have.text', ' Body ');
      cy.get(':nth-child(3) > .custom-header > .disable_ripple > .mat-content > .mat-expansion-panel-header-title > .item-technical-record')
        .should('have.text', ' Weights ');
      cy.get(':nth-child(4) > .custom-header > .disable_ripple > .mat-content > .mat-expansion-panel-header-title > .item-technical-record')
        .should('have.text', ' Tyres ');
      cy.get(':nth-child(5) > .custom-header > .disable_ripple > .mat-content > .mat-expansion-panel-header-title > .item-technical-record')
        .should('have.text', ' Dimensions ');
      cy.get(':nth-child(6) > .custom-header > .disable_ripple > .mat-content > .mat-expansion-panel-header-title > .item-technical-record')
        .should('have.text', ' Notes ');
      cy.get('#mat-expansion-panel-header-8 > .mat-content > .mat-expansion-panel-header-title > .item-technical-record')
        .should('have.text', ' Test history ');
      cy.get(':nth-child(8) > .custom-header > .disable_ripple > .mat-content > .mat-expansion-panel-header-title > .item-technical-record')
        .should('have.text', ' Technical record history ');
    });

    it('there is a call to action to "Open all" heading', () => {
      cy.get('.govuk-link').should('have.text', 'Open all').click();
    });
  });

  context('AC5: User expands one heading', () => {

    it('I have searched for a HGV/TRL', () => {
      cy.visit('/home');
      cy.get('.searchbar-input').type('P012301230123').should('have.value', 'P012301230123');
      cy.get('.searchbar-input').type('{enter}');
    });

    it('I click the "+" to expand one heading', () => {
      cy.get(':nth-child(8) > .custom-header > .disable_ripple > .mat-content > .mat-expansion-panel-header-title > .item-technical-record')
        .click();
    });

    it('all the keys/values under that heading are displayed', () => {
      const techRecordHistoryTable = '<td _ngcontent-c2="" class="govuk-table__cell">Current</td><td _ngcontent-c2="" class="govuk-table__cell">New Vehicle</td><td _ngcontent-c2="" class="govuk-table__cell">-</td><td _ngcontent-c2="" class="govuk-table__cell">24/06/2019</td><td _ngcontent-c2="" class="govuk-table__cell"></td><td _ngcontent-c2="" class="govuk-table__cell"></td>';

      cy.get('#cdk-accordion-child-7 > .mat-expansion-panel-body > .govuk-table > .govuk-table__body > .govuk-table__row')
        .should('have.html', techRecordHistoryTable);
    });

    it('the remaining heading are not expanded (since i only clicked the "+" on one particular heading', () => {
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
      cy.visit('/home');
      cy.get('.searchbar-input').type('P012301230123').should('have.value', 'P012301230123');
      cy.get('.searchbar-input').type('{enter}');
    });

    it('I click the call to action to "open all"', () => {
      cy.get('.govuk-link').should('have.text', 'Open all').click();
    });

    it('all the headings are expanded', () => {
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
      cy.visit('/home');
      cy.get('.searchbar-input').type('P012301230123').should('have.value', 'P012301230123');
      cy.get('.searchbar-input').type('{enter}');
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
      cy.visit('/home');
      cy.get('.searchbar-input').type('T12765432').should('have.value', 'T12765432');
      cy.get('.searchbar-input').type('{enter}');
    });

    it('I have been presented with a technical record', () => {
      cy.get('.record-search-title-text').should('have.text', 'Technical records from searched (vin/vrm) T12765432');
      cy.get('.grid-container-technical-record-status').should('have.text', 'Status Current ');
    });

    it('at least one attribute within this technical record has a value of "null" or space, within DynamoDB', () => {

    });

    it('this field appears on the VTM front end', () => {
      cy.get(':nth-child(6) > .custom-header > .disable_ripple > .mat-content > .mat-expansion-panel-header-title > .item-technical-record')
        .should('have.text', ' Notes ');
    });

    it('this "null" or space is represented as a "-" on the VTM front end', () => {
      const lineValueHtml = '<span _ngcontent-c2="" class="notes-section">-</span>';
      cy.get('#cdk-accordion-child-6 > .mat-expansion-panel-body > .technical-record-sub-details > .govuk-summary-list__row > .govuk-summary-list__key')
        .should('have.html', lineValueHtml);
    });

  });

});

