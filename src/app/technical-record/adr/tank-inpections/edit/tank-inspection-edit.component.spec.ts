import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule, FormGroupDirective } from '@angular/forms';
import { of, EMPTY } from 'rxjs';

import { SharedModule } from '@app/shared';
import { TESTING_UTILS } from '@app/utils/testing.utils';
import { TankInspectionsEditComponent } from './tank-inspections-edit.component';
import { ValidationMapper, STATUS } from '../../adr-validation.mapper';
import { TankDetails } from '@app/models/Tank';

describe('TankInspectionsEditComponent', () => {
  let component: TankInspectionsEditComponent;
  let fixture: ComponentFixture<TankInspectionsEditComponent>;
  let validationMapper: ValidationMapper;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, SharedModule],
      declarations: [TankInspectionsEditComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        FormGroupDirective,
        {
          provide: FormGroupDirective,
          useValue: TESTING_UTILS.mockFormGroupDirective()
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    validationMapper = TestBed.get(ValidationMapper);
    fixture = TestBed.createComponent(TankInspectionsEditComponent);
    component = fixture.componentInstance;

    const tankDetails = {
      ...TESTING_UTILS.mockTankDetails(),
      tc2Details: TESTING_UTILS.mockTc2Details(),
      tc3Details: [TESTING_UTILS.mockTc3Details()]
    } as TankDetails;
    component.tankDetailsData = tankDetails;
  });

  it('should create with initialized form controls', () => {
    fixture.detectChanges();

    expect(component).toBeDefined();
    expect(fixture).toMatchSnapshot();
  });

  /**
   * TODO: More unit tests for this file. In anticipation of tc3Detail
   * removal when story is implemented
   */

  describe('handleFormChanges', () => {
    it('should hide section when vehicle type dispatches HIDDEN', () => {
      spyOn(validationMapper, 'getVehicleTypeState').and.callFake(() =>
        of({ tankInspectionsEdit: STATUS.HIDDEN })
      );

      fixture.detectChanges();

      let tankInspectionState: STATUS;
      component.tankInspectionValidationState$.subscribe(
        ({ tankInspectionsEdit }) => (tankInspectionState = tankInspectionsEdit)
      );

      expect(tankInspectionState).toEqual(STATUS.HIDDEN);
      expect(fixture).toMatchSnapshot();
      expect(component.tc2Details.get('tc2IntermediateApprovalNo').value).toBeNull();
      expect(component.tc2Details.get('tc2IntermediateExpiryDate').value).toBeNull();
      expect(component.tc2Details.get('tc2Type').value).toBeNull();

      expect(component.tc3Details.controls[0].get('tc3Type').value).toBeNull();
      expect(component.tc3Details.controls[0].get('tc3PeriodicNumber').value).toBeNull();
      expect(component.tc3Details.controls[0].get('tc3PeriodicExpiryDate').value).toBeNull();
    });

    it('should show section when selected vehicle type dispatches no status', () => {
      spyOn(validationMapper, 'getVehicleTypeState').and.callFake(() => of(EMPTY));

      fixture.detectChanges();

      let tankInspectionState: STATUS;
      component.tankInspectionValidationState$.subscribe(
        ({ tankInspectionsEdit }) => (tankInspectionState = tankInspectionsEdit)
      );
      expect(component.showTankInspections).toBeTruthy();
    });
  });
});
