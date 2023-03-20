import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { StoreModule } from '@ngrx/store';
import { VehicleClass } from './vehicle-class.model';

describe('VehicleClass', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, DynamicFormsModule, StoreModule.forRoot({})],
      declarations: [VehicleClass]
    }).compileComponents();
  });

  describe('retrieveVehicleClassesByType', () => {
    describe('should return the correct classes by vehicle type', () => {
      it('where the vehicle type has specific classes', () => {
        const vehicleType = 'psv';
        const vehicleClasses = VehicleClass.retrieveVehicleClassesByType(vehicleType);
        expect(vehicleClasses).toHaveLength(7);
        expect(vehicleClasses).toEqual([
          VehicleClass.DescriptionEnum.SmallPsvIeLessThanOrEqualTo22Seats,
          VehicleClass.DescriptionEnum.LargePsvIeGreaterThan23Seats,
          VehicleClass.DescriptionEnum.MOTClass4,
          VehicleClass.DescriptionEnum.MOTClass5,
          VehicleClass.DescriptionEnum.MOTClass7,
          VehicleClass.DescriptionEnum.NotApplicable,
          VehicleClass.DescriptionEnum._3Wheelers
        ]);
      });

      it('where the vehicle type does not have specific classes', () => {
        const vehicleType = 'lgv';
        const vehicleClasses = VehicleClass.retrieveVehicleClassesByType(vehicleType);
        expect(vehicleClasses).toHaveLength(2);
        expect(vehicleClasses).toEqual([VehicleClass.DescriptionEnum.NotApplicable, VehicleClass.DescriptionEnum._3Wheelers]);
      });
    });

    it('should return the common classes if not given a vehicle type', () => {
      const vehicleType = '';
      const vehicleClasses = VehicleClass.retrieveVehicleClassesByType(vehicleType);
      expect(vehicleClasses).toHaveLength(2);
      expect(vehicleClasses).toEqual([VehicleClass.DescriptionEnum.NotApplicable, VehicleClass.DescriptionEnum._3Wheelers]);
    });
  });
});
