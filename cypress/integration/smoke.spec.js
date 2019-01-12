describe('Smoke Tests', () => {
    function getUrl() {
        return 'http://localhost:3000';
    }

    it('should have a page title', function() {
        cy.visit(getUrl());

        const title = cy.get('h1');

        title.contains('DXF File Converter');
    });

    it('should have a button to choose DXFs', function() {
        cy.visit(getUrl());

        const button = cy.get('[data-hook=file-button]');

        button.contains('Choose a DXF File');
    });
});
