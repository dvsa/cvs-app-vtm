/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
declare namespace Cypress {
  interface Chainable {
    loginToAAD(username: string, password: string): Chainable<JQuery<HTMLElement>>;
  }
}

function loginViaAAD(username: string, password: string) {
  //Login to your AAD tenant.
  cy.visit('');
  cy.origin(
    'login.microsoftonline.com',
    {
      args: {
        username
      }
    },
    ({ username }) => {
      cy.get('input[type="email"]').type(username, {
        log: false
      });
      cy.get('input[type="submit"]').click();
    }
  );

  // depending on the user and how they are registered with Microsoft, the origin may go to live.com
  cy.origin(
    'login.microsoftonline.com',
    {
      args: {
        password
      }
    },
    ({ password }) => {
      cy.get('input[type="password"]').type(password, {
        log: false
      });
      cy.get('input[type="submit"]').click();
    }
  );

  // Ensure Microsoft has redirected us back to the sample app with our logged in user.
  cy.url().should('equal', 'http://localhost:4200/');
}

Cypress.Commands.add('loginToAAD', (username: string, password: string) => {
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
