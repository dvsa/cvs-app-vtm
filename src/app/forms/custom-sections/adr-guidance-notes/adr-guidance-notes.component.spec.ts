import { ComponentFixture, TestBed } from '@angular/core/testing';

import {
  FormsModule, NG_VALUE_ACCESSOR, NgControl, ReactiveFormsModule,
} from '@angular/forms';
import { FORM_INJECTION_TOKEN } from '@forms/components/dynamic-form-field/dynamic-form-field.component';
import { FieldErrorMessageComponent } from '@forms/components/field-error-message/field-error-message.component';
import { SelectComponent } from '@forms/components/select/select.component';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { CustomFormControl, FormNodeTypes } from '@forms/services/dynamic-form.types';
import { AdrGuidanceNotesComponent } from './adr-guidance-notes.component';

describe('AdrGuidanceNotesComponent', () => {
  let component: AdrGuidanceNotesComponent;
  let fixture: ComponentFixture<AdrGuidanceNotesComponent>;

  const control = new CustomFormControl({
    name: 'techRecord_adrDetails_additionalNotes_guidanceNotes',
    label: 'Guidance Notes',
    type: FormNodeTypes.CONTROL,
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdrGuidanceNotesComponent, SelectComponent, FieldErrorMessageComponent],
      imports: [DynamicFormsModule, FormsModule, ReactiveFormsModule],
      providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: AdrGuidanceNotesComponent, multi: true },
        {
          provide: NgControl,
          useValue: {
            control: { key: control.meta.name, value: control },
          },
        },
        { provide: FORM_INJECTION_TOKEN, useValue: {} },
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(AdrGuidanceNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    component.formArray.patchValue([]);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set a subscription to listen to form array changes, and patch the control value', () => {
      const ngOnInitSpy = jest.spyOn(component, 'ngOnInit');
      component.ngOnInit();
      expect(ngOnInitSpy).toHaveBeenCalled();
    });
  });

  describe('ngAfterContentInit', () => {

    it('should set the form control name', () => {
      component.ngAfterContentInit();
      expect(component.name).toBeTruthy();
    });

    it('should inject the form to which the control belongs', () => {
      component.ngAfterContentInit();
      expect(component.control).toBeTruthy();
    });

    it('should inject the control created by the dynamic form service, which is derrived from the template', () => {
      component.ngAfterContentInit();
      expect(component.control).toBeTruthy();
    });

    it('should make this control the first index of the form array', () => {
      const formArraySpy = jest.spyOn(component.formArray, 'push');
      component.ngAfterContentInit();
      expect(formArraySpy).toHaveBeenCalledTimes(1);
      expect(component.formArray.controls.at(0)).toBeDefined();
    });
  });

  describe('addGuidanceNote', () => {
    it('should add a copy of the first guidance control note to the form array (but with a reset value)', () => {
      const methodSpy = jest.spyOn(component, 'addGuidanceNote');
      const formArraySpy = jest.spyOn(component.formArray, 'push');
      component.addGuidanceNote();
      expect(methodSpy).toHaveBeenCalled();
      expect(formArraySpy).toHaveBeenCalled();
      expect(component.formArray.controls.at(1)).toBeDefined();
      expect(component.formArray.controls.at(1)?.value).toBeFalsy();
    });
  });

  describe('removeGuidanceNote', () => {
    it('should remove the guidance note control from the form array at the index specified', () => {
      const methodSpy = jest.spyOn(component, 'removeGuidanceNote');
      const formArraySpy = jest.spyOn(component.formArray, 'removeAt');

      component.addGuidanceNote();
      component.addGuidanceNote();
      component.addGuidanceNote();
      component.addGuidanceNote();

      component.removeGuidanceNote(3);
      component.removeGuidanceNote(2);

      expect(methodSpy).toHaveBeenCalledTimes(2);
      expect(formArraySpy).toHaveBeenCalledTimes(2);
      expect(component.formArray.controls.at(4)).toBeUndefined();
      expect(component.formArray.controls.at(3)).toBeUndefined();
      expect(component.formArray.controls.at(2)).toBeDefined();
      expect(component.formArray.controls).toHaveLength(3);
    });
  });
});
