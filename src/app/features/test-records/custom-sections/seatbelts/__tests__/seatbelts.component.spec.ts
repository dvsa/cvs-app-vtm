import { Modes } from '@/src/app/models/modes.enum';
import { initialAppState } from '@/src/app/store';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlContainer, FormGroup, FormGroupDirective } from '@angular/forms';
import { provideMockStore } from '@ngrx/store/testing';
import { SeatbeltsComponent } from '../seatbelts.component';

describe('SeatbeltsComponent', () => {
	let fixture: ComponentFixture<SeatbeltsComponent>;
	let component: SeatbeltsComponent;
	let formGroupDirective: FormGroupDirective;

	/** Mirrors what `extractGlobalErrors` does on review, so sibling-dependent validators re-run. */
	const revalidate = (control: { updateValueAndValidity(): void }) => control.updateValueAndValidity();

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

		fixture = TestBed.createComponent(SeatbeltsComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('mode', Modes.EDIT);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('addValidators', () => {
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
		});

		describe('numberOfSeatbeltsFitted', () => {
			it('should be invalid when empty and the check was carried out', () => {
				const testTypeGroup = component.form.controls.testTypes.at(0);
				testTypeGroup.controls.seatbeltInstallationCheckDate.setValue(true);
				testTypeGroup.controls.numberOfSeatbeltsFitted.setValue(null);
				revalidate(testTypeGroup.controls.numberOfSeatbeltsFitted);

				expect(testTypeGroup.controls.numberOfSeatbeltsFitted.valid).toBe(false);
				expect(testTypeGroup.controls.numberOfSeatbeltsFitted.errors).toHaveProperty('required');
			});

			it('should be valid when empty and the check was not carried out', () => {
				const testTypeGroup = component.form.controls.testTypes.at(0);
				testTypeGroup.controls.seatbeltInstallationCheckDate.setValue(false);
				testTypeGroup.controls.numberOfSeatbeltsFitted.setValue(null);
				revalidate(testTypeGroup.controls.numberOfSeatbeltsFitted);

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
				revalidate(testTypeGroup.controls.numberOfSeatbeltsFitted);

				expect(testTypeGroup.controls.numberOfSeatbeltsFitted.valid).toBe(true);
			});
		});

		describe('lastSeatbeltInstallationCheckDate', () => {
			it('should be invalid when empty and the check was carried out', () => {
				const testTypeGroup = component.form.controls.testTypes.at(0);
				testTypeGroup.controls.seatbeltInstallationCheckDate.setValue(true);
				testTypeGroup.controls.lastSeatbeltInstallationCheckDate.setValue(null);
				revalidate(testTypeGroup.controls.lastSeatbeltInstallationCheckDate);

				expect(testTypeGroup.controls.lastSeatbeltInstallationCheckDate.valid).toBe(false);
				expect(testTypeGroup.controls.lastSeatbeltInstallationCheckDate.errors).toHaveProperty('required');
			});

			it('should be valid when empty and the check was not carried out', () => {
				const testTypeGroup = component.form.controls.testTypes.at(0);
				testTypeGroup.controls.seatbeltInstallationCheckDate.setValue(false);
				testTypeGroup.controls.lastSeatbeltInstallationCheckDate.setValue(null);
				revalidate(testTypeGroup.controls.lastSeatbeltInstallationCheckDate);

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
				revalidate(testTypeGroup.controls.lastSeatbeltInstallationCheckDate);

				expect(testTypeGroup.controls.lastSeatbeltInstallationCheckDate.valid).toBe(true);
			});
		});
	});

	describe('isSeatbeltCheckCarriedOut', () => {
		it.each([
			[true, true],
			[false, false],
			[null, false],
		])('should return %s for a check value of %s', (value, expected) => {
			component.form.controls.testTypes.at(0).controls.seatbeltInstallationCheckDate.setValue(value);
			expect(component.isSeatbeltCheckCarriedOut()).toBe(expected);
		});
	});
});
