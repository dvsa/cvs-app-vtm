import { ComponentFixture, TestBed } from '@angular/core/testing';

import {
  FormControl, FormGroup, NG_VALUE_ACCESSOR, NgControl,
} from '@angular/forms';
import { GlobalWarningService } from '@core/components/global-warning/global-warning.service';
import { FORM_INJECTION_TOKEN } from '@forms/components/dynamic-form-field/dynamic-form-field.component';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { CustomFormControl, FormNodeTypes } from '@forms/services/dynamic-form.types';
import { provideMockStore } from '@ngrx/store/testing';
import { initialAppState } from '@store/index';
import { AdrTankStatementUnNumberComponent } from './adr-tank-statement-un-number.component';

describe('AdrTankStatementUnNumberComponent', () => {
  let component: AdrTankStatementUnNumberComponent;
  let fixture: ComponentFixture<AdrTankStatementUnNumberComponent>;

  const control = new CustomFormControl({
    name: 'techRecord_adrDetails_tank_tankDetails_tankStatement_productListUnNo',
    label: 'UN Number',
    type: FormNodeTypes.CONTROL,
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicFormsModule],
      declarations: [AdrTankStatementUnNumberComponent],
      providers: [
        provideMockStore({ initialState: initialAppState }),
        { provide: GlobalWarningService, useValue: { error$: jest.fn() } },
        { provide: NG_VALUE_ACCESSOR, useExisting: AdrTankStatementUnNumberComponent, multi: true },
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

    fixture = TestBed.createComponent(AdrTankStatementUnNumberComponent);
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
      expect(component.formArray.value).toHaveLength(2);
    });
  });

  describe('addControl', () => {
    it('should add a copy of the control to the end of the form array', () => {
      const spy = jest.spyOn(component, 'addControl');
      component.addControl();
      component.addControl();
      component.addControl();
      component.addControl();
      expect(spy).toHaveBeenCalled();
      expect(component.formArray.value).toHaveLength(5);
    });
  });
});
