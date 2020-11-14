describe('Home page spec', () => {
  it('Should show correct contents', () => {
    cy.visit('/');
    cy.get('#appbar').should('be.visible');
    cy.get('h1').should('contain', 'Hi! My name is Jerico.');
    cy.get('h6').should('contain', 'Thanks for visiting! Select an area of interest below to learn more about me.');
  });
});