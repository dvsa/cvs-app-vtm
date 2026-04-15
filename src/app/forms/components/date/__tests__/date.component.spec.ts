import { Component } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { provideMockStore } from '@ngrx/store/testing';
import { CustomFormControl, FormNodeTypes } from '@services/dynamic-forms/dynamic-form.types';
import { initialAppState } from '@store/index';
import { DateComponent } from '../date.component';

@Component({
	selector: 'app-date-host',
	template: `<form [formGroup]="form">
    <app-date name="foo" label="Foo" formControlName="foo"></app-date>
  </form> `,
	imports: [
		DateComponent,
		FormsModule,
		ReactiveFormsModule,
	],
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

	afterEach(() => {
		fixture.destroy();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should add validators', fakeAsync(() => {
		const addValidatorsSpy = vi.spyOn(dateComponent, 'addValidators');
		fixture.detectChanges();
		tick();

		expect(addValidatorsSpy).toHaveBeenCalledTimes(1);
	}));

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
			fakeAsync((
				expected: string | undefined,
				year: number | undefined,
				month: number | undefined,
				day: number | undefined,
				hour: number | undefined,
				minute: number | undefined,
				displayTime = false
			) => {
				dateComponent.originalDate = '2022-01-01T01:06:00.000';
				vi.spyOn(dateComponent, 'displayTime').mockReturnValue(displayTime);
				vi.spyOn(dateComponent, 'addValidators').mockImplementation(() => undefined);

				fixture.detectChanges();
				tick();

				dateComponent.onDayChange(day);
				dateComponent.onMonthChange(month);
				dateComponent.onYearChange(year);
				dateComponent.onHourChange(hour);
				dateComponent.onMinuteChange(minute);
				tick();

				if (expected === undefined) {
					expect(component.form.get('foo')?.value).toBeNull();
				} else {
					expect((component.form.get('foo')?.value as Date).toString()).toEqual(expected.toString());
				}
			})
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
			fakeAsync((
				expected: string | undefined,
				year: number | undefined,
				month: number | undefined,
				day: number | undefined,
				hour: number | undefined,
				minute: number | undefined,
				displayTime = false
			) => {
				dateComponent.originalDate = '2022-01-01T01:06:00.000';
				vi.spyOn(dateComponent, 'displayTime').mockReturnValue(displayTime);
				vi.spyOn(dateComponent, 'isoDate').mockReturnValue(false);
				vi.spyOn(dateComponent, 'addValidators').mockImplementation(() => undefined);

				fixture.detectChanges();
				tick();

				dateComponent.onDayChange(day);
				dateComponent.onMonthChange(month);
				dateComponent.onYearChange(year);
				dateComponent.onHourChange(hour);
				dateComponent.onMinuteChange(minute);
				tick();

				if (expected === undefined) {
					expect(component.form.get('foo')?.value).toBeNull();
				} else {
					expect((component.form.get('foo')?.value as Date).toString()).toEqual(expected.toString());
				}
			})
		);

		it('should propagate control value to subjects', fakeAsync(() => {
			const date = new Date('1995-12-17T03:24:00');
			dateComponent.control?.patchValue(date.toISOString());

			dateComponent.valueWriteBack(date.toISOString());

			tick();
			dateComponent.control?.meta.changeDetection?.detectChanges();

			expect(dateComponent.day).toEqual(date.getDate());
			expect(dateComponent.month).toEqual(date.getMonth() + 1);
			expect(dateComponent.year).toEqual(date.getFullYear());
			expect(dateComponent.hour).toEqual(date.getUTCHours());
			expect(dateComponent.minute).toEqual(date.getUTCMinutes());
		}));
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
