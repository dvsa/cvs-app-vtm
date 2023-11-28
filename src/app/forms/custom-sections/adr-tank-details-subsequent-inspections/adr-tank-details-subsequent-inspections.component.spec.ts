import { ComponentFixture, TestBed } from '@angular/core/testing';

import {
  FormsModule, NG_VALUE_ACCESSOR, NgControl, ReactiveFormsModule,
} from '@angular/forms';
import { DateComponent } from '@forms/components/date/date.component';
import { FORM_INJECTION_TOKEN } from '@forms/components/dynamic-form-field/dynamic-form-field.component';
import { FieldErrorMessageComponent } from '@forms/components/field-error-message/field-error-message.component';
import { SelectComponent } from '@forms/components/select/select.component';
import { TextInputComponent } from '@forms/components/text-input/text-input.component';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { CustomFormControl, FormNodeTypes } from '@forms/services/dynamic-form.types';
import { provideMockStore } from '@ngrx/store/testing';
import { State, initialAppState } from '@store/index';
import { AdrTankDetailsSubsequentInspectionsComponent } from './adr-tank-details-subsequent-inspections.component';

describe('AdrTankDetailsSubsequentInspectionsComponent', () => {
  let component: AdrTankDetailsSubsequentInspectionsComponent;
  let fixture: ComponentFixture<AdrTankDetailsSubsequentInspectionsComponent>;

  const control = new CustomFormControl({
    name: 'techRecord_adrDetails_tank_tankDetails_tc3Details',
    type: FormNodeTypes.CONTROL,
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdrTankDetailsSubsequentInspectionsComponent, SelectComponent, FieldErrorMessageComponent, DateComponent, TextInputComponent],
      imports: [DynamicFormsModule, FormsModule, ReactiveFormsModule],
      providers: [
        provideMockStore<State>({ initialState: initialAppState }),
        { provide: NG_VALUE_ACCESSOR, useExisting: AdrTankDetailsSubsequentInspectionsComponent, multi: true },
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

    fixture = TestBed.createComponent(AdrTankDetailsSubsequentInspectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should, upon instantiation, add a form control to the form array', () => {
    expect(component.formArray).toHaveLength(1);
  });

  describe('ngOnInit', () => {
    it('should set a subscription to listen to form array changes, and patch the control value', () => {
      const ngOnInitSpy = jest.spyOn(component, 'ngOnInit');
      component.ngOnInit();
      expect(ngOnInitSpy).toHaveBeenCalled();
    });
  });

  describe('ngOnDestroy', () => {
    it('should next true and complete the destroy subject, triggering all subscriptions linked to it to complete also', () => {
      const ngOnDestroySpy = jest.spyOn(component, 'ngOnDestroy');
      const destroySubjectNextSpy = jest.spyOn(component.destroy$, 'next');
      const destroySubjectCompletedSpy = jest.spyOn(component.destroy$, 'complete');
      component.ngOnDestroy();
      expect(ngOnDestroySpy).toHaveBeenCalled();
      expect(destroySubjectNextSpy).toHaveBeenCalledWith(true);
      expect(destroySubjectCompletedSpy).toHaveBeenCalled();
    });
  });

  describe('createSubsequentInspection', () => {
    it('should return a new form group representing a subsequent inspection (for ADR Tank Details)', () => {
      const index = 1;
      const methodSpy = jest.spyOn(component, 'createSubsequentInspection');
      const result = component.createSubsequentInspection(1);
      expect(methodSpy).toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(result.meta).toBeDefined();
      expect(result.meta.customId).toBe(`subsequent[${index}]`);
      expect(Object.values(result.controls)).toHaveLength(3);
      expect(result.get('techRecord_adrDetails_tank_tankDetails_tc3Details_tc3Type')).toBeDefined();
      expect(result.get('techRecord_adrDetails_tank_tankDetails_tc3Type_tc3PeriodicNumber')).toBeDefined();
      expect(result.get('techRecord_adrDetails_tank_tankDetails_tc3Type_tc3PeriodicExpiryDate')).toBeDefined();
    });
  });

  describe('addSubsequentInspection', () => {
    it('should add an extra form group to the end of the form array', () => {
      const methodSpy = jest.spyOn(component, 'addSubsequentInspection');
      component.addSubsequentInspection();
      expect(methodSpy).toHaveBeenCalled();
      expect(component.formArray).toHaveLength(2);
    });
  });

  describe('removeSubsequentInspection', () => {
    it('should remove the form group, from the form array at the correct index', () => {
      component.addSubsequentInspection();
      component.addSubsequentInspection();
      component.addSubsequentInspection();
      const methodSpy = jest.spyOn(component, 'removeSubsequentInspection');
      component.removeSubsequentInspection(3);
      component.removeSubsequentInspection(2);
      component.removeSubsequentInspection(1);
      component.removeSubsequentInspection(0);
      expect(methodSpy).toHaveBeenCalledTimes(4);
      expect(component.formArray).toHaveLength(1); // form array cannot have less than 1 form group
    });
  });
});
