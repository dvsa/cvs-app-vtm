import { By } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ReactiveFormsModule,
  FormsModule,
  FormGroupDirective,
  FormGroup,
  AbstractControl
} from '@angular/forms';
import { of, EMPTY } from 'rxjs';

import { SharedModule } from '@app/shared';
import { TESTING_UTILS } from '@app/utils/testing.utils';
import { BatteryListApplicableEditComponent } from './battery-list-applicable-edit.component';
import { AdrDetails } from '@app/models/adr-details';
import { ValidationMapper, STATUS } from '../../adr-validation.mapper';

describe('BatteryListApplicableEditComponent', () => {
  let fixture: ComponentFixture<BatteryListApplicableEditComponent>;
  let component: BatteryListApplicableEditComponent;
  let validationMapper: ValidationMapper;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, SharedModule],
      declarations: [BatteryListApplicableEditComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        FormGroupDirective,
        {
          provide: FormGroupDirective,
          useValue: TESTING_UTILS.mockFormGroupDirective({
            techRecord: new FormGroup({
              adrDetails: new FormGroup({})
            }) as AbstractControl
          })
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    validationMapper = TestBed.get(ValidationMapper);
    fixture = TestBed.createComponent(BatteryListApplicableEditComponent);
    component = fixture.componentInstance;
    component.adrDetails = TESTING_UTILS.mockAdrDetails({
      listStatementApplicable: true,
      batteryListNumber: 'bat123'
    } as AdrDetails);
  });

  it('should create with initialized form controls', () => {
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should call vehicleTypeSelected on validationMapper if vehicle type exist', () => {
    spyOn(validationMapper, 'vehicleTypeSelected');
    fixture.detectChanges();

    const type = TESTING_UTILS.mockVehicleDetails().type;

    expect(validationMapper.vehicleTypeSelected).toHaveBeenCalledWith(type);
  });

  it('should setup a default battery list reference number', () => {
    fixture.detectChanges();

    const expectedValue = component.adrForm.get('batteryListNumber').value;
    expect(expectedValue).toEqual('bat123');
  });

  describe('handleFormChanges', () => {
    let ele: DebugElement;

    beforeEach(() => {
      ele = fixture.debugElement;
    });

    it('should update the battery list reference number field', () => {
      fixture.detectChanges();

      const refInput: HTMLInputElement = ele.query(By.css('[id=batteryListNumber]'))
        .nativeElement;
      refInput.value = 'bat124';
      refInput.dispatchEvent(new Event('input'));

      const expectedValue = component.adrForm.get('batteryListNumber').value;
      expect(expectedValue).toEqual('bat124');
    });

    it('should reset entered ref number when "no" option is selected', () => {
      fixture.detectChanges();

      const selectedOption: HTMLElement = ele.query(By.css('[id="listStatementApplicable-No"]'))
        .nativeElement;

      selectedOption.click();

      expect(component.adrForm.get('batteryListNumber').value).toBeNull();
    });

    it('should hide section when batterListValidationState$ value is HIDDEN', () => {
      spyOn(validationMapper, 'getCurrentState').and.callFake(() =>
        of({ batteryListApplicableEdit: STATUS.HIDDEN })
      );

      fixture.detectChanges();

      let batteryState: STATUS;
      component.batterListValidationState$.subscribe(
        ({ batteryListApplicableEdit }) => (batteryState = batteryListApplicableEdit)
      );

      expect(batteryState).toEqual(STATUS.HIDDEN);
      expect(fixture).toMatchSnapshot();
      expect(component.adrForm.get('listStatementApplicable').value).toBeNull();
      expect(component.adrForm.get('batteryListNumber').value).toBeNull();
    });

    it('should show section when batterListValidationState$ has no status', () => {
      spyOn(validationMapper, 'getCurrentState').and.callFake(() => of(EMPTY));

      fixture.detectChanges();

      let batteryState: STATUS;
      component.batterListValidationState$.subscribe(
        ({ batteryListApplicableEdit }) => (batteryState = batteryListApplicableEdit)
      );
      expect(component.showBatteryListSection).toBeTruthy();
    });
  });
});
