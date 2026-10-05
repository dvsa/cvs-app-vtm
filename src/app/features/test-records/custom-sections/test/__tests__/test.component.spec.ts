import { Modes } from '@/src/app/models/modes.enum';
import { V3TechRecordModel } from '@/src/app/models/vehicle-tech-record.model';
import { MultiOptionsService } from '@/src/app/services/multi-options/multi-options.service';
import { initialAppState } from '@/src/app/store';
import { techRecord } from '@/src/app/store/technical-records';
import { toEditOrNotToEdit } from '@/src/app/store/test-records';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlContainer, FormGroup, FormGroupDirective } from '@angular/forms';
import { TestResults } from '@dvsa/cvs-type-definitions/types/v1/enums/testResult.enum.js';
import { TestStatus } from '@dvsa/cvs-type-definitions/types/v1/enums/testStatus.enum.js';
import { TestResultSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { selectAllTestResults } from '@store/test-records';

import { TestComponent } from '../test.component';

describe('TestComponent', () => {
	let fixture: ComponentFixture<TestComponent>;
	let component: TestComponent;
	let store: MockStore;
	let formGroupDirective: FormGroupDirective;

	beforeEach(async () => {
		formGroupDirective = new FormGroupDirective([], []);
		formGroupDirective.form = new FormGroup({});

		await TestBed.configureTestingModule({
			imports: [TestComponent],
			providers: [
				{ provide: ControlContainer, useValue: formGroupDirective },
				{ provide: MultiOptionsService, useValue: { getOptions: jest.fn(), loadOptions: jest.fn() } },
				provideMockStore({ initialState: initialAppState }),
			],
		}).compileComponents();

		store = TestBed.inject(MockStore);
		fixture = TestBed.createComponent(TestComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('mode', Modes.EDIT);
		fixture.componentRef.setInput('initialMode', Modes.EDIT);
		fixture.detectChanges();
	});

	afterEach(() => {
		store.resetSelectors();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('prepopulateVTG15Required', () => {
		it.each([
			['hgv', true, null],
			['lgv', true, null],
			['trl', true, null],
			['hgv', false, false],
			['lgv', false, false],
			['trl', false, false],
		] as const)(
			'should default VTG15 required for vehicle type %s with dangerous goods %s to %s',
			(vehicleType, dangerousGoods, expected) => {
				store.overrideSelector(techRecord, {
					techRecord_vehicleType: vehicleType,
					techRecord_adrDetails_dangerousGoods: dangerousGoods,
				} as V3TechRecordModel);
				store.refreshState();
				fixture = TestBed.createComponent(TestComponent);
				component = fixture.componentInstance;
				fixture.componentRef.setInput('mode', Modes.EDIT);
				fixture.componentRef.setInput('initialMode', Modes.EDIT);
				const control = component.form.controls.vtg15.controls.vtg15Required;
				control.setValue(undefined);

				fixture.detectChanges();

				expect(control.value).toBe(expected);
			}
		);

		it.each([true, false])('should preserve an existing VTG15 required value of %s', (value) => {
			store.overrideSelector(techRecord, {
				techRecord_vehicleType: 'hgv',
				techRecord_adrDetails_dangerousGoods: false,
			} as V3TechRecordModel);
			store.refreshState();
			const control = component.form.controls.vtg15.controls.vtg15Required;
			control.setValue(value);

			component.prepopulateVTG15Required();

			expect(control.value).toBe(value);
		});

		it.each([Modes.AMEND, Modes.VIEW])('should not default VTG15 required in initial mode %s', (initialMode) => {
			fixture.componentRef.setInput('initialMode', initialMode);
			store.overrideSelector(techRecord, {
				techRecord_vehicleType: 'hgv',
				techRecord_adrDetails_dangerousGoods: false,
			} as V3TechRecordModel);
			store.refreshState();
			const control = component.form.controls.vtg15.controls.vtg15Required;
			control.setValue(null);

			component.prepopulateVTG15Required();

			expect(control.value).toBeNull();
		});

		it('should not default VTG15 required for a vehicle without ADR details', () => {
			store.overrideSelector(techRecord, { techRecord_vehicleType: 'psv' } as V3TechRecordModel);
			store.refreshState();
			const control = component.form.controls.vtg15.controls.vtg15Required;
			control.setValue(null);

			component.prepopulateVTG15Required();

			expect(control.value).toBeNull();
		});
	});

	describe('addValidators', () => {
		describe('contingencyTestNumber', () => {
			it('should be invalid when empty', () => {
				const control = component.form.controls.contingencyTestNumber;
				control.setValue(null);
				control.markAsTouched();
				expect(control.valid).toBe(false);
				expect(control.errors).toHaveProperty('required');
			});

			it('should be invalid when less than 6 characters', () => {
				const control = component.form.controls.contingencyTestNumber;
				control.setValue('12345');
				control.markAsTouched();
				expect(control.valid).toBe(false);
				expect(control.errors).toHaveProperty('minLength');
			});

			it('should be invalid when more than 8 characters', () => {
				const control = component.form.controls.contingencyTestNumber;
				control.setValue('123456789');
				control.markAsTouched();
				expect(control.valid).toBe(false);
				expect(control.errors).toHaveProperty('maxLength');
			});

			it('should be valid when between 6 and 8 characters', () => {
				const control = component.form.controls.contingencyTestNumber;
				control.setValue('123456');
				control.markAsTouched();
				expect(control.valid).toBe(true);
			});
		});

		describe('testTypeStartTimestamp', () => {
			let control: typeof component.form.controls.testTypes extends { at(index: 0): { controls: infer C } }
				? C extends { testTypeStartTimestamp: infer T }
					? T
					: never
				: never;

			beforeEach(() => {
				control = component.form.controls.testTypes.at(0).controls.testTypeStartTimestamp;
			});

			it('should be invalid when empty', () => {
				control.setValue(null);
				control.markAsTouched();
				expect(control.valid).toBe(false);
				expect(control.errors).toHaveProperty('required');
			});

			it('should be invalid when date is in the future', () => {
				const futureDate = new Date(Date.now() + 86400000).toISOString();
				control.setValue(futureDate);
				control.markAsTouched();
				expect(control.valid).toBe(false);
				expect(control.errors).toHaveProperty('pastDate');
			});

			it('should be valid when date is in the past', () => {
				const pastDate = '2024-01-15T10:30:00';
				control.setValue(pastDate);
				control.markAsTouched();
				expect(control.valid).toBe(true);
			});
		});

		describe('testExpiryDate', () => {
			let startControl: typeof component.form.controls.testTypes extends { at(index: 0): { controls: infer C } }
				? C extends { testTypeStartTimestamp: infer T }
					? T
					: never
				: never;
			let expiryControl: typeof component.form.controls.testTypes extends { at(index: 0): { controls: infer C } }
				? C extends { testExpiryDate: infer T }
					? T
					: never
				: never;

			beforeEach(() => {
				const testTypeGroup = component.form.controls.testTypes.at(0);
				startControl = testTypeGroup.controls.testTypeStartTimestamp;
				expiryControl = testTypeGroup.controls.testExpiryDate;
			});

			it('should be invalid when expiry date is before start date', () => {
				startControl.setValue('2024-01-15T14:00:00');
				expiryControl.setValue('2024-01-14');
				expiryControl.markAsTouched();
				expect(expiryControl.valid).toBe(false);
				expect(expiryControl.errors).toHaveProperty('aheadOfDate');
			});

			it('should be invalid when expiry date is the same day as start date', () => {
				startControl.setValue('2024-01-15T14:00:00');
				expiryControl.setValue('2024-01-15');
				expiryControl.markAsTouched();
				expect(expiryControl.valid).toBe(false);
				expect(expiryControl.errors).toHaveProperty('aheadOfDate');
			});

			it('should be valid when expiry date is after start date', () => {
				startControl.setValue('2024-01-15T14:00:00');
				expiryControl.setValue('2024-01-16');
				expiryControl.markAsTouched();
				expect(expiryControl.valid).toBe(true);
			});

			it('should be required when amending a passed test', () => {
				fixture.componentRef.setInput('mode', Modes.AMEND);
				component.form.controls.testTypes.at(0).controls.testResult.setValue(TestResults.PASS);
				expiryControl.setValue(null);
				expiryControl.markAsTouched();
				expect(expiryControl.valid).toBe(false);
				expect(expiryControl.errors).toHaveProperty('required');
			});

			it('should not be required when amending a failed test', () => {
				fixture.componentRef.setInput('mode', Modes.AMEND);
				component.form.controls.testTypes.at(0).controls.testResult.setValue(TestResults.FAIL);
				expiryControl.setValue(null);
				expiryControl.markAsTouched();
				expect(expiryControl.valid).toBe(true);
			});
		});

		describe('testAnniversaryDate', () => {
			let startControl: typeof component.form.controls.testTypes extends { at(index: 0): { controls: infer C } }
				? C extends { testTypeStartTimestamp: infer T }
					? T
					: never
				: never;
			let anniversaryControl: typeof component.form.controls.testTypes extends { at(index: 0): { controls: infer C } }
				? C extends { testAnniversaryDate: infer T }
					? T
					: never
				: never;

			beforeEach(() => {
				const testTypeGroup = component.form.controls.testTypes.at(0);
				startControl = testTypeGroup.controls.testTypeStartTimestamp;
				anniversaryControl = testTypeGroup.controls.testAnniversaryDate;
			});

			it('should be invalid when anniversary date is before start date', () => {
				startControl.setValue('2024-01-15T14:00:00');
				anniversaryControl.setValue('2024-01-14');
				anniversaryControl.markAsTouched();
				expect(anniversaryControl.valid).toBe(false);
				expect(anniversaryControl.errors).toHaveProperty('aheadOfDate');
			});

			it('should be invalid when anniversary date is the same day as start date', () => {
				startControl.setValue('2024-01-15T14:00:00');
				anniversaryControl.setValue('2024-01-15');
				anniversaryControl.markAsTouched();
				expect(anniversaryControl.valid).toBe(false);
				expect(anniversaryControl.errors).toHaveProperty('aheadOfDate');
			});

			it('should be valid when anniversary date is after start date', () => {
				startControl.setValue('2024-01-15T14:00:00');
				anniversaryControl.setValue('2024-01-16');
				anniversaryControl.markAsTouched();
				expect(anniversaryControl.valid).toBe(true);
			});
		});

		describe('testTypeEndTimestamp', () => {
			let startControl: typeof component.form.controls.testTypes extends { at(index: 0): { controls: infer C } }
				? C extends { testTypeStartTimestamp: infer T }
					? T
					: never
				: never;
			let endControl: typeof component.form.controls.testTypes extends { at(index: 0): { controls: infer C } }
				? C extends { testTypeEndTimestamp: infer T }
					? T
					: never
				: never;

			beforeEach(() => {
				const testTypeGroup = component.form.controls.testTypes.at(0);
				startControl = testTypeGroup.controls.testTypeStartTimestamp;
				endControl = testTypeGroup.controls.testTypeEndTimestamp;
			});

			it('should be invalid when empty', () => {
				endControl.setValue(null);
				endControl.markAsTouched();
				expect(endControl.valid).toBe(false);
				expect(endControl.errors).toHaveProperty('required');
			});

			it('should be invalid when date is in the future', () => {
				const futureDate = new Date(Date.now() + 86400000).toISOString();
				endControl.setValue(futureDate);
				endControl.markAsTouched();
				expect(endControl.valid).toBe(false);
				expect(endControl.errors).toHaveProperty('pastDate');
			});

			it('should be invalid when end date is before start date', () => {
				startControl.setValue('2024-01-15T14:00:00');
				endControl.setValue('2024-01-15T10:00:00');
				endControl.markAsTouched();
				expect(endControl.valid).toBe(false);
				expect(endControl.errors).toHaveProperty('aheadOfDate');
			});

			it('should be valid when end date is after start date and in the past', () => {
				startControl.setValue('2024-01-15T10:00:00');
				endControl.setValue('2024-01-15T14:00:00');
				endControl.markAsTouched();
				expect(endControl.valid).toBe(true);
			});
		});
	});

	describe('initTimeDisplayControls', () => {
		it('should not set display controls when not in AMEND mode', () => {
			expect(component.startTimeDisplay.value).toBe('');
			expect(component.endTimeDisplay.value).toBe('');
		});
	});

	describe('shouldShowLoadStatus', () => {
		const setTestType = (testType: Record<string, unknown>) => {
			store.overrideSelector(toEditOrNotToEdit, {
				vehicleType: 'hgv',
				testTypes: [{ testTypeStartTimestamp: '2026-09-28T10:00:00.000Z', ...testType }],
			} as TestResultSchema);
			store.refreshState();
		};

		// The annual test being retested
		const setTestHistory = (testType: Record<string, unknown>) => {
			store.overrideSelector(selectAllTestResults, [
				{
					testStatus: TestStatus.SUBMITTED,
					testTypes: [{ testTypeStartTimestamp: '2026-09-23T09:00:00.000Z', ...testType }],
				} as TestResultSchema,
			]);
			store.refreshState();
		};

		it('should be false when there is no test result', () => {
			store.overrideSelector(toEditOrNotToEdit, undefined);
			store.refreshState();
			expect(component.shouldShowLoadStatus()).toBe(false);
		});

		it('should be true for an HGV/TRL annual test', () => {
			setTestType({ testTypeId: '94' });
			expect(component.shouldShowLoadStatus()).toBe(true);
		});

		// Group 1/2 are PSV tests, which have no load status in the dynamic form templates
		it.each(['1', '18', '15', '22'])('should be false for group 1/2 test type %s', (testTypeId) => {
			setTestType({ testTypeId });
			expect(component.shouldShowLoadStatus()).toBe(false);
		});

		it('should be false for a retest when the vehicle has no test history', () => {
			setTestType({ testTypeId: '53' });
			expect(component.shouldShowLoadStatus()).toBe(false);
		});

		it('should be false for a retest of an annual test that did not fail', () => {
			setTestType({ testTypeId: '53' });
			setTestHistory({ testTypeId: '94', testResult: TestResults.PASS, defects: [{ imNumber: 59 }] });
			expect(component.shouldShowLoadStatus()).toBe(false);
		});

		it('should be false for a retest of an annual test without a qualifying defect', () => {
			setTestType({ testTypeId: '53' });
			setTestHistory({ testTypeId: '94', testResult: TestResults.FAIL, defects: [{ imNumber: 1 }] });
			expect(component.shouldShowLoadStatus()).toBe(false);
		});

		it('should be true for a retest of an annual test failed on a qualifying defect', () => {
			setTestType({ testTypeId: '53' });
			setTestHistory({ testTypeId: '94', testResult: TestResults.FAIL, defects: [{ imNumber: 59 }] });
			expect(component.shouldShowLoadStatus()).toBe(true);
		});
	});

	describe('isLoadStatusRequired', () => {
		it('should be required when creating a test that captures load status', () => {
			store.overrideSelector(toEditOrNotToEdit, { testTypes: [{ testTypeId: '94' }] } as TestResultSchema);
			store.refreshState();

			const control = component.form.controls.testTypes.at(0).controls.loadStatus.controls.vehicleLoadStatus;
			control.setValue(null);
			control.markAsTouched();

			expect(component.isLoadStatusRequired()).toBe(true);
			expect(control.valid).toBe(false);
			expect(control.errors).toHaveProperty('required');
		});

		it('should not be required when the test does not capture load status', () => {
			store.overrideSelector(toEditOrNotToEdit, { testTypes: [{ testTypeId: '1' }] } as TestResultSchema);
			store.refreshState();

			expect(component.isLoadStatusRequired()).toBe(false);
		});
	});
});

describe('TestComponent - AMEND mode', () => {
	let fixture: ComponentFixture<TestComponent>;
	let component: TestComponent;
	let formGroupDirective: FormGroupDirective;
	let store: MockStore;

	beforeEach(async () => {
		formGroupDirective = new FormGroupDirective([], []);
		formGroupDirective.form = new FormGroup({});

		await TestBed.configureTestingModule({
			imports: [TestComponent],
			providers: [
				{ provide: ControlContainer, useValue: formGroupDirective },
				{ provide: MultiOptionsService, useValue: { getOptions: jest.fn(), loadOptions: jest.fn() } },
				provideMockStore({ initialState: initialAppState }),
			],
		}).compileComponents();

		store = TestBed.inject(MockStore);
		fixture = TestBed.createComponent(TestComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('mode', Modes.AMEND);
		fixture.componentRef.setInput('initialMode', Modes.AMEND);
	});

	afterEach(() => {
		store.resetSelectors();
	});

	describe('load status', () => {
		beforeEach(() => {
			store.overrideSelector(toEditOrNotToEdit, {
				vehicleType: 'hgv',
				testTypes: [{ testTypeId: '53', testTypeStartTimestamp: '2026-09-28T10:00:00.000Z' }],
			} as TestResultSchema);
			store.overrideSelector(selectAllTestResults, [
				{
					testStatus: TestStatus.SUBMITTED,
					testTypes: [
						{
							testTypeId: '94',
							testResult: TestResults.FAIL,
							testTypeStartTimestamp: '2026-09-23T09:00:00.000Z',
							defects: [{ imNumber: 59 }],
						},
					],
				} as TestResultSchema,
			]);
			store.refreshState();
			fixture.detectChanges();
		});

		it('should be displayed when the annual test being retested failed on a qualifying defect', () => {
			expect(component.shouldShowLoadStatus()).toBe(true);
		});

		it('should not be mandatory, so an amendment can be saved with it left blank', () => {
			const control = component.form.controls.testTypes.at(0).controls.loadStatus.controls.vehicleLoadStatus;
			control.setValue(null);
			control.markAsTouched();

			expect(component.isLoadStatusRequired()).toBe(false);
			expect(control.valid).toBe(true);
		});
	});

	describe('initTimeDisplayControls', () => {
		it('should format start and end times in local time without Z suffix', () => {
			const testTypeGroup = component.form.controls.testTypes.at(0);
			testTypeGroup.controls.testTypeStartTimestamp.setValue('2024-06-15T14:30:00.000Z');
			testTypeGroup.controls.testTypeEndTimestamp.setValue('2024-06-15T15:45:00.000Z');

			fixture.detectChanges();

			const startValue = component.startTimeDisplay.value;
			const endValue = component.endTimeDisplay.value;

			expect(startValue).not.toContain('Z');
			expect(endValue).not.toContain('Z');

			const expectedStart = new Date('2024-06-15T14:30:00.000Z');
			const expectedStartStr = `${expectedStart.getFullYear()}-${(expectedStart.getMonth() + 1).toString().padStart(2, '0')}-${expectedStart.getDate().toString().padStart(2, '0')}T${expectedStart.getHours().toString().padStart(2, '0')}:${expectedStart.getMinutes().toString().padStart(2, '0')}:${expectedStart.getSeconds().toString().padStart(2, '0')}.${expectedStart.getMilliseconds().toString().padStart(3, '0')}`;
			expect(startValue).toBe(expectedStartStr);

			const expectedEnd = new Date('2024-06-15T15:45:00.000Z');
			const expectedEndStr = `${expectedEnd.getFullYear()}-${(expectedEnd.getMonth() + 1).toString().padStart(2, '0')}-${expectedEnd.getDate().toString().padStart(2, '0')}T${expectedEnd.getHours().toString().padStart(2, '0')}:${expectedEnd.getMinutes().toString().padStart(2, '0')}:${expectedEnd.getSeconds().toString().padStart(2, '0')}.${expectedEnd.getMilliseconds().toString().padStart(3, '0')}`;
			expect(endValue).toBe(expectedEndStr);
		});

		it('should set empty string when timestamp is null', () => {
			const testTypeGroup = component.form.controls.testTypes.at(0);
			testTypeGroup.controls.testTypeStartTimestamp.setValue(null);
			testTypeGroup.controls.testTypeEndTimestamp.setValue(null);

			fixture.detectChanges();

			expect(component.startTimeDisplay.value).toBe('');
			expect(component.endTimeDisplay.value).toBe('');
		});
	});
});
