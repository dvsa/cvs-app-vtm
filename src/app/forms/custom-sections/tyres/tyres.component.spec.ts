import { SimpleChanges } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { createMockPsv } from '@mocks/psv-record.mock';
import { FitmentCode, SpeedCategorySymbol, Tyres } from '@models/vehicle-tech-record.model';
import { StoreModule } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import { initialAppState, State } from '@store/index';
import { of } from 'rxjs';
import { TyresComponent } from './tyres.component';

const mockReferenceDataService = {
  getByKey$: jest.fn(),
  loadReferenceData: jest.fn()
};

describe('TyresComponent', () => {
  let component: TyresComponent;
  let fixture: ComponentFixture<TyresComponent>;
  let spy: jest.SpyInstance<void, [tyre: Tyres, axleNumber: number]>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, DynamicFormsModule, StoreModule.forRoot({})],
      declarations: [TyresComponent],
      providers: [provideMockStore<State>({ initialState: initialAppState }), { provide: ReferenceDataService, useValue: mockReferenceDataService }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TyresComponent);
    component = fixture.componentInstance;
    component.vehicleTechRecord = createMockPsv(12345).techRecord[0];
    fixture.detectChanges();
    spy = jest.spyOn(component, 'addTyreToTechRecord');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // describe('checkFitmentCodeHasChanged', () => {
  //   it('should return false when there has been no change', () => {
  //     const currentAxle = [{ tyres: { fitmentCode: 'single' } }];
  //     const previousAxle = [{ tyres: { fitmentCode: 'single' } }];

  //     const simpleChanges = {
  //       vehicleTechRecord: { currentValue: { axles: currentAxle }, previousValue: { axles: previousAxle }, firstChange: false }
  //     };

  //     expect(component.checkFitmentCodeHasChanged(simpleChanges as unknown as SimpleChanges)).toBe(false);
  //   });

  //   it('should return true when there has been a change', () => {
  //     jest.spyOn(component, 'getTyresRefData').mockImplementation(() => null);
  //     const currentAxle = [{ tyres: { fitmentCode: 'single' } }];
  //     const previousAxle = [{ tyres: { fitmentCode: 'double' } }];

  //     const simpleChanges = {
  //       vehicleTechRecord: { currentValue: { axles: currentAxle }, previousValue: { axles: previousAxle }, firstChange: false }
  //     };

  //     expect(component.checkFitmentCodeHasChanged(simpleChanges as unknown as SimpleChanges)).toBe(true);
  //   });

  //   it('should return false when there has been no change with multiple objects', () => {
  //     const currentAxle = [{ tyres: { fitmentCode: 'single' } }, { tyres: { fitmentCode: 'single' } }];
  //     const previousAxle = [{ tyres: { fitmentCode: 'single' } }, { tyres: { fitmentCode: 'single' } }];

  //     const simpleChanges = {
  //       vehicleTechRecord: { currentValue: { axles: currentAxle }, previousValue: { axles: previousAxle }, firstChange: false }
  //     };

  //     expect(component.checkFitmentCodeHasChanged(simpleChanges as unknown as SimpleChanges)).toBe(false);
  //   });

  //   it('should return true when there has been a change with multiple objects', () => {
  //     jest.spyOn(component, 'getTyresRefData').mockImplementation(() => null);
  //     const currentAxle = [{ tyres: { fitmentCode: 'single' } }, { tyres: { fitmentCode: 'single' } }];
  //     const previousAxle = [{ tyres: { fitmentCode: 'double' } }, { tyres: { fitmentCode: 'single' } }];

  //     const simpleChanges = {
  //       vehicleTechRecord: { currentValue: { axles: currentAxle }, previousValue: { axles: previousAxle }, firstChange: false }
  //     };

  //     expect(component.checkFitmentCodeHasChanged(simpleChanges as unknown as SimpleChanges)).toBe(true);
  //   });

  //   it('should return false when this is a first change', () => {
  //     const currentAxle = [{ tyres: { fitmentCode: 'single' } }, { tyres: { fitmentCode: 'single' } }];
  //     const previousAxle = [{ tyres: { fitmentCode: 'double' } }, { tyres: { fitmentCode: 'single' } }];

  //     const simpleChanges = {
  //       vehicleTechRecord: { currentValue: { axles: currentAxle }, previousValue: { axles: previousAxle }, firstChange: true }
  //     };

  //     expect(component.checkFitmentCodeHasChanged(simpleChanges as unknown as SimpleChanges)).toBe(false);
  //   });
  // });

  // describe('getTyresRefData', () => {
  //   it('should call add tyre to tech record with correct values', () => {
  //     mockReferenceDataService.getByKey$.mockImplementationOnce(() => {
  //       return of({
  //         code: '101',
  //         loadIndexSingleLoad: '123',
  //         tyreSize: '123L:123',
  //         dateTimeStamp: 'date',
  //         userId: 'user',
  //         loadIndexTwinLoad: '126',
  //         plyRating: '12'
  //       });
  //     });

  //     const tyre = {
  //       tyreSize: null,
  //       speedCategorySymbol: SpeedCategorySymbol.A7,
  //       fitmentCode: FitmentCode.SINGLE,
  //       dataTrAxles: null,
  //       plyRating: null,
  //       tyreCode: 101
  //     };

  //     const changedTyre: Tyres = {
  //       tyreSize: '123L:123',
  //       speedCategorySymbol: SpeedCategorySymbol.A7,
  //       fitmentCode: FitmentCode.SINGLE,
  //       dataTrAxles: 123,
  //       plyRating: '12',
  //       tyreCode: 101
  //     };

  //     component.getTyreSearch(tyre, 1);

  //     expect(spy).toHaveBeenCalledTimes(1);
  //     expect(spy).toHaveBeenCalledWith(changedTyre, 1);
  //   });

  //   it('should call add tyre to tech record with correct values when failure', () => {
  //     mockReferenceDataService.getByKey$.mockImplementationOnce(() => {
  //       return of(null);
  //     });

  //     const tyre = {
  //       tyreSize: null,
  //       speedCategorySymbol: SpeedCategorySymbol.A7,
  //       fitmentCode: FitmentCode.SINGLE,
  //       dataTrAxles: null,
  //       plyRating: null,
  //       tyreCode: 101
  //     };

  //     const changedTyre: Tyres = {
  //       tyreSize: null,
  //       speedCategorySymbol: SpeedCategorySymbol.A7,
  //       fitmentCode: FitmentCode.SINGLE,
  //       dataTrAxles: null,
  //       plyRating: null,
  //       tyreCode: 101
  //     };

  //     component.getTyreSearch(tyre, 1);

  //     expect(component.isError).toBe(true);
  //     expect(component.errorMessage).toBe('Cannot find data of this tyre');
  //     expect(spy).toHaveBeenCalledTimes(1);
  //     expect(spy).toHaveBeenCalledWith(changedTyre, 1);
  //   });
  // });

  // describe('addTyreToTechRecord', () => {
  //   it('should update the tech record with the new tyre', () => {
  //     const tyre = {
  //       tyreSize: '123',
  //       speedCategorySymbol: SpeedCategorySymbol.A7,
  //       fitmentCode: FitmentCode.SINGLE,
  //       dataTrAxles: 123,
  //       plyRating: '12',
  //       tyreCode: 101
  //     };

  //     component.addTyreToTechRecord(tyre, 1);

  //     expect(component.vehicleTechRecord.axles[0].tyres).toBe(tyre);
  //   });
  // });
});
