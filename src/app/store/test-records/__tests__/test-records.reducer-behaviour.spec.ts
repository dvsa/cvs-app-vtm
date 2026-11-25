import { ReasonForNotLoading } from '@dvsa/cvs-type-definitions/types/v1/enums/reasonForNotLoading.enum.js';
import { TestResults } from '@dvsa/cvs-type-definitions/types/v1/enums/testResult.enum.js';
import { UnladenBodyType } from '@dvsa/cvs-type-definitions/types/v1/enums/unladenBodyType.enum.js';
import { VehicleLoadStatusType } from '@dvsa/cvs-type-definitions/types/v1/enums/vehicleLoadStatus.enum.js';
import {
	DefectDetailsSchema,
	SpecialistCustomDefectsSchemaPut,
	TestResultSchema,
} from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { EUVehicleCategory } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/euVehicleCategory.enum.js';
import { TypeOfTest } from '@models/test-results/typeOfTest.enum';
import * as groups from '@models/testTypeId.enum';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import * as actions from '../test-records.actions';
import { initialTestResultsState, testResultsReducer } from '../test-records.reducer';

describe('Test record reducer behaviour', () => {
	const defect = { deficiencyRef: '1.2.a', deficiencyCategory: 'major', prs: false } as DefectDetailsSchema;
	const requiredStandard = { sectionNumber: 1, prs: false } as SpecialistCustomDefectsSchemaPut;
	function record(testType: object = {}, vehicle: object = {}): TestResultSchema {
		return {
			testResultId: 'result-1',
			vehicleType: VehicleTypes.HGV,
			typeOfTest: TypeOfTest.CONTINGENCY,
			testTypes: [{ testTypeId: '1', testResult: TestResults.FAIL, defects: [], requiredStandards: [], ...testType }],
			...vehicle,
		} as TestResultSchema;
	}
	const stateFor = (editingTestResult?: TestResultSchema) => ({ ...initialTestResultsState, editingTestResult });
	const clean = (value: TestResultSchema) =>
		testResultsReducer(stateFor(value), actions.cleanTestResult()).editingTestResult!;

	it.each([
		actions.createDefect({ defect }),
		actions.updateDefect({ defect, index: 0 }),
		actions.removeDefect({ index: 0 }),
		actions.createRequiredStandard({ requiredStandard }),
		actions.updateRequiredStandard({ requiredStandard, index: 0 }),
		actions.removeRequiredStandard({ index: 0 }),
		actions.updateResultOfTest(),
		actions.updateResultOfTestRequiredStandards(),
		actions.setResultOfTest({ result: TestResults.PASS }),
	])('does not construct a partial record when $type runs without an editing record', (action) => {
		expect(testResultsReducer(stateFor(), action).editingTestResult).toBeUndefined();
	});

	it.each([
		actions.updateDefect({ defect, index: 0 }),
		actions.removeDefect({ index: 0 }),
		actions.updateRequiredStandard({ requiredStandard, index: 0 }),
		actions.removeRequiredStandard({ index: 0 }),
	])('preserves a saved record with omitted defect/standard arrays for $type', (action) => {
		const value = record({ defects: undefined, requiredStandards: undefined });
		expect(testResultsReducer(stateFor(value), action).editingTestResult).toEqual(value);
	});

	it('initialises an omitted defect array when adding the first defect', () => {
		const value = record({ defects: undefined });
		const result = testResultsReducer(stateFor(value), actions.createDefect({ defect }));
		expect(result.editingTestResult?.testTypes[0].defects).toEqual([defect]);
		expect(value.testTypes[0].defects).toBeUndefined();
	});

	it.each([
		[[], TestResults.PASS],
		[[{ deficiencyCategory: 'advisory' }, { deficiencyCategory: 'minor' }], TestResults.PASS],
		[
			[
				{ deficiencyCategory: 'major', prs: true },
				{ deficiencyCategory: 'dangerous', prs: true },
				{ deficiencyCategory: 'minor' },
				{ deficiencyCategory: 'advisory' },
			],
			TestResults.PRS,
		],
		[
			[
				{ deficiencyCategory: 'major', prs: true },
				{ deficiencyCategory: 'dangerous', prs: false },
			],
			TestResults.FAIL,
		],
	] as const)('calculates the result from defects (%j)', (defects, expected) => {
		const value = record({ defects });
		const before = structuredClone(value);
		expect(
			testResultsReducer(stateFor(value), actions.updateResultOfTest()).editingTestResult?.testTypes[0].testResult
		).toBe(expected);
		expect(value).toEqual(before);
	});

	it.each([
		[[], TestResults.PASS],
		[[{ prs: true }, { prs: true }], TestResults.PRS],
		[[{ prs: true }, { prs: false }], TestResults.FAIL],
	] as const)('calculates the result from required standards (%j)', (requiredStandards, expected) => {
		const value = record({ requiredStandards });
		expect(
			testResultsReducer(stateFor(value), actions.updateResultOfTestRequiredStandards()).editingTestResult?.testTypes[0]
				.testResult
		).toBe(expected);
		expect(value.testTypes[0].testResult).toBe(TestResults.FAIL);
	});

	it.each([actions.updateResultOfTest(), actions.updateResultOfTestRequiredStandards()])(
		'preserves abandoned and desk-based results for $type',
		(action) => {
			const abandoned = record({ testResult: TestResults.ABANDONED });
			expect(testResultsReducer(stateFor(abandoned), action).editingTestResult).toEqual(abandoned);
			const deskBased = record({}, { typeOfTest: TypeOfTest.DESK_BASED });
			expect(testResultsReducer(stateFor(deskBased), action).editingTestResult).toEqual(deskBased);
			const missing = record({ defects: undefined, requiredStandards: undefined });
			expect(testResultsReducer(stateFor(missing), action).editingTestResult).toEqual(missing);
		}
	);

	it('sets an explicit result without mutating the previous state', () => {
		const value = record();
		expect(
			testResultsReducer(stateFor(value), actions.setResultOfTest({ result: TestResults.PRS })).editingTestResult
				?.testTypes[0].testResult
		).toBe(TestResults.PRS);
		expect(value.testTypes[0].testResult).toBe(TestResults.FAIL);
	});

	it('patches nested values without losing sibling fields, then clears editing state on cancellation', () => {
		const value = record({}, { vehicleClass: { code: 'a', description: 'Class A' } });
		const patched = testResultsReducer(
			stateFor(value),
			actions.patchEditingTestResult({
				testResult: { vehicleClass: { description: 'Amended' } } as Partial<TestResultSchema>,
			})
		);
		expect(patched.editingTestResult?.vehicleClass).toEqual({ code: 'a', description: 'Amended' });
		expect(value.vehicleClass?.description).toBe('Class A');
		expect(testResultsReducer(patched, actions.cancelEditingTestResult()).editingTestResult).toBeUndefined();
	});

	it('replaces editing state and updates the current section templates', () => {
		const value = record();
		let state = testResultsReducer(stateFor(), actions.initialContingencyTest({ testResult: value }));
		expect(state.editingTestResult).toEqual(value);
		state = testResultsReducer(state, actions.updateEditingTestResult({ testResult: { ...value, vin: 'NEW-VIN' } }));
		expect(state.editingTestResult?.vin).toBe('NEW-VIN');
		state = testResultsReducer(state, actions.templateSectionsChanged({ sectionTemplates: [], sectionsValue: value }));
		expect(state.sectionTemplates).toEqual([]);
		expect(state.editingTestResult).toEqual(value);
	});

	describe('submission cleanup', () => {
		it('cleans a frozen editing record without mutating it', () => {
			const value = record({ centralDocs: Object.freeze({ issueRequired: true }) }, { model: '' });
			Object.freeze(value.testTypes[0]);
			Object.freeze(value);
			const result = clean(value);
			expect(result.model).toBeNull();
			expect(result.testTypes[0].centralDocs?.issueRequired).toBe(false);
			expect(value.model).toBe('');
			expect(value.testTypes[0].centralDocs?.issueRequired).toBe(true);
		});

		it('normalises blank class/body values while preserving meaningful class values', () => {
			expect(
				clean(record({}, { vehicleClass: { code: '', description: '' }, bodyType: { code: '', description: '' } }))
			).toMatchObject({ vehicleClass: { code: null, description: null }, bodyType: { code: null, description: null } });
			expect(clean(record({}, { vehicleClass: { code: 'a', description: '' } })).vehicleClass).toEqual({
				code: 'a',
				description: '',
			});
		});

		it.each([
			[VehicleTypes.CAR, undefined, false, false],
			[VehicleTypes.PSV, undefined, true, false],
			[VehicleTypes.HGV, undefined, true, true],
			[VehicleTypes.LGV, undefined, false, true],
			[VehicleTypes.TRL, EUVehicleCategory.O1, true, false],
			[VehicleTypes.TRL, EUVehicleCategory.O2, true, false],
			[VehicleTypes.TRL, EUVehicleCategory.O3, true, true],
			[VehicleTypes.TRL, EUVehicleCategory.O4, true, true],
		] as const)(
			'retains applicable recalls and VTG15 fields for %s / %s',
			(vehicleType, euVehicleCategory, recalls, vtg15) => {
				const result = clean(
					record({}, { vehicleType, euVehicleCategory, recalls: { hasRecall: true }, vtg15: { vtg15Required: true } })
				);
				expect(result.recalls !== undefined).toBe(recalls);
				expect(result.vtg15 !== undefined).toBe(vtg15);
			}
		);

		it('removes dependent VTG15 fields when VTG15 is not required', () => {
			const value = record(
				{},
				{
					vtg15: {
						vtg15Required: false,
						primaryHazardClassification: '1',
						secondaryHazardClassification: '2',
						unNumber: '1234',
						media: [],
					},
				}
			);
			expect(clean(value).vtg15).toEqual({ vtg15Required: false });
		});

		it.each([TestResults.FAIL, TestResults.ABANDONED])('disables central document issuing for %s', (testResult) => {
			expect(
				clean(record({ testResult, centralDocs: { issueRequired: true } })).testTypes[0].centralDocs?.issueRequired
			).toBe(false);
		});

		it('uses placeholder certificates for central document issuing outside HGV/trailer IVA tests', () => {
			expect(
				clean(record({ testResult: TestResults.PASS, centralDocs: { issueRequired: true } })).testTypes[0]
			).toMatchObject({ certificateNumber: '000000', secondaryCertificateNumber: '000000' });
		});

		it.each([VehicleTypes.HGV, VehicleTypes.TRL])(
			'preserves certificate numbers for centrally issued %s IVA tests',
			(vehicleType) => {
				const result = clean(
					record(
						{
							testTypeId: groups.TEST_TYPES_NON_VOLUNTARY_IVA_HGV_TRL[0],
							testResult: TestResults.PASS,
							centralDocs: { issueRequired: true },
							certificateNumber: 'CERT-1',
						},
						{ vehicleType }
					)
				);
				expect(result.testTypes[0].certificateNumber).toBe('CERT-1');
			}
		);

		it.each([
			groups.TEST_TYPES_GROUP7[0],
			groups.TEST_TYPES_GROUP5_13[0],
			groups.TEST_TYPES_GROUP15_16[0],
			groups.TEST_TYPES_GROUP8_NOTIFABLE[0],
			groups.TEST_TYPES_GROUP3_4_8[0],
		])('supplies the backend-required custom-defect array for test %s', (testTypeId) => {
			expect(clean(record({ testTypeId, customDefects: undefined })).testTypes[0].customDefects).toEqual([]);
		});

		it('keeps an empty certificate number for an abandoned first test', () => {
			expect(
				clean(
					record({
						testTypeId: groups.TEST_TYPES_GROUP9_10_CENTRAL_DOCS[0],
						testResult: TestResults.ABANDONED,
						certificateNumber: 'old',
					})
				).testTypes[0].certificateNumber
			).toBe('');
		});

		it.each([groups.TEST_TYPES_GROUP2_DESK_BASED_TEST[0], groups.TEST_TYPES_GROUP15_16[0]])(
			'serialises smoke limits for test %s',
			(testTypeId) => {
				expect(clean(record({ testTypeId, smokeTestKLimitApplied: 1.5 })).testTypes[0].smokeTestKLimitApplied).toBe(
					'1.5'
				);
			}
		);

		it('serialises abandonment reasons and removes empty standards on additional test types', () => {
			const value = record({ reasonForAbandoning: ['Reason one', 'Reason two'] });
			value.testTypes.push({
				...value.testTypes[0],
				testTypeId: groups.TEST_TYPES_GROUP5_SPEC_TEST[0],
				requiredStandards: [],
			});
			const result = clean(value);
			expect(result.testTypes[0].reasonForAbandoning).toBe('Reason one. Reason two');
			expect(result.testTypes[1].requiredStandards).toBeUndefined();
		});

		it.each([VehicleLoadStatusType.UNLADEN, VehicleLoadStatusType.PARTIALLY_LADEN])(
			'keeps only the relevant load-status fields for %s',
			(vehicleLoadStatus) => {
				const loadStatus = {
					vehicleLoadStatus,
					unladenBodyType: UnladenBodyType.OTHER,
					reasonForNotLoading: ReasonForNotLoading.OTHER,
					otherUnladenBodyType: 'Special body',
					otherReasonForNotLoading: 'Not safe to load',
					partiallyLadenReason: 'Only part loaded',
				};
				expect(clean(record({ loadStatus })).testTypes[0].loadStatus).toEqual(
					vehicleLoadStatus === VehicleLoadStatusType.UNLADEN
						? {
								vehicleLoadStatus,
								unladenBodyType: UnladenBodyType.OTHER,
								reasonForNotLoading: ReasonForNotLoading.OTHER,
								otherUnladenBodyType: 'Special body',
								otherReasonForNotLoading: 'Not safe to load',
							}
						: { vehicleLoadStatus, partiallyLadenReason: 'Only part loaded' }
				);
			}
		);
	});
});
