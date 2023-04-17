/// <reference types="cypress" />
declare namespace Cypress {
  interface Chainable {
    loginToAAD(): Chainable<JQuery<HTMLElement>>;
    createVehicle(vehicleType: string, vin: string, statusCode: string, primaryVrm: string): Chainable<JQuery<HTMLElement>>;
    createVehicleAndTest(vehicleType: string, vin: string, primaryVrm: string, testTypeId: string): Chainable<JQuery<HTMLElement>>;
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

function createVehicle(vehicleType: string, vin: string, statusCode: string, primaryVrm: string) {
  cy.fixture(vehicleType).then(techRecord => {
    techRecord.statusCode = statusCode;
    const body = {
      vin,
      primaryVrm,
      msUserDetails: { msUser: '123', msOid: '123' },
      techRecord: [techRecord]
    };
    const headers = {
      authorization: 'Bearer ' + window.localStorage.getItem('accessToken')
    };
    cy.request({ method: 'POST', url: Cypress.env('vtm_api_uri') + '/vehicles', headers, body }).then(response => {
      expect(response.body).to.have.property('systemNumber');
    });
  });
}

function createTest(vehicleType: string, vin: string, primaryVrm: string, testTypeId: string) {
  cy.fixture(vehicleType).then(techRecord => {
    techRecord.statusCode = 'current';
    const body = {
      vin,
      primaryVrm,
      msUserDetails: { msUser: '123', msOid: '123' },
      techRecord: [techRecord]
    };
    const headers = {
      authorization: 'Bearer ' + window.localStorage.getItem('accessToken')
    };
    cy.request({ method: 'POST', url: Cypress.env('vtm_api_uri') + '/vehicles', headers, body }).then(response => {
      cy.fixture(testTypeId).then(testRecord => {
        testRecord.systemNumber = response.body.systemNumber;
        testRecord.testResultId = randomString(15);
        testRecord.testStartTimestamp = new Date().toISOString();
        testRecord.testEndTimestamp = new Date().toISOString();
        testRecord.testTypes[0].testTypeStartTimestamp = new Date().toISOString();
        testRecord.testTypes[0].testTypeEndTimestamp = new Date().toISOString();
        testRecord.vin = vin;
        const testBody = testRecord;
        cy.request({ method: 'POST', url: Cypress.env('vtm_api_uri') + '/test-results', headers, body: testBody }).then(response => {
          expect(response.status).to.equal(201);
        });
      });
    });
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

Cypress.Commands.add('createVehicle', (vehicleType: string, vin: string, statusCode: string, primaryVrm: string) => {
  createVehicle(vehicleType, vin, statusCode, primaryVrm);
});
Cypress.Commands.add('createVehicleAndTest', (vehicleType: string, vin: string, primaryVrm: string, testTypeId: string) => {
  createTest(vehicleType, vin, primaryVrm, testTypeId);
});

const randomString = (length: number = 5) => {
  const randomString = (Math.random() + 1).toString(36);
  return randomString.substring(randomString.length - length);
};
