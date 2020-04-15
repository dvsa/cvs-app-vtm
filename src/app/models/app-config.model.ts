export interface IAppConfig {
  env: {
    name: string;
  };
  appInsights: {
    instrumentationKey: string;
  };
  logging: {
    console: boolean;
    appInsights: boolean;
  };
  aad: {
    requireAuth: boolean;
    tenant: string;
    clientId: string;
  };
  adalConfig: {
    clientId: string,
    tenant: string,
    redirectUri: string,
    cacheLocation: string,
    endpoints: {
      api: string
    }
  };
  apiServer: {
    APITechnicalRecordServerUri: string;
    APITestResultServerUri: string;
    APIDocumentsServerUri: string;
    APIDocumentBlobUri: string;
    APIPreparersServerUri: string;
    APITestStationsServerUri: string;
    APICertificatesBlobUri: string;
    APITestTypesServerUri: string;
  };
}
