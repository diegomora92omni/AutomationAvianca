/// <reference types='Cypress' />

describe('Test cases for accessing the base URL and validating IP', () => {

    beforeEach(() => {
        // Visitar la URL base configurada en cypress.json
        cy.visit('/');
    });

    it('Should access the base URL and validate the IP address', () => {
        // Verificar que el sitio se ha cargado correctamente
        cy.url().should('include', Cypress.config('baseUrl'));

        // Hacer una solicitud a un servicio externo para obtener la IP pública
        cy.request('https://ipinfo.io/json').then((response) => {
            const ipInfo = response.body;

            // Loguear la IP en la consola de Cypress
            cy.log(`IP: ${ipInfo.ip}`);

            // Verificar que se haya obtenido una IP válida
            expect(ipInfo.ip).to.exist;

            // Opcional: Verificar el país o región si lo deseas
            // expect(ipInfo.country).to.equal('ES'); // Verificar si el país es España
        });
    });
});
