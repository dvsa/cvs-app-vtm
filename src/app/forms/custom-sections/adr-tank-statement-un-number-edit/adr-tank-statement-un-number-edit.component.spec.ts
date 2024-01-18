import { ComponentFixture, TestBed } from '@angular/core/testing';

import {
  FormControl, FormGroup, NG_VALUE_ACCESSOR, NgControl,
} from '@angular/forms';
import { GlobalWarningService } from '@core/components/global-warning/global-warning.service';
import { FORM_INJECTION_TOKEN } from '@forms/components/dynamic-form-field/dynamic-form-field.component';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { CustomFormControl, FormNodeTypes } from '@forms/services/dynamic-form.types';
import { provideMockStore } from '@ngrx/store/testing';
import { SharedModule } from '@shared/shared.module';
import { initialAppState } from '@store/index';
import { AdrTankStatementUnNumberEditComponent } from './adr-tank-statement-un-number-edit.component';

describe('AdrTankStatementUnNumberEditComponent', () => {
  let component: AdrTankStatementUnNumberEditComponent;
  let fixture: ComponentFixture<AdrTankStatementUnNumberEditComponent>;

  const control = new CustomFormControl({
    name: 'techRecord_adrDetails_tank_tankDetails_tankStatement_productListUnNo',
    label: 'UN Number',
    type: FormNodeTypes.CONTROL,
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicFormsModule, SharedModule],
      declarations: [AdrTankStatementUnNumberEditComponent],
      providers: [
        provideMockStore({ initialState: initialAppState }),
        { provide: GlobalWarningService, useValue: { error$: jest.fn() } },
        { provide: NG_VALUE_ACCESSOR, useExisting: AdrTankStatementUnNumberEditComponent, multi: true },
        {
          provide: NgControl,
          useValue: {
            control: { key: control.meta.name, value: control },
          },
        },
        {
          provide: FORM_INJECTION_TOKEN,
          useValue: new FormGroup({
            techRecord_adrDetails_additionalNotes_guidanceNotes: new FormControl(null),
          }),
        },
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(AdrTankStatementUnNumberEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call ngOnInit', () => {
      const spy = jest.spyOn(component, 'ngOnInit');
      component.ngOnInit();
      expect(spy).toHaveBeenCalled();
    });

    it('should subscribe to the form array value changes', () => {
      const spy = jest.spyOn(component, 'onFormChange');
      component.formArray.patchValue([null]);
      expect(spy).toHaveBeenCalled();
    });

  });

  describe('ngAfterContentInit', () => {
    it('should add an initial control to the form array once the form is injected into the component', () => {
      const spy = jest.spyOn(component, 'addControl');
      component.ngAfterContentInit();
      expect(spy).toHaveBeenCalled();
      expect(component.formArray.value).toHaveLength(1);
    });
  });

  describe('canAddControl', () => {

    it('should return true if a control can be added, e.g. when the previous control is empty, and there is at least 1 control', () => {
      const spy = jest.spyOn(component, 'canAddControl');
      component.formArray.patchValue(['valid']);
      const canAdd = component.canAddControl();
      expect(spy).toHaveBeenCalled();
      expect(canAdd).toBe(true);
    });

    it('should return false if a control cannot be added, e.g. when the previous control is empty', () => {
      const spy = jest.spyOn(component, 'canAddControl');
      component.formArray.patchValue(['valid']);
      component.addControl();
      const canAdd = component.canAddControl();
      expect(spy).toHaveBeenCalled();
      expect(canAdd).toBe(false);
    });
  });

  describe('addControl', () => {
    it('should add a copy of the control to the end of the form array', () => {
      const spy = jest.spyOn(component, 'addControl');
      component.formArray.patchValue(['valid']); // fill in controls, to allow adding of additional ones
      component.addControl('valid');
      component.addControl('valid');
      component.addControl('valid');
      component.addControl('valid');
      expect(spy).toHaveBeenCalled();
      expect(component.formArray.value).toHaveLength(5);
    });

    it('should prevent the adding of additional controls, when the previous one is empty', () => {
      component.addControl();
      expect(component.formArray.value).toHaveLength(1);
    });
  });

  describe('removeControl', () => {
    it('should remove the UN number control from the form array at the index specified', () => {
      const methodSpy = jest.spyOn(component, 'removeControl');

      component.formArray.patchValue(['valid']); // ensure initial is valid to allow adding subsequent controls
      component.addControl('valid');
      component.addControl('valid');
      component.addControl('valid');
      component.addControl('valid');

      component.removeControl(3);
      component.removeControl(2);

      expect(methodSpy).toHaveBeenCalledTimes(2);
      expect(component.formArray.controls.at(4)).toBeUndefined();
      expect(component.formArray.controls.at(3)).toBeUndefined();
      expect(component.formArray.controls.at(2)).toBeDefined();
      expect(component.formArray.controls).toHaveLength(3);
    });
  });

  describe('updateControls', () => {
    it('should update the meta properties of each control after insertion or deletion', () => {
      const methodSpy = jest.spyOn(component, 'updateControls');
      component.formArray.patchValue(['valid']);
      component.addControl('valid');
      expect(methodSpy).toHaveBeenCalled();
      component.removeControl(0);
      expect(methodSpy).toHaveBeenCalled();
      expect(component.formArray.controls).toHaveLength(1);
      expect(component.formArray.controls.at(0)?.meta.customId).toBe('techRecord_adrDetails_tank_tankDetails_tankStatement_productListUnNo_1');
    });
  });
});