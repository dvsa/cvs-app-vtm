import { ADRBodyType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/adrBodyType.enum.js';
import { ADRDangerousGood } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/adrDangerousGood.enum.js';
import { ADRTankDetailsTankStatementSelect } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/adrTankDetailsTankStatementSelect.enum.js';
import { ADRTankStatementSubstancePermitted } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/adrTankStatementSubstancePermitted.js';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { PsvMake } from '@models/reference-data.model';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import * as actions from '../technical-record-service.actions';
import { initialState, vehicleTechRecordReducer } from '../technical-record-service.reducer';

describe('Technical record reducer behaviour', () => {
	const record = (fields: object = {}) =>
		({ vin: 'VIN-1', techRecord_vehicleType: VehicleTypes.HGV, ...fields }) as TechRecordType<'put'>;
	const stateFor = (editingTechRecord?: TechRecordType<'put'>) => ({ ...initialState, editingTechRecord });
	const clean = (fields: object) =>
		vehicleTechRecordReducer(stateFor(record(fields)), actions.clearADRDetailsBeforeUpdate()).editingTechRecord as any;

	it.each([
		actions.generatePlateSuccess(),
		actions.generateLetterSuccess(),
		actions.generateADRCertificateSuccess({ id: 'certificate-1' }),
	])('clears editing data on $type', (action) => {
		const state = stateFor(record());
		expect(vehicleTechRecordReducer(state, action).editingTechRecord).toBeUndefined();
		expect(state.editingTechRecord?.vin).toBe('VIN-1');
	});

	it.each([
		actions.generatePlateFailure({ error: 'Failed' }),
		actions.generateLetterFailure({ error: 'Failed' }),
		actions.generateADRCertificateFailure({ error: 'Failed' }),
	])('records document generation failure for $type', (action) => {
		const state = { ...stateFor(record()), loading: true, vehicleTechRecord: record() as TechRecordType<'get'> };
		expect(vehicleTechRecordReducer(state, action)).toMatchObject({
			error: 'Failed',
			loading: false,
			vehicleTechRecord: undefined,
		});
	});

	it('changes plate-generation eligibility without discarding the editing record', () => {
		const state = stateFor(record());
		const enabled = vehicleTechRecordReducer(state, actions.canGeneratePlate());
		expect(enabled.canGeneratePlate).toBe(true);
		expect(vehicleTechRecordReducer(enabled, actions.cannotGeneratePlate()).canGeneratePlate).toBe(false);
		expect(enabled.editingTechRecord).toBe(state.editingTechRecord);
	});

	it.each([
		actions.updateBrakeForces({ grossLadenWeight: 10000 }),
		actions.updateBody({ psvMake: { psvBodyType: 'S' } as PsvMake }),
	])('ignores PSV-only changes on missing or non-PSV records for $type', (action) => {
		for (const value of [undefined, record()]) {
			const state = stateFor(value);
			expect(vehicleTechRecordReducer(state, action)).toEqual(state);
		}
	});

	it.each([
		[9900, '099CODE'],
		[10000, '100CODE'],
	] as const)('formats the brake code prefix for laden weight %s', (grossLadenWeight, expectedCode) => {
		const state = stateFor(
			record({ techRecord_vehicleType: VehicleTypes.PSV, techRecord_brakes_brakeCodeOriginal: 'CODE' })
		);
		const result = vehicleTechRecordReducer(state, actions.updateBrakeForces({ grossLadenWeight }));
		expect((result.editingTechRecord as any).techRecord_brakes_brakeCode).toBe(expectedCode);
		expect((state.editingTechRecord as any).techRecord_brakes_brakeCode).toBeUndefined();
	});

	describe.each([
		['tank inspections', actions.removeTC3TankInspection, 'techRecord_adrDetails_tank_tankDetails_tc3Details'],
		['UN numbers', actions.removeUNNumber, 'techRecord_adrDetails_tank_tankDetails_tankStatement_productListUnNo'],
	] as const)('removing %s', (_name, action, field) => {
		it.each([VehicleTypes.HGV, VehicleTypes.LGV, VehicleTypes.TRL])(
			'removes only the selected entry for %s without mutating state',
			(vehicleType) => {
				const entries = [{ value: 'first' }, { value: 'second' }];
				const state = stateFor(record({ techRecord_vehicleType: vehicleType, [field]: entries }));
				expect((vehicleTechRecordReducer(state, action({ index: 0 })).editingTechRecord as any)[field]).toEqual([
					{ value: 'second' },
				]);
				expect(entries).toHaveLength(2);
			}
		);
		it('ignores missing lists, absent records, and unsupported vehicle types', () => {
			for (const value of [
				undefined,
				record(),
				record({ techRecord_vehicleType: VehicleTypes.CAR, [field]: ['one'] }),
			]) {
				const state = stateFor(value);
				expect(vehicleTechRecordReducer(state, action({ index: 0 }))).toEqual(state);
			}
		});
	});

	it('opens a section requested by a global error without adding duplicate entries', () => {
		const opened = vehicleTechRecordReducer(initialState, actions.addSectionStateFromGlobalError({ section: 'adr' }));
		expect(
			vehicleTechRecordReducer(opened, actions.addSectionStateFromGlobalError({ section: 'adr' })).sectionState
		).toEqual(['adr']);
		const state = { ...initialState, sectionState: undefined };
		expect(vehicleTechRecordReducer(state, actions.removeSectionState({ section: 'missing' }))).toEqual(state);
	});

	describe('ADR cleanup', () => {
		const base = {
			techRecord_adrDetails_dangerousGoods: true,
			techRecord_adrDetails_vehicleDetails_type: ADRBodyType.RIGID_BATTERY,
			techRecord_adrDetails_permittedDangerousGoods: [ADRDangerousGood.EXPLOSIVES_TYPE_3],
			techRecord_adrDetails_compatibilityGroupJ: true,
			techRecord_adrDetails_bodyDeclaration_type: 'type-3',
			techRecord_adrDetails_listStatementApplicable: true,
			techRecord_adrDetails_batteryListNumber: 'LIST-1',
			techRecord_adrDetails_brakeDeclarationsSeen: true,
			techRecord_adrDetails_brakeEndurance: true,
			techRecord_adrDetails_weight: 15000,
			techRecord_adrDetails_tank_tankDetails_tankManufacturer: 'Manufacturer',
			techRecord_adrDetails_tank_tankDetails_tankStatement_statement: 'Statement 1',
			techRecord_adrDetails_tank_tankDetails_tankStatement_productListRefNo: 'REF-1',
			techRecord_adrDetails_tank_tankDetails_tankStatement_productList: 'Products',
			techRecord_adrDetails_tank_tankDetails_tankStatement_productListUnNo: ['1203', '', null, '1993'],
		};

		it('preserves applicable fields and removes empty UN entries', () => {
			expect(clean(base)).toMatchObject({
				...base,
				techRecord_adrDetails_tank_tankDetails_tankStatement_productListUnNo: ['1203', '1993'],
			});
			expect(base.techRecord_adrDetails_tank_tankDetails_tankStatement_productListUnNo).toHaveLength(4);
		});

		it.each([
			[[ADRDangerousGood.EXPLOSIVES_TYPE_2], true, null],
			[[ADRDangerousGood.AT], null, null],
			[undefined, null, null],
		] as const)('clears explosive-only fields for permitted goods %j', (goods, compatibility, declaration) => {
			expect(clean({ ...base, techRecord_adrDetails_permittedDangerousGoods: goods })).toMatchObject({
				techRecord_adrDetails_compatibilityGroupJ: compatibility,
				techRecord_adrDetails_bodyDeclaration_type: declaration,
			});
		});

		it('clears tank and battery fields for a box-body vehicle', () => {
			expect(clean({ ...base, techRecord_adrDetails_vehicleDetails_type: ADRBodyType.RIGID_BOX_BODY })).toMatchObject({
				techRecord_adrDetails_tank_tankDetails_tankManufacturer: null,
				techRecord_adrDetails_batteryListNumber: null,
				techRecord_adrDetails_listStatementApplicable: null,
			});
		});

		it.each([ADRTankDetailsTankStatementSelect.STATEMENT, ADRTankDetailsTankStatementSelect.PRODUCT_LIST])(
			'keeps only fields applicable to tank statement selection %s',
			(selection) => {
				const result = clean({ ...base, techRecord_adrDetails_tank_tankDetails_tankStatement_select: selection });
				expect(result.techRecord_adrDetails_tank_tankDetails_tankStatement_statement).toBe(
					selection === ADRTankDetailsTankStatementSelect.STATEMENT ? 'Statement 1' : null
				);
				expect(result.techRecord_adrDetails_tank_tankDetails_tankStatement_productListRefNo).toBe(
					selection === ADRTankDetailsTankStatementSelect.PRODUCT_LIST ? 'REF-1' : null
				);
			}
		);

		it('clears statement selection and product details when substances are specified by tank code', () => {
			expect(
				clean({
					...base,
					techRecord_adrDetails_tank_tankDetails_tankStatement_substancesPermitted:
						ADRTankStatementSubstancePermitted.UNDER_TANK_CODE,
				})
			).toMatchObject({
				techRecord_adrDetails_tank_tankDetails_tankStatement_select: null,
				techRecord_adrDetails_tank_tankDetails_tankStatement_statement: null,
				techRecord_adrDetails_tank_tankDetails_tankStatement_productListUnNo: null,
			});
		});

		it('clears the battery list number when its declaration is withdrawn', () => {
			expect(
				clean({ ...base, techRecord_adrDetails_listStatementApplicable: false }).techRecord_adrDetails_batteryListNumber
			).toBeNull();
		});

		it('preserves the brake declaration but removes weight when endurance is not confirmed', () => {
			expect(clean({ ...base, techRecord_adrDetails_brakeEndurance: false })).toMatchObject({
				techRecord_adrDetails_brakeDeclarationsSeen: true,
				techRecord_adrDetails_brakeEndurance: false,
				techRecord_adrDetails_weight: null,
			});
		});

		it('leaves unsupported or absent editing records unchanged', () => {
			const state = stateFor(record({ techRecord_vehicleType: VehicleTypes.CAR }));
			expect(vehicleTechRecordReducer(state, actions.clearADRDetailsBeforeUpdate())).toEqual(state);
			expect(vehicleTechRecordReducer(initialState, actions.clearADRDetailsBeforeUpdate())).toBe(initialState);
		});
	});

	describe('examiner notes', () => {
		it.each([{ notes: undefined }, { notes: null }, { notes: [] }])(
			'adds a dated note to an absent or empty note list ($notes)',
			({ notes }) => {
				vi.useFakeTimers();
				vi.setSystemTime(new Date('2026-11-09T12:00:00Z'));
				const value = Object.freeze(
					record({
						techRecord_adrDetails_additionalExaminerNotes: notes,
						techRecord_adrDetails_additionalExaminerNotes_note: 'New note',
					})
				);
				const previous = structuredClone(value);
				const result = vehicleTechRecordReducer(
					stateFor(value),
					actions.updateADRAdditionalExaminerNotes({ username: 'Examiner' })
				);
				expect((result.editingTechRecord as any).techRecord_adrDetails_additionalExaminerNotes).toEqual([
					{ note: 'New note', lastUpdatedBy: 'Examiner', createdAtDate: '2026-11-09T12:00:00.000Z' },
				]);
				expect(value).toEqual(previous);
			}
		);

		it('edits only the selected note without modifying the saved note', () => {
			const note = Object.freeze({ note: 'Original', lastUpdatedBy: 'Examiner' });
			const value = record({ techRecord_adrDetails_additionalExaminerNotes: [note] });
			const result = vehicleTechRecordReducer(
				stateFor(value),
				actions.updateExistingADRAdditionalExaminerNote({ additionalExaminerNote: 'Edited', examinerNoteIndex: 0 })
			);
			expect((result.editingTechRecord as any).techRecord_adrDetails_additionalExaminerNotes[0]).toEqual({
				...note,
				note: 'Edited',
			});
			expect(note.note).toBe('Original');
		});

		it.each([
			actions.updateADRAdditionalExaminerNotes({ username: 'Examiner' }),
			actions.updateExistingADRAdditionalExaminerNote({ additionalExaminerNote: 'Edited', examinerNoteIndex: 0 }),
		])('does not construct an editing record for $type when it is absent', (action) => {
			expect(vehicleTechRecordReducer(initialState, action).editingTechRecord).toBeUndefined();
		});
	});
});
