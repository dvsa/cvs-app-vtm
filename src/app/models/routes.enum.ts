export enum RootRoutes {
  SEARCH_TECHNICAL_RECORD = 'search',
  CREATE_TECHNICAL_RECORD = 'create',
  BATCH_CREATE_TECHNICAL_RECORD = 'create-batch',
  CURRENT_TEST_RESULT = 'test-records/:systemNumber/test-result/:testResultId/:testNumber',
  CURRENT_TECH_RECORD = 'tech-records/:systemNumber/:createdTimestamp',
  REFERENCE_DATA = 'reference-data',
  FEATURE_TOGGLE = 'feature-toggle',
  ERROR = 'error',
  WILCARD = '**',
}
