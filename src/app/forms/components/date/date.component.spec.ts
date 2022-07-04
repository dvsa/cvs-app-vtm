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
      [new Date(NaN), 234234, 6213, 234],
      [new Date(`${2022}-${0o1}-${0o1}`), 2022, 0o1, 0o1],
      [null, NaN, 0o1, 0o1],
      [null, 2022, NaN, 0o1],
      [null, 2022, 0o1, NaN]
    ])('should be %s for %d, %d, %d', (expected: Date | null, year: number, month: number, day: number) => {
      component.dateComponent?.onDayChange(day);
      component.dateComponent?.onMonthChange(month);
      component.dateComponent?.onYearChange(year);
      if (expected === null) {
        expect(component.form.get('foo')?.value).toBeNull();
      } else {
        expect((component.form.get('foo')?.value as Date).toString()).toEqual(expected.toString());
      }
    });

    it('should propagate control value to subjects', fakeAsync(() => {
      const date = new Date(`${2022}-${0o1}-${0o1}`);
      component.dateComponent?.control?.patchValue(date.toISOString());

      component.dateComponent?.valueWriteBack(date.toISOString());

      tick();
      component.dateComponent?.control?.meta.changeDetection?.detectChanges();

      expect(component.dateComponent?.day).toEqual(date.getDate());
      expect(component.dateComponent?.month).toEqual(date.getMonth() + 1);
      expect(component.dateComponent?.year).toEqual(date.getFullYear());
    }));
  });
});
