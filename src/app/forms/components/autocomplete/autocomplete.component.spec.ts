import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomFormControl, FormNodeTypes } from '@forms/services/dynamic-form.types';
import { FieldErrorMessageComponent } from '../field-error-message/field-error-message.component';
import { AutocompleteComponent } from './autocomplete.component';

jest.mock('accessible-autocomplete/dist/accessible-autocomplete.min', () => {
  return {
    __esModule: true,
    default: jest.fn(),
    enhanceSelectElement: () => {}
  };
});

@Component({
  selector: 'app-host-component',
  template: '<form [formGroup]="form"><app-autocomplete [name]="name" [options]="options" formControlName="foo"></app-autocomplete></form>'
})
class HostComponent {
  name = 'autocomplete';
  options = ['option1', 'option2', 'option3'];
  form = new FormGroup({ foo: new CustomFormControl({ name: 'foo', type: FormNodeTypes.CONTROL }, '') });
}

describe('AutocompleteComponent', () => {
  let component: HostComponent;
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AutocompleteComponent, HostComponent, FieldErrorMessageComponent],
      imports: [FormsModule, ReactiveFormsModule]
    }).compileComponents();
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
