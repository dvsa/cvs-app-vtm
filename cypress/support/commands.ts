/// <reference types="cypress" />
declare namespace Cypress {
  interface Chainable {
    loginToAAD(): Chainable<JQuery<HTMLElement>>;
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

Cypress.Commands.add('loginToAAD', () => {
  const username = Cypress.env('aad_username');
  const password = Cypress.env('aad_password');
  cy.session(
    `aad-${username}`,
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
        // this is a very basic form of session validation for this demo.
        // depending on your needs, something more verbose might be needed
        cy.visit('http://localhost:4200');
      }
    }
  );
});
