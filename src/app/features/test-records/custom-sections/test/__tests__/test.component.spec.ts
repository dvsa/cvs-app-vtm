import { GlobalErrorService } from '@/src/app/core/components/global-error/global-error.service';
import { Modes } from '@/src/app/models/modes.enum';
import { V3TechRecordModel } from '@/src/app/models/vehicle-tech-record.model';
import { MultiOptionsService } from '@/src/app/services/multi-options/multi-options.service';
import { initialAppState } from '@/src/app/store';
import { techRecord } from '@/src/app/store/technical-records';
import { toEditOrNotToEdit } from '@/src/app/store/test-records';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlContainer, FormArray, FormControl, FormGroup, FormGroupDirective } from '@angular/forms';
import { disabled } from '@angular/forms/signals';
import { SignalFormControl } from '@angular/forms/signals/compat';
import { RouterTestingModule } from '@angular/router/testing';
import { TestResults } from '@dvsa/cvs-type-definitions/types/v1/enums/testResult.enum.js';
import { TestStatus } from '@dvsa/cvs-type-definitions/types/v1/enums/testStatus.enum.js';
import { TestResultSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { DeficiencyCategoryEnum } from '@models/test-results/test-result-defect.model';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { selectAllTestResults } from '@store/test-records';
import { EMPTY } from 'rxjs';

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
			imports: [TestComponent, RouterTestingModule],
			providers: [
				{ provide: ControlContainer, useValue: formGroupDirective },
				{ provide: MultiOptionsService, useValue: { getOptions: vi.fn(), loadOptions: vi.fn() } },
				provideMockStore({ initialState: initialAppState }),
				provideMockActions(() => EMPTY),
			],
		}).compileComponents();

		store = TestBed.inject(MockStore);
		fixture = TestBed.createComponent(TestComponent);
		component = fixture.componentInstance;
		component.testService.mode.set(Modes.EDIT);
		component.testService.initialMode.set(Modes.EDIT);
		fixture.detectChanges();
	});

	afterEach(() => {
		store.resetSelectors();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('enables reactive controls without enabling the signal control imperatively', () => {
		const rootControl = component.form.controls.systemNumber;
		const nestedControl = component.form.controls.testTypes.at(0).controls.loadStatus.controls.otherUnladenBodyType;
		rootControl.disable();
		nestedControl.disable();
		const signalControl = component.testService.reasonForCreation;
		const enable = vi.spyOn(signalControl, 'enable');

		component.disableFields();

		expect(rootControl.enabled).toBe(true);
		expect(nestedControl.enabled).toBe(true);
		expect(signalControl.enabled).toBe(true);
		expect(enable).not.toHaveBeenCalled();
	});

	it('skips all signal controls, including those nested in groups and arrays', () => {
		const topLevelSignal = TestBed.runInInjectionContext(() => new SignalFormControl('value'));
		const nestedSignal = TestBed.runInInjectionContext(
			() => new SignalFormControl('value', (path) => disabled(path, { when: () => true }))
		);
		const reactiveControl = new FormControl({ value: 'value', disabled: true });
		const nestedGroup = new FormGroup({ signal: nestedSignal, reactive: reactiveControl });
		const group = new FormGroup({ nested: new FormArray([nestedGroup]) });
		const form: FormGroup = component.form;
		form.addControl('additionalSignal', topLevelSignal);
		form.addControl('additionalGroup', group);
		const enableTopLevel = vi.spyOn(topLevelSignal, 'enable');
		const enableNested = vi.spyOn(nestedSignal, 'enable');

		component.disableFields();

		expect(enableTopLevel).not.toHaveBeenCalled();
		expect(enableNested).not.toHaveBeenCalled();
		expect(topLevelSignal.enabled).toBe(true);
		expect(nestedSignal.disabled).toBe(true);
		expect(reactiveControl.enabled).toBe(true);
		expect(nestedGroup.enabled).toBe(true);
		expect(group.enabled).toBe(true);
	});

	it('keeps amendment-only fields disabled after enabling the other controls', () => {
		component.testService.initialMode.set(Modes.AMEND);
		component.disableFields();

		const controls = component.form.controls.testTypes.at(0).controls;
		expect(controls.createdAt.disabled).toBe(true);
		expect(controls.testCode.disabled).toBe(true);
		expect(controls.testTypeName.disabled).toBe(true);
		expect(controls.testNumber.disabled).toBe(true);
		expect(component.testService.reasonForCreation.enabled).toBe(true);
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
				component.testService.mode.set(Modes.EDIT);
				component.testService.initialMode.set(Modes.EDIT);
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
			component.testService.initialMode.set(initialMode);
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
				// Ensure the test result is a group7 PASS with no centralDocs.issueRequired so certificate number is shown
				store.overrideSelector(toEditOrNotToEdit, {
					testTypes: [{ testTypeId: '59', testResult: TestResults.PASS, centralDocs: { issueRequired: false } }],
				} as TestResultSchema);
				store.refreshState();

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
				component.testService.mode.set(Modes.AMEND);
				component.form.controls.testTypes.at(0).controls.testResult.setValue(TestResults.PASS);
				expiryControl.setValue(null);
				expiryControl.markAsTouched();
				expect(expiryControl.valid).toBe(false);
				expect(expiryControl.errors).toHaveProperty('required');
			});

			it('should not be required when amending a failed test', () => {
				component.testService.mode.set(Modes.AMEND);
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

		it.each([
			{ deficiencyCategory: DeficiencyCategoryEnum.Dangerous, expected: true },
			{ deficiencyCategory: DeficiencyCategoryEnum.Major, expected: true },
			{ deficiencyCategory: DeficiencyCategoryEnum.Minor, expected: false },
			{ deficiencyCategory: DeficiencyCategoryEnum.Advisory, expected: false },
		])('should return $expected for a $deficiencyCategory brake defect', ({ deficiencyCategory, expected }) => {
			setTestType({ testTypeId: '53' });
			setTestHistory({
				testTypeId: '94',
				testResult: TestResults.FAIL,
				defects: [{ imNumber: 59, deficiencyCategory }],
			});
			expect(component.shouldShowLoadStatus()).toBe(expected);
			expect(component.isLoadStatusRequired()).toBe(expected);

			const control = component.form.controls.testTypes.at(0).controls.loadStatus.controls.vehicleLoadStatus;
			control.updateValueAndValidity();
			expect(control.hasError('required')).toBe(expected);
		});
	});

	describe('visibility helpers (ADR / central docs)', () => {
		it('should return false when there is no test result', () => {
			store.overrideSelector(toEditOrNotToEdit, undefined);
			store.refreshState();
			expect(component.shouldShowResult()).toBe(false);
			expect(component.shouldShowGenerateADRCertificate()).toBe(false);
			expect(component.shouldShowProhibitionIssued()).toBe(false);
			expect(component.shouldShowCentralDocs()).toBe(false);
			expect(component.testService.certificateNumber.fieldTree().hidden()).toBe(true);
		});

		describe('certificate number signal control', () => {
			const setContext = (
				testTypeId: string,
				testResult: TestResults | null | undefined,
				issueRequired = false,
				vehicleType = 'hgv',
				customDefects?: TestResultSchema['testTypes'][0]['customDefects']
			) => {
				store.overrideSelector(toEditOrNotToEdit, {
					vehicleType,
					testTypes: [{ testTypeId, testResult, centralDocs: { issueRequired }, customDefects }],
				} as TestResultSchema);
				store.refreshState();
			};

			it.each([
				['1', TestResults.PASS, false, 'psv', Modes.EDIT, true, false],
				['59', TestResults.PASS, false, 'hgv', Modes.EDIT, false, true],
				['59', TestResults.PASS, true, 'hgv', Modes.EDIT, true, false],
				['59', TestResults.PRS, false, 'hgv', Modes.EDIT, true, false],
				['59', TestResults.FAIL, false, 'hgv', Modes.EDIT, true, false],
				['59', null, false, 'hgv', Modes.EDIT, true, false],
				['59', undefined, false, 'hgv', Modes.EDIT, true, false],
				['59', TestResults.PASS, false, 'hgv', Modes.ABANDON, false, false],
				['59', TestResults.PRS, false, 'hgv', Modes.AMEND, false, false],
				['59', TestResults.PRS, true, 'hgv', Modes.AMEND, true, false],
				['59', TestResults.ABANDONED, true, 'hgv', Modes.AMEND, false, false],
				['49', TestResults.PASS, false, 'hgv', Modes.EDIT, false, true],
				['49', TestResults.PRS, false, 'hgv', Modes.EDIT, true, false],
				['49', TestResults.PASS, false, 'hgv', Modes.AMEND, true, false],
				['126', TestResults.PASS, false, 'psv', Modes.EDIT, false, true],
				['126', TestResults.PRS, false, 'psv', Modes.EDIT, false, false],
				['126', TestResults.PRS, true, 'psv', Modes.EDIT, true, false],
				['186', TestResults.PASS, true, 'hgv', Modes.EDIT, false, true],
				['186', TestResults.PRS, true, 'trl', Modes.EDIT, false, true],
				['126', TestResults.FAIL, false, 'psv', Modes.AMEND, true, false],
				['126', TestResults.ABANDONED, false, 'psv', Modes.AMEND, false, false],
				['126', null, false, 'psv', Modes.EDIT, false, false],
				['39', TestResults.PRS, false, 'hgv', Modes.AMEND, false, true],
				['39', TestResults.PRS, true, 'hgv', Modes.AMEND, true, false],
				['39', TestResults.PASS, false, 'trl', Modes.EDIT, true, false],
				['153', TestResults.PRS, false, 'psv', Modes.AMEND, false, true],
				['417', undefined, false, 'psv', Modes.EDIT, false, true],
				['417', TestResults.PASS, false, 'hgv', Modes.EDIT, true, false],
				['407', TestResults.PASS, false, 'psv', Modes.EDIT, false, true],
				['407', TestResults.PASS, false, 'psv', Modes.AMEND, false, false],
				['409', TestResults.PASS, false, 'psv', Modes.EDIT, true, false],
				['409', TestResults.PASS, false, 'psv', Modes.AMEND, false, false],
			] as const)(
				'uses the existing visibility and required rules for %s / %s / central=%s / %s / %s',
				(type, result, central, vehicle, mode, isHidden, isRequired) => {
					component.testService.mode.set(mode);
					setContext(type, result, central, vehicle);
					const control = component.testService.certificateNumber;
					control.setValue(null);

					expect(control.fieldTree().hidden()).toBe(isHidden);
					expect(control.hasError('required')).toBe(isRequired);
					expect(control.invalid).toBe(isRequired);
				}
			);

			it.each([Modes.AMEND, Modes.SUMMARY])('requires alphanumeric ADR certificates in %s mode', (mode) => {
				component.testService.initialMode.set(Modes.AMEND);
				component.testService.mode.set(mode);
				setContext('59', TestResults.PRS);
				const control = component.testService.certificateNumber;
				control.setValue('ABC-123');
				expect(control.fieldTree().hidden()).toBe(false);
				expect(control.getError('pattern')).toEqual(
					expect.objectContaining({ message: 'Certificate number must be alphanumeric' })
				);
				control.setValue('ABC123');
				expect(control.errors).toBeNull();
				control.setValue(null);
				expect(control.errors).toBeNull();
			});

			it('keeps old IVA certificates optional on amendment', () => {
				component.testService.mode.set(Modes.AMEND);
				setContext('126', TestResults.PASS, true, 'psv', [
					{ referenceNumber: '1' } as NonNullable<TestResultSchema['testTypes'][0]['customDefects']>[number],
				]);
				const control = component.testService.certificateNumber;
				control.setValue(null);
				expect(control.fieldTree().hidden()).toBe(false);
				expect(control.errors).toBeNull();
				control.setValue('ABC-123');
				expect(control.hasError('pattern')).toBe(true);
			});

			it('uses the unconditional required message for LEC certificates', () => {
				setContext('39', TestResults.PASS);
				const control = component.testService.certificateNumber;
				control.setValue(null);
				expect(control.getError('required')).toEqual(
					expect.objectContaining({ message: 'Certificate number is required' })
				);
			});

			it('updates inline and global errors as the result and certificate number change', () => {
				setContext('59', TestResults.PASS);
				const control = component.testService.certificateNumber;
				control.setValue(null);
				control.markAsTouched();
				fixture.detectChanges();

				expect(fixture.nativeElement.querySelector('#certificateNumber-error')?.textContent).toContain(
					'Certificate number is required with Result'
				);
				expect(TestBed.inject(GlobalErrorService).extractGlobalErrors(component.form)).toContainEqual(
					expect.objectContaining({
						error: 'Certificate number is required with Result',
						anchorLink: 'certificateNumber',
					})
				);

				control.setValue('ABC-123');
				fixture.detectChanges();
				expect(fixture.nativeElement.querySelector('#certificateNumber-error')?.textContent).toContain(
					'Certificate number must be alphanumeric'
				);
				expect(TestBed.inject(GlobalErrorService).extractGlobalErrors(component.form)).toContainEqual(
					expect.objectContaining({ error: 'Certificate number must be alphanumeric', anchorLink: 'certificateNumber' })
				);

				setContext('59', TestResults.FAIL);
				fixture.detectChanges();
				expect(control.fieldTree().hidden()).toBe(true);
				expect(control.errors).toBeNull();
				expect(fixture.nativeElement.querySelector('#certificateNumber')).toBeNull();
				expect(TestBed.inject(GlobalErrorService).extractGlobalErrors(component.form)).not.toContainEqual(
					expect.objectContaining({ anchorLink: 'certificateNumber' })
				);

				setContext('59', TestResults.PASS);
				control.setValue('ABC123');
				fixture.detectChanges();
				expect(fixture.nativeElement.querySelector('#certificateNumber')).not.toBeNull();
				expect(control.errors).toBeNull();
			});

			it('still validates a supplied certificate for an abandoned specialist amendment', () => {
				component.testService.mode.set(Modes.AMEND);
				setContext('126', TestResults.ABANDONED, false, 'psv');
				const control = component.testService.certificateNumber;
				control.setValue('ABC-123');
				fixture.detectChanges();

				expect(fixture.nativeElement.querySelectorAll('#certificateNumber')).toHaveLength(1);
				expect(control.hasError('pattern')).toBe(true);
				control.setValue(null);
				expect(control.valid).toBe(true);
			});

			it('uses the signal visibility for specialist summary rows', () => {
				component.testService.mode.set(Modes.SUMMARY);
				setContext('126', TestResults.PASS, false, 'psv');
				fixture.detectChanges();
				expect(fixture.nativeElement.querySelectorAll('#test-certificateNumber')).toHaveLength(1);

				setContext('126', TestResults.FAIL, false, 'psv');
				fixture.detectChanges();
				expect(fixture.nativeElement.querySelector('#test-certificateNumber')).toBeNull();

				setContext('126', null, false, 'psv');
				fixture.detectChanges();
				expect(fixture.nativeElement.querySelector('#test-certificateNumber')).toBeNull();
			});

			it('updates the nested reactive group validity when signal rules change', () => {
				const control = component.testService.certificateNumber;
				const group = new FormGroup({ certificateNumber: control });
				const parent = new FormGroup({ group });
				setContext('59', TestResults.PASS);
				control.setValue(null);
				TestBed.tick();
				expect(group.invalid).toBe(true);
				expect(parent.invalid).toBe(true);
				const valueChanges = vi.fn();
				parent.valueChanges.subscribe(valueChanges);

				setContext('59', TestResults.FAIL);
				TestBed.tick();
				expect(control.errors).toBeNull();
				expect(group.valid).toBe(true);
				expect(parent.valid).toBe(true);
				expect(valueChanges).not.toHaveBeenCalled();
			});
		});

		it('should be true for group 7 test types', () => {
			store.overrideSelector(toEditOrNotToEdit, {
				testTypes: [{ testTypeId: '59', testResult: TestResults.PASS }],
			} as TestResultSchema);
			store.refreshState();

			expect(component.shouldShowResult()).toBe(true);
			expect(component.shouldShowGenerateADRCertificate()).toBe(true);
			expect(component.shouldShowProhibitionIssued()).toBe(true);
		});

		it('should include central docs ids and group7 for central docs check', () => {
			// central docs id from TEST_TYPES_GROUP9_10_CENTRAL_DOCS (e.g. '95')
			store.overrideSelector(toEditOrNotToEdit, { testTypes: [{ testTypeId: '95' }] } as TestResultSchema);
			store.refreshState();
			expect(component.shouldShowCentralDocs()).toBe(true);

			// also true for group7 id
			store.overrideSelector(toEditOrNotToEdit, { testTypes: [{ testTypeId: '59' }] } as TestResultSchema);
			store.refreshState();
			expect(component.shouldShowCentralDocs()).toBe(true);
		});

		it('hides the certificate for unrelated or failing tests', () => {
			// non-group7 -> false
			store.overrideSelector(toEditOrNotToEdit, {
				testTypes: [{ testTypeId: '1', testResult: TestResults.PASS }],
			} as TestResultSchema);
			store.refreshState();
			expect(component.testService.certificateNumber.fieldTree().hidden()).toBe(true);

			// group7 but failed -> false
			store.overrideSelector(toEditOrNotToEdit, {
				testTypes: [{ testTypeId: '59', testResult: TestResults.FAIL }],
			} as TestResultSchema);
			store.refreshState();
			expect(component.testService.certificateNumber.fieldTree().hidden()).toBe(true);
		});

		it('shows the certificate for a pass without central documents', () => {
			store.overrideSelector(toEditOrNotToEdit, {
				vehicleType: 'hgv',
				testTypes: [{ testTypeId: '59', testResult: TestResults.PASS, centralDocs: { issueRequired: false } }],
			} as TestResultSchema);
			store.refreshState();
			expect(component.testService.certificateNumber.fieldTree().hidden()).toBe(false);
		});

		it('hides the certificate for a pass with central documents', () => {
			store.overrideSelector(toEditOrNotToEdit, {
				vehicleType: 'hgv',
				testTypes: [{ testTypeId: '59', testResult: TestResults.PASS, centralDocs: { issueRequired: true } }],
			} as TestResultSchema);
			store.refreshState();
			expect(component.testService.certificateNumber.fieldTree().hidden()).toBe(true);
		});
	});

	describe('specialist group 1 (IVA/MSVA)', () => {
		const setTestResult = (testType: Partial<TestResultSchema['testTypes'][0]>, vehicleType = 'psv') => {
			store.overrideSelector(toEditOrNotToEdit, {
				vehicleType,
				testTypes: [{ testTypeId: '126', ...testType }],
			} as TestResultSchema);
			store.refreshState();
		};

		it('should show the result with pass, fail and PRS options when creating', () => {
			setTestResult({ testResult: TestResults.PASS });
			expect(component.isSpecialistGroup1()).toBe(true);
			expect(component.shouldShowResult()).toBe(true);
			expect(component.resultOptions().map((option) => option.value)).toEqual(['pass', 'fail', 'prs']);
		});

		it('should show the description, prohibition issued and hide the anniversary date', () => {
			setTestResult({ testResult: TestResults.PASS });
			expect(component.shouldShowCreateModeDescription()).toBe(true);
			expect(component.shouldShowProhibitionIssued()).toBe(true);
			expect(component.shouldShowAnniversaryDate()).toBe(false);
			expect(component.shouldShowExpiryDate()).toBe(false);
		});

		it.each([
			[TestResults.PASS, true],
			[TestResults.PRS, true],
			[TestResults.FAIL, false],
		])('should show issue documents centrally when the result is %s: %s', (testResult, expected) => {
			setTestResult({ testResult });
			expect(component.shouldShowCentralDocs()).toBe(expected);
		});

		it('should only show the reapplication date when the test has failed', () => {
			setTestResult({ testResult: TestResults.FAIL });
			expect(component.shouldShowReapplicationDate()).toBe(true);

			setTestResult({ testResult: TestResults.PASS });
			expect(component.shouldShowReapplicationDate()).toBe(false);
		});

		describe('certificate number visibility', () => {
			it('should be hidden when the test has failed', () => {
				setTestResult({ testResult: TestResults.FAIL });
				expect(component.testService.certificateNumber.fieldTree().hidden()).toBe(true);
			});

			it.each([TestResults.PASS, TestResults.PRS])('should be shown when the result is %s', (testResult) => {
				setTestResult({ testResult, centralDocs: { issueRequired: false } });
				expect(component.testService.certificateNumber.fieldTree().hidden()).toBe(false);
			});

			it('should be hidden when issuing documents centrally', () => {
				setTestResult({ testResult: TestResults.PASS, centralDocs: { issueRequired: true } });
				expect(component.testService.certificateNumber.fieldTree().hidden()).toBe(true);
			});

			it.each(['hgv', 'trl'])('should be shown for a %s when issuing documents centrally', (vehicleType) => {
				setTestResult(
					{ testTypeId: '186', testResult: TestResults.PASS, centralDocs: { issueRequired: true } },
					vehicleType
				);
				expect(component.testService.certificateNumber.fieldTree().hidden()).toBe(false);
			});
		});

		describe('testResult', () => {
			const requiredStandard = { rsNumber: 1, prs: false } as never;

			it.each([
				[TestResults.PASS, [requiredStandard], 'Cannot pass test when required standards are present'],
				[TestResults.FAIL, [], 'Cannot fail test when no required standards are present'],
				[TestResults.PRS, [], 'Cannot mark test as PRS when no required standards are present'],
			])(
				'should be invalid when the result is %s and the required standards are %j',
				(testResult, requiredStandards, error) => {
					setTestResult({ testResult });
					const testTypeGroup = component.form.controls.testTypes.at(0);
					testTypeGroup.controls.requiredStandards.setValue(requiredStandards);
					testTypeGroup.controls.testResult.setValue(testResult);

					expect(testTypeGroup.controls.testResult.errors).toEqual({ invalidTestResult: { error } });
				}
			);

			it.each([
				[TestResults.PASS, []],
				[TestResults.FAIL, [requiredStandard]],
				[TestResults.PRS, [requiredStandard]],
			])('should be valid when the result is %s and the required standards are %j', (testResult, requiredStandards) => {
				setTestResult({ testResult });
				const testTypeGroup = component.form.controls.testTypes.at(0);
				testTypeGroup.controls.requiredStandards.setValue(requiredStandards);
				testTypeGroup.controls.testResult.setValue(testResult);

				expect(testTypeGroup.controls.testResult.valid).toBe(true);
			});
		});

		describe('reapplicationDate', () => {
			it('should be required when the test has failed', () => {
				setTestResult({ testResult: TestResults.FAIL });
				const control = component.form.controls.testTypes.at(0).controls.reapplicationDate;
				control.setValue(null);
				expect(control.errors).toHaveProperty('required');
			});

			it('should be invalid when not in the future', () => {
				setTestResult({ testResult: TestResults.FAIL });
				const control = component.form.controls.testTypes.at(0).controls.reapplicationDate;
				control.setValue('2024-01-15');
				expect(control.errors).toHaveProperty('futureDate');
			});

			it('should not be required when the test has passed', () => {
				setTestResult({ testResult: TestResults.PASS });
				const control = component.form.controls.testTypes.at(0).controls.reapplicationDate;
				control.setValue(null);
				expect(control.valid).toBe(true);
			});
		});

		it('should require prohibition issued', () => {
			setTestResult({ testResult: TestResults.PASS });
			const control = component.form.controls.testTypes.at(0).controls.prohibitionIssued;
			control.setValue(null);
			expect(control.errors).toHaveProperty('required');
		});

		it('should not require an expiry or anniversary date when amending a passed test', () => {
			setTestResult({ testResult: TestResults.PASS });
			component.testService.mode.set(Modes.AMEND);
			const testTypeGroup = component.form.controls.testTypes.at(0);
			testTypeGroup.controls.testResult.setValue(TestResults.PASS);
			testTypeGroup.controls.testExpiryDate.setValue(undefined);
			testTypeGroup.controls.testAnniversaryDate.setValue(null);

			expect(testTypeGroup.controls.testExpiryDate.valid).toBe(true);
			expect(testTypeGroup.controls.testAnniversaryDate.valid).toBe(true);
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
			imports: [TestComponent, RouterTestingModule],
			providers: [
				{ provide: ControlContainer, useValue: formGroupDirective },
				{ provide: MultiOptionsService, useValue: { getOptions: vi.fn(), loadOptions: vi.fn() } },
				provideMockStore({ initialState: initialAppState }),
			],
		}).compileComponents();

		store = TestBed.inject(MockStore);
		fixture = TestBed.createComponent(TestComponent);
		component = fixture.componentInstance;
		component.testService.mode.set(Modes.AMEND);
		component.testService.initialMode.set(Modes.AMEND);
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
							defects: [{ imNumber: 59, deficiencyCategory: DeficiencyCategoryEnum.Major }],
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
});
