describe('Home page spec', () => {
  it('Should show correct contents', () => {
    cy.visit('/');
    cy.get('#appbar').should('be.visible');
  });
});
