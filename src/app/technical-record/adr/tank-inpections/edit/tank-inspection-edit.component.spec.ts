import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule, FormGroupDirective } from '@angular/forms';
import { of, EMPTY } from 'rxjs';
import { By } from '@angular/platform-browser';

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

  it('should call vehicleTypeSelected on validationMapper if vehicle type exist', () => {
    const type = TESTING_UTILS.mockVehicleDetails().type;
    spyOn(validationMapper, 'vehicleTypeSelected');
    component.vehicleType = type;

    fixture.detectChanges();

    expect(validationMapper.vehicleTypeSelected).toHaveBeenCalledWith(type);
  });

  describe('addSubsequentInspectionGroup', () => {
    it('should add a subsequent tank inspection when button is clicked', () => {
      fixture.detectChanges();

      const addInspection: HTMLElement = fixture.debugElement.query(
        By.css('[id=test-addTc3Details]')
      ).nativeElement;
      addInspection.click();

      expect(component.tc3Details.length).toBe(2);
    });
  });

  describe('removeSubsequentInspectionGroup', () => {
    it('should remove the subsequent tank inspection when button is clicked', () => {
      fixture.detectChanges();

      const selectedSubsequentInspection: HTMLElement = fixture.debugElement.query(
        By.css('[id=test-removeTc3-0]')
      ).nativeElement;
      selectedSubsequentInspection.click();

      expect(component.tc3Details.length).toBe(0);
    });
  });

  describe('handleFormChanges', () => {
    it('should hide section when tankInspectionValidationState$ value is HIDDEN', () => {
      spyOn(validationMapper, 'getCurrentState').and.callFake(() =>
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

      expect(component.tc3Details.controls.length).toBe(0);
    });

    it('should show section when tankInspectionValidationState has no status', () => {
      spyOn(validationMapper, 'getCurrentState').and.callFake(() => of(EMPTY));

      fixture.detectChanges();

      let tankInspectionState: STATUS;
      component.tankInspectionValidationState$.subscribe(
        ({ tankInspectionsEdit }) => (tankInspectionState = tankInspectionsEdit)
      );
      expect(component.showTankInspections).toBeTruthy();
    });
  });
});
