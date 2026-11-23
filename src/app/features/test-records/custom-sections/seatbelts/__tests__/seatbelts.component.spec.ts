import { Modes } from '@/src/app/models/modes.enum';
import { TestService } from '@/src/app/services/test/test.service';
import { initialAppState } from '@/src/app/store';
import { toEditOrNotToEdit } from '@/src/app/store/test-records';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlContainer, FormGroup, FormGroupDirective } from '@angular/forms';
import { TestResultSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { SeatbeltsComponent } from '../seatbelts.component';

describe('SeatbeltsComponent', () => {
	let fixture: ComponentFixture<SeatbeltsComponent>;
	let component: SeatbeltsComponent;
	let testService: TestService;
	let store: MockStore;
	let formGroupDirective: FormGroupDirective;

	const setTestResult = (vehicleType: string, testTypeId: string) => {
		store.overrideSelector(toEditOrNotToEdit, { vehicleType, testTypes: [{ testTypeId }] } as TestResultSchema);
		store.refreshState();
	};

	beforeEach(async () => {
		formGroupDirective = new FormGroupDirective([], []);
		formGroupDirective.form = new FormGroup({});

		await TestBed.configureTestingModule({
			imports: [SeatbeltsComponent],
			providers: [
				{ provide: ControlContainer, useValue: formGroupDirective },
				provideMockStore({ initialState: initialAppState }),
			],
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
				const control = component.form.controls.testTypes.at(0).controls.seatbeltInstallationCheckDate;
				control.setValue(null);
				control.markAsTouched();
				expect(control.valid).toBe(false);
				expect(control.errors).toHaveProperty('required');
			});

			it('should be valid when answered Yes', () => {
				const control = component.form.controls.testTypes.at(0).controls.seatbeltInstallationCheckDate;
				control.setValue(true);
				control.markAsTouched();
				expect(control.valid).toBe(true);
			});

			// `required` treats falsy values as empty, so "No" must not be reported as unanswered
			it('should be valid when answered No', () => {
				const control = component.form.controls.testTypes.at(0).controls.seatbeltInstallationCheckDate;
				control.setValue(false);
				control.markAsTouched();
				expect(control.valid).toBe(true);
			});

			it('should be valid when unanswered and the test is being abandoned', () => {
				testService.isAbandoning.set(true);
				const control = component.form.controls.testTypes.at(0).controls.seatbeltInstallationCheckDate;
				control.setValue(null);
				control.markAsTouched();
				expect(control.valid).toBe(true);
			});

			it('should be valid when unanswered for a specialist group 1 (IVA/MSVA) test', () => {
				setTestResult('psv', '126');
				const control = component.form.controls.testTypes.at(0).controls.seatbeltInstallationCheckDate;
				control.setValue(null);
				expect(control.valid).toBe(true);
			});

			it('should be valid when unanswered for a non-PSV test', () => {
				setTestResult('hgv', '94');
				const control = component.form.controls.testTypes.at(0).controls.seatbeltInstallationCheckDate;
				control.setValue(null);
				expect(control.valid).toBe(true);
			});
		});

		describe('numberOfSeatbeltsFitted', () => {
			it('should be invalid when empty and the check was carried out', () => {
				const testTypeGroup = component.form.controls.testTypes.at(0);
				testTypeGroup.controls.seatbeltInstallationCheckDate.setValue(true);
				testTypeGroup.controls.numberOfSeatbeltsFitted.setValue(null);

				expect(testTypeGroup.controls.numberOfSeatbeltsFitted.valid).toBe(false);
				expect(testTypeGroup.controls.numberOfSeatbeltsFitted.errors).toHaveProperty('required');
			});

			it('should be valid when empty and the check was not carried out', () => {
				const testTypeGroup = component.form.controls.testTypes.at(0);
				testTypeGroup.controls.seatbeltInstallationCheckDate.setValue(false);
				testTypeGroup.controls.numberOfSeatbeltsFitted.setValue(null);

				expect(testTypeGroup.controls.numberOfSeatbeltsFitted.valid).toBe(true);
			});

			it('should be invalid when greater than 150', () => {
				const control = component.form.controls.testTypes.at(0).controls.numberOfSeatbeltsFitted;
				control.setValue(151);
				control.markAsTouched();
				expect(control.valid).toBe(false);
				expect(control.errors).toHaveProperty('max');
			});

			it('should be valid at the 150 limit', () => {
				const testTypeGroup = component.form.controls.testTypes.at(0);
				testTypeGroup.controls.seatbeltInstallationCheckDate.setValue(true);
				testTypeGroup.controls.numberOfSeatbeltsFitted.setValue(150);

				expect(testTypeGroup.controls.numberOfSeatbeltsFitted.valid).toBe(true);
			});

			it('accepts zero seatbelts when the check was carried out', () => {
				testService.seatbeltInstallationCheckDate.setValue(true);
				testService.numberOfSeatbeltsFitted.setValue(0);
				expect(testService.numberOfSeatbeltsFitted.valid).toBe(true);
				expect(testService.form.getRawValue().testTypes[0].numberOfSeatbeltsFitted).toBe(0);
			});
		});

		describe('lastSeatbeltInstallationCheckDate', () => {
			it('should be invalid when empty and the check was carried out', () => {
				const testTypeGroup = component.form.controls.testTypes.at(0);
				testTypeGroup.controls.seatbeltInstallationCheckDate.setValue(true);
				testTypeGroup.controls.lastSeatbeltInstallationCheckDate.setValue(null);

				expect(testTypeGroup.controls.lastSeatbeltInstallationCheckDate.valid).toBe(false);
				expect(testTypeGroup.controls.lastSeatbeltInstallationCheckDate.errors).toHaveProperty('required');
			});

			it('should be valid when empty and the check was not carried out', () => {
				const testTypeGroup = component.form.controls.testTypes.at(0);
				testTypeGroup.controls.seatbeltInstallationCheckDate.setValue(false);
				testTypeGroup.controls.lastSeatbeltInstallationCheckDate.setValue(null);

				expect(testTypeGroup.controls.lastSeatbeltInstallationCheckDate.valid).toBe(true);
			});

			it('should be invalid when the date is in the future', () => {
				const control = component.form.controls.testTypes.at(0).controls.lastSeatbeltInstallationCheckDate;
				control.setValue(new Date(Date.now() + 86400000).toISOString());
				control.markAsTouched();
				expect(control.valid).toBe(false);
				expect(control.errors).toHaveProperty('pastDate');
			});

			it('should be invalid when the date is not a real date', () => {
				const control = component.form.controls.testTypes.at(0).controls.lastSeatbeltInstallationCheckDate;
				control.setValue('2024-13-01');
				control.markAsTouched();
				expect(control.valid).toBe(false);
				expect(control.errors).toHaveProperty('invalidDate');
			});

			it('should be valid when the date is in the past', () => {
				const testTypeGroup = component.form.controls.testTypes.at(0);
				testTypeGroup.controls.seatbeltInstallationCheckDate.setValue(true);
				testTypeGroup.controls.lastSeatbeltInstallationCheckDate.setValue('2024-01-15');

				expect(testTypeGroup.controls.lastSeatbeltInstallationCheckDate.valid).toBe(true);
			});
		});
	});

	// The dependent fields used to keep whatever validity they last had, so their errors only
	// caught up with the answer once the user edited the fields themselves.
	describe('dependent fields', () => {
		it('does not validate retained seatbelt data for a test without the section', () => {
			testService.seatbeltInstallationCheckDate.setValue(true);
			testService.numberOfSeatbeltsFitted.setValue(151);
			testService.lastSeatbeltInstallationCheckDate.setValue('2024-13-01');
			setTestResult('hgv', '94');
			expect(testService.numberOfSeatbeltsFitted.errors).toBeNull();
			expect(testService.lastSeatbeltInstallationCheckDate.errors).toBeNull();
		});

		it('should raise the dependent errors as soon as the check is answered Yes', () => {
			const testTypeGroup = component.form.controls.testTypes.at(0);
			testTypeGroup.controls.numberOfSeatbeltsFitted.setValue(null);
			testTypeGroup.controls.lastSeatbeltInstallationCheckDate.setValue(null);

			testTypeGroup.controls.seatbeltInstallationCheckDate.setValue(true);

			expect(testTypeGroup.controls.numberOfSeatbeltsFitted.errors).toHaveProperty('required');
			expect(testTypeGroup.controls.lastSeatbeltInstallationCheckDate.errors).toHaveProperty('required');
		});

		it('should clear the dependent errors as soon as the check is answered No', () => {
			const testTypeGroup = component.form.controls.testTypes.at(0);
			testTypeGroup.controls.numberOfSeatbeltsFitted.setValue(null);
			testTypeGroup.controls.lastSeatbeltInstallationCheckDate.setValue(null);
			testTypeGroup.controls.seatbeltInstallationCheckDate.setValue(true);

			testTypeGroup.controls.seatbeltInstallationCheckDate.setValue(false);

			expect(testTypeGroup.controls.numberOfSeatbeltsFitted.errors).toBeNull();
			expect(testTypeGroup.controls.lastSeatbeltInstallationCheckDate.errors).toBeNull();
		});

		it('updates parent validity when the answer changes', () => {
			const group = component.form.controls.testTypes.at(0);
			testService.testTypeStartTimestamp.setValue('2025-01-01T10:00:00.000Z');
			testService.testTypeEndTimestamp.setValue('2025-01-01T10:30:00.000Z');
			testService.numberOfSeatbeltsFitted.setValue(null);
			testService.lastSeatbeltInstallationCheckDate.setValue(null);
			testService.seatbeltInstallationCheckDate.setValue(true);
			TestBed.tick();
			expect(group.invalid).toBe(true);
			testService.seatbeltInstallationCheckDate.setValue(false);
			TestBed.tick();
			expect(group.valid).toBe(true);
		});
	});
});
