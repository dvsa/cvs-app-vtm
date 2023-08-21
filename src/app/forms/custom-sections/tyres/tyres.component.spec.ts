import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SimpleChanges } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { Tyres, V3TechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { StoreModule } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import { State, initialAppState } from '@store/index';
import { of, throwError } from 'rxjs';
import { TyresComponent } from './tyres.component';

const mockReferenceDataService = {
  fetchReferenceDataByKey: jest.fn()
};

describe('TyresComponent', () => {
  let component: TyresComponent;
  let fixture: ComponentFixture<TyresComponent>;
  let spy: jest.SpyInstance<void, [tyre: Tyres, axleNumber: number]>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, DynamicFormsModule, StoreModule.forRoot({})],
      declarations: [TyresComponent],
      providers: [provideMockStore<State>({ initialState: initialAppState }), { provide: ReferenceDataService, useValue: mockReferenceDataService }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TyresComponent);
    component = fixture.componentInstance;
    component.vehicleTechRecord = {
      systemNumber: 'foo',
      createdTimestamp: 'bar',
      vin: 'testVin',
      techRecord_axles: [
        {
          axleNumber: 1
        }
      ],
      techRecord_vehicleType: VehicleTypes.PSV
    } as unknown as V3TechRecordModel;
    fixture.detectChanges();
    spy = jest.spyOn(component, 'addTyreToTechRecord');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  //TODO V3 PSV
  describe('checkFitmentCodeHasChanged', () => {
    it('should return false when there has been no change', () => {
      const currentAxle = [{ tyres_fitmentCode: 'single', tyres_tyreCode: '123' }];
      const previousAxle = [{ tyres_fitmentCode: 'single', tyres_tyreCode: '123' }];

      const simpleChanges = {
        vehicleTechRecord: { currentValue: { techRecord_axles: currentAxle }, previousValue: { techRecord_axles: previousAxle }, firstChange: false }
      };

      expect(component.checkFitmentCodeHasChanged(simpleChanges as unknown as SimpleChanges)).toBe(false);
    });

    it('should return true when there has been a change', () => {
      jest.spyOn(component, 'getTyresRefData').mockImplementation(() => null);
      const currentAxle = [{ tyres_fitmentCode: 'single', tyres_tyreCode: '123' }];
      const previousAxle = [{ tyres_fitmentCode: 'double', tyres_tyreCode: '123' }];

      const simpleChanges = {
        vehicleTechRecord: { currentValue: { techRecord_axles: currentAxle }, previousValue: { techRecord_axles: previousAxle }, firstChange: false }
      };

      expect(component.checkFitmentCodeHasChanged(simpleChanges as unknown as SimpleChanges)).toBe(true);
    });

    it('should return false when there has been no change with multiple objects', () => {
      const currentAxle = [
        { tyres_fitmentCode: 'single', tyres_tyreCode: '123' },
        { tyres_fitmentCode: 'single', tyres_tyreCode: '123' }
      ];
      const previousAxle = [
        { tyres_fitmentCode: 'single', tyres_tyreCode: '123' },
        { tyres_fitmentCode: 'single', tyres_tyreCode: '123' }
      ];

      const simpleChanges = {
        vehicleTechRecord: { currentValue: { techRecord_axles: currentAxle }, previousValue: { techRecord_axles: previousAxle }, firstChange: false }
      };

      expect(component.checkFitmentCodeHasChanged(simpleChanges as unknown as SimpleChanges)).toBe(false);
    });

    it('should return true when there has been a change with multiple objects', () => {
      jest.spyOn(component, 'getTyresRefData').mockImplementation(() => null);
      const currentAxle = [
        { tyres_fitmentCode: 'single', tyres_tyreCode: '123' },
        { tyres_fitmentCode: 'single', tyres_tyreCode: '123' }
      ];
      const previousAxle = [
        { tyres_fitmentCode: 'double', tyres_tyreCode: '123' },
        { tyres_fitmentCode: 'single', tyres_tyreCode: '123' }
      ];

      const simpleChanges = {
        vehicleTechRecord: { currentValue: { techRecord_axles: currentAxle }, previousValue: { techRecord_axles: previousAxle }, firstChange: false }
      };

      expect(component.checkFitmentCodeHasChanged(simpleChanges as unknown as SimpleChanges)).toBe(true);
    });

    it('should return false when this is a first change', () => {
      const currentAxle = [
        { tyres_fitmentCode: 'single', tyres_tyreCode: '123' },
        { tyres_fitmentCode: 'single', tyres_tyreCode: '123' }
      ];
      const previousAxle = [
        { tyres_fitmentCode: 'double', tyres_tyreCode: '123' },
        { tyres_fitmentCode: 'single', tyres_tyreCode: '123' }
      ];

      const simpleChanges = {
        vehicleTechRecord: { currentValue: { techRecord_axles: currentAxle }, previousValue: { techRecord_axles: previousAxle }, firstChange: true }
      };

      expect(component.checkFitmentCodeHasChanged(simpleChanges as unknown as SimpleChanges)).toBe(false);
    });
  });

  describe('getTyresRefData', () => {
    it('should call add tyre to tech record with correct values', () => {
      mockReferenceDataService.fetchReferenceDataByKey.mockImplementationOnce(() => {
        return of({
          code: '101',
          loadIndexSingleLoad: '123',
          tyreSize: '123L:123',
          dateTimeStamp: 'date',
          userId: 'user',
          loadIndexTwinLoad: '126',
          plyRating: '12'
        });
      });
      component.getTyresRefData('tyres_tyreCode', 1);

      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should call add tyre to tech record with correct values when failure', () => {
      mockReferenceDataService.fetchReferenceDataByKey.mockReturnValue(throwError(() => 'error'));

      component.getTyresRefData('tyres_tyreCode', 1);

      expect(component.isError).toBe(true);
      expect(component.errorMessage).toBe('Cannot find data of this tyre on axle 1');
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('addTyreToTechRecord', () => {
    it('should update the tech record with the new tyre', () => {
      const tyre = {
        tyreSize: '123',
        dataTrAxles: 123,
        plyRating: '12',
        tyreCode: 101
      };

      component.addTyreToTechRecord(tyre, 1);

      //TODO: Remove the anys
      expect((component.vehicleTechRecord as any).techRecord_axles![0].tyres_tyreSize).toBe(tyre.tyreSize);
      expect((component.vehicleTechRecord as any).techRecord_axles![0].tyres_dataTrAxles).toBe(tyre.dataTrAxles);
      expect((component.vehicleTechRecord as any).techRecord_axles![0].tyres_plyRating).toBe(tyre.plyRating);
      expect((component.vehicleTechRecord as any).techRecord_axles![0].tyres_tyreCode).toBe(tyre.tyreCode);
    });
  });
});
