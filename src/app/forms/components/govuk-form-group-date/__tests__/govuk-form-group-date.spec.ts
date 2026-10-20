import { initialAppState } from '@/src/app/store';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlContainer, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideMockStore } from '@ngrx/store/testing';
import { GovukFormGroupDateComponent } from '../govuk-form-group-date.component';

// These assertions hold in any timezone, but the BST cases only catch regressions when run with TZ=Europe/London
describe('GovukFormGroupDateComponent', () => {
	let component: GovukFormGroupDateComponent;
	let fixture: ComponentFixture<GovukFormGroupDateComponent>;
	let onChange: jest.Mock;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			providers: [ControlContainer, provideMockStore({ initialState: initialAppState })],
			imports: [GovukFormGroupDateComponent, FormsModule, ReactiveFormsModule],
		}).compileComponents();

		fixture = TestBed.createComponent(GovukFormGroupDateComponent);
		component = fixture.componentInstance;
		onChange = jest.fn();
		component.registerOnChange(onChange);
	});

	const lastEmitted = () => onChange.mock.calls[onChange.mock.calls.length - 1][0];

	it('should create', () => {
		fixture.detectChanges();
		expect(component).toBeTruthy();
	});

	describe('yyyy-mm-dd mode', () => {
		beforeEach(() => fixture.detectChanges());

		it.each([
			['GMT', '2025-02-09T00:00:00.000Z', 9],
			['BST', '2025-07-09T00:00:00.000Z', 9],
			['BST, midnight local time', '2025-07-08T23:00:00.000Z', 8],
		])('should show the UTC calendar day (%s)', (_, value, day) => {
			component.writeValue(value);

			expect(component.form.value.day).toBe(day);
		});

		it('should read a legacy value without a Z as UTC', () => {
			component.writeValue('2025-07-09T00:00:00.000');

			expect(component.form.value.day).toBe(9);
		});

		it('should emit a date only string', () => {
			component.form.patchValue({ year: 2025, month: 7, day: 9 });

			expect(lastEmitted()).toBe('2025-07-09');
		});

		it('should emit null when the date is cleared', () => {
			component.form.patchValue({ year: null, month: null, day: null });

			expect(lastEmitted()).toBeNull();
		});
	});

	describe('iso-date mode', () => {
		beforeEach(() => {
			fixture.componentRef.setInput('mode', 'iso-date');
			fixture.detectChanges();
		});

		it.each([
			['GMT', '2025-02-09T00:00:00.000Z'],
			['BST', '2025-07-09T00:00:00.000Z'],
			['BST, midnight local time', '2025-07-08T23:00:00.000Z'],
			['BST, time of day preserved', '2025-07-09T10:15:30.000Z'],
		])('should show the UTC date and emit the value unchanged (%s)', (_, value) => {
			component.writeValue(value);

			expect(component.form.value.day).toBe(new Date(value).getUTCDate());

			component.form.updateValueAndValidity();

			expect(lastEmitted()).toBe(value);
		});

		it('should keep the original time when the date is changed', () => {
			component.writeValue('2025-07-09T10:15:30.000Z');

			component.form.patchValue({ day: 20 });

			expect(lastEmitted()).toBe('2025-07-20T10:15:30.000Z');
		});

		it('should add a Z to a legacy value without one', () => {
			component.writeValue('2025-07-09T00:00:00.000');

			component.form.updateValueAndValidity();

			expect(lastEmitted()).toBe('2025-07-09T00:00:00.000Z');
		});

		it('should emit UTC midnight for a new date', () => {
			component.form.patchValue({ year: 2025, month: 7, day: 9 });

			expect(lastEmitted()).toBe('2025-07-09T00:00:00.000Z');
		});

		it.each([
			['an invalid day', { year: 2025, month: 2, day: 30 }, '2025-02-30'],
			['a two digit year', { year: 25, month: 2, day: 9 }, '25-02-09'],
		])('should not convert %s so the validator can report it', (_, value, expected) => {
			component.form.patchValue(value);

			expect(lastEmitted()).toBe(expected);
		});
	});

	describe('iso mode', () => {
		beforeEach(() => {
			fixture.componentRef.setInput('mode', 'iso');
			fixture.detectChanges();
		});

		it.each([
			['GMT', '2025-02-09T13:45:00.000Z'],
			['BST', '2025-07-09T13:45:00.000Z'],
		])('should show local time and emit the value unchanged (%s)', (_, value) => {
			component.writeValue(value);

			expect(component.form.value.hours).toBe(new Date(value).getHours());

			component.form.updateValueAndValidity();

			expect(lastEmitted()).toBe(value);
		});

		it('should convert an entered local date and time to UTC', () => {
			component.form.patchValue({ year: 2025, month: 7, day: 9, hours: 13, minutes: 45 });

			expect(lastEmitted()).toBe(new Date(2025, 6, 9, 13, 45).toISOString());
		});

		it.each([
			['missing time', { year: 2025, month: 7, day: 9 }, '2025-07-09T::00.000'],
			['an invalid day', { year: 2025, month: 2, day: 30, hours: 10, minutes: 0 }, '2025-02-30T10:00:00.000'],
			['a two digit year', { year: 25, month: 2, day: 9, hours: 10, minutes: 0 }, '25-02-09T10:00:00.000'],
		])('should not convert %s', (_, value, expected) => {
			component.form.patchValue(value);

			expect(lastEmitted()).toBe(expected);
		});
	});
});
