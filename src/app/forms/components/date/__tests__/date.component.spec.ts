/* eslint-disable jest/no-conditional-expect */
import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { DateFocusNextDirective } from '@directives/date-focus-next/date-focus-next.directive';
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
	styles: [],
})
class HostComponent {
	@ViewChild(DateComponent, { static: true }) dateComponent?: DateComponent;
	form = new FormGroup({
		foo: new CustomFormControl({ name: 'foo', type: FormNodeTypes.CONTROL, children: [] }, null),
	});
}

describe('DateComponent', () => {
	let component: HostComponent;
	let fixture: ComponentFixture<HostComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [BaseControlComponent, DateComponent, FieldErrorMessageComponent, HostComponent],
			imports: [FormsModule, ReactiveFormsModule, DateFocusNextDirective],
			providers: [GlobalErrorService, provideMockStore({ initialState: initialAppState })],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(HostComponent);
		component = fixture.componentInstance;
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should add validators', () => {
		const addValidatorsSpy = jest.spyOn(component.dateComponent as DateComponent, 'addValidators');
		fixture.detectChanges();

		expect(addValidatorsSpy).toHaveBeenCalledTimes(1);
	});

	describe('control values', () => {
		it.each([
			['2342346-6213-234T00:00:00.000', 2342346, 6213, 234, 1, 6],
			['2022-01-12T00:00:00.000', 2022, 0o1, 12, 1, 6],
			['2022--01T00:00:00.000', 2022, Number.NaN, 0o1, 0o1, 0o1],
			['2022-01-T00:00:00.000', 2022, 0o1, Number.NaN, 0o1, 0o1],
			['2022-02-01T13:45:00.000', 2022, 2, 0o1, 13, 45, true],
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
				if (component.dateComponent) {
					component.dateComponent.originalDate = '2022-01-01T01:06:00.000';
					component.dateComponent.displayTime = displayTime;
				}

				fixture.detectChanges();

				component.dateComponent?.onDayChange(day);
				component.dateComponent?.onMonthChange(month);
				component.dateComponent?.onYearChange(year);
				component.dateComponent?.onHourChange(hour);
				component.dateComponent?.onMinuteChange(minute);
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
				if (component.dateComponent) {
					component.dateComponent.originalDate = '2022-01-01T01:06:00.000';
					component.dateComponent.displayTime = displayTime;
					component.dateComponent.isoDate = false;
				}

				fixture.detectChanges();

				component.dateComponent?.onDayChange(day);
				component.dateComponent?.onMonthChange(month);
				component.dateComponent?.onYearChange(year);
				component.dateComponent?.onHourChange(hour);
				component.dateComponent?.onMinuteChange(minute);
				if (expected === undefined) {
					expect(component.form.get('foo')?.value).toBeNull();
				} else {
					expect((component.form.get('foo')?.value as Date).toString()).toEqual(expected.toString());
				}
			}
		);

		it('should propagate control value to subjects', fakeAsync(() => {
			const date = new Date('1995-12-17T03:24:00');
			component.dateComponent?.control?.patchValue(date.toISOString());

			component.dateComponent?.valueWriteBack(date.toISOString());

			tick();
			component.dateComponent?.control?.meta.changeDetection?.detectChanges();

			expect(component.dateComponent?.day).toEqual(date.getDate());
			expect(component.dateComponent?.month).toEqual(date.getMonth() + 1);
			expect(component.dateComponent?.year).toEqual(date.getFullYear());
			expect(component.dateComponent?.hour).toEqual(date.getUTCHours());
			expect(component.dateComponent?.minute).toEqual(date.getUTCMinutes());
		}));
	});

	describe('error handling', () => {
		it('should return empty if the day, month and year are not defined', () => {
			if (component.dateComponent) {
				component.dateComponent.errors = {
					error: true,
					date: new Date(),
					errors: [{ error: false, reason: 'foo', index: 1 }],
				};
			}
			expect(component.dateComponent?.elementHasErrors(1)).toBe(false);
		});

		it('should return true if there are some errors with the same index', () => {
			if (component.dateComponent) {
				component.dateComponent.day = 2;
				component.dateComponent.year = 2021;
				component.dateComponent.month = 2;
				component.dateComponent.errors = {
					error: true,
					date: new Date(),
					errors: [{ error: false, reason: 'foo', index: 1 }],
				};
			}
			expect(component.dateComponent?.elementHasErrors(1)).toBe(true);
		});

		it('should return false if there are no errors with the same index', () => {
			if (component.dateComponent) {
				component.dateComponent.day = 2;
				component.dateComponent.year = 2021;
				component.dateComponent.month = 2;
				component.dateComponent.errors = {
					error: true,
					date: new Date(),
					errors: [{ error: false, reason: 'foo', index: 1 }],
				};
			}
			expect(component.dateComponent?.elementHasErrors(2)).toBe(false);
		});
	});
});
