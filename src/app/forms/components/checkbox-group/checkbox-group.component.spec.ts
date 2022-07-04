import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { MultiOptions } from '../../models/options.model';
import { CustomFormControl, FormNodeTypes } from '../../services/dynamic-form.types';
import { BaseControlComponent } from '../base-control/base-control.component';
import { FieldErrorMessageComponent } from '../field-error-message/field-error-message.component';
import { CheckboxGroupComponent } from './checkbox-group.component';

@Component({
  selector: 'app-host-component',
  template: `<form [formGroup]="form">
    <app-checkbox-group name="foo" label="Foo" [options]="options" formControlName="foo"></app-checkbox-group>
  </form> `,
  styles: []
})
class HostComponent {
  form = new FormGroup({
    foo: new CustomFormControl({ name: 'foo', type: FormNodeTypes.CONTROL, children: [] }, null)
  });
  options: MultiOptions = [
    { label: 'Value 1', value: '1' },
    { label: 'Value 2', value: '2' },
    { label: 'Value 3', value: '3' }
  ];
}

describe('CheckboxGroupComponent', () => {
  let component: HostComponent;
  let fixture: ComponentFixture<HostComponent>;
  let checkboxGroupComponent: CheckboxGroupComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HostComponent, CheckboxGroupComponent, BaseControlComponent, FieldErrorMessageComponent],
      imports: [FormsModule, ReactiveFormsModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HostComponent);
    component = fixture.componentInstance;
    checkboxGroupComponent = fixture.debugElement.query(By.directive(CheckboxGroupComponent)).nativeElement;
    fixture.detectChanges();
  });

  describe('value', () => {
    it('should be propagated from element to the form control', () => {
      const foo = component.form.get('foo');
      const boxes = fixture.debugElement.queryAll(By.css('input[type="checkbox"]'));
      expect(boxes.length).toBe(3);

      (boxes[1].nativeElement as HTMLInputElement).click();
      (boxes[0].nativeElement as HTMLInputElement).click();
      expect(foo?.value).toEqual(['2', '1']);
      (boxes[1].nativeElement as HTMLInputElement).click();
      (boxes[0].nativeElement as HTMLInputElement).click();
      expect(foo?.value).toBeNull();
    });

    it('should be propagated from the form control to the element', () => {
      component.form.patchValue({ foo: ['1', '2'] });
      fixture.detectChanges();
      const checkedBoxes = fixture.debugElement.queryAll(By.css('input[type="checkbox"][checked=true]'));

      checkedBoxes.forEach((box) => {
        const {
          nativeElement: { value, checked, name }
        } = box;
      });
      expect(checkedBoxes.length).toBe(2);
    });
  });
});
