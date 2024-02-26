export enum RootRoutes {
  SEARCH_TECHNICAL_RECORD = 'search',
  CREATE_TECHNICAL_RECORD = 'create',
  BATCH_CREATE_TECHNICAL_RECORD = 'create-batch',
  CURRENT_TEST_RESULT = 'test-records/:systemNumber/test-result/:testResultId/:testNumber',
  CURRENT_TECH_RECORD = 'tech-records/:systemNumber/:createdTimestamp',
  REFERENCE_DATA = 'reference-data',
  FEATURE_TOGGLE = 'feature-toggle',
  ERROR = 'error',
  WILDCARD = '**',
}

export enum SearchRoutes {
  SEARCH_RESULT = 'results',
}

export enum TechRecordRoutes {
  TECH_RECORD_CORRECT_ERROR = 'correcting-an-error',
  TECH_RECORD_NOTIFIABLE_ALTERATION_NEEDED = 'notifiable-alteration-needed',
  TECH_RECORD_CHANGE_VIN = 'change-vin',
  TECH_RECORD_CHANGE_VRM = 'change-vrm',
  TECH_RECORD_REASON_TO_CHANGE_VRM = 'change-vrm/:reason',
  TECH_RECORD_GENERATE_PLATE = 'generate-plate',
  TECH_RECORD_GENERATE_LETTER = 'generate-letter',
  TECH_RECORD_AMEND_REASON = 'amend-reason',
  TECH_RECORD_CHANGE_STATUS = 'change-status',
  TECH_RECORD_UNARCHIVE_RECORD = 'unarchive-record',
  TECH_RECORD_CHANGE_VEHICLE_TYPE = 'change-vehicle-type',
  TECH_RECORD_CHANGE_VTA_VISIBILITY = 'change-vta-visibility',
  TECH_RECORD_CORRECT_ERROR_TYRE_SEARCH = 'correcting-an-error/tyre-search/:axleNumber',
  TECH_RECORD_CORRECT_ERROR_CHANGE_SUMMARY = 'correcting-an-error/change-summary',
  TECH_RECORD_NOTIFIABLE_ALTERATION_NEEDED_CHANGE_SUMMARY = 'notifiable-alteration-needed/change-summary',
  TECH_RECORD_NOTIFIABLE_ALTERATION_NEEDED_TYRE_SEARCH = 'notifiable-alteration-needed/tyre-search/:axleNumber',
  TECH_RECORD_TEST_RECORDS = 'test-records/test-result/:testResultId/:testNumber',
  TECH_RECORD_TEST_RECORDS_CREATE_TESTS = 'test-records/create-test',
  TECH_RECORD_ADR_CERTIFICATE = 'adr-certificate',
}
