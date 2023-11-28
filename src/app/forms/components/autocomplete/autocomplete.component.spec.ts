import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { CustomFormControl, FormNodeTypes } from '@forms/services/dynamic-form.types';
import { of } from 'rxjs';
import { FieldErrorMessageComponent } from '../field-error-message/field-error-message.component';
import { AutocompleteComponent } from './autocomplete.component';

jest.mock('accessible-autocomplete/dist/accessible-autocomplete.min', () => {
  return {
    __esModule: true,
    default: jest.fn(),
    enhanceSelectElement: () => {},
  };
});

@Component({
  selector: 'app-host-component',
  template: '<form [formGroup]="form"><app-autocomplete [name]="name" [options$]="options$" formControlName="foo"></app-autocomplete></form>',
})
class HostComponent {
  name = 'autocomplete';
  options$ = of([
    { label: 'option1', value: 'option1' },
    { label: 'option2', value: 'option2' },
  ]);
  form = new FormGroup({ foo: new CustomFormControl({ name: 'foo', type: FormNodeTypes.CONTROL }, '') });
}

describe('AutocompleteComponent', () => {
  let component: HostComponent;
  let fixture: ComponentFixture<HostComponent>;
  let autocompleteComponent: AutocompleteComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AutocompleteComponent, HostComponent, FieldErrorMessageComponent],
      imports: [FormsModule, ReactiveFormsModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HostComponent);
    component = fixture.componentInstance;
    autocompleteComponent = fixture.debugElement.query(By.directive(AutocompleteComponent)).componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it.each([
    ['option1', of([{ label: 'option1', value: 'option1' }]), 'option1'],
    [undefined, of([{ label: 'option1', value: 'option1' }]), 'option3'],
  ])('should return %s for %o when looking for $s', (expected, options$, label) => {
    autocompleteComponent.options$ = options$;
    expect(autocompleteComponent.findOptionValue(label)).toBe(expected);
  });

  it('should call handleChange when input value changes', () => {
    const handleChangeSpy = jest.spyOn(autocompleteComponent, 'handleChange');
    const autocompleteInput: HTMLInputElement = fixture.debugElement.query(By.css(`#${component.name}`)).nativeElement;

    autocompleteInput.dispatchEvent(new Event('change'));

    expect(handleChangeSpy).toHaveBeenCalled();
  });

  it('should find option value by label and propagate to form control', () => {
    const findOptionValueSpy = jest.spyOn(autocompleteComponent, 'findOptionValue');
    const control = component.form.get('foo');

    autocompleteComponent.handleChange({ target: { value: 'option2' } });

    expect(findOptionValueSpy).toHaveBeenCalled();
    expect(control?.value).toBe('option2');
    expect(control?.touched).toBeTruthy();
  });

  it('should propagate "" to form control when input is left empty', () => {
    const findOptionValueSpy = jest.spyOn(autocompleteComponent, 'findOptionValue');
    const control = component.form.get('foo');

    autocompleteComponent.handleChange({ target: { value: '' } });

    expect(findOptionValueSpy).toHaveBeenCalled();
    expect(control?.value).toBe('');
    expect(control?.touched).toBeTruthy();
  });

  it('should propagate "[INVALID_OPTION]" to form control when value is not an option', () => {
    const findOptionValueSpy = jest.spyOn(autocompleteComponent, 'findOptionValue');
    const control = component.form.get('foo');

    autocompleteComponent.handleChange({ target: { value: 'option3' } });

    expect(findOptionValueSpy).toHaveBeenCalled();
    expect(control?.value).toBe('[INVALID_OPTION]');
    expect(control?.touched).toBeTruthy();
  });
});
