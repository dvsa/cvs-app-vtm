import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: 'http://localhost:4200/',
    experimentalModifyObstructiveThirdPartyCode: true,
    defaultCommandTimeout: 30000,
    videoCompression: false,
    videoUploadOnPasses: false
  }
});
