import { ADRBodyType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/adrBodyType.enum.js';
import { ADRDangerousGood } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/adrDangerousGood.enum.js';
import { ADRTankDetailsTankStatementSelect } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/adrTankDetailsTankStatementSelect.enum.js';
import { ADRTankStatementSubstancePermitted } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/adrTankStatementSubstancePermitted.js';
import { TechRecordSearchSchema } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/search';
import { TechRecordType as NonVerbTechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { BodyTypeCode, vehicleBodyTypeCodeMap } from '@models/body-type-enum';
import { PsvMake } from '@models/reference-data.model';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import { cloneDeep } from 'lodash';
import {
	clearBatch,
	setApplicationId,
	setGenerateNumberFlag,
	setVehicleStatus,
	setVehicleType,
	upsertVehicleBatch,
} from './batch-create.actions';
import { BatchRecords, initialBatchState, vehicleBatchCreateReducer } from './batch-create.reducer';
import {
	addSectionState,
	amendVin,
	amendVinFailure,
	amendVinSuccess,
	amendVrm,
	amendVrmFailure,
	amendVrmSuccess,
	archiveTechRecord,
	archiveTechRecordFailure,
	archiveTechRecordSuccess,
	canGeneratePlate,
	cannotGeneratePlate,
	clearADRDetailsBeforeUpdate,
	clearAllSectionStates,
	clearScrollPosition,
	createVehicleRecord,
	createVehicleRecordFailure,
	createVehicleRecordSuccess,
	generateADRCertificate,
	generateADRCertificateFailure,
	generateADRCertificateSuccess,
	generateContingencyADRCertificate,
	generateLetter,
	generateLetterFailure,
	generateLetterSuccess,
	generatePlate,
	generatePlateFailure,
	generatePlateSuccess,
	getBySystemNumber,
	getBySystemNumberFailure,
	getBySystemNumberSuccess,
	getTechRecordV3Success,
	promoteTechRecord,
	promoteTechRecordFailure,
	promoteTechRecordSuccess,
	removeSectionState,
	removeTC3TankInspection,
	removeUNNumber,
	unarchiveTechRecord,
	unarchiveTechRecordFailure,
	unarchiveTechRecordSuccess,
	updateADRAdditionalExaminerNotes,
	updateBody,
	updateBrakeForces,
	updateEditingTechRecord,
	updateEditingTechRecordCancel,
	updateExistingADRAdditionalExaminerNote,
	updateScrollPosition,
	updateTechRecord,
	updateTechRecordFailure,
	updateTechRecordSuccess,
} from './technical-record-service.actions';

export const STORE_FEATURE_TECHNICAL_RECORDS_KEY = 'TechnicalRecords';

export interface TechnicalRecordServiceState {
	vehicleTechRecord: TechRecordType<'get'> | undefined;
	loading: boolean;
	editingTechRecord?: TechRecordType<'put'>;
	error?: unknown;
	techRecordHistory?: TechRecordSearchSchema[];
	batchVehicles: BatchRecords;
	sectionState?: (string | number)[];
	canGeneratePlate: boolean;
	scrollPosition: [number, number];
}

export const initialState: TechnicalRecordServiceState = {
	vehicleTechRecord: undefined,
	batchVehicles: initialBatchState,
	loading: false,
	sectionState: [],
	canGeneratePlate: false,
	scrollPosition: [0, 0],
};

export const getTechRecordState = createFeatureSelector<TechnicalRecordServiceState>(
	STORE_FEATURE_TECHNICAL_RECORDS_KEY
);

export const vehicleTechRecordReducer = createReducer(
	initialState,

	on(createVehicleRecord, defaultArgs),
	on(createVehicleRecordSuccess, successArgs),
	on(createVehicleRecordFailure, (state) => ({ ...state, loading: false })),

	on(getBySystemNumber, (state) => ({ ...state, loading: true })),
	on(getBySystemNumberSuccess, (state, action) => ({
		...state,
		loading: false,
		techRecordHistory: action.techRecordHistory,
	})),
	on(getBySystemNumberFailure, (state) => ({ ...state, loading: false, techRecordHistory: [] })),

	on(updateTechRecord, defaultArgs),
	on(updateTechRecordSuccess, successArgs),
	on(updateTechRecordFailure, updateFailureArgs),

	on(archiveTechRecord, defaultArgs),
	on(archiveTechRecordSuccess, successArgs),
	on(archiveTechRecordFailure, updateFailureArgs),

	on(unarchiveTechRecord, defaultArgs),
	on(unarchiveTechRecordSuccess, successArgs),
	on(unarchiveTechRecordFailure, updateFailureArgs),

	on(promoteTechRecord, defaultArgs),
	on(promoteTechRecordSuccess, successArgs),
	on(promoteTechRecordFailure, updateFailureArgs),

	on(amendVrm, defaultArgs),
	on(amendVrmSuccess, successArgs),
	on(amendVrmFailure, updateFailureArgs),

	on(amendVin, defaultArgs),
	on(amendVinSuccess, successArgs),
	on(amendVinFailure, updateFailureArgs),

	on(generatePlate, defaultArgs),
	on(generatePlateSuccess, (state) => ({ ...state, editingTechRecord: undefined, loading: false })),
	on(generatePlateFailure, failureArgs),
	on(canGeneratePlate, (state) => ({ ...state, canGeneratePlate: true })),
	on(cannotGeneratePlate, (state) => ({ ...state, canGeneratePlate: false })),

	on(generateLetter, defaultArgs),
	on(generateLetterSuccess, (state) => ({ ...state, editingTechRecord: undefined })),
	on(generateLetterFailure, failureArgs),

	on(generateADRCertificate, defaultArgs),
	on(generateContingencyADRCertificate, defaultArgs),
	on(generateADRCertificateSuccess, (state) => ({ ...state, editingTechRecord: undefined, loading: false })),
	on(generateADRCertificateFailure, failureArgs),

	on(updateEditingTechRecord, (state, action) => updateEditingTechRec(state, action)),
	on(updateEditingTechRecordCancel, (state) => ({ ...state, editingTechRecord: undefined })),

	on(updateBrakeForces, (state, action) => handleUpdateBrakeForces(state, action)),

	on(updateBody, (state, action) => handleUpdateBody(state, action)),

	on(updateADRAdditionalExaminerNotes, (state, action) => handleADRExaminerNoteChanges(state, action.username)),

	on(updateExistingADRAdditionalExaminerNote, (state, action) => handleUpdateExistingADRExaminerNote(state, action)),

	on(removeTC3TankInspection, (state, action) => handleRemoveTC3TankInspection(state, action)),

	on(removeUNNumber, (state, action) => handleRemoveUNNumber(state, action)),

	on(addSectionState, (state, action) => handleAddSection(state, action)),
	on(removeSectionState, (state, action) => handleRemoveSection(state, action)),
	on(clearAllSectionStates, (state) => ({ ...state, sectionState: [] })),

	on(
		upsertVehicleBatch,
		createVehicleRecordSuccess,
		updateTechRecordSuccess,
		setApplicationId,
		setVehicleStatus,
		setVehicleType,
		setGenerateNumberFlag,
		clearBatch,
		(state, action) => ({
			...state,
			batchVehicles: vehicleBatchCreateReducer(state.batchVehicles, action),
		})
	),

	on(getTechRecordV3Success, (state, action) => ({ ...state, vehicleTechRecord: action.vehicleTechRecord })),

	on(updateScrollPosition, (state, action) => ({ ...state, scrollPosition: action.position })),
	on(clearScrollPosition, (state) => ({ ...state, scrollPosition: [0, 0] as [number, number] })),

	on(clearADRDetailsBeforeUpdate, (state) => handleClearADRDetails(state))
);

function defaultArgs(state: TechnicalRecordServiceState) {
	return { ...state, loading: true };
}

function successArgs(state: TechnicalRecordServiceState, data: { vehicleTechRecord: TechRecordType<'get'> }) {
	return { ...state, vehicleTechRecord: data.vehicleTechRecord, loading: false };
}

function updateFailureArgs(state: TechnicalRecordServiceState, data: { error: unknown }) {
	return { ...state, error: data.error, loading: false };
}

function failureArgs(state: TechnicalRecordServiceState, data: { error: unknown }) {
	return {
		...state,
		vehicleTechRecord: undefined,
		error: data.error,
		loading: false,
	};
}

function handleUpdateBrakeForces(
	state: TechnicalRecordServiceState,
	data: { grossLadenWeight?: number; grossKerbWeight?: number }
): TechnicalRecordServiceState {
	const newState = cloneDeep(state);
	if (!newState.editingTechRecord) return newState;
	if (newState.editingTechRecord.techRecord_vehicleType !== 'psv') {
		return newState;
	}

	if (data.grossLadenWeight) {
		if (newState.editingTechRecord.techRecord_brakes_brakeCodeOriginal) {
			const prefix = `${Math.round(data.grossLadenWeight / 100)}`;
			newState.editingTechRecord.techRecord_brakes_brakeCode =
				(prefix.length <= 2 ? `0${prefix}` : prefix) + newState.editingTechRecord.techRecord_brakes_brakeCodeOriginal;
		}

		newState.editingTechRecord.techRecord_brakes_brakeForceWheelsNotLocked_serviceBrakeForceA = Math.round(
			(data.grossLadenWeight * 16) / 100
		);
		newState.editingTechRecord.techRecord_brakes_brakeForceWheelsNotLocked_secondaryBrakeForceA = Math.round(
			(data.grossLadenWeight * 22.5) / 100
		);
		newState.editingTechRecord.techRecord_brakes_brakeForceWheelsNotLocked_parkingBrakeForceA = Math.round(
			(data.grossLadenWeight * 45) / 100
		);
	}

	if (data.grossKerbWeight) {
		newState.editingTechRecord.techRecord_brakes_brakeForceWheelsUpToHalfLocked_serviceBrakeForceB = Math.round(
			(data.grossKerbWeight * 16) / 100
		);
		newState.editingTechRecord.techRecord_brakes_brakeForceWheelsUpToHalfLocked_secondaryBrakeForceB = Math.round(
			(data.grossKerbWeight * 25) / 100
		);
		newState.editingTechRecord.techRecord_brakes_brakeForceWheelsUpToHalfLocked_parkingBrakeForceB = Math.round(
			(data.grossKerbWeight * 50) / 100
		);
	}

	return newState;
}

function handleUpdateBody(
	state: TechnicalRecordServiceState,
	action: { psvMake: PsvMake }
): TechnicalRecordServiceState {
	const newState = cloneDeep(state);

	if (!newState.editingTechRecord) return newState;
	if (newState.editingTechRecord.techRecord_vehicleType !== 'psv') {
		return newState;
	}

	const code = action.psvMake.psvBodyType.toLowerCase() as BodyTypeCode;

	newState.editingTechRecord.techRecord_bodyType_code = code;
	newState.editingTechRecord.techRecord_bodyType_description = vehicleBodyTypeCodeMap.get(VehicleTypes.PSV)?.get(code);
	newState.editingTechRecord.techRecord_bodyMake = action.psvMake.psvBodyMake;
	newState.editingTechRecord.techRecord_chassisMake = action.psvMake.psvChassisMake;
	newState.editingTechRecord.techRecord_chassisModel = action.psvMake.psvChassisModel;

	return newState;
}

function handleRemoveTC3TankInspection(state: TechnicalRecordServiceState, action: { index: number }) {
	const newState = cloneDeep(state);
	if (!newState.editingTechRecord) return newState;

	if (
		(newState.editingTechRecord.techRecord_vehicleType === VehicleTypes.HGV ||
			newState.editingTechRecord.techRecord_vehicleType === VehicleTypes.TRL ||
			newState.editingTechRecord.techRecord_vehicleType === VehicleTypes.LGV) &&
		Array.isArray(newState.editingTechRecord.techRecord_adrDetails_tank_tankDetails_tc3Details)
	) {
		newState.editingTechRecord.techRecord_adrDetails_tank_tankDetails_tc3Details.splice(action.index, 1);
	}

	return newState;
}

function handleRemoveUNNumber(state: TechnicalRecordServiceState, action: { index: number }) {
	const newState = cloneDeep(state);
	if (!newState.editingTechRecord) return newState;

	if (
		(newState.editingTechRecord.techRecord_vehicleType === VehicleTypes.HGV ||
			newState.editingTechRecord.techRecord_vehicleType === VehicleTypes.TRL ||
			newState.editingTechRecord.techRecord_vehicleType === VehicleTypes.LGV) &&
		Array.isArray(newState.editingTechRecord.techRecord_adrDetails_tank_tankDetails_tankStatement_productListUnNo)
	) {
		newState.editingTechRecord.techRecord_adrDetails_tank_tankDetails_tankStatement_productListUnNo.splice(
			action.index,
			1
		);
	}

	return newState;
}

function handleAddSection(state: TechnicalRecordServiceState, action: { section: string | number }) {
	const newState = cloneDeep(state);
	if (newState.sectionState?.includes(action.section)) return newState;
	return { ...newState, sectionState: newState.sectionState?.concat(action.section) };
}

function handleRemoveSection(state: TechnicalRecordServiceState, action: { section: string | number }) {
	const newState = cloneDeep(state);
	if (!newState.sectionState?.includes(action.section)) return newState;
	return { ...newState, sectionState: newState.sectionState?.filter((section) => section !== action.section) };
}

function updateEditingTechRec(
	state: TechnicalRecordServiceState,
	action: { vehicleTechRecord: TechRecordType<'put'> }
) {
	const newState = { ...state };
	const { editingTechRecord } = state;
	const { vehicleTechRecord } = action;

	newState.editingTechRecord = { ...editingTechRecord, ...vehicleTechRecord } as TechRecordType<'put'>;

	return newState;
}

export function nullADRDetails(editingTechRecord: TechRecordType<'put'>) {
	const { techRecord_vehicleType: type } = editingTechRecord;
	if (type === VehicleTypes.HGV || type === VehicleTypes.TRL || type === VehicleTypes.LGV) {
		const nulledExplosivesSubfields = {
			techRecord_adrDetails_compatibilityGroupJ: null,
			techRecord_adrDetails_bodyDeclaration_type: null,
		};

		const nulledTankDetails = {
			techRecord_adrDetails_tank_tankDetails_tankManufacturer: null,
			techRecord_adrDetails_tank_tankDetails_yearOfManufacture: null,
			techRecord_adrDetails_tank_tankDetails_tankManufacturerSerialNo: null,
			techRecord_adrDetails_tank_tankDetails_tankTypeAppNo: null,
			techRecord_adrDetails_tank_tankDetails_tankCode: null,
			techRecord_adrDetails_tank_tankDetails_specialProvisions: null,
			techRecord_adrDetails_tank_tankDetails_tc2Details_tc2Type: null,
			techRecord_adrDetails_tank_tankDetails_tc2Details_tc2IntermediateApprovalNo: null,
			techRecord_adrDetails_tank_tankDetails_tc2Details_tc2IntermediateExpiryDate: null,
			techRecord_adrDetails_tank_tankDetails_tc3Details: null,
			techRecord_adrDetails_tank_tankDetails_tankStatement_substancesPermitted: null,
			techRecord_adrDetails_tank_tankDetails_tankStatement_statement: null,
			techRecord_adrDetails_tank_tankDetails_tankStatement_productListRefNo: null,
			techRecord_adrDetails_tank_tankDetails_tankStatement_productListUnNo: null,
			techRecord_adrDetails_tank_tankDetails_tankStatement_productList: null,
		};

		const nulledTankStatementStatement = {
			techRecord_adrDetails_tank_tankDetails_tankStatement_statement: null,
		};

		const nulledTankStatementProductList = {
			techRecord_adrDetails_tank_tankDetails_tankStatement_productListRefNo: null,
			techRecord_adrDetails_tank_tankDetails_tankStatement_productListUnNo: null,
			techRecord_adrDetails_tank_tankDetails_tankStatement_productList: null,
		};

		const nulledSubstancesPermittedUNNumber = {
			techRecord_adrDetails_tank_tankDetails_tankStatement_select: null,
			...nulledTankStatementStatement,
			...nulledTankStatementProductList,
		};

		const nulledBatteryListNumber = {
			techRecord_adrDetails_batteryListNumber: null,
		};

		const nulledWeight = {
			techRecord_adrDetails_weight: null,
		};

		const nulledBrakeDeclaration = {
			techRecord_adrDetails_brakeDeclarationIssuer: null,
			techRecord_adrDetails_brakeEndurance: null,
			...nulledWeight,
		};

		if (!editingTechRecord.techRecord_adrDetails_dangerousGoods) {
			// vehicle doesn't carry dangerous goods so null this information
			const record = {
				...editingTechRecord,
				techRecord_adrDetails_vehicleDetails_type: null,
				techRecord_adrDetails_vehicleDetails_usedOnInternationalJourneys: null,
				techRecord_adrDetails_vehicleDetails_approvalDate: null,
				techRecord_adrDetails_permittedDangerousGoods: null,
				...nulledExplosivesSubfields,
				techRecord_adrDetails_additionalExaminerNotes: null,
				techRecord_adrDetails_applicantDetails_name: null,
				techRecord_adrDetails_applicantDetails_street: null,
				techRecord_adrDetails_applicantDetails_town: null,
				techRecord_adrDetails_applicantDetails_city: null,
				techRecord_adrDetails_applicantDetails_postcode: null,
				techRecord_adrDetails_memosApply: null,
				techRecord_adrDetails_m145Statement: null,
				techRecord_adrDetails_documents: null,
				techRecord_adrDetails_listStatementApplicable: null,
				techRecord_adrDetails_batteryListNumber: null,
				techRecord_adrDetails_brakeDeclarationsSeen: null,
				techRecord_adrDetails_brakeDeclarationIssuer: null,
				techRecord_adrDetails_brakeEndurance: null,
				techRecord_adrDetails_weight: null,
				techRecord_adrDetails_declarationsSeen: null,
				techRecord_adrDetails_additionalNotes_guidanceNotes: null,
				techRecord_adrDetails_additionalNotes_number: null,
				techRecord_adrDetails_adrTypeApprovalNo: null,
				techRecord_adrDetails_adrCertificateNotes: null,
				techRecord_adrDetails_newCertificateRequested: null,
				...nulledTankDetails,
				...nulledSubstancesPermittedUNNumber,
			};

			return record;
		}

		let sanitisedEditingTechRecord = {
			...editingTechRecord,
		};

		// Null compatibility group J when permitted dangerous goods is NOT explosives type 2/3
		const explosivesGroups: string[] = [ADRDangerousGood.EXPLOSIVES_TYPE_2, ADRDangerousGood.EXPLOSIVES_TYPE_3];
		if (
			!editingTechRecord.techRecord_adrDetails_permittedDangerousGoods?.some((value) =>
				explosivesGroups.includes(value)
			)
		) {
			sanitisedEditingTechRecord = { ...sanitisedEditingTechRecord, ...nulledExplosivesSubfields };
		}

		// Null body declaration type when permitted dangerous goods is NOT explosives type 3
		if (
			!editingTechRecord.techRecord_adrDetails_permittedDangerousGoods?.includes(ADRDangerousGood.EXPLOSIVES_TYPE_3)
		) {
			sanitisedEditingTechRecord = {
				...sanitisedEditingTechRecord,
				techRecord_adrDetails_bodyDeclaration_type: null,
			};
		}

		// Null all tank details fields when ADR vehicle type does not include the words 'tank' or 'battery'
		const adrVehicleTypes: string[] = Object.values(ADRBodyType).filter(
			(value) => value.includes('battery') || value.includes('tank')
		);
		if (!adrVehicleTypes.includes(editingTechRecord.techRecord_adrDetails_vehicleDetails_type as string)) {
			sanitisedEditingTechRecord = { ...sanitisedEditingTechRecord, ...nulledTankDetails };
		}

		// Strip all unfilled UN numbers
		const { techRecord_adrDetails_tank_tankDetails_tankStatement_productListUnNo: unNumbers } =
			sanitisedEditingTechRecord;
		if (unNumbers) {
			sanitisedEditingTechRecord = {
				...sanitisedEditingTechRecord,
				techRecord_adrDetails_tank_tankDetails_tankStatement_productListUnNo: unNumbers.filter(Boolean),
			};
		}

		// If tank details 'statement' selected, null UN numbers, product list referene no., product list
		const { techRecord_adrDetails_tank_tankDetails_tankStatement_select: select } = sanitisedEditingTechRecord;
		if (select === ADRTankDetailsTankStatementSelect.STATEMENT) {
			sanitisedEditingTechRecord = { ...sanitisedEditingTechRecord, ...nulledTankStatementProductList };
		}

		// If tank details 'product list' selected, null statement reference no.
		if (select === ADRTankDetailsTankStatementSelect.PRODUCT_LIST) {
			sanitisedEditingTechRecord = { ...sanitisedEditingTechRecord, ...nulledTankStatementStatement };
		}

		// If tank details 'substances permitted' has 'tank code' option selected, null UN and product list reference no.
		const { techRecord_adrDetails_tank_tankDetails_tankStatement_substancesPermitted: substancesPermitted } =
			sanitisedEditingTechRecord;
		if (substancesPermitted === ADRTankStatementSubstancePermitted.UNDER_TANK_CODE) {
			sanitisedEditingTechRecord = { ...sanitisedEditingTechRecord, ...nulledSubstancesPermittedUNNumber };
		}

		// If battery list applicable is no, null the battery list number
		const { techRecord_adrDetails_listStatementApplicable: listStatementApplicable } = sanitisedEditingTechRecord;
		if (!listStatementApplicable) {
			sanitisedEditingTechRecord = { ...sanitisedEditingTechRecord, ...nulledBatteryListNumber };
		}
		// If the ADR body type not includes 'battery', null all fields related battery list applicable
		const { techRecord_adrDetails_vehicleDetails_type: vehicleDetailsType } = sanitisedEditingTechRecord;
		if (!vehicleDetailsType?.includes('battery')) {
			sanitisedEditingTechRecord = {
				...sanitisedEditingTechRecord,
				...nulledBatteryListNumber,
				techRecord_adrDetails_listStatementApplicable: null,
			};
		}
		// If manufacturer brake declaration is no, null dependent sections
		const { techRecord_adrDetails_brakeDeclarationsSeen: brakeDeclarationSeen } = sanitisedEditingTechRecord;
		if (!brakeDeclarationSeen) {
			sanitisedEditingTechRecord = { ...sanitisedEditingTechRecord, ...nulledBrakeDeclaration };
		}

		// If brake endurance is no, null weight field
		const { techRecord_adrDetails_brakeEndurance: brakeEndurance } = sanitisedEditingTechRecord;
		if (!brakeEndurance) {
			sanitisedEditingTechRecord = { ...sanitisedEditingTechRecord, ...nulledWeight };
		}

		return sanitisedEditingTechRecord;
	}

	return editingTechRecord;
}

function handleClearADRDetails(state: TechnicalRecordServiceState) {
	return state.editingTechRecord ? { ...state, editingTechRecord: nullADRDetails(state.editingTechRecord) } : state;
}

function handleADRExaminerNoteChanges(state: TechnicalRecordServiceState, username: string) {
	const { editingTechRecord } = state;
	const additionalNoteTechRecord = editingTechRecord as unknown as NonVerbTechRecordType<'hgv' | 'lgv' | 'trl'> & {
		techRecord_adrDetails_additionalExaminerNotes_note: string;
	};
	if (editingTechRecord) {
		if (additionalNoteTechRecord.techRecord_adrDetails_additionalExaminerNotes_note) {
			const additionalExaminerNotes = {
				note: additionalNoteTechRecord.techRecord_adrDetails_additionalExaminerNotes_note,
				lastUpdatedBy: username,
				createdAtDate: new Date().toISOString(),
			};
			if (
				additionalNoteTechRecord.techRecord_adrDetails_additionalExaminerNotes === null ||
				additionalNoteTechRecord.techRecord_adrDetails_additionalExaminerNotes === undefined
			) {
				additionalNoteTechRecord.techRecord_adrDetails_additionalExaminerNotes = [];
			}
			additionalNoteTechRecord.techRecord_adrDetails_additionalExaminerNotes?.unshift(additionalExaminerNotes);
		}
	}
	return { ...state, editingTechRecord: additionalNoteTechRecord as unknown as TechRecordType<'put'> };
}

function handleUpdateExistingADRExaminerNote(
	state: TechnicalRecordServiceState,
	action: { additionalExaminerNote: string; examinerNoteIndex: number }
) {
	const { editingTechRecord } = state;
	const editedTechRecord = editingTechRecord as unknown as NonVerbTechRecordType<'hgv' | 'lgv' | 'trl'>;
	if (editedTechRecord) {
		const examinerNotes = editedTechRecord.techRecord_adrDetails_additionalExaminerNotes;
		examinerNotes![action.examinerNoteIndex].note = action.additionalExaminerNote;
	}
	return { ...state, editingTechRecord: editingTechRecord as unknown as TechRecordType<'put'> };
}
