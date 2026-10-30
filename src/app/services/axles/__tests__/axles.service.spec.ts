import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { FeatureFlags, FeatureToggleService } from '@services/feature-toggle-service/feature-toggle-service';
import { selectFeatureFlags } from '@store/feature-flags/feature-flags.selectors';
import { State, initialAppState } from '@store/index';
import { AxlesService } from '../axles.service';

describe('AxlesService', () => {
	let service: AxlesService;
	let fb: FormBuilder;
	let store: MockStore<State>;

	const enableRedesignFlag = () => {
		store.overrideSelector(selectFeatureFlags, {
			[FeatureFlags.TECH_RECORD_REDESIGN_CREATE_DETAILS]: { enabled: true },
		});
		store.refreshState();
	};

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				FeatureToggleService,
				provideMockStore<State>({ initialState: initialAppState }),
				provideHttpClient(),
				provideHttpClientTesting(),
				AxlesService,
			],
		});
		service = TestBed.inject(AxlesService);
		fb = TestBed.inject(FormBuilder);
		store = TestBed.inject(MockStore);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	describe('reset', () => {
		it('should reset all internal state back to defaults', () => {
			service.setLockAxles(true);
			service.showDimensionsWarning = true;
			service.axleDistancesWithValues = true;
			service.allInvalidAxles = [1, 2, 3];

			service.reset();

			expect(service.lockAxles$()).toBe(false);
			expect(service.showDimensionsWarning).toBe(false);
			expect(service.axleDistancesWithValues).toBe(false);
			expect(service.allInvalidAxles).toEqual([]);
		});
	});

	describe('setLockAxles', () => {
		it('should set the lockAxles signal to true', () => {
			service.setLockAxles(true);
			expect(service.lockAxles$()).toBe(true);
		});

		it('should set the lockAxles signal to false', () => {
			service.setLockAxles(true);
			service.setLockAxles(false);
			expect(service.lockAxles$()).toBe(false);
		});
	});

	describe('sortAxles', () => {
		it('should sort axles ascending by axleNumber', () => {
			const axles = [{ axleNumber: 3 }, { axleNumber: 1 }, { axleNumber: 2 }] as never;
			const result = service.sortAxles(axles);
			expect(result.map((a: { axleNumber: number }) => a.axleNumber)).toEqual([1, 2, 3]);
		});

		it('should treat a missing axleNumber as 0', () => {
			const axles = [{ axleNumber: 2 }, {}] as never;
			const result = service.sortAxles(axles);
			expect(result.map((a: { axleNumber?: number }) => a.axleNumber)).toEqual([undefined, 2]);
		});
	});

	describe('generateAxlesForm', () => {
		it('should generate a sorted FormArray of HGV axle forms', () => {
			const techRecord = {
				techRecord_vehicleType: 'hgv',
				techRecord_axles: [{ axleNumber: 2 }, { axleNumber: 1 }],
			} as TechRecordType<'hgv'>;

			const result = service.generateAxlesForm(techRecord);

			expect(result?.length).toBe(2);
			expect(result?.at(0).value.axleNumber).toBe(1);
			expect(result?.at(1).value.axleNumber).toBe(2);
		});

		it('should generate a sorted FormArray of PSV axle forms', () => {
			const techRecord = {
				techRecord_vehicleType: 'psv',
				techRecord_axles: [{ axleNumber: 2 }, { axleNumber: 1 }],
			} as TechRecordType<'psv'>;

			const result = service.generateAxlesForm(techRecord);

			expect(result?.length).toBe(2);
			expect(result?.at(0).value.axleNumber).toBe(1);
		});

		it('should generate a sorted FormArray of TRL axle forms', () => {
			const techRecord = {
				techRecord_vehicleType: 'trl',
				techRecord_axles: [{ axleNumber: 2 }, { axleNumber: 1 }],
			} as TechRecordType<'trl'>;

			const result = service.generateAxlesForm(techRecord);

			expect(result?.length).toBe(2);
			expect(result?.at(0).value.axleNumber).toBe(1);
		});

		it('should default to an empty array of axles when none exist on the tech record', () => {
			const techRecord = { techRecord_vehicleType: 'hgv' } as TechRecordType<'hgv'>;
			const result = service.generateAxlesForm(techRecord);
			expect(result?.length).toBe(0);
		});

		it('should return undefined for an unhandled vehicle type', () => {
			const techRecord = { techRecord_vehicleType: 'car', techRecord_axles: [] } as never;
			const result = service.generateAxlesForm(techRecord);
			expect(result).toBeUndefined();
		});
	});

	describe('generateAxleForm', () => {
		it('should delegate to generateHGVAxleForm for type "hgv"', () => {
			const result = service.generateAxleForm('hgv', { axleNumber: 5 });
			expect(result.value.axleNumber).toBe(5);
		});

		it('should delegate to generatePSVAxleForm for type "psv"', () => {
			const result = service.generateAxleForm('psv', { axleNumber: 6 });
			expect(result.value.axleNumber).toBe(6);
		});

		it('should delegate to generateTRLAxleForm for type "trl"', () => {
			const result = service.generateAxleForm('trl', { axleNumber: 7 });
			expect(result.value.axleNumber).toBe(7);
		});
	});

	describe('refDataValidator', () => {
		it('should always return null when the feature flag is disabled', () => {
			const validator = service.refDataValidator();
			const control = fb.control('12345');
			expect(validator(control)).toBeNull();
		});

		it('should return a noAxleData error when the feature flag is enabled and the ref data is not found', () => {
			enableRedesignFlag();
			const parent = fb.group({ axleNumber: 1, tyres_tyreCode: '12345' });
			const validator = service.refDataValidator();
			const control = parent.get('tyres_tyreCode');
			const result = control ? validator(control) : null;

			expect(result).toEqual({
				noAxleData: {
					error: 'Axle 1 tyre code not in database',
					anchorLink: 'tyres_tyreCode-1',
					accordion: 'tyres',
				},
			});
		});

		it('should return null when the control has no value, even when the feature flag is enabled', () => {
			enableRedesignFlag();
			const parent = fb.group({ axleNumber: 1, tyres_tyreCode: null });
			const validator = service.refDataValidator();
			const control = parent.get('tyres_tyreCode');
			const result = control ? validator(control) : null;
			expect(result).toBeNull();
		});
	});

	describe('generateHGVAxleForm', () => {
		it('should generate a form with default values when no axle is provided', () => {
			const form = service.generateHGVAxleForm();
			expect(form.value).toEqual(
				expect.objectContaining({
					axleNumber: null,
					tyres_tyreCode: null,
					tyres_fitmentCode: null,
				})
			);
			expect(form.get('tyres_tyreSize')?.disabled).toBe(true);
		});

		it('should default tyres_fitmentCode to "single" when the feature flag is enabled', () => {
			enableRedesignFlag();
			const form = service.generateHGVAxleForm();
			expect(form.value.tyres_fitmentCode).toBe('single');
		});

		it('should populate values from the provided axle', () => {
			const form = service.generateHGVAxleForm({
				axleNumber: 1,
				tyres_tyreCode: 123,
				weights_gbWeight: 500,
			} as never);
			expect(form.value.axleNumber).toBe(1);
			expect(form.value.tyres_tyreCode).toBe(123);
			expect(form.value.weights_gbWeight).toBe(500);
		});

		it('should error on tyres_tyreCode above the max of 99999 (feature flag disabled)', () => {
			const form = service.generateHGVAxleForm({ axleNumber: 2, tyres_tyreCode: 100000 } as never);
			const control = form.get('tyres_tyreCode');
			control?.updateValueAndValidity();
			expect(control?.errors?.max).toEqual({
				error: 'Axle 2 tyre code must be less than or equal to 99999',
				anchorLink: 'tyres_tyreCode-2',
			});
		});

		it('should error on tyres_tyreCode above the max of 99999 (feature flag enabled)', () => {
			enableRedesignFlag();
			const form = service.generateHGVAxleForm({ axleNumber: 2, tyres_tyreCode: 100000 } as never);
			const control = form.get('tyres_tyreCode');
			control?.updateValueAndValidity();
			expect(control?.errors?.max).toEqual({
				error: 'Axle 2 tyre code must be less than or equal to 99999',
				anchorLink: 'tyres_tyreCode-2',
				accordion: 'tyres',
			});
		});

		it('should error on tyres_tyreCode below the min of 0', () => {
			const form = service.generateHGVAxleForm({ axleNumber: 3, tyres_tyreCode: -1 } as never);
			const control = form.get('tyres_tyreCode');
			control?.updateValueAndValidity();
			expect(control?.errors?.min).toEqual({
				error: 'Axle 3 tyre code must be greater than or equal to 0',
				anchorLink: 'tyres_tyreCode-3',
			});
		});

		it('should error on tyres_tyreCode below the min of 0 (feature flag enabled)', () => {
			enableRedesignFlag();
			const form = service.generateHGVAxleForm({ axleNumber: 3, tyres_tyreCode: -1 } as never);
			const control = form.get('tyres_tyreCode');
			control?.updateValueAndValidity();
			expect(control?.errors?.min).toEqual({
				error: 'Axle 3 tyre code must be greater than or equal to 0',
				anchorLink: 'tyres_tyreCode-3',
				accordion: 'tyres',
			});
		});

		it('should error on weights_gbWeight above the max of 99999', () => {
			const form = service.generateHGVAxleForm({ axleNumber: 4, weights_gbWeight: 100000 } as never);
			const errors = form.get('weights_gbWeight')?.errors;
			expect(errors?.max.error).toContain('GB Weight must be less than or equal to 99999');
		});
	});

	describe('generatePSVAxleForm', () => {
		it('should generate a form with default values when no axle is provided', () => {
			const form = service.generatePSVAxleForm();
			expect(form.value.parkingBrakeMrk).toBe(false);
			expect(form.value.tyres_fitmentCode).toBeNull();
		});

		it('should default tyres_fitmentCode to "single" when the feature flag is enabled', () => {
			enableRedesignFlag();
			const form = service.generatePSVAxleForm();
			expect(form.value.tyres_fitmentCode).toBe('single');
		});

		it('should error on tyres_tyreCode above the max of 99999', () => {
			const form = service.generatePSVAxleForm({ axleNumber: 1, tyres_tyreCode: 100000 } as never);
			const control = form.get('tyres_tyreCode');
			control?.updateValueAndValidity();
			expect(control?.errors?.max.error).toBe('Axle 1 tyre code must be less than or equal to 99999');
		});

		it('should include an accordion on the tyres_tyreCode max error when the feature flag is enabled', () => {
			enableRedesignFlag();
			const form = service.generatePSVAxleForm({ axleNumber: 1, tyres_tyreCode: 100000 } as never);
			const control = form.get('tyres_tyreCode');
			control?.updateValueAndValidity();
			expect(control?.errors?.max).toEqual({
				error: 'Axle 1 tyre code must be less than or equal to 99999',
				anchorLink: 'tyres_tyreCode-1',
				accordion: 'tyres',
			});
		});

		it('should error on tyres_tyreCode below the min of 0', () => {
			const form = service.generatePSVAxleForm({ axleNumber: 1, tyres_tyreCode: -1 } as never);
			const control = form.get('tyres_tyreCode');
			control?.updateValueAndValidity();
			expect(control?.errors?.min.error).toBe('Axle 1 tyre code must be greater than or equal to 0');
		});

		it('should include an accordion on the tyres_tyreCode min error when the feature flag is enabled', () => {
			enableRedesignFlag();
			const form = service.generatePSVAxleForm({ axleNumber: 1, tyres_tyreCode: -1 } as never);
			const control = form.get('tyres_tyreCode');
			control?.updateValueAndValidity();
			expect(control?.errors?.min).toEqual({
				error: 'Axle 1 tyre code must be greater than or equal to 0',
				anchorLink: 'tyres_tyreCode-1',
				accordion: 'tyres_dataTrAxles',
			});
		});

		it('should error on weights_kerbWeight above the max of 99999', () => {
			const form = service.generatePSVAxleForm({ axleNumber: 1, weights_kerbWeight: 100000 } as never);
			const errors = form.get('weights_kerbWeight')?.errors;
			expect(errors?.max.error).toContain('Kerb Weight must be less than or equal to 99999');
		});
	});

	describe('generateTRLAxleForm', () => {
		it('should generate a form with default values when no axle is provided', () => {
			const form = service.generateTRLAxleForm();
			expect(form.value.brakes_springBrakeParking).toBeNull();
			expect(form.value.parkingBrakeMrk).toBe(false);
		});

		it('should preserve a boolean brakes_springBrakeParking value of true', () => {
			const form = service.generateTRLAxleForm({ brakes_springBrakeParking: true } as never);
			expect(form.value.brakes_springBrakeParking).toBe(true);
		});

		it('should preserve a boolean brakes_springBrakeParking value of false', () => {
			const form = service.generateTRLAxleForm({ brakes_springBrakeParking: false } as never);
			expect(form.value.brakes_springBrakeParking).toBe(false);
		});

		it('should error on brakes_brakeActuator above the max of 999 (feature flag disabled)', () => {
			const form = service.generateTRLAxleForm({ axleNumber: 1, brakes_brakeActuator: 1000 } as never);
			const errors = form.get('brakes_brakeActuator')?.errors;
			expect(errors?.max.error).toBe('This field must be less than or equal to 999');
		});

		it('should error on brakes_brakeActuator above the max of 999 (feature flag enabled)', () => {
			enableRedesignFlag();
			const form = service.generateTRLAxleForm({ axleNumber: 1, brakes_brakeActuator: 1000 } as never);
			const errors = form.get('brakes_brakeActuator')?.errors;
			expect(errors?.max.error).toBe('Brake actuator and Lever length must be less than or equal to 999mm');
		});

		it('should error on brakes_leverLength above the max of 999', () => {
			const form = service.generateTRLAxleForm({ axleNumber: 1, brakes_leverLength: 1000 } as never);
			const errors = form.get('brakes_leverLength')?.errors;
			expect(errors?.max.error).toBe('This field must be less than or equal to 999');
		});

		it('should error on brakes_leverLength above the max of 999 (feature flag enabled)', () => {
			enableRedesignFlag();
			const form = service.generateTRLAxleForm({ axleNumber: 1, brakes_leverLength: 1000 } as never);
			const errors = form.get('brakes_leverLength')?.errors;
			expect(errors?.max.error).toBe('Brake actuator and Lever length must be less than or equal to 999mm');
		});

		it('should error on tyres_tyreCode above the max of 99999 (feature flag disabled)', () => {
			const form = service.generateTRLAxleForm({ axleNumber: 1, tyres_tyreCode: 100000 } as never);
			const control = form.get('tyres_tyreCode');
			control?.updateValueAndValidity();
			expect(control?.errors?.max).toEqual({
				error: 'Axle 1 tyre code must be less than or equal to 99999',
				anchorLink: 'tyres_tyreCode-1',
			});
		});

		it('should error on tyres_tyreCode above the max of 99999 (feature flag enabled)', () => {
			enableRedesignFlag();
			const form = service.generateTRLAxleForm({ axleNumber: 1, tyres_tyreCode: 100000 } as never);
			const control = form.get('tyres_tyreCode');
			control?.updateValueAndValidity();
			expect(control?.errors?.max).toEqual({
				error: 'Axle 1 tyre code must be less than or equal to 99999',
				anchorLink: 'tyres_tyreCode-1',
				accordion: 'tyres',
			});
		});

		it('should error on tyres_tyreCode below the min of 0 (feature flag disabled)', () => {
			const form = service.generateTRLAxleForm({ axleNumber: 1, tyres_tyreCode: -1 } as never);
			const control = form.get('tyres_tyreCode');
			control?.updateValueAndValidity();
			expect(control?.errors?.min).toEqual({
				error: 'Axle 1 tyre code must be greater than or equal to 0',
				anchorLink: 'tyres_tyreCode-1',
			});
		});

		it('should error on tyres_tyreCode below the min of 0 (feature flag enabled)', () => {
			enableRedesignFlag();
			const form = service.generateTRLAxleForm({ axleNumber: 1, tyres_tyreCode: -1 } as never);
			const control = form.get('tyres_tyreCode');
			control?.updateValueAndValidity();
			expect(control?.errors?.min).toEqual({
				error: 'Axle 1 tyre code must be greater than or equal to 0',
				anchorLink: 'tyres_tyreCode-1',
				accordion: 'tyres',
			});
		});

		it('should default tyres_fitmentCode to "single" when the feature flag is enabled', () => {
			enableRedesignFlag();
			const form = service.generateTRLAxleForm();
			expect(form.value.tyres_fitmentCode).toBe('single');
		});
	});

	describe('maxWeightHGV', () => {
		it('should return the non-redesign error message when the feature flag is disabled', () => {
			const validator = service.maxWeightHGV('GB Weight', 'weights_gbWeight');
			const control = fb.group({ axleNumber: 1, weights_gbWeight: 100000 }).get('weights_gbWeight');
			const result = control ? validator(control) : null;
			expect(result?.max).toEqual({
				error: 'Axle 1 GB Weight must be less than or equal to 99999',
				anchorLink: 'weights_gbWeight-1',
			});
		});

		it('should return the redesign error message when the feature flag is enabled', () => {
			enableRedesignFlag();
			const validator = service.maxWeightHGV('GB Weight', 'weights_gbWeight');
			const control = fb.group({ axleNumber: 1, weights_gbWeight: 100000 }).get('weights_gbWeight');
			const result = control ? validator(control) : null;
			expect(result?.max).toEqual({
				error: 'Axle 1 GB, EEC, Design Weight must be less than or equal to 99999kg',
				anchorLink: 'weights_gbWeight-1',
				accordion: 'weights',
			});
		});
	});

	describe('maxWeightPSV', () => {
		it('should return the non-redesign error message when the feature flag is disabled', () => {
			const validator = service.maxWeightPSV('Kerb Weight', 'weights_kerbWeight');
			const control = fb.group({ axleNumber: 1, weights_kerbWeight: 100000 }).get('weights_kerbWeight');
			const result = control ? validator(control) : null;
			expect(result?.max).toEqual({
				error: 'Axle 1 Kerb Weight must be less than or equal to 99999',
				anchorLink: 'weights_kerbWeight-1',
			});
		});

		it('should return the redesign error message when the feature flag is enabled', () => {
			enableRedesignFlag();
			const validator = service.maxWeightPSV('Kerb Weight', 'weights_kerbWeight');
			const control = fb.group({ axleNumber: 1, weights_kerbWeight: 100000 }).get('weights_kerbWeight');
			const result = control ? validator(control) : null;
			expect(result?.max).toEqual({
				error: 'Axle 1 Kerb, Laden, GB Max, EEC, Design Weight must be less than or equal to 99999kg',
				anchorLink: 'weights_kerbWeight-1',
				accordion: 'weights',
			});
		});
	});

	describe('generateAxleSpacingsForm', () => {
		it('should generate a FormArray from the axle spacings on the tech record', () => {
			const techRecord = {
				techRecord_dimensions_axleSpacing: [{ axles: '1-2', value: 100 }],
			} as TechRecordType<'hgv'>;

			const result = service.generateAxleSpacingsForm(techRecord);
			expect(result.length).toBe(1);
			expect(result.at(0).value).toEqual({ axles: '1-2', value: 100 });
		});

		it('should default to an empty array when no axle spacings exist', () => {
			const techRecord = {} as TechRecordType<'hgv'>;
			const result = service.generateAxleSpacingsForm(techRecord);
			expect(result.length).toBe(0);
		});
	});

	describe('generateAxleSpacingForm', () => {
		it('should default axles to an empty string when not provided', () => {
			const form = service.generateAxleSpacingForm({}, 2);
			expect(form.value.axles).toBe('');
		});

		it('should error on value above the max of 99999 (feature flag disabled)', () => {
			const form = service.generateAxleSpacingForm({ axles: '1-2', value: 100000 }, 2);
			const errors = form.get('value')?.errors;
			expect(errors?.max).toEqual({
				error: 'Axle 1 to 2 spacing must be less than or equal to 99999mm',
				anchorLink: 'techRecord_dimensions_axleSpacing_0_value',
			});
		});

		it('should error on value above the max of 99999 (feature flag enabled)', () => {
			enableRedesignFlag();
			const form = service.generateAxleSpacingForm({ axles: '1-2', value: 100000 }, 2);
			const errors = form.get('value')?.errors;
			expect(errors?.max).toEqual({
				error: 'Axle 1 to 2 spacing must be less than or equal to 99999mm',
				anchorLink: 'techRecord_dimensions_axleSpacing_0_value',
				accordion: 'dimensions',
			});
		});
	});

	describe('addAxle', () => {
		function buildParent(withSpacingForm = true) {
			return fb.group({
				techRecord_axles: fb.array([]),
				techRecord_noOfAxles: fb.control<number | null>(null),
				...(withSpacingForm ? { techRecord_dimensions_axleSpacing: fb.array([]) } : {}),
			});
		}

		it('should do nothing if techRecord_axles is not a FormArray', () => {
			const parent = fb.group({ techRecord_axles: fb.control(null) });
			expect(() => service.addAxle(parent, 'hgv')).not.toThrow();
		});

		it('should push a new axle form, lock axles, and update noOfAxles', () => {
			const parent = buildParent();
			service.addAxle(parent, 'psv');

			const axlesForm = parent.get('techRecord_axles') as never as { controls: unknown[] };
			expect(axlesForm.controls.length).toBe(1);
			expect(parent.get('techRecord_noOfAxles')?.value).toBe(1);
			expect(service.lockAxles$()).toBe(true);
		});

		it('should add an axle spacing form when adding a second HGV axle', () => {
			const parent = buildParent();
			service.addAxle(parent, 'hgv');
			service.addAxle(parent, 'hgv');

			const spacingForm = parent.get('techRecord_dimensions_axleSpacing') as never as { controls: unknown[] };
			expect(spacingForm.controls.length).toBe(1);
		});

		it('should add an axle spacing form when adding a second TRL axle', () => {
			const parent = buildParent();
			service.addAxle(parent, 'trl');
			service.addAxle(parent, 'trl');

			const spacingForm = parent.get('techRecord_dimensions_axleSpacing') as never as { controls: unknown[] };
			expect(spacingForm.controls.length).toBe(1);
		});

		it('should not add an axle spacing form for PSV vehicles', () => {
			const parent = buildParent();
			service.addAxle(parent, 'psv');
			service.addAxle(parent, 'psv');

			const spacingForm = parent.get('techRecord_dimensions_axleSpacing') as never as { controls: unknown[] };
			expect(spacingForm.controls.length).toBe(0);
		});

		it('should set a length error and stop adding once there are already 10 axles', () => {
			const parent = buildParent();
			const axlesForm = parent.get('techRecord_axles') as never as { push: (c: unknown) => void };
			for (let i = 0; i < 10; i++) {
				axlesForm.push(service.generatePSVAxleForm({ axleNumber: i + 1 }));
			}

			service.addAxle(parent, 'psv');

			expect((axlesForm as never as { controls: unknown[] }).controls.length).toBe(10);
			expect((axlesForm as never as { errors: unknown }).errors).toEqual({
				length: 'Cannot have more than 10 axles',
			});
		});
	});

	describe('removeAllAxles', () => {
		it('should clear the axles and reset noOfAxles for PSV', () => {
			const parent = fb.group({
				techRecord_axles: fb.array([service.generatePSVAxleForm({ axleNumber: 1 })]),
				techRecord_noOfAxles: fb.control<number | null>(1),
				techRecord_dimensions_axleSpacing: fb.array([]),
			});

			service.removeAllAxles(parent, 'psv');

			expect((parent.get('techRecord_axles') as never as { length: number }).length).toBe(0);
			expect(parent.get('techRecord_noOfAxles')?.value).toBeNull();
		});

		it('should also clear axle spacings for HGV', () => {
			const parent = fb.group({
				techRecord_axles: fb.array([service.generateHGVAxleForm({ axleNumber: 1 })]),
				techRecord_noOfAxles: fb.control<number | null>(1),
				techRecord_dimensions_axleSpacing: fb.array([service.generateAxleSpacingForm({ axles: '1-2' }, 2)]),
			});

			service.removeAllAxles(parent, 'hgv');

			expect((parent.get('techRecord_dimensions_axleSpacing') as never as { length: number }).length).toBe(0);
		});
	});

	describe('canRemoveAxle', () => {
		it('should return true for TRL when there is more than 1 axle', () => {
			const parent = fb.group({
				techRecord_axles: fb.array([
					service.generateTRLAxleForm({ axleNumber: 1 }),
					service.generateTRLAxleForm({ axleNumber: 2 }),
				]),
			});
			expect(service.canRemoveAxle(parent, 'trl')).toBe(true);
		});

		it('should return false for TRL when there is only 1 axle', () => {
			const parent = fb.group({
				techRecord_axles: fb.array([service.generateTRLAxleForm({ axleNumber: 1 })]),
			});
			expect(service.canRemoveAxle(parent, 'trl')).toBe(false);
		});

		it('should return false for HGV when there are only 2 axles', () => {
			const parent = fb.group({
				techRecord_axles: fb.array([
					service.generateHGVAxleForm({ axleNumber: 1 }),
					service.generateHGVAxleForm({ axleNumber: 2 }),
				]),
			});
			expect(service.canRemoveAxle(parent, 'hgv')).toBe(false);
		});

		it('should return true for HGV when there are more than 2 axles', () => {
			const parent = fb.group({
				techRecord_axles: fb.array([
					service.generateHGVAxleForm({ axleNumber: 1 }),
					service.generateHGVAxleForm({ axleNumber: 2 }),
					service.generateHGVAxleForm({ axleNumber: 3 }),
				]),
			});
			expect(service.canRemoveAxle(parent, 'hgv')).toBe(true);
		});
	});

	describe('removeAxle', () => {
		function buildHgvParent(axleCount: number) {
			const axles = Array.from({ length: axleCount }, (_, i) => service.generateHGVAxleForm({ axleNumber: i + 1 }));
			const spacings = Array.from({ length: Math.max(axleCount - 1, 0) }, (_, i) =>
				service.generateAxleSpacingForm({ axles: `${i + 1}-${i + 2}` }, i + 2)
			);
			return fb.group({
				techRecord_axles: fb.array(axles),
				techRecord_noOfAxles: fb.control<number | null>(axleCount),
				techRecord_dimensions_axleSpacing: fb.array(spacings),
				techRecord_frontAxleToRearAxle: fb.control<number | null>(123),
				techRecord_frontVehicleTo5thWheelCouplingMin: fb.control<number | null>(1),
				techRecord_frontVehicleTo5thWheelCouplingMax: fb.control<number | null>(1),
				techRecord_frontAxleTo5thWheelMin: fb.control<number | null>(1),
				techRecord_frontAxleTo5thWheelMax: fb.control<number | null>(1),
			});
		}

		it('should set a length error and not remove when below the minimum for HGV', () => {
			const parent = buildHgvParent(2);
			service.removeAxle(parent, 'hgv', 0);

			const axlesForm = parent.get('techRecord_axles') as never as { controls: unknown[]; errors: unknown };
			expect(axlesForm.controls.length).toBe(2);
			expect(axlesForm.errors).toEqual({ length: 'Cannot have less than 2 axles' });
		});

		it('should remove the axle, relabel remaining axles, and update noOfAxles for HGV', () => {
			const parent = buildHgvParent(3);
			service.removeAxle(parent, 'hgv', 0);

			const axlesForm = parent.get('techRecord_axles') as never as { controls: { value: { axleNumber: number } }[] };
			expect(axlesForm.controls.length).toBe(2);
			expect(axlesForm.controls.map((c) => c.value.axleNumber)).toEqual([1, 2]);
			expect(parent.get('techRecord_noOfAxles')?.value).toBe(2);
			expect(service.showDimensionsWarning).toBe(true);
			expect(service.axleDistancesWithValues).toBe(false);
		});

		it('should patch techRecord_frontAxleToRearAxle to null when the feature flag is enabled', () => {
			enableRedesignFlag();
			const parent = buildHgvParent(3);
			service.removeAxle(parent, 'hgv', 0);
			expect(parent.get('techRecord_frontAxleToRearAxle')?.value).toBeNull();
		});

		it('should reset the HGV 5th wheel coupling fields when the feature flag is enabled', () => {
			enableRedesignFlag();
			const parent = buildHgvParent(3);
			service.removeAxle(parent, 'hgv', 0);
			expect(parent.get('techRecord_frontVehicleTo5thWheelCouplingMin')?.value).toBeNull();
			expect(parent.get('techRecord_frontVehicleTo5thWheelCouplingMax')?.value).toBeNull();
			expect(parent.get('techRecord_frontAxleTo5thWheelMin')?.value).toBeNull();
			expect(parent.get('techRecord_frontAxleTo5thWheelMax')?.value).toBeNull();
		});

		it('should remove an axle spacing form entry for HGV', () => {
			const parent = buildHgvParent(3);
			service.removeAxle(parent, 'hgv', 0);

			const spacingForm = parent.get('techRecord_dimensions_axleSpacing') as never as { controls: unknown[] };
			expect(spacingForm.controls.length).toBe(1);
		});

		function buildTrlParent(axleCount: number) {
			const axles = Array.from({ length: axleCount }, (_, i) => service.generateTRLAxleForm({ axleNumber: i + 1 }));
			const spacings = Array.from({ length: Math.max(axleCount - 1, 0) }, (_, i) =>
				service.generateAxleSpacingForm({ axles: `${i + 1}-${i + 2}` }, i + 2)
			);
			return fb.group({
				techRecord_axles: fb.array(axles),
				techRecord_noOfAxles: fb.control<number | null>(axleCount),
				techRecord_dimensions_axleSpacing: fb.array(spacings),
				techRecord_rearAxleToRearTrl: fb.control<number | null>(1),
				techRecord_centreOfRearmostAxleToRearOfTrl: fb.control<number | null>(1),
				techRecord_couplingCenterToRearTrlMin: fb.control<number | null>(1),
				techRecord_couplingCenterToRearTrlMax: fb.control<number | null>(1),
				techRecord_couplingCenterToRearAxleMin: fb.control<number | null>(1),
				techRecord_couplingCenterToRearAxleMax: fb.control<number | null>(1),
			});
		}

		it('should set a length error and not remove when below the minimum for TRL', () => {
			const parent = buildTrlParent(1);
			service.removeAxle(parent, 'trl', 0);

			const axlesForm = parent.get('techRecord_axles') as never as { controls: unknown[]; errors: unknown };
			expect(axlesForm.controls.length).toBe(1);
			expect(axlesForm.errors).toEqual({ length: 'Cannot have less than 1 axles' });
		});

		it('should reset the TRL coupling fields when the feature flag is enabled', () => {
			enableRedesignFlag();
			const parent = buildTrlParent(3);
			service.removeAxle(parent, 'trl', 0);
			expect(parent.get('techRecord_rearAxleToRearTrl')?.value).toBeNull();
			expect(parent.get('techRecord_centreOfRearmostAxleToRearOfTrl')?.value).toBeNull();
			expect(parent.get('techRecord_couplingCenterToRearTrlMin')?.value).toBeNull();
			expect(parent.get('techRecord_couplingCenterToRearTrlMax')?.value).toBeNull();
			expect(parent.get('techRecord_couplingCenterToRearAxleMin')?.value).toBeNull();
			expect(parent.get('techRecord_couplingCenterToRearAxleMax')?.value).toBeNull();
		});

		it('should remove the axle spacing at index - 1 when removing an axle with a positive index', () => {
			const parent = buildHgvParent(3);
			service.removeAxle(parent, 'hgv', 1);

			const spacingForm = parent.get('techRecord_dimensions_axleSpacing') as never as { controls: unknown[] };
			expect(spacingForm.controls.length).toBe(1);
		});

		it('should relabel remaining axle spacing controls without a value reset when the feature flag is disabled', () => {
			const parent = buildHgvParent(3);
			service.removeAxle(parent, 'hgv', 0);

			const spacingForm = parent.get('techRecord_dimensions_axleSpacing') as never as {
				controls: { value: { axles: string; value: number | null } }[];
			};
			expect(spacingForm.controls[0].value.axles).toBe('1-2');
		});

		it('should remove the axle spacing at index 0 when removing the first axle', () => {
			const parent = buildHgvParent(3);
			service.removeAxle(parent, 'hgv', 0);
			const spacingForm = parent.get('techRecord_dimensions_axleSpacing') as never as { controls: unknown[] };
			expect(spacingForm.controls.length).toBe(1);
		});

		it('should remove the axle without touching axle spacings for PSV', () => {
			const axles = [
				service.generatePSVAxleForm({ axleNumber: 1 }),
				service.generatePSVAxleForm({ axleNumber: 2 }),
				service.generatePSVAxleForm({ axleNumber: 3 }),
			];
			const parent = fb.group({
				techRecord_axles: fb.array(axles),
				techRecord_noOfAxles: fb.control<number | null>(3),
			});

			service.removeAxle(parent, 'psv', 0);

			const axlesForm = parent.get('techRecord_axles') as never as { controls: unknown[] };
			expect(axlesForm.controls.length).toBe(2);
			expect(parent.get('techRecord_noOfAxles')?.value).toBe(2);
		});
	});
});
