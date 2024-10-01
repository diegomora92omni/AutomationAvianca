const { defineConfig } = require('cypress');

module.exports = defineConfig({
  viewportWidth: 1366,
  viewportHeight: 768,
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    charts: true,
    reportPageTitle: 'Reporter Automation Project GUESS (AXO)',
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: false,
  },
  retries: 4,
  defaultCommandTimeout: 50000, // Incrementa el tiempo de espera por comando
  pageLoadTimeout: 60000, // Incrementa el tiempo de espera de carga de página
  numTestsKeptInMemory: 1, // Reduce el número de pruebas mantenidas en memoria
  experimentalMemoryManagement: true, // Habilita el manejo experimental de memoria
  fixturesFolder: 'cypress/fixtures',
  supportFolder: 'cypress/support',
  e2e: {
    baseUrl: 'https://www.avianca.com/es/',
    chromeWebSecurity: false,
    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on);
    },
  },
});

      