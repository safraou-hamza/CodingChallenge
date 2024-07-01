describe('Customer Table Tests', () => {
    beforeEach(() => {
      cy.visit('/');
    });
  
    it('should load the table with data', () => {
      cy.get('table').should('exist');
      cy.get('tbody tr').should('have.length.greaterThan', 0);
    });
  
    it('should filter table data', () => {
      cy.get('input[placeholder="Filter table..."]').type('Private');
      cy.get('tbody tr').each(($row) => {
        cy.wrap($row).contains('Private');
      });
    });
  
    it('should sort table by Full Name', () => {
      cy.get('th').contains('Full Name').click();
      cy.get('tbody tr').first().contains('Alice Smith');
  
      cy.get('th').contains('Full Name').click();
      cy.get('tbody tr').first().contains('Zack Johnson');
    });
  
    it('should paginate table data', () => {
      cy.get('button').contains('>').click();
      cy.get('button').contains('>').click();
      cy.get('tbody tr').should('have.length', 10);
    });
  
    it('should change page size', () => {
      cy.get('select').select('20');
      cy.get('tbody tr').should('have.length', 20);
    });
  
    it('should open modal and display portfolios', () => {
      cy.get('button').contains('View Portfolios').first().click();
      cy.get('.modalBlur').should('exist');
      cy.get('.modalBlur').contains('Portfolios');
    });
  });
  