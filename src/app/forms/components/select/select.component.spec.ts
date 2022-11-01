import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { CustomFormControl, FormNodeOption, FormNodeTypes } from '@forms/services/dynamic-form.types';
import { BaseControlComponent } from '../base-control/base-control.component';
import { FieldErrorMessageComponent } from '../field-error-message/field-error-message.component';

import { SelectComponent } from './select.component';

@Component({
  selector: 'app-host-component',
  template: `<form [formGroup]="form">
    <app-select name="foo" label="Foo" [options]="options" formControlName="foo"></app-select>
  </form> `,
  styles: []
})
class HostComponent {
  form = new FormGroup({
    foo: new CustomFormControl({ name: 'foo', type: FormNodeTypes.CONTROL, children: [] }, null)
  });
  options: FormNodeOption<string | number | boolean>[] = [
    { label: 'Value 1', value: '1' },
    { label: 'Value 2', value: '2' },
    { label: 'Value 3', value: '3' }
  ];
}

describe('SelectComponent', () => {
  let component: HostComponent;
  let fixture: ComponentFixture<HostComponent>;
  let selectComponent: SelectComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BaseControlComponent, FieldErrorMessageComponent, HostComponent, SelectComponent],
      imports: [FormsModule, ReactiveFormsModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HostComponent);
    component = fixture.componentInstance;
    selectComponent = fixture.debugElement.query(By.directive(SelectComponent)).nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('value', () => {
    it('should be propagated from element to the form control', () => {
      const foo = component.form.get('foo');
      const select = fixture.debugElement.query(By.css('select'));
      expect(select).toBeTruthy();

      (select.nativeElement as HTMLSelectElement).value = '1';
      select.nativeElement.dispatchEvent(new Event('change'));
      expect(foo?.value).toEqual('1');
      expect(foo?.value).not.toBeNull();
    });

    it('should select the right option when the form value is updated', () => {
      component.form.patchValue({ foo: '2' });
      fixture.detectChanges();
      const select = fixture.debugElement.query(By.css('select'));
      expect(select).toBeTruthy();
      expect(select.nativeElement.value).toEqual('2');
    });
  });
});
