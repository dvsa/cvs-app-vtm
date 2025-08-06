export enum RootRoutes {
	ROOT = '',
	SEARCH_TECHNICAL_RECORD = 'search',
	CREATE_TECHNICAL_RECORD = 'create',
	BATCH_CREATE_TECHNICAL_RECORD = 'create-batch',
	CURRENT_TEST_RESULT = 'test-records/:systemNumber/test-result/:testResultId/:testNumber',
	CURRENT_TECH_RECORD = 'tech-records/:systemNumber/:createdTimestamp',
	REFERENCE_DATA = 'reference-data',
	FEATURE_TOGGLE = 'feature-toggle',
	BETAS = 'betas',
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
	CORRECT_ERROR_EDIT_ADDITIONAL_EXAMINER_NOTE = 'correcting-an-error/edit-additional-examiner-note/:examinerNoteIndex',
	NOTIFIABLE_ALTERATION_NEEDED_CHANGE_SUMMARY = 'notifiable-alteration-needed/change-summary',
	NOTIFIABLE_ALTERATION_NEEDED_TYRE_SEARCH = 'notifiable-alteration-needed/tyre-search/:axleNumber',
	NOTIFIABLE_ALTERNATION_NEEDED_EDIT_ADDITIONAL_EXAMINER_NOTE = 'notifiable-alteration-needed/edit-additional-examiner-note/:examinerNoteIndex',
	TEST_RECORDS = 'test-records/test-result/:testResultId/:testNumber',
	CREATE_TEST = 'test-records/create-test',
	ADR_CERTIFICATE = 'adr-certificate',
}

export enum TechRecordCreateRoutes {
	NEW_RECORD_DETAILS = 'new-record-details',
	TYRE_SEARCH = 'tyre-search/:axleNumber',
	DUPLICATE_VIN = 'duplicate-vin',
}

export enum TechRecordCreateBatchRoutes {
	RECORD = ':vehicleType',
	DETAILS = 'details',
	BATCH_RESULT = 'batch-results',
	TYRE_SEARCH = 'tyre-search/:axleNumber',
}

export enum ReferenceDataRoutes {
	TYPE = ':type',
	CREATE = 'create',
	DELETED_ITEMS = 'deleted-items',
	KEY = ':key',
	DELETE = ':key/delete',
}

export enum TestRecordAmendRoutes {
	AMEND_TEST = 'amend-test',
	INCORRECT_TEST_TYPE = 'incorrect-test-type',
	TEST_DETAILS = 'amend-test-details',
	DEFECT = 'defect/:defectIndex',
	SELECT_DEFECT = 'selectDefect',
	SELECT_DEFECT_REFERENCE = ':ref',
	AMENDED_TEST = 'amended/:createdAt',
	CANCEL_TEST = 'cancel-test',
	REQUIRED_STANDARD = 'requiredStandard/:requiredStandardIndex',
	SELECT_REQUIRED_STANDARD = 'selectRequiredStandard',
	REQUIRED_STANDARD_REF = ':inspectionType/:ref',
}

export enum TestRecordCreateRoutes {
	TYPE = 'type',
	TEST_DETAILS = 'test-details',
	DEFECT = 'defect/:defectIndex',
	SELECT_DEFECT = 'selectDefect',
	SELECT_DEFECT_REF = ':ref',
	REQUIRED_STANDARD = 'requiredStandard/:requiredStandardIndex',
	SELECT_REQUIRED_STANDARD = 'selectRequiredStandard',
	REQUIRED_STANDARD_REF = ':inspectionType/:ref',
}
