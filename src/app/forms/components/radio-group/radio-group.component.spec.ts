import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { CustomFormControl, FormNodeTypes } from '../../services/dynamic-form.types';
import { RadioGroupComponent } from './radio-group.component';
import { MultiOptions } from '../../../models/options.model';
import { BaseControlComponent } from '../base-control/base-control.component';

@Component({
  selector: 'app-host-component',
  template: `<form [formGroup]="form">
  <app-radio-group name="foo" label="Foo" [options]="options" formControlName="foo"></app-radio-group>
</form>
`,
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

describe('RadioGroupComponent', () => {
  let component: HostComponent;
  let fixture: ComponentFixture<HostComponent>;
  let radioGroupComponent: RadioGroupComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HostComponent, RadioGroupComponent, BaseControlComponent],
      imports: [FormsModule, ReactiveFormsModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HostComponent);
    component = fixture.componentInstance;
    radioGroupComponent = fixture.debugElement.query(By.directive(RadioGroupComponent)).nativeElement;
    fixture.detectChanges();
  });

  describe('value', () => {
    it('should be propagated from element to the form control', () => {
      const foo = component.form.get('foo');
      const radios = fixture.debugElement.queryAll(By.css('input[type="radio"]'));
      expect(radios.length).toBe(3);

      (radios[0].nativeElement as HTMLInputElement).click();
      expect(foo?.value).toEqual('1');
      (radios[1].nativeElement as HTMLInputElement).click();
      expect(foo?.value).toEqual('2');
      (radios[1].nativeElement as HTMLInputElement).click();
      expect(foo?.value).not.toBeNull();
    });

    it('should check a radio button when the form value is updated', () => {
      component.form.patchValue({ foo: '2' });
      fixture.detectChanges();
      const radios2 = fixture.debugElement.queryAll(By.css('input[checked=true]'));
      expect(radios2.length).toBe(1);
      expect(radios2[0].nativeElement.id).toEqual('foo-2-radio');
      component.form.patchValue({ foo: '3' });
      fixture.detectChanges();
      const radios3 = fixture.debugElement.queryAll(By.css('input[checked=true]'));
      expect(radios3.length).toBe(1);
      expect(radios3[0].nativeElement.id).toEqual('foo-3-radio');
    });
  });
});
