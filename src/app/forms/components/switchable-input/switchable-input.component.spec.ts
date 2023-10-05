import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SuffixDirective } from '@forms/directives/suffix.directive';
import { CustomFormControl, FormNodeEditTypes, FormNodeTypes } from '@forms/services/dynamic-form.types';
import { AutocompleteComponent } from '../autocomplete/autocomplete.component';
import { DateComponent } from '../date/date.component';
import { FieldErrorMessageComponent } from '../field-error-message/field-error-message.component';
import { NumberInputComponent } from '../number-input/number-input.component';
import { RadioGroupComponent } from '../radio-group/radio-group.component';
import { ReadOnlyComponent } from '../read-only/read-only.component';
import { SelectComponent } from '../select/select.component';
import { TextAreaComponent } from '../text-area/text-area.component';
import { TextInputComponent } from '../text-input/text-input.component';
import { SwitchableInputComponent } from './switchable-input.component';

describe('SwitchableInputComponent', () => {
  let component: SwitchableInputComponent;
  let fixture: ComponentFixture<SwitchableInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AutocompleteComponent,
        DateComponent,
        FieldErrorMessageComponent,
        NumberInputComponent,
        RadioGroupComponent,
        ReadOnlyComponent,
        SelectComponent,
        SuffixDirective,
        SwitchableInputComponent,
        TextAreaComponent,
        TextInputComponent,
      ],
      imports: [FormsModule, ReactiveFormsModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SwitchableInputComponent);
    component = fixture.componentInstance;
    component.type = FormNodeEditTypes.TEXT;
    component.form = new FormGroup({ foo: new CustomFormControl({ name: 'foo', type: FormNodeTypes.CONTROL }, '') });
    component.name = 'foo';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
