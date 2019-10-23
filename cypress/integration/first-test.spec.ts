context('First test', () => {
  it('should visit home page', () => {
    cy.visit('/home');
    cy.get('.searchbar-input').type('1234567889').should('have.value', '1234567889');
    cy.get('.searchbar-input').type('{enter}');
    cy.get('.record-search-title-text').should('have.text', 'Technical records from searched (vin/vrm) 1234567889');
  });
});
