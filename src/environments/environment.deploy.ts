export const environment = {
  name: '#{envName}',
  production: true,
  debug: false,
  appInsights: {
    instrumentationKey: '#{appInsightsKey}'
  },
  logging: {
    console: true,
    appInsights: true
  },
  aad: {
    requireAuth: true,
    clientId: '#{aadClientId}',
    tenant: '#{aadTenant}'
  },
  adalConfig: {
    clientId: '#{aadClientId}',
    tenant: '#{aadTenant}',
    cacheLocation: 'localStorage',
    redirectUri: '',
    endpoints: {
      api: 'xxx-bae6-4760-b434-xxx'
    }
  },
  apiServer: {
    APITechnicalRecordServerUri: '',
    APITestResultServerUri: '',
    APIDocumentsServerUri: '',
    APIDocumentBlobUri: '',
    APIPreparersServerUri: '',
    APITestStationsServerUri: '',
    APICertificatesBlobUri: '',
    APITestTypesServerUri: ''
  }
};
