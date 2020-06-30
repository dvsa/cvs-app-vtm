export const environment = {
  production: true,
  // name: 'deploy',
  debug: false,
  name: '#{envName}',
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
    APITechnicalRecordServerUri: 'https://#{apiServerPrefix}.demo.com/api/v1.0/',
    APITestResultServerUri: 'https://#{apiServerPrefix}.demo.com/api/v1.0/',
    APIDocumentsServerUri: 'https://api.nonprod.cvs.dvsacloud.uk/BRANCH',
    APIDocumentBlobUri: 'https://api.nonprod.cvs.dvsacloud.uk/BRANCH/cvs-nonprod-adr-pdfs/BRANCH%2F',
    APIPreparersServerUri: 'https://api.nonprod.cvs.dvsacloud.uk/BRANCH',
    APITestStationsServerUri: 'https://api.nonprod.cvs.dvsacloud.uk/BRANCH',
    APICertificatesBlobUri: 'https://api.nonprod.cvs.dvsacloud.uk/BRANCH/cvs-cert-nonprod/BRANCH%2F',
    APITestTypesServerUri: ''
  }
};
