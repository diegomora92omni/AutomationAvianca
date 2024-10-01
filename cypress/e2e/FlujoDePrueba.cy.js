/// <reference types='Cypress' />

describe('Test cases for selecting Bogotá (BOG) as origin and Medellín (MDE) as destination', () => {

    beforeEach(() => {

        // Visitar la URL base configurada en cypress.json
        cy.visit('/');

        // Limpiar todas las cookies antes de empezar
        cy.clearCookies();

        // Intentar establecer la cookie manualmente
        cy.setCookie('test_cookie', 'CheckForPermission', { domain: 'www.avianca.com', path: '/' });

        // Verificar si la cookie fue configurada correctamente
        cy.getCookie('test_cookie').then((cookie) => {
            cy.log(cookie); // Loguear la cookie para verificarla
        });

        // Verificar si el banner de cookies aún aparece y hacer clic en el botón de aceptación si es necesario
        cy.get('body').then(($body) => {
            if ($body.find('#onetrust-accept-btn-handler').length > 0) {
                cy.get('#onetrust-accept-btn-handler').click({ force: true });
            }
        });
    });

    it('Should select Bogotá (BOG) as origin, Medellín (MDE) as destination, and search for flights', () => {
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
    });
});

