export enum RootRoutes {
    ROOT_ROUTE_ROOT = '',
    ROOT_ROUTE_SEARCH_TECHNICAL_RECORD = 'search',
    ROOT_ROUTE_CREATE_TECHNICAL_RECORD = 'create',
    ROOT_ROUTE_BATCH_CREATE_TECHNICAL_RECORD = 'create-batch',
    ROOT_ROUTE_CURRENT_TEST_RESULT = 'test-records/:systemNumber/test-result/:testResultId/:testNumber',
    ROOT_ROUTE_CURRENT_TECH_RECORD = 'tech-records/:systemNumber/:createdTimestamp',
    ROOT_ROUTE_REFERENCE_DATA = 'reference-data',
    ROOT_ROUTE_FEATURE_TOGGLE = 'feature-toggle',
    ROOT_ROUTE_ERROR = 'error',
    ROOT_ROUTE_WILDCARD = '**',
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
    TECH_RECORD_TEST_RECORDS_CREATE_TEST = 'test-records/create-test',
    TECH_RECORD_ADR_CERTIFICATE = 'adr-certificate',
}

export enum TechRecordCreateRoutes {
    TECH_RECORD_CREATE_NEW_RECORD_DETAILS = 'new-record-details',
    TECH_RECORD_CREATE_TYRE_SEARCH = 'tyre-search/:axleNumber',
}

export enum TechRecordCreateBatchRoutes {
    TECH_RECORD_CREATE_BATCH_BATCH_RECORD = ':vehicleType',
    TECH_RECORD_CREATE_BATCH_BATCH_RECORD_DETAILS = 'details',
    TECH_RECORD_CREATE_BATCH_BATCH_RECORD_BATCH_RESULT = 'batch-results',
    TECH_RECORD_CREATE_BATCH_BATCH_RECORD_TYRE_SEARCH = 'tyre-search/:axleNumber',
}


export enum ReferenceDataRoutes {
    REFERENCE_DATA_TYPE = ':type',
    REFERENCE_DATA_CREATE = 'create',
    REFERENCE_DATA_DELETED_ITEMS = 'deleted-items',
    REFERENCE_DATA_KEY = ':key',
    REFERENCE_DATA_DELETE = ':key/delete',
}

export enum TestRecordAmendRoutes {
    TEST_RECORD_AMEND_ROOT = '',
    TEST_RECORD_AMEND_AMEND_TEST = 'amend-test',
    TEST_RECORD_AMEND_INCORRECT_TEST_TYPE = 'incorrect-test-type',
    TEST_RECORD_AMEND_TEST_DETAILS = 'amend-test-details',
    TEST_RECORD_AMEND_TEST_DETAILS_DEFECT = 'defect/:defectIndex',
    TEST_RECORD_AMEND_TEST_DETAILS_SELECT_DEFECT = 'selectDefect',
    TEST_RECORD_AMEND_TEST_DETAILS_SELECT_DEFECT_REFERENCE = ':ref',
    TEST_RECORD_AMEND_AMENDED_TEST = 'amended/:createdAt',
    TEST_RECORD_AMEND_CANCEL_TEST ='cancel-test',
    TEST_RECORD_AMEND_DEFECT = 'defect/:defectIndex',
}

export enum TestRecordCreateRoutes {
    TEST_RECORD_CREATE_TYPE = 'type',
    TEST_RECORD_CREATE_TEST_DETAILS = 'test-details',
    TEST_RECORD_CREATE_TEST_DETAILS_DEFECT = 'defect/:defectIndex',
    TEST_RECORD_CREATE_TEST_DETAILS_SELECT_DEFECT = 'selectDefect',
    TEST_RECORD_CREATE_TEST_DETAILS_SELECT_DEFECT_REF = ':ref',
    TEST_RECORD_CREATE_TEST_DETAILS_REQUIRED_STANDARD = 'requiredStandard/:requiredStandardIndex',
    TEST_RECORD_CREATE_TEST_DETAILS_SELECT_REQUIRED_STANDARD = 'selectRequiredStandard',
    TEST_RECORD_CREATE_TEST_DETAILS_SELECT_REQUIRED_STANDARD_REF = ':inspectionType/:ref',
}