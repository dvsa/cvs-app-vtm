/// <reference types="cypress" />
declare namespace Cypress {
  interface Chainable {
    loginToAAD(): Chainable<JQuery<HTMLElement>>;
    createVehicle(vin: string, statusCode: string, primaryVrm: string): Chainable<JQuery<HTMLElement>>;
  }
}

function loginViaAAD(username: string, password: string) {
  //Login to your AAD tenant.
  cy.visit('');
  cy.origin(
    'login.microsoftonline.com',
    {
      args: {
        username,
        password
      }
    },
    ({ username, password }) => {
      cy.get('input[type="email"]').type(username, {
        log: false
      });
      cy.get('input[type="submit"]').click();
      cy.get('input[type="password"]').type(password, {
        log: false
      });
      cy.get('input[type="submit"]').click();
    }
  );

  cy.url().should('equal', 'http://localhost:4200/');
}

function createVehicle(vin: string, statusCode: string, primaryVrm: string) {
  const techRecord = [
    {
      vehicleType: 'psv',
      vehicleClass: { code: '4', description: 'MOT class 4' },
      bodyType: { code: 'b', description: 'box' },
      reasonForCreation: 'Cypress auto testing',
      brakes: { brakeCode: '123' },
      statusCode
    }
  ];
  const body = {
    vin,
    primaryVrm,
    techRecord,
    msUserDetails: { msUser: '123', msOid: '123' }
  };
  const headers = {
    authorization: 'Bearer ' + window.localStorage.getItem('accessToken')
  };
  cy.request({ method: 'POST', url: Cypress.env('vtm_api_uri') + '/vehicles', headers, body }).then(response => {
    expect(response.body).to.have.property('systemNumber');
  });
}

Cypress.Commands.add('loginToAAD', () => {
  const username = Cypress.env('aad_username');
  const password = Cypress.env('aad_password');
  cy.session(
    `loginSession`,
    () => {
      const log = Cypress.log({
        displayName: 'Azure Active Directory Login',
        message: [`🔐 Authenticating | ${username}`],
        // @ts-ignore
        autoEnd: false
      });

      log.snapshot('before');

      loginViaAAD(username, password);

      log.snapshot('after');
      log.end();
    },
    {
      validate: () => {
        cy.visit('http://localhost:4200');
      },
      cacheAcrossSpecs: true
    }
  );
});

Cypress.Commands.add('createVehicle', (vin: string, statusCode: string, primaryVrm: string) => {
  createVehicle(vin, statusCode, primaryVrm);
});
