import { GlobalErrorService } from '@/src/app/core/components/global-error/global-error.service';
import { Modes } from '@/src/app/models/modes.enum';
import { V3TechRecordModel } from '@/src/app/models/vehicle-tech-record.model';
import { MultiOptionsService } from '@/src/app/services/multi-options/multi-options.service';
import { initialAppState } from '@/src/app/store';
import { techRecord } from '@/src/app/store/technical-records';
import { toEditOrNotToEdit } from '@/src/app/store/test-records';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReasonForNotLoading } from '@dvsa/cvs-type-definitions/types/v1/enums/reasonForNotLoading.enum.js';
import { TestResults } from '@dvsa/cvs-type-definitions/types/v1/enums/testResult.enum.js';
import { TestStatus } from '@dvsa/cvs-type-definitions/types/v1/enums/testStatus.enum.js';
import { UnladenBodyType } from '@dvsa/cvs-type-definitions/types/v1/enums/unladenBodyType.enum.js';
import { VehicleLoadStatusType } from '@dvsa/cvs-type-definitions/types/v1/enums/vehicleLoadStatus.enum.js';
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

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [TestComponent, RouterTestingModule],
			providers: [
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

	it('disables amendment-only fields while leaving editable fields enabled', () => {
		component.testService.initialMode.set(Modes.AMEND);

		const controls = component.testService.testType;
		expect(controls.createdAt().disabled()).toBe(true);
		expect(controls.testCode().disabled()).toBe(true);
		expect(controls.testTypeName().disabled()).toBe(true);
		expect(controls.testNumber().disabled()).toBe(true);
		expect(!component.testService.form.reasonForCreation().disabled()).toBe(true);
	});

	it('updates load status dependencies and visibility without revalidating sibling controls', () => {
		store.overrideSelector(toEditOrNotToEdit, {
			vehicleType: 'hgv',
			testTypes: [{ testTypeId: '94' }],
		} as TestResultSchema);
		store.refreshState();
		const service = component.testService;
		service.testType.loadStatus.vehicleLoadStatus().value.set(VehicleLoadStatusType.UNLADEN);
		service.testType.loadStatus.unladenBodyType().value.set(UnladenBodyType.OTHER);
		service.testType.loadStatus.reasonForNotLoading().value.set(ReasonForNotLoading.OTHER);
		expect(service.testType.loadStatus.unladenBodyType().valid()).toBe(true);
		expect(service.testType.loadStatus.otherUnladenBodyType().hidden()).toBe(false);
		expect(
			service.testType.loadStatus
				.otherUnladenBodyType()
				.errors()
				.map((error) => error.kind)
		).toContain('required');
		expect(
			service.testType.loadStatus
				.otherReasonForNotLoading()
				.errors()
				.map((error) => error.kind)
		).toContain('required');

		service.testType.loadStatus.otherUnladenBodyType().value.set('a'.repeat(201));
		expect(
			service.testType.loadStatus
				.otherUnladenBodyType()
				.errors()
				.map((error) => error.kind)
		).toContain('maxLength');
		service.testType.loadStatus.vehicleLoadStatus().value.set(VehicleLoadStatusType.PARTIALLY_LADEN);
		expect(service.testType.loadStatus.otherUnladenBodyType().hidden()).toBe(true);
		expect(service.testType.loadStatus.otherUnladenBodyType().errors()).toEqual([]);
		expect(service.testType.loadStatus.otherReasonForNotLoading().hidden()).toBe(true);
		expect(
			service.testType.loadStatus
				.partiallyLadenReason()
				.errors()
				.map((error) => error.kind)
		).toContain('required');
		service.testType.loadStatus.partiallyLadenReason().value.set('a'.repeat(200));
		expect(service.testType.loadStatus.partiallyLadenReason().valid()).toBe(true);
		expect(service.value().testTypes[0].loadStatus.otherUnladenBodyType).toBe('a'.repeat(201));
	});

	it('shows signal-controlled test fields and updates them when the test result changes', () => {
		const setContext = (testTypeId: string, testResult: TestResults) => {
			store.overrideSelector(toEditOrNotToEdit, {
				vehicleType: 'psv',
				testTypes: [{ testTypeId, testResult }],
			} as TestResultSchema);
			store.refreshState();
			fixture.detectChanges();
		};
		const hasField = (name: string) => !!fixture.nativeElement.querySelector(`#${name}`);

		setContext('126', TestResults.PASS);
		expect(hasField('testResult')).toBe(true);
		expect(hasField('issueRequired')).toBe(true);
		expect(hasField('prohibitionIssued')).toBe(true);
		expect(hasField('reapplicationDate')).toBe(false);

		setContext('126', TestResults.FAIL);
		expect(hasField('issueRequired')).toBe(false);
		expect(hasField('reapplicationDate')).toBe(true);
		expect(
			component.testService.testType
				.reapplicationDate()
				.errors()
				.map((error) => error.kind)
		).toContain('required');

		setContext('1', TestResults.PASS);
		expect(hasField('testResult')).toBe(false);
		expect(hasField('prohibitionIssued')).toBe(false);
		expect(hasField('reapplicationDate')).toBe(false);
		expect(component.testService.testType.reapplicationDate().errors()).toEqual([]);
	});

	it('preserves different date visibility in amendment and review', () => {
		store.overrideSelector(toEditOrNotToEdit, {
			vehicleType: 'hgv',
			testTypes: [{ testTypeId: '117', testResult: TestResults.PASS }],
		} as TestResultSchema);
		store.refreshState();
		component.testService.initialMode.set(Modes.AMEND);
		component.testService.mode.set(Modes.AMEND);
		expect(component.testService.testType.testExpiryDate().hidden()).toBe(true);
		expect(component.testService.testType.testAnniversaryDate().hidden()).toBe(true);

		component.testService.mode.set(Modes.SUMMARY);
		expect(component.testService.testType.testExpiryDate().hidden()).toBe(false);
		expect(component.testService.testType.testAnniversaryDate().hidden()).toBe(false);
	});

	it.each([TestResults.PASS, TestResults.FAIL])('renders one expiry date when amending an ADR %s result', (outcome) => {
		store.overrideSelector(toEditOrNotToEdit, {
			vehicleType: 'hgv',
			testTypes: [{ testTypeId: '59', testResult: outcome }],
		} as TestResultSchema);
		store.refreshState();
		component.testService.initialMode.set(Modes.AMEND);
		component.testService.mode.set(Modes.AMEND);
		fixture.detectChanges();

		expect(component.testService.testType.testExpiryDate().hidden()).toBe(false);
		expect(fixture.nativeElement.querySelectorAll('#testExpiryDate')).toHaveLength(1);
	});

	it.each([
		['59', TestResults.FAIL, Modes.SUMMARY, true],
		['49', TestResults.PASS, Modes.SUMMARY, true],
		['49', TestResults.FAIL, Modes.SUMMARY, false],
		['126', TestResults.PASS, Modes.SUMMARY, true],
		['1', TestResults.PASS, Modes.SUMMARY, false],
		['59', TestResults.PASS, Modes.VIEW, false],
	] as const)(
		'uses certificate visibility for test %s with result %s in %s',
		(testTypeId, testResult, mode, visible) => {
			store.overrideSelector(toEditOrNotToEdit, {
				vehicleType: 'psv',
				testTypes: [{ testTypeId, testResult, certificateNumber: '123', centralDocs: { issueRequired: false } }],
			} as TestResultSchema);
			store.refreshState();
			component.testService.mode.set(mode);
			fixture.detectChanges();

			expect(component.testService.testType.certificateNumber().hidden()).toBe(!visible);
			expect(!!fixture.nativeElement.querySelector('#test-certificateNumber')).toBe(visible);
		}
	);

	it('clears nested load-status errors when the section is no longer applicable', () => {
		store.overrideSelector(toEditOrNotToEdit, {
			vehicleType: 'hgv',
			testTypes: [{ testTypeId: '94' }],
		} as TestResultSchema);
		store.refreshState();
		const service = component.testService;
		service.testType.loadStatus.vehicleLoadStatus().value.set(VehicleLoadStatusType.UNLADEN);
		expect(
			service.testType.loadStatus
				.unladenBodyType()
				.errors()
				.map((error) => error.kind)
		).toContain('required');

		store.overrideSelector(toEditOrNotToEdit, {
			vehicleType: 'psv',
			testTypes: [{ testTypeId: '1' }],
		} as TestResultSchema);
		store.refreshState();
		expect(service.testType.loadStatus.vehicleLoadStatus().hidden()).toBe(true);
		expect(service.testType.loadStatus.unladenBodyType().hidden()).toBe(true);
		expect(service.testType.loadStatus.unladenBodyType().errors()).toEqual([]);
		expect(service.value().testTypes[0].loadStatus.vehicleLoadStatus).toBe(VehicleLoadStatusType.UNLADEN);
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
				const control = component.form.vtg15.vtg15Required;
				control().value.set(null);

				fixture.detectChanges();

				expect(control().value()).toBe(expected);
			}
		);

		it.each([true, false])('should preserve an existing VTG15 required value of %s', (value) => {
			store.overrideSelector(techRecord, {
				techRecord_vehicleType: 'hgv',
				techRecord_adrDetails_dangerousGoods: false,
			} as V3TechRecordModel);
			store.refreshState();
			const control = component.form.vtg15.vtg15Required;
			control().value.set(value);

			component.prepopulateVTG15Required();

			expect(control().value()).toBe(value);
		});

		it.each([Modes.AMEND, Modes.VIEW])('should not default VTG15 required in initial mode %s', (initialMode) => {
			component.testService.initialMode.set(initialMode);
			store.overrideSelector(techRecord, {
				techRecord_vehicleType: 'hgv',
				techRecord_adrDetails_dangerousGoods: false,
			} as V3TechRecordModel);
			store.refreshState();
			const control = component.form.vtg15.vtg15Required;
			control().value.set(null);

			component.prepopulateVTG15Required();

			expect(control().value()).toBeNull();
		});

		it('should not default VTG15 required for a vehicle without ADR details', () => {
			store.overrideSelector(techRecord, { techRecord_vehicleType: 'psv' } as V3TechRecordModel);
			store.refreshState();
			const control = component.form.vtg15.vtg15Required;
			control().value.set(null);

			component.prepopulateVTG15Required();

			expect(control().value()).toBeNull();
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

				const control = component.form.contingencyTestNumber;
				control().value.set(null);
				control().markAsTouched();
				expect(control().valid()).toBe(false);
				expect(
					control()
						.errors()
						.map((error) => error.kind)
				).toContain('required');
			});

			it('should be invalid when less than 6 characters', () => {
				const control = component.form.contingencyTestNumber;
				control().value.set('12345');
				control().markAsTouched();
				expect(control().valid()).toBe(false);
				expect(
					control()
						.errors()
						.map((error) => error.kind)
				).toContain('minLength');
			});

			it('should be invalid when more than 8 characters', () => {
				const control = component.form.contingencyTestNumber;
				control().value.set('123456789');
				control().markAsTouched();
				expect(control().valid()).toBe(false);
				expect(
					control()
						.errors()
						.map((error) => error.kind)
				).toContain('maxLength');
			});

			it('should be valid when between 6 and 8 characters', () => {
				const control = component.form.contingencyTestNumber;
				control().value.set('123456');
				control().markAsTouched();
				expect(control().valid()).toBe(true);
			});
		});

		describe('testTypeStartTimestamp', () => {
			let control: typeof component.testService.testType.testTypeStartTimestamp;

			beforeEach(() => {
				control = component.testService.testType.testTypeStartTimestamp;
			});

			it('should be invalid when empty', () => {
				control().value.set(null);
				control().markAsTouched();
				expect(control().valid()).toBe(false);
				expect(
					control()
						.errors()
						.map((error) => error.kind)
				).toContain('required');
			});

			it('should be invalid when date is in the future', () => {
				const futureDate = new Date(Date.now() + 86400000).toISOString();
				control().value.set(futureDate);
				control().markAsTouched();
				expect(control().valid()).toBe(false);
				expect(
					control()
						.errors()
						.map((error) => error.kind)
				).toContain('pastDate');
			});

			it('should be valid when date is in the past', () => {
				const pastDate = '2024-01-15T10:30:00';
				control().value.set(pastDate);
				control().markAsTouched();
				expect(control().valid()).toBe(true);
			});
		});

		describe('testExpiryDate', () => {
			let startControl: typeof component.testService.testType.testTypeStartTimestamp;
			let expiryControl: typeof component.testService.testType.testExpiryDate;

			beforeEach(() => {
				component.testService.mode.set(Modes.AMEND);
				const testTypeGroup = component.testService.testType;
				startControl = testTypeGroup.testTypeStartTimestamp;
				expiryControl = testTypeGroup.testExpiryDate;
			});

			it('should be invalid when expiry date is before start date', () => {
				startControl().value.set('2024-01-15T14:00:00');
				expiryControl().value.set('2024-01-14');
				expiryControl().markAsTouched();
				expect(expiryControl().valid()).toBe(false);
				expect(
					expiryControl()
						.errors()
						.map((error) => error.kind)
				).toContain('aheadOfDate');
			});

			it('should be invalid when expiry date is the same day as start date', () => {
				startControl().value.set('2024-01-15T14:00:00');
				expiryControl().value.set('2024-01-15');
				expiryControl().markAsTouched();
				expect(expiryControl().valid()).toBe(false);
				expect(
					expiryControl()
						.errors()
						.map((error) => error.kind)
				).toContain('aheadOfDate');
			});

			it('should be valid when expiry date is after start date', () => {
				startControl().value.set('2024-01-15T14:00:00');
				expiryControl().value.set('2024-01-16');
				expiryControl().markAsTouched();
				expect(expiryControl().valid()).toBe(true);
			});

			it('revalidates when the start date changes', () => {
				startControl().value.set('2024-01-15T14:00:00');
				expiryControl().value.set('2024-01-16');
				expect(expiryControl().valid()).toBe(true);

				startControl().value.set('2024-01-17T14:00:00');
				expect(
					expiryControl()
						.errors()
						.map((error) => error.kind)
				).toContain('aheadOfDate');
			});

			it('should be required when amending a passed test', () => {
				component.testService.mode.set(Modes.AMEND);
				component.testService.testType.testResult().value.set(TestResults.PASS);
				expiryControl().value.set(null);
				expiryControl().markAsTouched();
				expect(expiryControl().valid()).toBe(false);
				expect(
					expiryControl()
						.errors()
						.map((error) => error.kind)
				).toContain('required');
			});

			it('should not be required when amending a failed test', () => {
				component.testService.mode.set(Modes.AMEND);
				component.testService.testType.testResult().value.set(TestResults.FAIL);
				expiryControl().value.set(null);
				expiryControl().markAsTouched();
				expect(expiryControl().valid()).toBe(true);
			});
		});

		describe('testAnniversaryDate', () => {
			let startControl: typeof component.testService.testType.testTypeStartTimestamp;
			let anniversaryControl: typeof component.testService.testType.testAnniversaryDate;

			beforeEach(() => {
				component.testService.mode.set(Modes.AMEND);
				const testTypeGroup = component.testService.testType;
				startControl = testTypeGroup.testTypeStartTimestamp;
				anniversaryControl = testTypeGroup.testAnniversaryDate;
			});

			it('should be invalid when anniversary date is before start date', () => {
				startControl().value.set('2024-01-15T14:00:00');
				anniversaryControl().value.set('2024-01-14');
				anniversaryControl().markAsTouched();
				expect(anniversaryControl().valid()).toBe(false);
				expect(
					anniversaryControl()
						.errors()
						.map((error) => error.kind)
				).toContain('aheadOfDate');
			});

			it('should be invalid when anniversary date is the same day as start date', () => {
				startControl().value.set('2024-01-15T14:00:00');
				anniversaryControl().value.set('2024-01-15');
				anniversaryControl().markAsTouched();
				expect(anniversaryControl().valid()).toBe(false);
				expect(
					anniversaryControl()
						.errors()
						.map((error) => error.kind)
				).toContain('aheadOfDate');
			});

			it('should be valid when anniversary date is after start date', () => {
				startControl().value.set('2024-01-15T14:00:00');
				anniversaryControl().value.set('2024-01-16');
				anniversaryControl().markAsTouched();
				expect(anniversaryControl().valid()).toBe(true);
			});

			it('revalidates when the start date changes', () => {
				startControl().value.set('2024-01-15T14:00:00');
				anniversaryControl().value.set('2024-01-16');
				expect(anniversaryControl().valid()).toBe(true);

				startControl().value.set('2024-01-17T14:00:00');
				expect(
					anniversaryControl()
						.errors()
						.map((error) => error.kind)
				).toContain('aheadOfDate');
			});
		});

		describe('testTypeEndTimestamp', () => {
			let startControl: typeof component.testService.testType.testTypeStartTimestamp;
			let endControl: typeof component.testService.testType.testTypeEndTimestamp;

			beforeEach(() => {
				const testTypeGroup = component.testService.testType;
				startControl = testTypeGroup.testTypeStartTimestamp;
				endControl = testTypeGroup.testTypeEndTimestamp;
			});

			it('should be invalid when empty', () => {
				endControl().value.set(null);
				endControl().markAsTouched();
				expect(endControl().valid()).toBe(false);
				expect(
					endControl()
						.errors()
						.map((error) => error.kind)
				).toContain('required');
			});

			it('should be invalid when date is in the future', () => {
				const futureDate = new Date(Date.now() + 86400000).toISOString();
				endControl().value.set(futureDate);
				endControl().markAsTouched();
				expect(endControl().valid()).toBe(false);
				expect(
					endControl()
						.errors()
						.map((error) => error.kind)
				).toContain('pastDate');
			});

			it('should be invalid when end date is before start date', () => {
				startControl().value.set('2024-01-15T14:00:00');
				endControl().value.set('2024-01-15T10:00:00');
				endControl().markAsTouched();
				expect(endControl().valid()).toBe(false);
				expect(
					endControl()
						.errors()
						.map((error) => error.kind)
				).toContain('aheadOfDate');
			});

			it('should be valid when end date is after start date and in the past', () => {
				startControl().value.set('2024-01-15T10:00:00');
				endControl().value.set('2024-01-15T14:00:00');
				endControl().markAsTouched();
				expect(endControl().valid()).toBe(true);
			});

			it('rechecks the end time when only the start time changes', () => {
				endControl().value.set('2024-01-15T14:00:00');
				startControl().value.set('2024-01-15T15:00:00');
				expect(
					endControl()
						.errors()
						.some((error) => error.kind === 'aheadOfDate')
				).toBe(true);

				startControl().value.set('2024-01-15T14:00:00');
				expect(endControl().valid()).toBe(true);
			});

			it('keeps both levels of the test result in sync when timestamps change or clear', () => {
				const start = '2024-01-15T10:00:00.000Z';
				const end = '2024-01-15T14:00:00.000Z';
				startControl().value.set(start);
				endControl().value.set(end);
				TestBed.tick();

				expect(component.testService.value()).toMatchObject({
					testStartTimestamp: start,
					testEndTimestamp: end,
					testTypes: [expect.objectContaining({ testTypeStartTimestamp: start, testTypeEndTimestamp: end })],
				});

				endControl().value.set(null);
				TestBed.tick();
				expect(component.testService.value().testEndTimestamp).toBeUndefined();
			});

			it('clears previously populated root timestamps when the test type timestamps are cleared', () => {
				const start = '2024-01-15T10:00:00.000Z';
				const end = '2024-01-15T14:00:00.000Z';
				component.testService.patch({
					testStartTimestamp: start,
					testEndTimestamp: end,
					testTypes: [{ testTypeStartTimestamp: start, testTypeEndTimestamp: end }],
				});
				startControl().value.set(null);
				endControl().value.set(null);

				expect({
					start: component.testService.value().testStartTimestamp,
					end: component.testService.value().testEndTimestamp,
				}).toEqual({ start: undefined, end: undefined });
			});

			it('reactively unlocks the timestamps for IVA/MSVA amendments only', () => {
				component.testService.initialMode.set(Modes.AMEND);
				expect(startControl().disabled()).toBe(true);
				expect(endControl().disabled()).toBe(true);

				store.overrideSelector(toEditOrNotToEdit, { testTypes: [{ testTypeId: '186' }] } as TestResultSchema);
				store.refreshState();
				expect(!startControl().disabled()).toBe(true);
				expect(!endControl().disabled()).toBe(true);
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
			expect(!component.testService.testType.loadStatus.vehicleLoadStatus().hidden()).toBe(false);
		});

		it('should be true for an HGV/TRL annual test', () => {
			setTestType({ testTypeId: '94' });
			expect(!component.testService.testType.loadStatus.vehicleLoadStatus().hidden()).toBe(true);
		});

		// Group 1/2 are PSV tests, which have no load status in the dynamic form templates
		it.each(['1', '18', '15', '22'])('should be false for group 1/2 test type %s', (testTypeId) => {
			setTestType({ testTypeId });
			expect(!component.testService.testType.loadStatus.vehicleLoadStatus().hidden()).toBe(false);
		});

		it('should be false for a retest when the vehicle has no test history', () => {
			setTestType({ testTypeId: '53' });
			expect(!component.testService.testType.loadStatus.vehicleLoadStatus().hidden()).toBe(false);
		});

		it('should be false for a retest of an annual test that did not fail', () => {
			setTestType({ testTypeId: '53' });
			setTestHistory({ testTypeId: '94', testResult: TestResults.PASS, defects: [{ imNumber: 59 }] });
			expect(!component.testService.testType.loadStatus.vehicleLoadStatus().hidden()).toBe(false);
		});

		it('should be false for a retest of an annual test without a qualifying defect', () => {
			setTestType({ testTypeId: '53' });
			setTestHistory({ testTypeId: '94', testResult: TestResults.FAIL, defects: [{ imNumber: 1 }] });
			expect(!component.testService.testType.loadStatus.vehicleLoadStatus().hidden()).toBe(false);
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
			expect(!component.testService.testType.loadStatus.vehicleLoadStatus().hidden()).toBe(expected);
			expect(component.testService.loadStatusRequired()).toBe(expected);

			const control = component.testService.testType.loadStatus.vehicleLoadStatus;
			expect(
				control()
					.errors()
					.some((error) => error.kind === 'required')
			).toBe(expected);
		});
	});

	describe('visibility helpers (ADR / central docs)', () => {
		it('should return false when there is no test result', () => {
			store.overrideSelector(toEditOrNotToEdit, undefined);
			store.refreshState();
			expect(!component.testService.testType.testResult().hidden()).toBe(false);
			expect(component.shouldShowGenerateADRCertificate()).toBe(false);
			expect(!component.testService.testType.prohibitionIssued().hidden()).toBe(false);
			expect(!component.testService.testType.centralDocs.issueRequired().hidden()).toBe(false);
			expect(component.testService.testType.certificateNumber().hidden()).toBe(true);
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
					const control = component.testService.testType.certificateNumber;
					control().value.set(null);

					expect(control().hidden()).toBe(isHidden);
					expect(
						control()
							.errors()
							.some((error) => error.kind === 'required')
					).toBe(isRequired);
					expect(control().invalid()).toBe(isRequired);
				}
			);

			it.each([Modes.AMEND, Modes.SUMMARY])('requires alphanumeric ADR certificates in %s mode', (mode) => {
				component.testService.initialMode.set(Modes.AMEND);
				component.testService.mode.set(mode);
				setContext('59', TestResults.PRS);
				const control = component.testService.testType.certificateNumber;
				control().value.set('ABC-123');
				expect(control().hidden()).toBe(false);
				expect(
					control()
						.errors()
						.find((error) => error.kind === 'pattern')
				).toEqual(expect.objectContaining({ message: 'Certificate number must be alphanumeric' }));
				control().value.set('ABC123');
				expect(control().errors()).toEqual([]);
				control().value.set(null);
				expect(control().errors()).toEqual([]);
			});

			it('keeps old IVA certificates optional on amendment', () => {
				component.testService.mode.set(Modes.AMEND);
				setContext('126', TestResults.PASS, true, 'psv', [
					{ referenceNumber: '1' } as NonNullable<TestResultSchema['testTypes'][0]['customDefects']>[number],
				]);
				const control = component.testService.testType.certificateNumber;
				control().value.set(null);
				expect(control().hidden()).toBe(false);
				expect(control().errors()).toEqual([]);
				control().value.set('ABC-123');
				expect(
					control()
						.errors()
						.some((error) => error.kind === 'pattern')
				).toBe(true);
			});

			it('uses the unconditional required message for LEC certificates', () => {
				setContext('39', TestResults.PASS);
				const control = component.testService.testType.certificateNumber;
				control().value.set(null);
				expect(
					control()
						.errors()
						.find((error) => error.kind === 'required')
				).toEqual(expect.objectContaining({ message: 'Certificate number is required' }));
			});

			it('updates inline and global errors as the result and certificate number change', () => {
				setContext('59', TestResults.PASS);
				const control = component.testService.testType.certificateNumber;
				control().value.set(null);
				control().markAsTouched();
				fixture.detectChanges();

				expect(fixture.nativeElement.querySelector('#certificateNumber-error')?.textContent).toContain(
					'Certificate number is required with Result'
				);
				expect(
					TestBed.inject(GlobalErrorService).extractSignalFormErrors(
						component.form,
						component.testService.errorAnchor.bind(component.testService)
					)
				).toContainEqual(
					expect.objectContaining({
						error: 'Certificate number is required with Result',
						anchorLink: 'certificateNumber',
					})
				);

				control().value.set('ABC-123');
				fixture.detectChanges();
				expect(fixture.nativeElement.querySelector('#certificateNumber-error')?.textContent).toContain(
					'Certificate number must be alphanumeric'
				);
				expect(
					TestBed.inject(GlobalErrorService).extractSignalFormErrors(
						component.form,
						component.testService.errorAnchor.bind(component.testService)
					)
				).toContainEqual(
					expect.objectContaining({ error: 'Certificate number must be alphanumeric', anchorLink: 'certificateNumber' })
				);

				setContext('59', TestResults.FAIL);
				fixture.detectChanges();
				expect(control().hidden()).toBe(true);
				expect(control().errors()).toEqual([]);
				expect(fixture.nativeElement.querySelector('#certificateNumber')).toBeNull();
				expect(
					TestBed.inject(GlobalErrorService).extractSignalFormErrors(
						component.form,
						component.testService.errorAnchor.bind(component.testService)
					)
				).not.toContainEqual(expect.objectContaining({ anchorLink: 'certificateNumber' }));

				setContext('59', TestResults.PASS);
				control().value.set('ABC123');
				fixture.detectChanges();
				expect(fixture.nativeElement.querySelector('#certificateNumber')).not.toBeNull();
				expect(control().errors()).toEqual([]);
			});

			it('still validates a supplied certificate for an abandoned specialist amendment', () => {
				component.testService.mode.set(Modes.AMEND);
				setContext('126', TestResults.ABANDONED, false, 'psv');
				const control = component.testService.testType.certificateNumber;
				control().value.set('ABC-123');
				fixture.detectChanges();

				expect(fixture.nativeElement.querySelectorAll('#certificateNumber')).toHaveLength(1);
				expect(
					control()
						.errors()
						.some((error) => error.kind === 'pattern')
				).toBe(true);
				control().value.set(null);
				expect(control().valid()).toBe(true);
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

			it('updates the nested signal form error summary when visibility changes', () => {
				const control = component.testService.testType.certificateNumber;
				setContext('59', TestResults.PASS);
				control().value.set(null);
				expect(component.testService.testType().errorSummary()).toContainEqual(
					expect.objectContaining({ kind: 'required', message: 'Certificate number is required with Result' })
				);
				expect(component.testService.form().errorSummary()).toContainEqual(
					expect.objectContaining({ kind: 'required', message: 'Certificate number is required with Result' })
				);

				setContext('59', TestResults.FAIL);
				expect(control().errors()).toEqual([]);
				expect(component.testService.testType().errorSummary()).not.toContainEqual(
					expect.objectContaining({ message: 'Certificate number is required with Result' })
				);
				expect(component.testService.form().errorSummary()).not.toContainEqual(
					expect.objectContaining({ message: 'Certificate number is required with Result' })
				);
			});
		});

		it('should be true for group 7 test types', () => {
			store.overrideSelector(toEditOrNotToEdit, {
				testTypes: [{ testTypeId: '59', testResult: TestResults.PASS }],
			} as TestResultSchema);
			store.refreshState();

			expect(!component.testService.testType.testResult().hidden()).toBe(true);
			expect(component.shouldShowGenerateADRCertificate()).toBe(true);
			expect(!component.testService.testType.prohibitionIssued().hidden()).toBe(true);
		});

		it('should include central docs ids and group7 for central docs check', () => {
			// central docs id from TEST_TYPES_GROUP9_10_CENTRAL_DOCS (e.g. '95')
			store.overrideSelector(toEditOrNotToEdit, { testTypes: [{ testTypeId: '95' }] } as TestResultSchema);
			store.refreshState();
			expect(!component.testService.testType.centralDocs.issueRequired().hidden()).toBe(true);

			// also true for group7 id
			store.overrideSelector(toEditOrNotToEdit, { testTypes: [{ testTypeId: '59' }] } as TestResultSchema);
			store.refreshState();
			expect(!component.testService.testType.centralDocs.issueRequired().hidden()).toBe(true);
		});

		it('hides the certificate for unrelated or failing tests', () => {
			// non-group7 -> false
			store.overrideSelector(toEditOrNotToEdit, {
				testTypes: [{ testTypeId: '1', testResult: TestResults.PASS }],
			} as TestResultSchema);
			store.refreshState();
			expect(component.testService.testType.certificateNumber().hidden()).toBe(true);

			// group7 but failed -> false
			store.overrideSelector(toEditOrNotToEdit, {
				testTypes: [{ testTypeId: '59', testResult: TestResults.FAIL }],
			} as TestResultSchema);
			store.refreshState();
			expect(component.testService.testType.certificateNumber().hidden()).toBe(true);
		});

		it('shows the certificate for a pass without central documents', () => {
			store.overrideSelector(toEditOrNotToEdit, {
				vehicleType: 'hgv',
				testTypes: [{ testTypeId: '59', testResult: TestResults.PASS, centralDocs: { issueRequired: false } }],
			} as TestResultSchema);
			store.refreshState();
			expect(component.testService.testType.certificateNumber().hidden()).toBe(false);
		});

		it('hides the certificate for a pass with central documents', () => {
			store.overrideSelector(toEditOrNotToEdit, {
				vehicleType: 'hgv',
				testTypes: [{ testTypeId: '59', testResult: TestResults.PASS, centralDocs: { issueRequired: true } }],
			} as TestResultSchema);
			store.refreshState();
			expect(component.testService.testType.certificateNumber().hidden()).toBe(true);
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
			expect(component.testService.isSpecialistGroup1()).toBe(true);
			expect(!component.testService.testType.testResult().hidden()).toBe(true);
			expect(component.resultOptions().map((option) => option.value)).toEqual(['pass', 'fail', 'prs']);
		});

		it('should show the description, prohibition issued and hide the anniversary date', () => {
			setTestResult({ testResult: TestResults.PASS });
			expect(!component.testService.testType.testTypeName().hidden()).toBe(true);
			expect(!component.testService.testType.prohibitionIssued().hidden()).toBe(true);
			expect(!component.testService.testType.testAnniversaryDate().hidden()).toBe(false);
			expect(!component.testService.testType.testExpiryDate().hidden()).toBe(false);
		});

		it.each([
			[TestResults.PASS, true],
			[TestResults.PRS, true],
			[TestResults.FAIL, false],
		])('should show issue documents centrally when the result is %s: %s', (testResult, expected) => {
			setTestResult({ testResult });
			expect(!component.testService.testType.centralDocs.issueRequired().hidden()).toBe(expected);
		});

		it('should only show the reapplication date when the test has failed', () => {
			setTestResult({ testResult: TestResults.FAIL });
			expect(!component.testService.testType.reapplicationDate().hidden()).toBe(true);

			setTestResult({ testResult: TestResults.PASS });
			expect(!component.testService.testType.reapplicationDate().hidden()).toBe(false);
		});

		describe('certificate number visibility', () => {
			it('should be hidden when the test has failed', () => {
				setTestResult({ testResult: TestResults.FAIL });
				expect(component.testService.testType.certificateNumber().hidden()).toBe(true);
			});

			it.each([TestResults.PASS, TestResults.PRS])('should be shown when the result is %s', (testResult) => {
				setTestResult({ testResult, centralDocs: { issueRequired: false } });
				expect(component.testService.testType.certificateNumber().hidden()).toBe(false);
			});

			it('should be hidden when issuing documents centrally', () => {
				setTestResult({ testResult: TestResults.PASS, centralDocs: { issueRequired: true } });
				expect(component.testService.testType.certificateNumber().hidden()).toBe(true);
			});

			it.each(['hgv', 'trl'])('should be shown for a %s when issuing documents centrally', (vehicleType) => {
				setTestResult(
					{ testTypeId: '186', testResult: TestResults.PASS, centralDocs: { issueRequired: true } },
					vehicleType
				);
				expect(component.testService.testType.certificateNumber().hidden()).toBe(false);
			});
		});

		describe('testResult', () => {
			const requiredStandard = {
				sectionNumber: '1',
				sectionDescription: 'Section',
				rsNumber: 1,
				requiredStandard: 'Standard',
				refCalculation: '1',
				additionalInfo: false,
				prs: false,
			};

			it.each([
				[TestResults.PASS, [requiredStandard], 'Cannot pass test when required standards are present'],
				[TestResults.FAIL, [], 'Cannot fail test when no required standards are present'],
				[TestResults.PRS, [], 'Cannot mark test as PRS when no required standards are present'],
			])(
				'should be invalid when the result is %s and the required standards are %j',
				(testResult, requiredStandards, error) => {
					setTestResult({ testResult });
					const testTypeGroup = component.testService.testType;
					testTypeGroup.requiredStandards().value.set(requiredStandards);
					testTypeGroup.testResult().value.set(testResult);

					expect(testTypeGroup.testResult().errors()).toContainEqual(
						expect.objectContaining({ kind: 'invalidTestResult', message: error })
					);
				}
			);

			it.each([
				[TestResults.PASS, []],
				[TestResults.FAIL, [requiredStandard]],
				[TestResults.PRS, [requiredStandard]],
			])('should be valid when the result is %s and the required standards are %j', (testResult, requiredStandards) => {
				setTestResult({ testResult });
				const testTypeGroup = component.testService.testType;
				testTypeGroup.requiredStandards().value.set(requiredStandards);
				testTypeGroup.testResult().value.set(testResult);

				expect(testTypeGroup.testResult().valid()).toBe(true);
			});

			it('revalidates an existing result when required standards change', () => {
				setTestResult({ testResult: TestResults.PASS });
				const testType = component.testService.testType;
				testType.testResult().value.set(TestResults.PASS);
				testType.requiredStandards().value.set([]);
				expect(testType.testResult().valid()).toBe(true);

				testType.requiredStandards().value.set([requiredStandard]);
				expect(
					testType
						.testResult()
						.errors()
						.map((error) => error.kind)
				).toContain('invalidTestResult');
				testType.requiredStandards().value.set([]);
				expect(testType.testResult().valid()).toBe(true);
			});
		});

		describe('reapplicationDate', () => {
			it('should be required when the test has failed', () => {
				setTestResult({ testResult: TestResults.FAIL });
				const control = component.testService.testType.reapplicationDate;
				control().value.set(null);
				expect(
					control()
						.errors()
						.map((error) => error.kind)
				).toContain('required');
			});

			it('should be invalid when not in the future', () => {
				setTestResult({ testResult: TestResults.FAIL });
				const control = component.testService.testType.reapplicationDate;
				control().value.set('2024-01-15');
				expect(
					control()
						.errors()
						.map((error) => error.kind)
				).toContain('futureDate');
			});

			it('should not be required when the test has passed', () => {
				setTestResult({ testResult: TestResults.PASS });
				const control = component.testService.testType.reapplicationDate;
				control().value.set(null);
				expect(control().valid()).toBe(true);
			});
		});

		it('should require prohibition issued', () => {
			setTestResult({ testResult: TestResults.PASS });
			const control = component.testService.testType.prohibitionIssued;
			control().value.set(null);
			expect(
				control()
					.errors()
					.map((error) => error.kind)
			).toContain('required');
		});

		it('should not require an expiry or anniversary date when amending a passed test', () => {
			setTestResult({ testResult: TestResults.PASS });
			component.testService.mode.set(Modes.AMEND);
			const testTypeGroup = component.testService.testType;
			testTypeGroup.testResult().value.set(TestResults.PASS);
			testTypeGroup.testExpiryDate().value.set(null);
			testTypeGroup.testAnniversaryDate().value.set(null);

			expect(testTypeGroup.testExpiryDate().valid()).toBe(true);
			expect(testTypeGroup.testAnniversaryDate().valid()).toBe(true);
		});
	});

	describe('groups 3, 4 and 8', () => {
		const setTestResult = (testType: Partial<TestResultSchema['testTypes'][0]>, vehicleType = 'psv') => {
			store.overrideSelector(toEditOrNotToEdit, {
				vehicleType,
				testTypes: [{ testTypeId: '38', ...testType }],
			} as TestResultSchema);
			store.refreshState();
		};

		it.each(['psv', 'hgv', 'trl'])('shows only the create fields from the %s template', (vehicleType) => {
			setTestResult({ testResult: TestResults.PASS }, vehicleType);
			const service = component.testService;

			expect(component.resultOptions().map((option) => option.value)).toEqual(['pass', 'fail']);
			expect(service.testType.testResult().hidden()).toBe(false);
			expect(service.testType.testTypeName().hidden()).toBe(false);
			expect(service.testType.testTypeName().disabled()).toBe(true);
			expect(service.testType.prohibitionIssued().hidden()).toBe(false);
			expect(service.testType.certificateNumber().hidden()).toBe(true);
			expect(service.testType.centralDocs.issueRequired().hidden()).toBe(true);
			expect(service.testType.testExpiryDate().hidden()).toBe(true);
			expect(service.testType.testAnniversaryDate().hidden()).toBe(true);
			expect(service.testType.defects().hidden()).toBe(true);
			expect(service.testType.seatbeltInstallationCheckDate().hidden()).toBe(true);
		});

		it('requires prohibition issued but not a certificate number', () => {
			setTestResult({ testResult: TestResults.PASS });
			const testType = component.testService.testType;
			testType.prohibitionIssued().value.set(null);
			testType.certificateNumber().value.set(null);

			expect(
				testType
					.prohibitionIssued()
					.errors()
					.map((error) => error.kind)
			).toContain('required');
			expect(testType.certificateNumber().valid()).toBe(true);
		});

		it('does not require PSV seatbelt details', () => {
			setTestResult({ testResult: TestResults.PASS });
			const seatbelts = component.testService.testType.seatbeltInstallationCheckDate;
			seatbelts().value.set(null);

			expect(seatbelts().valid()).toBe(true);
		});

		describe('when amending', () => {
			beforeEach(() => {
				component.testService.mode.set(Modes.AMEND);
				component.testService.initialMode.set(Modes.AMEND);
			});

			it.each(['psv', 'hgv', 'trl'])('offers pass, fail and abandoned without test dates for a %s', (vehicleType) => {
				setTestResult({ testResult: TestResults.PASS }, vehicleType);
				const testType = component.testService.testType;
				testType.testExpiryDate().value.set(null);
				testType.testAnniversaryDate().value.set(null);

				expect(component.resultOptions().map((option) => option.value)).toEqual(['pass', 'fail', 'abandoned']);
				expect(component.testService.testType.testExpiryDate().hidden()).toBe(true);
				expect(component.testService.testType.testAnniversaryDate().hidden()).toBe(true);
				expect(testType.testAnniversaryDate().valid()).toBe(true);
			});

			it('requires the abandonment details when the result is abandoned', () => {
				setTestResult({ testResult: TestResults.ABANDONED }, 'hgv');
				const testType = component.testService.testType;
				testType.reasonForAbandoning().value.set([]);
				testType.additionalCommentsForAbandon().value.set(null);

				expect(testType.reasonForAbandoning().errors()).toContainEqual(
					expect.objectContaining({ kind: 'required', message: 'Reason for abandoning is required with Result' })
				);
				expect(
					testType
						.additionalCommentsForAbandon()
						.errors()
						.map((error) => error.kind)
				).toContain('required');
			});
		});

		it('hides the test dates when viewing', () => {
			component.testService.mode.set(Modes.VIEW);
			component.testService.initialMode.set(Modes.VIEW);
			setTestResult({ testResult: TestResults.PASS });

			expect(component.testService.testType.testExpiryDate().hidden()).toBe(true);
			expect(component.testService.testType.testAnniversaryDate().hidden()).toBe(true);
			expect(component.testService.testType.prohibitionIssued().hidden()).toBe(false);
		});
	});

	describe('amending an abandoned test', () => {
		beforeEach(() => {
			component.testService.mode.set(Modes.AMEND);
			component.testService.initialMode.set(Modes.AMEND);
		});

		const amendAbandoned = (vehicleType: string, testTypeId: string) => {
			store.overrideSelector(toEditOrNotToEdit, {
				vehicleType,
				testTypes: [{ testTypeId, testResult: TestResults.ABANDONED }],
			} as TestResultSchema);
			store.refreshState();
			const testType = component.testService.testType;
			testType.reasonForAbandoning().value.set([]);
			testType.additionalCommentsForAbandon().value.set(null);
			return testType;
		};

		it.each([
			['psv', '1'],
			['psv', '15'],
			['psv', '38'],
			['psv', '125'],
			['hgv', '59'],
			['hgv', '76'],
			['trl', '117'],
			['trl', '56'],
			['lgv', '125'],
			['car', '125'],
			['motorcycle', '125'],
		])('requires the abandonment details for a %s test type %s', (vehicleType, testTypeId) => {
			const testType = amendAbandoned(vehicleType, testTypeId);

			expect(testType.reasonForAbandoning().errors()).toContainEqual(
				expect.objectContaining({ kind: 'required', message: 'Reason for abandoning is required with Result' })
			);
			expect(testType.additionalCommentsForAbandon().errors()).toContainEqual(
				expect.objectContaining({
					kind: 'required',
					message: 'Additional details for abandoning is required with Result',
				})
			);

			testType.additionalCommentsForAbandon().value.set('a'.repeat(501));
			expect(testType.additionalCommentsForAbandon().errors()).toContainEqual(
				expect.objectContaining({
					kind: 'maxLength',
					message: 'Additional details for abandoning must be less than or equal to 500 characters',
				})
			);
		});

		it.each([
			['psv', '59'],
			['psv', '76'],
			['psv', '56'],
			['hgv', '1'],
			['trl', '15'],
			['lgv', '1'],
			['small trl', '125'],
		])('does not require the abandonment details for a %s test type %s', (vehicleType, testTypeId) => {
			const testType = amendAbandoned(vehicleType, testTypeId);

			expect(testType.reasonForAbandoning().valid()).toBe(true);
			expect(testType.additionalCommentsForAbandon().valid()).toBe(true);
		});
	});

	describe('isLoadStatusRequired', () => {
		it('should be required when creating a test that captures load status', () => {
			store.overrideSelector(toEditOrNotToEdit, { testTypes: [{ testTypeId: '94' }] } as TestResultSchema);
			store.refreshState();

			const control = component.testService.testType.loadStatus.vehicleLoadStatus;
			control().value.set(null);
			control().markAsTouched();

			expect(component.testService.loadStatusRequired()).toBe(true);
			expect(control().valid()).toBe(false);
			expect(
				control()
					.errors()
					.map((error) => error.kind)
			).toContain('required');
		});

		it('should not be required when the test does not capture load status', () => {
			store.overrideSelector(toEditOrNotToEdit, { testTypes: [{ testTypeId: '1' }] } as TestResultSchema);
			store.refreshState();

			expect(component.testService.loadStatusRequired()).toBe(false);
		});
	});
});

describe('TestComponent - AMEND mode', () => {
	let fixture: ComponentFixture<TestComponent>;
	let component: TestComponent;
	let store: MockStore;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [TestComponent, RouterTestingModule],
			providers: [
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
			expect(!component.testService.testType.loadStatus.vehicleLoadStatus().hidden()).toBe(true);
		});

		it('should not be mandatory, so an amendment can be saved with it left blank', () => {
			const control = component.testService.testType.loadStatus.vehicleLoadStatus;
			control().value.set(null);
			control().markAsTouched();

			expect(component.testService.loadStatusRequired()).toBe(false);
			expect(control().valid()).toBe(true);
		});
	});
});
