/* eslint-disable jest/no-conditional-expect */
import { Component } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { provideMockStore } from '@ngrx/store/testing';
import { CustomFormControl, FormNodeTypes } from '@services/dynamic-forms/dynamic-form.types';
import { initialAppState } from '@store/index';
import { BaseControlComponent } from '../../base-control/base-control.component';
import { FieldErrorMessageComponent } from '../../field-error-message/field-error-message.component';
import { DateComponent } from '../date.component';

@Component({
	selector: 'app-host-component',
	template: `<form [formGroup]="form">
    <app-date name="foo" label="Foo" formControlName="foo"></app-date>
  </form> `,
	imports: [BaseControlComponent, DateComponent, FieldErrorMessageComponent, FormsModule, ReactiveFormsModule],
})
class HostComponent {
	form = new FormGroup({
		foo: new CustomFormControl({ name: 'foo', type: FormNodeTypes.CONTROL, children: [] }, null),
	});
}

describe('DateComponent', () => {
	let component: HostComponent;
	let fixture: ComponentFixture<HostComponent>;
	let dateComponent: DateComponent;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [HostComponent],
			providers: [GlobalErrorService, provideMockStore({ initialState: initialAppState })],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(HostComponent);
		component = fixture.componentInstance;
		dateComponent = fixture.debugElement.query(By.directive(DateComponent)).componentInstance;
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should add validators', () => {
		const addValidatorsSpy = jest.spyOn(dateComponent, 'addValidators');
		fixture.detectChanges();

		expect(addValidatorsSpy).toHaveBeenCalledTimes(1);
	});

	describe('control values', () => {
		it.each([
			['2342346-6213-234T00:00:00.000', 2342346, 6213, 234, 1, 6],
			['2022-01-12T00:00:00.000Z', 2022, 0o1, 12, 1, 6],
			['2022--01T00:00:00.000', 2022, Number.NaN, 0o1, 0o1, 0o1],
			['2022-01-T00:00:00.000', 2022, 0o1, Number.NaN, 0o1, 0o1],
			[new Date(2022, 1, 1, 13, 45).toISOString(), 2022, 2, 0o1, 13, 45, true],
			['-01-01T01:01:00.000', Number.NaN, 0o1, 0o1, 0o1, 0o1, true],
			[undefined, undefined, undefined, undefined, undefined, undefined, true],
		])(
			'should be %s for %d, %d, %d, %d, %d',
			(
				expected: string | undefined,
				year: number | undefined,
				month: number | undefined,
				day: number | undefined,
				hour: number | undefined,
				minute: number | undefined,
				displayTime = false
			) => {
				dateComponent.originalDate = '2022-01-01T01:06:00.000';
				jest.spyOn(dateComponent, 'displayTime').mockReturnValue(displayTime);

				fixture.detectChanges();

				dateComponent.onDayChange(day);
				dateComponent.onMonthChange(month);
				dateComponent.onYearChange(year);
				dateComponent.onHourChange(hour);
				dateComponent.onMinuteChange(minute);

				if (expected === undefined) {
					expect(component.form.get('foo')?.value).toBeNull();
				} else {
					expect((component.form.get('foo')?.value as Date).toString()).toEqual(expected.toString());
				}
			}
		);

		it.each([
			['2342346-6213-234', 2342346, 6213, 234, 1, 6],
			['2022-01-12', 2022, 0o1, 12, 1, 6],
			['2022--01', 2022, Number.NaN, 0o1, 0o1, 0o1],
			['2022-01-', 2022, 0o1, Number.NaN, 0o1, 0o1],
			['2022-02-01', 2022, 2, 0o1, 13, 45, true],
			['-01-01', Number.NaN, 0o1, 0o1, 0o1, 0o1, true],
			[undefined, undefined, undefined, undefined, undefined, undefined, true],
		])(
			'should be %s for %d, %d, %d, %d, %d',
			(
				expected: string | undefined,
				year: number | undefined,
				month: number | undefined,
				day: number | undefined,
				hour: number | undefined,
				minute: number | undefined,
				displayTime = false
			) => {
				dateComponent.originalDate = '2022-01-01T01:06:00.000';
				jest.spyOn(dateComponent, 'displayTime').mockReturnValue(displayTime);
				jest.spyOn(dateComponent, 'isoDate').mockReturnValue(false);

				fixture.detectChanges();

				dateComponent.onDayChange(day);
				dateComponent.onMonthChange(month);
				dateComponent.onYearChange(year);
				dateComponent.onHourChange(hour);
				dateComponent.onMinuteChange(minute);
				if (expected === undefined) {
					expect(component.form.get('foo')?.value).toBeNull();
				} else {
					expect((component.form.get('foo')?.value as Date).toString()).toEqual(expected.toString());
				}
			}
		);

		it('should propagate control value to subjects', fakeAsync(() => {
			const date = new Date('1995-12-17T03:24:00');
			dateComponent.control?.patchValue(date.toISOString());

			dateComponent.valueWriteBack(date.toISOString());

			tick();
			dateComponent.control?.meta.changeDetection?.detectChanges();

			expect(dateComponent.day).toEqual(date.getUTCDate());
			expect(dateComponent.month).toEqual(date.getUTCMonth() + 1);
			expect(dateComponent.year).toEqual(date.getUTCFullYear());
			expect(dateComponent.hour).toEqual(date.getUTCHours());
			expect(dateComponent.minute).toEqual(date.getUTCMinutes());
		}));
	});

	// These assertions hold in any timezone, but the BST cases only catch regressions when run with TZ=Europe/London
	describe('timezone handling', () => {
		const reEmit = () => {
			dateComponent.onDayChange(dateComponent.day);
			dateComponent.onMonthChange(dateComponent.month);
			dateComponent.onYearChange(dateComponent.year);
			dateComponent.onHourChange(dateComponent.hour);
			dateComponent.onMinuteChange(dateComponent.minute);
		};

		it.each([
			['GMT', '2025-02-09T00:00:00.000Z'],
			['BST', '2025-07-09T00:00:00.000Z'],
			['BST, midnight local time', '2025-07-08T23:00:00.000Z'],
			['BST, time of day preserved', '2025-07-09T10:15:30.000Z'],
		])('should show the UTC date and write it back unchanged for a date only field (%s)', (_, value) => {
			component.form.get('foo')?.setValue(value);
			fixture.detectChanges();

			expect(dateComponent.day).toBe(new Date(value).getUTCDate());

			reEmit();

			expect(component.form.get('foo')?.value).toBe(value);
		});

		it('should read a legacy value without a Z as UTC and write it back with a Z', () => {
			component.form.get('foo')?.setValue('2025-07-09T00:00:00.000');
			fixture.detectChanges();

			expect(dateComponent.day).toBe(9);

			reEmit();

			expect(component.form.get('foo')?.value).toBe('2025-07-09T00:00:00.000Z');
		});

		it.each([
			['GMT', 2025, 2, 9, '2025-02-09T00:00:00.000Z'],
			['BST', 2025, 7, 9, '2025-07-09T00:00:00.000Z'],
		])('should write a new date only value as UTC midnight (%s)', (_, year, month, day, expected) => {
			fixture.detectChanges();

			dateComponent.onDayChange(day);
			dateComponent.onMonthChange(month);
			dateComponent.onYearChange(year);

			expect(component.form.get('foo')?.value).toBe(expected);
		});

		it.each([
			['GMT', '2025-02-09T13:45:00.000Z'],
			['BST', '2025-07-09T13:45:00.000Z'],
		])('should show local time and write it back unchanged for a date and time field (%s)', (_, value) => {
			jest.spyOn(dateComponent, 'displayTime').mockReturnValue(true);
			component.form.get('foo')?.setValue(value);
			fixture.detectChanges();

			expect(dateComponent.hour).toBe(new Date(value).getHours());

			reEmit();

			expect(component.form.get('foo')?.value).toBe(value);
		});

		it('should convert an entered local date and time to UTC', () => {
			jest.spyOn(dateComponent, 'displayTime').mockReturnValue(true);
			fixture.detectChanges();

			dateComponent.onDayChange(9);
			dateComponent.onMonthChange(7);
			dateComponent.onYearChange(2025);
			dateComponent.onHourChange(13);
			dateComponent.onMinuteChange(45);

			expect(component.form.get('foo')?.value).toBe(new Date(2025, 6, 9, 13, 45).toISOString());
		});

		it.each([
			['an invalid day', 2025, 2, 30, '2025-02-30T00:00:00.000'],
			['a two digit year', 25, 2, 9, '25-02-09T00:00:00.000'],
		])('should not convert %s so the validator can report it', (_, year, month, day, expected) => {
			fixture.detectChanges();

			dateComponent.onDayChange(day);
			dateComponent.onMonthChange(month);
			dateComponent.onYearChange(year);

			expect(component.form.get('foo')?.value).toBe(expected);
		});
	});

	describe('error handling', () => {
		it('should return empty if the day, month and year are not defined', () => {
			if (dateComponent) {
				dateComponent.errors = {
					error: true,
					date: new Date(),
					errors: [{ error: false, reason: 'foo', index: 1 }],
				};
			}
			expect(dateComponent.elementHasErrors(1)).toBe(false);
		});

		it('should return true if there are some errors with the same index', () => {
			dateComponent.day = 2;
			dateComponent.year = 2021;
			dateComponent.month = 2;
			dateComponent.errors = {
				error: true,
				date: new Date(),
				errors: [{ error: false, reason: 'foo', index: 1 }],
			};

			expect(dateComponent.elementHasErrors(1)).toBe(true);
		});

		it('should return false if there are no errors with the same index', () => {
			dateComponent.day = 2;
			dateComponent.year = 2021;
			dateComponent.month = 2;
			dateComponent.errors = {
				error: true,
				date: new Date(),
				errors: [{ error: false, reason: 'foo', index: 1 }],
			};

			expect(dateComponent.elementHasErrors(2)).toBe(false);
		});
	});
});
