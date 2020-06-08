export const environment = {
  name: 'test',
  production: false,
  // APIServerUri: 'http://localhost:3005',
  // APITestResultServerUri: 'http://localhost:3006',
  // Add cfg for docker here
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
    // replace with dev endpoints, will be use for docker build to test against latest APIs
    // when image will be created to be used for e2e tests.
    APITechnicalRecordServerUri: 'http://localhost:3005',
    APITestResultServerUri: 'http://localhost:3006',
    APIDocumentsServerUri: 'assets/files',
    APIPreparersServerUri: 'http://localhost:3003',
    APITestStationsServerUri: 'http://localhost:3004',
    APIDocumentBlobUri: '',
    APICertificatesBlobUri: ''
  }
};
