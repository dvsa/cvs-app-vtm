// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
export const environment = {
  production: false,
  debug: true,
  name: 'dev',
  appInsights: {
    instrumentationKey: '#{appInsightsKey}'
  },
  logging: {
    console: true,
    appInsights: true
  },
  aad: {
    requireAuth: true,
    clientId: '',
    tenant: ''
  },
  adalConfig: {
    clientId: '',
    tenant: '',
    redirectUri: window.location.origin,
    cacheLocation: 'localStorage',
    endpoints: {
      api: ''
    }
  },
  apiServer: {
    APITechnicalRecordServerUri: 'http://localhost:3005',
    APITestResultServerUri: 'http://localhost:3006',
    APIDocumentsServerUri: 'assets/files',
    APIDocumentBlobUri: '',
    APIPreparersServerUri: 'http://localhost:3003',
    APITestStationsServerUri: 'http://localhost:3004',
    APICertificatesBlobUri: '',
    APITestTypesServerUri: ''
  }
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
