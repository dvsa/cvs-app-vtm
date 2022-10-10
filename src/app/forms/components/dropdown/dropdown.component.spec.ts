import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomFormControl, FormNodeTypes } from '@forms/services/dynamic-form.types';
import { BaseControlComponent } from '../base-control/base-control.component';
import { FieldErrorMessageComponent } from '../field-error-message/field-error-message.component';
import { DropdownComponent } from './dropdown.component';

@Component({
  selector: 'app-host-component',
  template: `<form [formGroup]="form">
    <app-dropdown name="foo" label="Foo" [options]="[]" formControlName="foo"></app-dropdown>
  </form> `,
  styles: []
})
class HostComponent {
  form = new FormGroup({
    foo: new CustomFormControl({ name: 'foo', type: FormNodeTypes.CONTROL }, '')
  });
}

describe('DropdownComponent', () => {
  let component: HostComponent;
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BaseControlComponent, DropdownComponent, FieldErrorMessageComponent, HostComponent ],
      imports: [FormsModule, ReactiveFormsModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
