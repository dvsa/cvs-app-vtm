export enum RootRoutes {
  ROOT = '',
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
  CORRECT_ERROR = 'correcting-an-error',
  NOTIFIABLE_ALTERATION_NEEDED = 'notifiable-alteration-needed',
  CHANGE_VIN = 'change-vin',
  CHANGE_VRM = 'change-vrm',
  REASON_TO_CHANGE_VRM = 'change-vrm/:reason',
  GENERATE_PLATE = 'generate-plate',
  GENERATE_LETTER = 'generate-letter',
  AMEND_REASON = 'amend-reason',
  CHANGE_STATUS = 'change-status',
  UNARCHIVE_RECORD = 'unarchive-record',
  CHANGE_VEHICLE_TYPE = 'change-vehicle-type',
  CHANGE_VTA_VISIBILITY = 'change-vta-visibility',
  CORRECT_ERROR_TYRE_SEARCH = 'correcting-an-error/tyre-search/:axleNumber',
  CORRECT_ERROR_CHANGE_SUMMARY = 'correcting-an-error/change-summary',
  NOTIFIABLE_ALTERATION_NEEDED_CHANGE_SUMMARY = 'notifiable-alteration-needed/change-summary',
  NOTIFIABLE_ALTERATION_NEEDED_TYRE_SEARCH = 'notifiable-alteration-needed/tyre-search/:axleNumber',
  TEST_RECORDS = 'test-records/test-result/:testResultId/:testNumber',
  TEST_RECORDS_CREATE_TEST = 'test-records/create-test',
  ADR_CERTIFICATE = 'adr-certificate',
}

export enum TechRecordCreateRoutes {
  CREATE_NEW_RECORD_DETAILS = 'new-record-details',
  CREATE_TYRE_SEARCH = 'tyre-search/:axleNumber',
}

export enum TechRecordCreateBatchRoutes {
  CREATE_BATCH_BATCH_RECORD = ':vehicleType',
  CREATE_BATCH_BATCH_RECORD_DETAILS = 'details',
  CREATE_BATCH_BATCH_RECORD_BATCH_RESULT = 'batch-results',
  CREATE_BATCH_BATCH_RECORD_TYRE_SEARCH = 'tyre-search/:axleNumber',
}

export enum ReferenceDataRoutes {
  DATA_TYPE = ':type',
  DATA_CREATE = 'create',
  DATA_DELETED_ITEMS = 'deleted-items',
  DATA_KEY = ':key',
  DATA_DELETE = ':key/delete',
}

export enum TestRecordAmendRoutes {
  AMEND_ROOT = '',
  AMEND_AMEND_TEST = 'amend-test',
  AMEND_INCORRECT_TEST_TYPE = 'incorrect-test-type',
  AMEND_TEST_DETAILS = 'amend-test-details',
  AMEND_DEFECT = 'defect/:defectIndex',
  AMEND_TEST_DETAILS_SELECT_DEFECT = 'selectDefect',
  AMEND_TEST_DETAILS_SELECT_DEFECT_REFERENCE = ':ref',
  AMEND_AMENDED_TEST = 'amended/:createdAt',
  AMEND_CANCEL_TEST = 'cancel-test',
}

export enum TestRecordCreateRoutes {
  CREATE_TYPE = 'type',
  CREATE_TEST_DETAILS = 'test-details',
  CREATE_TEST_DETAILS_DEFECT = 'defect/:defectIndex',
  CREATE_TEST_DETAILS_SELECT_DEFECT = 'selectDefect',
  CREATE_TEST_DETAILS_SELECT_DEFECT_REF = ':ref',
  CREATE_TEST_DETAILS_REQUIRED_STANDARD = 'requiredStandard/:requiredStandardIndex',
  CREATE_TEST_DETAILS_SELECT_REQUIRED_STANDARD = 'selectRequiredStandard',
  CREATE_TEST_DETAILS_SELECT_REQUIRED_STANDARD_REF = ':inspectionType/:ref',
}
