import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
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
      [new Date(`${2022}-${0o1}-${0o1}`), 2022, 0o1, 0o1]
    ])('should be %s for %d, %d, %d', (expected: Date, year: number, month: number, day: number) => {
      component.dateComponent?.onDayChange(day);
      component.dateComponent?.onMonthChange(month);
      component.dateComponent?.onYearChange(year);
      expect((component.form.get('foo')?.value as Date).toString()).toEqual(expected.toString());
    });
  });
});
