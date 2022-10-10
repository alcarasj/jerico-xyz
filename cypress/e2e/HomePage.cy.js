describe('Home page spec', () => {
  it('Should show correct contents', () => {
    cy.visit('/');
    cy.get('#appbar').should('be.visible');
    cy.get('h3').should('be.visible');
    cy.get('h6').should('be.visible');
    cy.get('.MuiCard-root').should(cards => {
      expect(cards).to.have.length(4);
    });
  });
});
