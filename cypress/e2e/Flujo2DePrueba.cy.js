/// <reference types='Cypress' />

describe('Test cases for selecting Bogotá (BOG) as origin and Medellín (MDE) as destination, and tracking specific event types', () => {

    const allRequests = []; // Array para almacenar todas las solicitudes interceptadas
    const smetricsRequests = []; // Array para almacenar solo las solicitudes relacionadas con smetrics

    beforeEach(() => {
        // Visitar la URL base configurada en cypress.json
        cy.visit('/');

        // Limpiar todas las cookies antes de empezar
        cy.clearCookies();

        // Intentar establecer la cookie manualmente
        cy.setCookie('test_cookie', 'CheckForPermission', { domain: 'www.avianca.com', path: '/' });

        // Verificar si el banner de cookies aún aparece y hacer clic en el botón de aceptación si es necesario
        cy.get('body').then(($body) => {
            if ($body.find('#onetrust-accept-btn-handler').length > 0) {
                cy.get('#onetrust-accept-btn-handler').click({ force: true });
            }
        });

        // Interceptar todas las solicitudes POST
        cy.intercept('POST', '**').as('allRequests');
    });

    it('Should select Bogotá (BOG) as origin, Medellín (MDE) as destination, search for flights, and log all requests', () => {

        // ORIGEN: Haz clic en el botón para activar el campo de origen
        cy.get('#originBtn').click({ force: true });

        // Forzar el clic y la escritura en el campo de origen si está oculto
        cy.get('input.control_field_input[placeholder="Origen"]').click({ force: true });
        cy.get('input.control_field_input[placeholder="Origen"]').type('Bogotá', { force: true });

        // Esperar que las opciones de autocompletado aparezcan
        cy.get('ul.station-control-list_list').should('be.visible');

        // Seleccionar "Bogotá (BOG)" de la lista
        cy.contains('button.station-control-list_item_link', 'Bogotá').click({ force: true });

        // Forzar el clic y la escritura en el campo de Destino si está oculto
        cy.get('input.control_field_input[placeholder="Hacia"]').click({ force: true });
        cy.get('input.control_field_input[placeholder="Hacia"]').type('Medellín', { force: true });

        // Esperar que las opciones de autocompletado aparezcan
        cy.get('ul.station-control-list_list').should('be.visible');

        // Seleccionar "Medellín (MDE)" de la lista
        cy.contains('button.station-control-list_item_link', 'Medellín').click({ force: true });

        // Hacer clic en el botón de "Buscar vuelos"
        cy.get('#searchButton').click({ force: true });

        // Esperar a que la URL cambie a la página de resultados de vuelos
        cy.url().should('include', '/es/booking/select');

        // Esperar y capturar todas las solicitudes hechas después de la búsqueda
        cy.wait('@allRequests', { timeout: 20000 }).then((interception) => {
            // Almacenar la URL y otros detalles en el array
            allRequests.push({
                url: interception.request.url,
                status: interception.response.statusCode,
                requestBody: interception.request.body,
                responseBody: interception.response.body
            });

            // Verificar si la solicitud está relacionada con smetrics
            if (interception.request.url.includes('smetrics.avianca.com')) {
                smetricsRequests.push({
                    url: interception.request.url,
                    requestBody: interception.request.body,
                    responseBody: interception.response.body
                });

                // Loguear los detalles de la solicitud
                cy.log(`Captured smetrics request URL: ${interception.request.url}`);

                // Verificar si el cuerpo de la solicitud contiene los eventos que queremos rastrear
                const requestBody = JSON.stringify(interception.request.body);
                if (requestBody.includes('web.webpagedetails') || requestBody.includes('pageview')) {
                    cy.log('Event type web.webpagedetails or pageview found!');
                } else {
                    cy.log('Event type not found.');
                }
            }
        });

        // Al final de la prueba, mostrar todas las solicitudes capturadas
        cy.then(() => {
            // Loguear el array completo de todas las solicitudes
            cy.log('All requests captured:', JSON.stringify(allRequests));

            // Loguear solo las solicitudes relacionadas con smetrics
            cy.log('Smetrics requests captured:', JSON.stringify(smetricsRequests));
        });
    });
});
