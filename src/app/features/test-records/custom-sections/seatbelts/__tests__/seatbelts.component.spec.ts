import { Modes } from '@/src/app/models/modes.enum';
import { TestService } from '@/src/app/services/test/test.service';
import { initialAppState } from '@/src/app/store';
import { toEditOrNotToEdit } from '@/src/app/store/test-records';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestResultSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { SeatbeltsComponent } from '../seatbelts.component';

type SignalField = () => { errors: () => { kind: string; message: string }[] };
const hasError = (field: SignalField, kind: string) =>
	field()
		.errors()
		.some((error) => error.kind === kind);

describe('SeatbeltsComponent', () => {
	let fixture: ComponentFixture<SeatbeltsComponent>;
	let component: SeatbeltsComponent;
	let testService: TestService;
	let store: MockStore;

	const setTestResult = (vehicleType: string, testTypeId: string) => {
		store.overrideSelector(toEditOrNotToEdit, { vehicleType, testTypes: [{ testTypeId }] } as TestResultSchema);
		store.refreshState();
	};

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [SeatbeltsComponent],
			providers: [provideMockStore({ initialState: initialAppState })],
		}).compileComponents();

		testService = TestBed.inject(TestService);
		testService.isAbandoning.set(false);
		store = TestBed.inject(MockStore);
		setTestResult('psv', '1');
		fixture = TestBed.createComponent(SeatbeltsComponent);
		component = fixture.componentInstance;
		testService.mode.set(Modes.EDIT);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('validation', () => {
		describe('seatbeltInstallationCheckDate', () => {
			it('should be invalid when unanswered', () => {
				const control = component.form.testTypes[0].seatbeltInstallationCheckDate;
				control().value.set(null);
				control().markAsTouched();
				expect(control().valid()).toBe(false);
				expect(hasError(control, 'required')).toBe(true);
			});

			it('should be valid when answered Yes', () => {
				const control = component.form.testTypes[0].seatbeltInstallationCheckDate;
				control().value.set(true);
				control().markAsTouched();
				expect(control().valid()).toBe(true);
			});

			// `required` treats falsy values as empty, so "No" must not be reported as unanswered
			it('should be valid when answered No', () => {
				const control = component.form.testTypes[0].seatbeltInstallationCheckDate;
				control().value.set(false);
				control().markAsTouched();
				expect(control().valid()).toBe(true);
			});

			it('should be valid when unanswered and the test is being abandoned', () => {
				testService.isAbandoning.set(true);
				const control = component.form.testTypes[0].seatbeltInstallationCheckDate;
				control().value.set(null);
				control().markAsTouched();
				expect(control().valid()).toBe(true);
			});

			it('should be valid when unanswered for a specialist group 1 (IVA/MSVA) test', () => {
				setTestResult('psv', '126');
				const control = component.form.testTypes[0].seatbeltInstallationCheckDate;
				control().value.set(null);
				expect(control().valid()).toBe(true);
			});

			it('should be valid when unanswered for a non-PSV test', () => {
				setTestResult('hgv', '94');
				const control = component.form.testTypes[0].seatbeltInstallationCheckDate;
				control().value.set(null);
				expect(control().valid()).toBe(true);
			});
		});

		describe('numberOfSeatbeltsFitted', () => {
			it('should be invalid when empty and the check was carried out', () => {
				const testTypeGroup = component.form.testTypes[0];
				testTypeGroup.seatbeltInstallationCheckDate().value.set(true);
				testTypeGroup.numberOfSeatbeltsFitted().value.set(null);

				expect(testTypeGroup.numberOfSeatbeltsFitted().valid()).toBe(false);
				expect(hasError(testTypeGroup.numberOfSeatbeltsFitted, 'required')).toBe(true);
			});

			it('should be valid when empty and the check was not carried out', () => {
				const testTypeGroup = component.form.testTypes[0];
				testTypeGroup.seatbeltInstallationCheckDate().value.set(false);
				testTypeGroup.numberOfSeatbeltsFitted().value.set(null);

				expect(testTypeGroup.numberOfSeatbeltsFitted().valid()).toBe(true);
			});

			it('should be invalid when greater than 150', () => {
				const control = component.form.testTypes[0].numberOfSeatbeltsFitted;
				control().value.set(151);
				control().markAsTouched();
				expect(control().valid()).toBe(false);
				expect(hasError(control, 'max')).toBe(true);
			});

			it('should be valid at the 150 limit', () => {
				const testTypeGroup = component.form.testTypes[0];
				testTypeGroup.seatbeltInstallationCheckDate().value.set(true);
				testTypeGroup.numberOfSeatbeltsFitted().value.set(150);

				expect(testTypeGroup.numberOfSeatbeltsFitted().valid()).toBe(true);
			});

			it('accepts zero seatbelts when the check was carried out', () => {
				testService.testType.seatbeltInstallationCheckDate().value.set(true);
				testService.testType.numberOfSeatbeltsFitted().value.set(0);
				expect(testService.testType.numberOfSeatbeltsFitted().valid()).toBe(true);
				expect(testService.value().testTypes[0].numberOfSeatbeltsFitted).toBe(0);
			});
		});

		describe('lastSeatbeltInstallationCheckDate', () => {
			it('should be invalid when empty and the check was carried out', () => {
				const testTypeGroup = component.form.testTypes[0];
				testTypeGroup.seatbeltInstallationCheckDate().value.set(true);
				testTypeGroup.lastSeatbeltInstallationCheckDate().value.set(null);

				expect(testTypeGroup.lastSeatbeltInstallationCheckDate().valid()).toBe(false);
				expect(hasError(testTypeGroup.lastSeatbeltInstallationCheckDate, 'required')).toBe(true);
			});

			it('should be valid when empty and the check was not carried out', () => {
				const testTypeGroup = component.form.testTypes[0];
				testTypeGroup.seatbeltInstallationCheckDate().value.set(false);
				testTypeGroup.lastSeatbeltInstallationCheckDate().value.set(null);

				expect(testTypeGroup.lastSeatbeltInstallationCheckDate().valid()).toBe(true);
			});

			it('should be invalid when the date is in the future', () => {
				const control = component.form.testTypes[0].lastSeatbeltInstallationCheckDate;
				control().value.set(new Date(Date.now() + 86400000).toISOString());
				control().markAsTouched();
				expect(control().valid()).toBe(false);
				expect(hasError(control, 'pastDate')).toBe(true);
			});

			it('should be invalid when the date is not a real date', () => {
				const control = component.form.testTypes[0].lastSeatbeltInstallationCheckDate;
				control().value.set('2024-13-01');
				control().markAsTouched();
				expect(control().valid()).toBe(false);
				expect(hasError(control, 'invalidDate')).toBe(true);
			});

			it('should be valid when the date is in the past', () => {
				const testTypeGroup = component.form.testTypes[0];
				testTypeGroup.seatbeltInstallationCheckDate().value.set(true);
				testTypeGroup.lastSeatbeltInstallationCheckDate().value.set('2024-01-15');

				expect(testTypeGroup.lastSeatbeltInstallationCheckDate().valid()).toBe(true);
			});
		});
	});

	// The dependent fields used to keep whatever validity they last had, so their errors only
	// caught up with the answer once the user edited the fields themselves.
	describe('dependent fields', () => {
		it('does not validate retained seatbelt data for a test without the section', () => {
			testService.testType.seatbeltInstallationCheckDate().value.set(true);
			testService.testType.numberOfSeatbeltsFitted().value.set(151);
			testService.testType.lastSeatbeltInstallationCheckDate().value.set('2024-13-01');
			setTestResult('hgv', '94');
			expect(testService.testType.numberOfSeatbeltsFitted().errors()).toEqual([]);
			expect(testService.testType.lastSeatbeltInstallationCheckDate().errors()).toEqual([]);
		});

		it('should raise the dependent errors as soon as the check is answered Yes', () => {
			const testTypeGroup = component.form.testTypes[0];
			testTypeGroup.numberOfSeatbeltsFitted().value.set(null);
			testTypeGroup.lastSeatbeltInstallationCheckDate().value.set(null);

			testTypeGroup.seatbeltInstallationCheckDate().value.set(true);

			expect(hasError(testTypeGroup.numberOfSeatbeltsFitted, 'required')).toBe(true);
			expect(hasError(testTypeGroup.lastSeatbeltInstallationCheckDate, 'required')).toBe(true);
		});

		it('should clear the dependent errors as soon as the check is answered No', () => {
			const testTypeGroup = component.form.testTypes[0];
			testTypeGroup.numberOfSeatbeltsFitted().value.set(null);
			testTypeGroup.lastSeatbeltInstallationCheckDate().value.set(null);
			testTypeGroup.seatbeltInstallationCheckDate().value.set(true);

			testTypeGroup.seatbeltInstallationCheckDate().value.set(false);

			expect(testTypeGroup.numberOfSeatbeltsFitted().errors()).toEqual([]);
			expect(testTypeGroup.lastSeatbeltInstallationCheckDate().errors()).toEqual([]);
		});

		it('updates parent validity when the answer changes', () => {
			const group = component.form.testTypes[0];
			testService.testType.testTypeStartTimestamp().value.set('2025-01-01T10:00:00.000Z');
			testService.testType.testTypeEndTimestamp().value.set('2025-01-01T10:30:00.000Z');
			testService.testType.numberOfSeatbeltsFitted().value.set(null);
			testService.testType.lastSeatbeltInstallationCheckDate().value.set(null);
			testService.testType.seatbeltInstallationCheckDate().value.set(true);
			TestBed.tick();
			expect(group().invalid()).toBe(true);
			testService.testType.seatbeltInstallationCheckDate().value.set(false);
			TestBed.tick();
			expect(group().valid()).toBe(true);
		});
	});
});
