import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule, FormGroupDirective } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

import { TESTING_UTILS } from '@app/utils/testing.utils';
import { SharedModule } from '@app/shared';
import { TankDetailsEditComponent } from './tank-details-edit.component';
import { TankStatement } from '@app/models/Tank';
import { SUBSTANCES } from '@app/app.enums';
import { STATEMENT, PRODUCT_LIST } from '../../adr.constants';
import { ValidationMapper, STATUS } from '../../adr-validation.mapper';

describe('TankDetailsEditComponent', () => {
  let component: TankDetailsEditComponent;
  let fixture: ComponentFixture<TankDetailsEditComponent>;
  let validationMapper: ValidationMapper;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, SharedModule],
      declarations: [TankDetailsEditComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        ValidationMapper,
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
    fixture = TestBed.createComponent(TankDetailsEditComponent);
    component = fixture.componentInstance;
    component.tank = TESTING_UTILS.mockTank();
  });

  it('should create with initialized form controls', () => {
    fixture.detectChanges();

    expect(component).toBeDefined();
    expect(fixture).toMatchSnapshot();
  });

  it('should create with mulitiple UN number controls', () => {
    component.tank = TESTING_UTILS.mockTank({
      tankStatement: { productListUnNo: ['listUN1', 'listUN2'] } as TankStatement
    });
    fixture.detectChanges();

    expect(component.productListUnNo.controls.length).toBe(2);
  });

  it('should add a UN number control', () => {
    fixture.detectChanges();
    component.addUNNumberControl();

    expect(component.productListUnNo.controls.length).toBe(1);
  });

  it('should remove all UN number controls', () => {
    component.tank = TESTING_UTILS.mockTank({
      tankStatement: { productListUnNo: ['listUN1'] } as TankStatement
    });
    fixture.detectChanges();
    component.removeAllUNNumberControl();

    expect(component.productListUnNo.controls.length).toBe(0);
  });

  describe('handleFormChanges', () => {
    it('should reset controls when substance permitted is selected', () => {
      fixture.detectChanges();

      const selectedSubstance: HTMLElement = fixture.debugElement.query(
        By.css('[id=substancesPermitted_permitted]')
      ).nativeElement;
      selectedSubstance.click();

      expect(component.substancesPermitted.value).toEqual(SUBSTANCES.PERMITTED);
      expect(component.substanceReferenceSelect.value).toBeNull();
      expect(component.tankStatement.get('statement').value).toBeNull();
      expect(component.tankStatement.get('productListRefNo').value).toBeNull();
      expect(component.productListUnNo.value).toEqual([]);
      expect(component.tankStatement.get('productList').value).toBeNull();
    });

    it('should reset controls within product list when Statement option is selected', () => {
      fixture.detectChanges();

      component.substanceReferenceSelect.setValue(STATEMENT);
      expect(component.tankStatement.get('productListRefNo').value).toBeNull();
      expect(component.productListUnNo.value).toEqual([]);
      expect(component.tankStatement.get('productList').value).toBeNull();
    });

    it(`should reset controls within statement when Product list option is selected
      and also default the addition of UN number`, () => {
      fixture.detectChanges();

      component.substanceReferenceSelect.setValue(PRODUCT_LIST);
      expect(component.tankStatement.get('statement').value).toBeNull();
      expect(component.productListUnNo.controls.length).toBe(1);
    });

    it('should hide section when vehicle type dispatches HIDDEN', () => {
      spyOn(validationMapper, 'getVehicleTypeState').and.callFake(() =>
        of({ tankDetailsEdit: STATUS.HIDDEN })
      );

      fixture.detectChanges();

      let tankState: STATUS;
      component.tankValidationState$.subscribe(
        ({ tankDetailsEdit }) => (tankState = tankDetailsEdit)
      );

      expect(tankState).toEqual(STATUS.HIDDEN);
      expect(fixture).toMatchSnapshot();
      expect(component.tankDetails.get('tankManufacturer').value).toBeNull();
      expect(component.tankDetails.get('yearOfManufacture').value).toBeNull();
      expect(component.tankDetails.get('tankManufacturerSerialNo').value).toBeNull();
      expect(component.tankDetails.get('tankTypeAppNo').value).toBeNull();
      expect(component.tankDetails.get('tankCode').value).toBeNull();
      expect(component.tankStatement.get('substancesPermitted').value).toBeNull();
    });

    it('should show section when vehicle type dispatches MANDATORY and set required validator', () => {
      spyOn(validationMapper, 'getVehicleTypeState').and.callFake(() =>
        of({ tankDetailsEdit: STATUS.MANDATORY })
      );

      fixture.detectChanges();

      let tankState: STATUS;
      component.tankValidationState$.subscribe(
        ({ tankDetailsEdit }) => (tankState = tankDetailsEdit)
      );

      expect(tankState).toEqual(STATUS.MANDATORY);
      expect(component.showTankDetails).toBeTruthy();
      expect(component.tankDetails.get('tankManufacturer').validator).toBeDefined();
      expect(component.tankDetails.get('yearOfManufacture').validator).toBeDefined();
      expect(component.tankDetails.get('tankManufacturerSerialNo').validator).toBeDefined();
      expect(component.tankDetails.get('tankTypeAppNo').validator).toBeDefined();
      expect(component.tankDetails.get('tankCode').validator).toBeDefined();
      expect(component.tankStatement.get('substancesPermitted').validator).toBeDefined();
    });
  });
});
