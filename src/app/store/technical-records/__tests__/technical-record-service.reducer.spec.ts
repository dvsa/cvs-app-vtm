import { TechRecordSearchSchema } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/search';
import { TechRecordType as NonVerbTechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import {
	TechRecordPUTHGV,
	TechRecordPUTLGV,
	TechRecordPUTTRL,
	TechRecordType as TechRecordTypeVehicleVerb,
} from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb-vehicle-type';
import { createMockHgv } from '@mocks/hgv-record.mock';
import { createMockLgv } from '@mocks/lgv-record.mock';
import { mockVehicleTechnicalRecord } from '@mocks/mock-vehicle-technical-record.mock';
import { createMockTrl } from '@mocks/trl-record.mock';
import { BodyTypeCode, BodyTypeDescription } from '@models/body-type-enum';
import { PsvMake } from '@models/reference-data.model';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import {
	addSectionState,
	archiveTechRecord,
	archiveTechRecordFailure,
	archiveTechRecordSuccess,
	clearADRDetailsBeforeUpdate,
	clearAllSectionStates,
	clearScrollPosition,
	createVehicleRecord,
	createVehicleRecordFailure,
	createVehicleRecordSuccess,
	getBySystemNumber,
	getBySystemNumberFailure,
	getBySystemNumberSuccess,
	removeSectionState,
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
} from '../technical-record-service.actions';
import {
	TechnicalRecordServiceState,
	initialState,
	vehicleTechRecordReducer,
} from '../technical-record-service.reducer';

describe('Vehicle Technical Record Reducer', () => {
	describe('unknown action', () => {
		it('should return the default state', () => {
			const action = {
				type: 'Unknown',
			};
			const state = vehicleTechRecordReducer(initialState, action);

			expect(state).toBe(initialState);
		});
	});

	describe('getBySystemNumber', () => {
		it('should set all vehicle technical records', () => {
			const newState: TechnicalRecordServiceState = { ...initialState, loading: true };
			const action = getBySystemNumber({ systemNumber: '001' });
			const state = vehicleTechRecordReducer(initialState, action);

			expect(state).toEqual(newState);
			expect(state).not.toBe(newState);
		});
	});

	describe('getBySystemNumberSuccess', () => {
		it('should set all vehicle technical records', () => {
			const record = { systemNumber: 'foo', createdTimestamp: 'bar', vin: 'testVin' } as TechRecordSearchSchema;
			const newState: TechnicalRecordServiceState = {
				...initialState,
				techRecordHistory: [{ systemNumber: 'foo', createdTimestamp: 'bar', vin: 'testVin' } as TechRecordSearchSchema],
			};
			const action = getBySystemNumberSuccess({ techRecordHistory: [record] });
			const state = vehicleTechRecordReducer(initialState, action);

			expect(state).toEqual(newState);
			expect(state).not.toBe(newState);
		});
	});

	describe('getBySystemNumberFailure', () => {
		it('should history to an empty array', () => {
			const newState = { ...initialState, techRecordHistory: [] };
			const action = getBySystemNumberFailure({ error: 'error' });
			const state = vehicleTechRecordReducer(initialState, action);

			expect(state).toEqual(newState);
			expect(state).not.toBe(newState);
		});
	});

	describe('createVehicleRecord', () => {
		it('should set loading to true', () => {
			const expectedVehicle = { systemNumber: 'foo', createdTimestamp: 'bar', vin: 'testVin' } as TechRecordType<'get'>;

			const oldState: TechnicalRecordServiceState = {
				...initialState,
				vehicleTechRecord: expectedVehicle,
				loading: false,
			};

			const newState = vehicleTechRecordReducer(
				oldState,
				createVehicleRecord({ vehicle: {} as TechRecordType<'put'> })
			);

			expect(newState).not.toBe(oldState);
			expect(newState.vehicleTechRecord).toEqual(expectedVehicle);
			expect(newState.loading).toBeTruthy();
		});
	});

	describe('createVehicleRecordSuccess', () => {
		it('should update the vehicleTechRecords property of the state with the newly created vehicle and set loading to false', () => {
			const oldState: TechnicalRecordServiceState = {
				...initialState,
				vehicleTechRecord: { systemNumber: 'foo', createdTimestamp: 'bar', vin: 'testVin' } as TechRecordType<'get'>,
			};

			const expectedVehicle = { systemNumber: 'foo', createdTimestamp: 'bar', vin: 'testVin' } as TechRecordType<'get'>;

			const action = createVehicleRecordSuccess({ vehicleTechRecord: expectedVehicle });

			const newState = vehicleTechRecordReducer(oldState, action);

			expect(newState.loading).toBeFalsy();
		});
	});

	describe('createVehicleRecordFailure', () => {
		it('should add an error to the state and set loading to false', () => {
			const action = createVehicleRecordFailure({ error: 'something bad happened' });
			const newState = vehicleTechRecordReducer(initialState, action);

			expect(newState.loading).toBeFalsy();
		});
	});

	describe('updateTechRecords', () => {
		it('should set the new vehicle tech records state after update', () => {
			const state: TechnicalRecordServiceState = {
				...initialState,
				vehicleTechRecord: { systemNumber: 'foo', createdTimestamp: 'bar', vin: 'testVin' } as TechRecordType<'get'>,
				loading: true,
			};
			const action = updateTechRecord({ systemNumber: 'foo', createdTimestamp: 'bar' });
			const newState = vehicleTechRecordReducer(state, action);

			expect(newState).toEqual(state);
			expect(newState).not.toBe(state);
			expect(newState.loading).toBe(true);
		});
	});

	describe('updateTechRecordsSuccess', () => {
		it('should set the new vehicle tech records state after update success', () => {
			const oldRecord = { systemNumber: 'foo', createdTimestamp: 'bar', vin: 'testVin' } as TechRecordType<'get'>;
			const newRecord = { systemNumber: 'foo', createdTimestamp: 'bar', vin: 'testVinNew' } as TechRecordType<'get'>;

			const state: TechnicalRecordServiceState = {
				...initialState,
				vehicleTechRecord: oldRecord,
			};
			const action = updateTechRecordSuccess({ vehicleTechRecord: newRecord });
			const newState = vehicleTechRecordReducer(state, action);

			expect(state).not.toEqual(newState);
			expect(newState.vehicleTechRecord).toEqual(newRecord);
		});
	});

	describe('updateTechRecordsFailure', () => {
		it('should set error state', () => {
			const error = 'fetching vehicle tech records failed';
			const action = updateTechRecordFailure({ error });
			const newState = vehicleTechRecordReducer(initialState, action);

			expect(initialState).not.toEqual(newState);
			expect(newState.error).toEqual(error);
			expect(initialState).not.toBe(newState);
		});
	});

	describe('archiveTechRecord', () => {
		it('should set the state to loading', () => {
			const state: TechnicalRecordServiceState = {
				...initialState,
				vehicleTechRecord: { systemNumber: 'foo', createdTimestamp: 'bar', vin: 'testVin' } as TechRecordType<'get'>,
				loading: true,
			};
			const action = archiveTechRecord({
				systemNumber: 'foo',
				createdTimestamp: 'bar',
				reasonForArchiving: 'some reason',
			});
			const newState = vehicleTechRecordReducer(state, action);

			expect(state).toEqual(newState);
			expect(state).not.toBe(newState);
			expect(state.loading).toBe(true);
		});
	});

	describe('archiveTechRecordSuccess', () => {
		it('should set the new vehicle tech records state after update success', () => {
			const oldRecord = {
				systemNumber: 'foo',
				createdTimestamp: 'bar',
				vin: 'testVin',
			} as unknown as TechRecordType<'get'>;
			const newRecord = {
				systemNumber: 'foo',
				createdTimestamp: 'bar',
				vin: 'testVinNew',
			} as unknown as TechRecordType<'get'>;

			const state: TechnicalRecordServiceState = {
				...initialState,
				vehicleTechRecord: oldRecord,
			};
			const action = archiveTechRecordSuccess({ vehicleTechRecord: newRecord });
			const newState = vehicleTechRecordReducer(state, action);

			expect(state).not.toEqual(newState);
			expect(newState.vehicleTechRecord).toEqual(newRecord);
		});
	});

	describe('archiveTechRecordFailure', () => {
		it('should set error state', () => {
			const error = 'fetching vehicle tech records failed';
			const action = archiveTechRecordFailure({ error });
			const newState = vehicleTechRecordReducer(initialState, action);

			expect(initialState).not.toEqual(newState);
			expect(newState.error).toEqual(error);
			expect(initialState).not.toBe(newState);
		});
	});

	describe('updateEditingTechRecord', () => {
		it('should set the editingTechRecord', () => {
			const vehicleTechRecord = {
				systemNumber: 'foo',
				createdTimestamp: 'bar',
				vin: 'testVin',
			} as unknown as TechRecordType<'put'>;
			const action = updateEditingTechRecord({ vehicleTechRecord });
			const newState = vehicleTechRecordReducer(initialState, action);

			expect(initialState).not.toEqual(newState);
			expect(newState.editingTechRecord).toEqual(vehicleTechRecord);
			expect(initialState).not.toBe(newState);
		});
	});

	describe('updateEditingTechRecordCancel', () => {
		it('should clear the state', () => {
			initialState.editingTechRecord = {
				systemNumber: 'foo',
				createdTimestamp: 'bar',
				vin: 'testVin',
			} as unknown as TechRecordType<'put'>;
			const action = updateEditingTechRecordCancel();
			const newState = vehicleTechRecordReducer(initialState, action);

			expect(initialState).not.toEqual(newState);
			expect(newState.editingTechRecord).toBeUndefined();
			expect(initialState).not.toBe(newState);
		});
	});

	describe('Section state changes', () => {
		it('should add the section name to the state', () => {
			initialState.sectionState = [];
			const action = addSectionState({ section: 'TEST_SECTION' });
			const newState = vehicleTechRecordReducer(initialState, action);

			expect(initialState).not.toEqual(newState);
			expect(newState.sectionState).toEqual(['TEST_SECTION']);
			expect(initialState).not.toBe(newState);
		});

		it('should avoid duplicating the section name', () => {
			initialState.sectionState = ['TEST_SECTION'];
			const action = addSectionState({ section: 'TEST_SECTION' });
			const newState = vehicleTechRecordReducer(initialState, action);

			expect(initialState).toEqual(newState);
			expect(newState.sectionState).toEqual(['TEST_SECTION']);
			expect(initialState).not.toBe(newState);
		});

		it('should remove the section name from the state', () => {
			initialState.sectionState = ['TEST_SECTION1', 'TEST_SECTION2'];
			const action = removeSectionState({ section: 'TEST_SECTION1' });
			const newState = vehicleTechRecordReducer(initialState, action);

			expect(initialState).not.toEqual(newState);
			expect(newState.sectionState).toEqual(['TEST_SECTION2']);
			expect(initialState).not.toBe(newState);
		});

		it('should clear all the section names from the state', () => {
			initialState.sectionState = ['TEST_SECTION1', 'TEST_SECTION2'];
			const action = clearAllSectionStates();
			const newState = vehicleTechRecordReducer(initialState, action);

			expect(initialState).not.toEqual(newState);
			expect(newState.sectionState).toEqual([]);
			expect(initialState).not.toBe(newState);
		});
	});
	// TODO V3 HGV/PSV tests
	describe('updating properties of the tech record in edit', () => {
		beforeEach(() => {
			initialState.editingTechRecord = mockVehicleTechnicalRecord(VehicleTypes.PSV) as TechRecordType<'put'>;
		});

		describe('updateBrakeForces', () => {
			it('should not update half locked brake forces with no gross kerb weight', () => {
				const asPSV = initialState.editingTechRecord as TechRecordTypeVehicleVerb<'psv', 'put'>;
				asPSV.techRecord_brakes_brakeCodeOriginal = '80';
				asPSV.techRecord_brakes_brakeForceWheelsUpToHalfLocked_parkingBrakeForceB = 50;
				asPSV.techRecord_brakes_brakeForceWheelsUpToHalfLocked_secondaryBrakeForceB = 30;
				asPSV.techRecord_brakes_brakeForceWheelsUpToHalfLocked_serviceBrakeForceB = 10;
				expect(asPSV.techRecord_brakes_brakeCode).toBe('1234');

				const newState = vehicleTechRecordReducer(initialState, updateBrakeForces({ grossLadenWeight: 2000 }));

				const newPSV = newState.editingTechRecord as TechRecordTypeVehicleVerb<'psv', 'put'>;

				expect(newPSV.techRecord_brakes_brakeCode).toBe(`0${2000 / 100}${asPSV.techRecord_brakes_brakeCodeOriginal}`);

				expect(newPSV.techRecord_brakes_brakeForceWheelsNotLocked_serviceBrakeForceA).toBe(
					Math.round((2000 * 16) / 100)
				);
				expect(newPSV.techRecord_brakes_brakeForceWheelsNotLocked_secondaryBrakeForceA).toBe(
					Math.round((2000 * 22.5) / 100)
				);
				expect(newPSV.techRecord_brakes_brakeForceWheelsNotLocked_parkingBrakeForceA).toBe(
					Math.round((2000 * 45) / 100)
				);

				expect(newPSV.techRecord_brakes_brakeForceWheelsUpToHalfLocked_serviceBrakeForceB).toBe(10);
				expect(newPSV.techRecord_brakes_brakeForceWheelsUpToHalfLocked_secondaryBrakeForceB).toBe(30);
				expect(newPSV.techRecord_brakes_brakeForceWheelsUpToHalfLocked_parkingBrakeForceB).toBe(50);
			});

			it('should not update half locked brake forces with no gross laden weight', () => {
				const asPSV = initialState.editingTechRecord as TechRecordTypeVehicleVerb<'psv', 'put'>;
				asPSV.techRecord_brakes_brakeCodeOriginal = '80';
				asPSV.techRecord_brakes_brakeForceWheelsNotLocked_parkingBrakeForceA = 50;
				asPSV.techRecord_brakes_brakeForceWheelsNotLocked_secondaryBrakeForceA = 30;
				asPSV.techRecord_brakes_brakeForceWheelsNotLocked_serviceBrakeForceA = 10;

				const newState = vehicleTechRecordReducer(initialState, updateBrakeForces({ grossKerbWeight: 1000 }));

				const newPSV = newState.editingTechRecord as TechRecordTypeVehicleVerb<'psv', 'put'>;

				expect(newPSV.techRecord_brakes_brakeCode).toBe('1234');

				expect(newPSV.techRecord_brakes_brakeForceWheelsNotLocked_serviceBrakeForceA).toBe(10);
				expect(newPSV.techRecord_brakes_brakeForceWheelsNotLocked_secondaryBrakeForceA).toBe(30);
				expect(newPSV.techRecord_brakes_brakeForceWheelsNotLocked_parkingBrakeForceA).toBe(50);

				expect(newPSV.techRecord_brakes_brakeForceWheelsUpToHalfLocked_serviceBrakeForceB).toBe(
					Math.round((1000 * 16) / 100)
				);
				expect(newPSV.techRecord_brakes_brakeForceWheelsUpToHalfLocked_secondaryBrakeForceB).toBe(
					Math.round((1000 * 25) / 100)
				);
				expect(newPSV.techRecord_brakes_brakeForceWheelsUpToHalfLocked_parkingBrakeForceB).toBe(
					Math.round((1000 * 50) / 100)
				);
			});

			it('should not update brakeCode with no gross laden weight', () => {
				const asPSV = initialState.editingTechRecord as TechRecordTypeVehicleVerb<'psv', 'put'>;
				asPSV.techRecord_brakes_brakeCodeOriginal = '80';
				asPSV.techRecord_brakes_brakeCode = '37';

				const newState = vehicleTechRecordReducer(initialState, updateBrakeForces({ grossKerbWeight: 1000 }));
				expect(
					(newState?.editingTechRecord as TechRecordTypeVehicleVerb<'psv', 'put'>).techRecord_brakes_brakeCode
				).toBe('37');
			});

			it('should update brake forces', () => {
				const asPSV = initialState.editingTechRecord as TechRecordTypeVehicleVerb<'psv', 'put'>;
				asPSV.techRecord_brakes_brakeCodeOriginal = '80';
				expect(asPSV.techRecord_brakes_brakeCode).toBe('1234');

				const newState = vehicleTechRecordReducer(
					initialState,
					updateBrakeForces({ grossKerbWeight: 1000, grossLadenWeight: 2000 })
				);

				expect(newState).not.toBe(initialState);
				expect(newState).not.toEqual(initialState);

				const newPSV = newState.editingTechRecord as TechRecordTypeVehicleVerb<'psv', 'put'>;
				expect(newPSV.techRecord_brakes_brakeCode).toBe(`0${2000 / 100}${asPSV.techRecord_brakes_brakeCodeOriginal}`);

				expect(newPSV.techRecord_brakes_brakeForceWheelsNotLocked_serviceBrakeForceA).toBe(
					Math.round((2000 * 16) / 100)
				);
				expect(newPSV.techRecord_brakes_brakeForceWheelsNotLocked_secondaryBrakeForceA).toBe(
					Math.round((2000 * 22.5) / 100)
				);
				expect(newPSV.techRecord_brakes_brakeForceWheelsNotLocked_parkingBrakeForceA).toBe(
					Math.round((2000 * 45) / 100)
				);

				expect(newPSV.techRecord_brakes_brakeForceWheelsUpToHalfLocked_serviceBrakeForceB).toBe(
					Math.round((1000 * 16) / 100)
				);
				expect(newPSV.techRecord_brakes_brakeForceWheelsUpToHalfLocked_secondaryBrakeForceB).toBe(
					Math.round((1000 * 25) / 100)
				);
				expect(newPSV.techRecord_brakes_brakeForceWheelsUpToHalfLocked_parkingBrakeForceB).toBe(
					Math.round((1000 * 50) / 100)
				);
			});
		});

		describe('updateBody', () => {
			it('should update body', () => {
				expect(
					(initialState.editingTechRecord as TechRecordTypeVehicleVerb<'psv', 'put'>).techRecord_bodyType_description
				).toBe(BodyTypeDescription.DOUBLE_DECKER);

				const expectedData = {
					dtpNumber: '9999',
					psvChassisMake: 'Toyota',
					psvChassisModel: 'Supra',
					psvBodyMake: 'Random',
					psvBodyType: 'o',
				} as PsvMake;

				const newState = vehicleTechRecordReducer(initialState, updateBody({ psvMake: expectedData }));

				expect(newState).not.toBe(initialState);
				expect(newState).not.toEqual(initialState);

				const updatedTechRecord = newState.editingTechRecord as TechRecordTypeVehicleVerb<'psv', 'put'>;
				expect(updatedTechRecord?.techRecord_bodyType_code).toBe(BodyTypeCode.O);
				expect(updatedTechRecord?.techRecord_bodyType_description).toBe(BodyTypeDescription.OTHER);
				expect(updatedTechRecord?.techRecord_bodyMake).toBe(expectedData.psvBodyMake);
				expect(updatedTechRecord?.techRecord_chassisMake).toBe(expectedData.psvChassisMake);
				expect(updatedTechRecord?.techRecord_chassisModel).toBe(expectedData.psvChassisModel);
			});
		});
		describe('updateScrollPosition', () => {
			it('should update the scroll position state', () => {
				const newState = vehicleTechRecordReducer(initialState, updateScrollPosition({ position: [1, 2] }));

				expect(newState.scrollPosition).toEqual([1, 2]);
			});
		});
		describe('clearScrollPosition', () => {
			it('should reset the scroll position', () => {
				initialState.scrollPosition = [2, 2];
				const newState = vehicleTechRecordReducer(initialState, clearScrollPosition());

				expect(newState.scrollPosition).toEqual([0, 0]);
			});
		});
	});

	describe('clearADRDetailsBeforeUpdate', () => {
		it('should set all ADR fields to null when: vehicleType = HGV and dangerousGoods = false', () => {
			initialState.editingTechRecord = createMockHgv(1234) as TechRecordPUTHGV;
			initialState.editingTechRecord.techRecord_adrDetails_dangerousGoods = false;
			initialState.editingTechRecord.techRecord_adrDetails_applicantDetails_city = 'Test City';

			const newState = vehicleTechRecordReducer(initialState, clearADRDetailsBeforeUpdate());
			expect(newState.editingTechRecord).toBeDefined();
			expect((newState.editingTechRecord as TechRecordPUTHGV).techRecord_adrDetails_applicantDetails_city).toBeNull();
		});

		it('should set all ADR fields to null when: vehicleType = TRL and dangerousGoods = false', () => {
			initialState.editingTechRecord = createMockTrl(1234) as TechRecordPUTTRL;
			initialState.editingTechRecord.techRecord_adrDetails_dangerousGoods = false;
			initialState.editingTechRecord.techRecord_adrDetails_applicantDetails_street = 'Test Street';

			const newState = vehicleTechRecordReducer(initialState, clearADRDetailsBeforeUpdate());
			expect(newState.editingTechRecord).toBeDefined();
			expect((newState.editingTechRecord as TechRecordPUTTRL).techRecord_adrDetails_applicantDetails_street).toBeNull();
		});

		it('should set all ADR fields to null when: vehicleType = LGV and dangerousGoods = false', () => {
			initialState.editingTechRecord = createMockLgv(1234) as TechRecordPUTLGV;
			initialState.editingTechRecord.techRecord_adrDetails_dangerousGoods = false;
			initialState.editingTechRecord.techRecord_adrDetails_adrCertificateNotes = 'Test notes';

			const newState = vehicleTechRecordReducer(initialState, clearADRDetailsBeforeUpdate());
			expect(newState.editingTechRecord).toBeDefined();
			expect((newState.editingTechRecord as TechRecordPUTLGV).techRecord_adrDetails_applicantDetails_street).toBeNull();
		});

		it('should not set all ADR fields to null when: vehicleType = HGV and dangerousGoods = true', () => {
			initialState.editingTechRecord = createMockHgv(1234) as TechRecordPUTHGV;
			initialState.editingTechRecord.techRecord_adrDetails_dangerousGoods = true;
			initialState.editingTechRecord.techRecord_adrDetails_applicantDetails_town = 'Test Town';

			const newState = vehicleTechRecordReducer(initialState, clearADRDetailsBeforeUpdate());
			expect(newState.editingTechRecord).toBeDefined();
			expect((newState.editingTechRecord as TechRecordPUTHGV).techRecord_adrDetails_applicantDetails_town).toBe(
				'Test Town'
			);
		});

		it('should not set all ADR fields to null when: vehicleType = TRL and dangerousGoods = true', () => {
			initialState.editingTechRecord = createMockTrl(1234) as TechRecordPUTTRL;
			initialState.editingTechRecord.techRecord_adrDetails_dangerousGoods = true;
			initialState.editingTechRecord.techRecord_adrDetails_applicantDetails_postcode = 'Test Postcode';

			const newState = vehicleTechRecordReducer(initialState, clearADRDetailsBeforeUpdate());
			expect(newState.editingTechRecord).toBeDefined();
			expect((newState.editingTechRecord as TechRecordPUTTRL).techRecord_adrDetails_applicantDetails_postcode).toBe(
				'Test Postcode'
			);
		});

		it('should not set all ADR fields to null when: vehicleType = LGV and dangerousGoods = true', () => {
			initialState.editingTechRecord = createMockLgv(1234) as TechRecordPUTLGV;
			initialState.editingTechRecord.techRecord_adrDetails_dangerousGoods = true;
			initialState.editingTechRecord.techRecord_adrDetails_adrCertificateNotes = 'Test notes';

			const newState = vehicleTechRecordReducer(initialState, clearADRDetailsBeforeUpdate());
			expect(newState.editingTechRecord).toBeDefined();
			expect((newState.editingTechRecord as TechRecordPUTLGV).techRecord_adrDetails_adrCertificateNotes).toBe(
				'Test notes'
			);
		});
	});
	describe('handleADRExaminerNoteChanges', () => {
		beforeEach(() => {
			const mockedDate = new Date(2024, 5, 20);
			jest.useFakeTimers();
			jest.setSystemTime(mockedDate);
		});

		afterEach(() => {
			jest.useRealTimers();
		});
		it('should handle any changes made to the adr examiner notes', () => {
			const testNote = {
				note: 'testNote',
				createdAtDate: new Date().toISOString(),
				lastUpdatedBy: 'someone',
			};
			const state: TechnicalRecordServiceState = {
				...initialState,
				vehicleTechRecord: {
					systemNumber: 'foo',
					createdTimestamp: 'bar',
					vin: 'testVin',
				} as unknown as TechRecordType<'get'>,
				editingTechRecord: {
					systemNumber: 'foo',
					createdTimestamp: 'bar',
					vin: 'testVin',
					techRecord_adrDetails_additionalExaminerNotes_note: testNote.note,
				} as unknown as TechRecordType<'put'>,
				loading: true,
			};
			const action = updateADRAdditionalExaminerNotes({ username: testNote.lastUpdatedBy });
			const newState = vehicleTechRecordReducer(state, action);
			expect(
				(newState.editingTechRecord as unknown as NonVerbTechRecordType<'hgv' | 'lgv' | 'trl'>)
					?.techRecord_adrDetails_additionalExaminerNotes
			).toContainEqual(testNote);
		});
	});
	describe('handleUpdateExistingADRExaminerNote', () => {
		it('should', () => {
			const state: TechnicalRecordServiceState = {
				...initialState,
				editingTechRecord: {
					systemNumber: 'foo',
					createdTimestamp: 'bar',
					vin: 'testVin',
					techRecord_adrDetails_additionalExaminerNotes: [
						{
							note: 'foo',
							createdAtDate: 'bar',
							lastUpdatedBy: 'foo',
						},
					],
				} as unknown as TechRecordType<'put'>,
				loading: true,
			};
			const newNote = 'foobar';
			const action = updateExistingADRAdditionalExaminerNote({ additionalExaminerNote: newNote, examinerNoteIndex: 0 });
			const newState = vehicleTechRecordReducer(state, action);
			const editingTechRecord = newState.editingTechRecord as unknown as NonVerbTechRecordType<'hgv' | 'lgv' | 'trl'>;
			expect(editingTechRecord.techRecord_adrDetails_additionalExaminerNotes![0].note).toEqual(newNote);
		});
	});
});
