import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomFormControl, FormNodeTypes } from '@forms/services/dynamic-form.types';
import { DateValidators } from '@forms/validators/date/date.validators';
import { BaseControlComponent } from '../base-control/base-control.component';
import { FieldErrorMessageComponent } from '../field-error-message/field-error-message.component';
import { DateComponent } from './date.component';

@Component({
  selector: 'app-host-component',
  template: `<form [formGroup]="form">
    <app-date name="foo" label="Foo" formControlName="foo"></app-date>
  </form> `,
  styles: []
})
class HostComponent {
  @ViewChild(DateComponent, { static: true }) dateComponent?: DateComponent;
  form = new FormGroup({
    foo: new CustomFormControl({ name: 'foo', type: FormNodeTypes.CONTROL, children: [] }, null)
  });
}

describe('DateComponent', () => {
  let component: HostComponent;
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DateComponent, BaseControlComponent, HostComponent, FieldErrorMessageComponent],
      imports: [FormsModule, ReactiveFormsModule]
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
    fixture.detectChanges();

    expect(component.dateComponent!.control?.hasValidator(DateValidators.validDate)).toBeTruthy();
  });

  describe('control values', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it.each([
      [new Date(NaN), 2342346, 6213, 234, 1, 6],
      [new Date(Date.UTC(2022, 0, 12, 1, 6, 0)), 2022, 0o1, 12, 1, 6],
      [new Date(`2022-08-01T00:06:00.000Z`), 2022, 8, 0o1, 1, 6],
      [new Date(`2022-02-01T01:06:00.000Z`), 2022, 2, 0o1, 1, 6],
      [null, NaN, 0o1, 0o1, 0o1, 0o1],
      [null, 2022, NaN, 0o1, 0o1, 0o1],
      [null, 2022, 0o1, NaN, 0o1, 0o1]
    ])('should be %s for %d, %d, %d', (expected: Date | null, year: number, month: number, day: number, hour: number, minute: number) => {
      component.dateComponent!.originalDate = '2022-01-01T01:06:00.000Z';
      component.dateComponent?.onDayChange(day);
      component.dateComponent?.onMonthChange(month);
      component.dateComponent?.onYearChange(year);
      component.dateComponent?.onHourChange(hour);
      component.dateComponent?.onMinuteChange(minute);
      if (expected === null) {
        expect(component.form.get('foo')?.value).toBeNull();
      } else {
        expect((component.form.get('foo')?.value as Date).toString()).toEqual(expected.toString());
      }
    });

    it('should propagate control value to subjects', fakeAsync(() => {
      const date = new Date(`1995-12-17T03:24:00`);
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
});
