import { Modes } from '@/src/app/models/modes.enum';
import { initialAppState } from '@/src/app/store';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlContainer, FormGroup, FormGroupDirective } from '@angular/forms';
import { provideMockStore } from '@ngrx/store/testing';
import { TestComponent } from '../test.component';

describe('TestComponent', () => {
	let fixture: ComponentFixture<TestComponent>;
	let component: TestComponent;
	let formGroupDirective: FormGroupDirective;

	beforeEach(async () => {
		formGroupDirective = new FormGroupDirective([], []);
		formGroupDirective.form = new FormGroup({});

		await TestBed.configureTestingModule({
			imports: [TestComponent],
			providers: [
				{ provide: ControlContainer, useValue: formGroupDirective },
				provideMockStore({ initialState: initialAppState }),
			],
		}).compileComponents();

		fixture = TestBed.createComponent(TestComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('mode', Modes.EDIT);
		fixture.componentRef.setInput('initialMode', Modes.EDIT);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
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
});
