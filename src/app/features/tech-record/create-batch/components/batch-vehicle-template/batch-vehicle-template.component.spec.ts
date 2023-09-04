import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { StatusCodes, VehicleTypes } from '@models/vehicle-tech-record.model';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { BatchTechnicalRecordService } from '@services/batch-technical-record/batch-technical-record.service';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { FixNavigationTriggeredOutsideAngularZoneNgModule } from '@shared/custom-module/fixNgZoneError';
import { initialAppState, State } from '@store/.';
import { createVehicleRecord, updateTechRecord } from '@store/technical-records';
import { BatchRecord } from '@store/technical-records/reducers/batch-create.reducer';
import { of } from 'rxjs';
import { TechRecordSummaryComponent } from '../../../components/tech-record-summary/tech-record-summary.component';
import { BatchVehicleResultsComponent } from '../batch-vehicle-results/batch-vehicle-results.component';
import { BatchVehicleTemplateComponent } from './batch-vehicle-template.component';

let batchOfVehicles: BatchRecord[] = [];

const mockTechRecordService = (<unknown>{
  editableVehicleTechRecord$: of({ techRecord: [] }),
  updateEditingTechRecord: jest.fn(),
  createVehicleRecord: jest.fn(),
  clearSectionTemplateStates: jest.fn()
}) as TechnicalRecordService;

const mockBatchTechRecordService = (<unknown>{
  get batchVehicles$() {
    return of(batchOfVehicles);
  },
  applicationId$: of('TES_1_APPLICATION_ID'),
  isBatchCreate$: of(true),
  batchCount$: of(2),
  vehicleType$: of(VehicleTypes.TRL),
  get vehicleStatus$() {
    return of('current');
  }
}) as BatchTechnicalRecordService;

@Component({})
class TechRecordSummaryStubComponent {
  checkForms() {}
}

describe('BatchVehicleTemplateComponent', () => {
  let component: BatchVehicleTemplateComponent;
  let fixture: ComponentFixture<BatchVehicleTemplateComponent>;
  let store: MockStore<State>;
  let router: Router;
  let errorService: GlobalErrorService;
  let technicalRecordService: TechnicalRecordService;
  let batchTechRecordService: BatchTechnicalRecordService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'batch-results', component: BatchVehicleResultsComponent }]),
        HttpClientTestingModule,
        FixNavigationTriggeredOutsideAngularZoneNgModule
      ],
      declarations: [BatchVehicleTemplateComponent, TechRecordSummaryStubComponent],
      providers: [
        GlobalErrorService,
        provideMockStore({ initialState: initialAppState }),
        { provide: TechnicalRecordService, useValue: mockTechRecordService },
        { provide: BatchTechnicalRecordService, useValue: mockBatchTechRecordService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BatchVehicleTemplateComponent);
    store = TestBed.inject(MockStore);
    technicalRecordService = TestBed.inject(TechnicalRecordService);
    errorService = TestBed.inject(GlobalErrorService);
    router = TestBed.inject(Router);
    batchTechRecordService = TestBed.inject(BatchTechnicalRecordService);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  // TODO V3 HGV PSV TRL
  it('should expose the editableVehicleTechRecord$ observable', () => {
    expect(component.vehicle$).toBeTruthy();
  });

  it('should expose the applicationId$ observable', () => {
    expect(component.applicationId$).toBeTruthy();
  });

  it('should expose the isBatch$ observable', () => {
    expect(component.isBatch$).toBeTruthy();
  });

  it('should expose the batchCount$ observable', () => {
    expect(component.batchCount$).toBeTruthy();
  });

  it('should expose the vehicleType$ observable', () => {
    expect(component.vehicleType$).toBeTruthy();
  });

  describe('should dispatch the createVehicleTechRecord action for every vin and trailerId given', () => {
    beforeEach(() => {
      component.summary = TestBed.createComponent(TechRecordSummaryStubComponent).componentInstance as TechRecordSummaryComponent;
    });

    it('given a batch of 0', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch').mockImplementation();
      jest.spyOn(component, 'isVehicleStatusValid', 'get').mockReturnValue(true);
      component.handleSubmit();
      expect(dispatchSpy).toHaveBeenCalledTimes(0);
    });

    it('given a batch of 2 vehicles to create', () => {
      batchOfVehicles = [{ vin: 'EXAMPLEVIN000001' }, { vin: 'EXAMPLEVIN000002' }];

      const dispatchSpy = jest.spyOn(store, 'dispatch').mockImplementation();
      jest.spyOn(component, 'isVehicleStatusValid', 'get').mockReturnValue(true);
      component.handleSubmit();
      expect(dispatchSpy).toHaveBeenCalledTimes(2);
    });

    it('given a batch of 2 vehicles to update', fakeAsync(() => {
      jest.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true));

      batchOfVehicles = [
        { vin: 'EXAMPLEVIN000001', trailerIdOrVrm: '1000001', systemNumber: '1' },
        { vin: 'EXAMPLEVIN000002', trailerIdOrVrm: '1000002', systemNumber: '2' }
      ];
      jest.spyOn(mockBatchTechRecordService, 'batchVehicles$', 'get').mockReturnValue(of(batchOfVehicles));

      jest.spyOn(component, 'isVehicleStatusValid', 'get').mockReturnValue(true);

      const dispatchSpy = jest.spyOn(store, 'dispatch').mockImplementation();
      component.handleSubmit();

      tick();

      expect(dispatchSpy).toHaveBeenCalledTimes(2);
      expect(dispatchSpy).toHaveBeenNthCalledWith(
        1,
        updateTechRecord({
          vehicleTechRecord: {
            systemNumber: '1',
            createdTimestamp: undefined,
            techRecord_statusCode: StatusCodes.CURRENT,
            trailerId: undefined,
            primaryVrm: '1000001',
            vin: 'EXAMPLEVIN000001'
          } as unknown as TechRecordType<'put'>
        })
      );

      expect(dispatchSpy).toHaveBeenNthCalledWith(
        2,
        updateTechRecord({
          vehicleTechRecord: {
            systemNumber: '2',
            createdTimeStamp: undefined,
            trailerId: undefined,
            primaryVrm: '1000002',
            techRecord_statusCode: StatusCodes.CURRENT,
            vin: 'EXAMPLEVIN000002'
          } as unknown as TechRecordType<'put'>
        })
      );
    }));

    it('given a batch of 5 vehicles to create and update', fakeAsync(() => {
      jest.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true));

      batchOfVehicles = [
        { vin: 'EXAMPLEVIN000001', trailerIdOrVrm: '1000001', systemNumber: '1' },
        { vin: 'EXAMPLEVIN000002' },
        { vin: 'EXAMPLEVIN000003', trailerIdOrVrm: '1000002', systemNumber: '3' },
        { vin: 'EXAMPLEVIN000004' },
        { vin: 'EXAMPLEVIN000005' }
      ];

      jest.spyOn(mockBatchTechRecordService, 'batchVehicles$', 'get').mockReturnValue(of(batchOfVehicles));
      jest.spyOn(component, 'isVehicleStatusValid', 'get').mockReturnValue(true);
      const dispatchSpy = jest.spyOn(store, 'dispatch').mockImplementation();
      component.handleSubmit();

      tick();

      expect(dispatchSpy).toHaveBeenCalledTimes(5);
      expect(dispatchSpy).toHaveBeenNthCalledWith(
        1,
        updateTechRecord({
          vehicleTechRecord: {
            systemNumber: '1',
            techRecord_statusCode: StatusCodes.CURRENT,
            vin: 'EXAMPLEVIN000001',
            trailerId: undefined,
            primaryVrm: '1000001',
            createdTimestamp: undefined
          } as unknown as TechRecordType<'put'>
        })
      );
      expect(dispatchSpy).toHaveBeenNthCalledWith(2, createVehicleRecord({ vehicle: expect.anything() }));
      expect(dispatchSpy).toHaveBeenNthCalledWith(
        3,
        updateTechRecord({
          vehicleTechRecord: {
            systemNumber: '3',
            techRecord_statusCode: StatusCodes.CURRENT,
            vin: 'EXAMPLEVIN000003',
            trailerId: undefined,
            primaryVrm: '1000002',
            createdTimestamp: undefined
          } as unknown as TechRecordType<'put'>
        })
      );
      expect(dispatchSpy).toHaveBeenNthCalledWith(4, createVehicleRecord({ vehicle: expect.anything() }));
      expect(dispatchSpy).toHaveBeenNthCalledWith(5, createVehicleRecord({ vehicle: expect.anything() }));
    }));

    it('given a batch of 40', fakeAsync(() => {
      jest.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true));
      batchOfVehicles = [];
      for (let i = 1; i <= 40; i++) {
        batchOfVehicles.push({ vin: `EXAMPLEVIN0000${i}`, trailerIdOrVrm: `100000${i}` });
      }

      jest.spyOn(mockBatchTechRecordService, 'batchVehicles$', 'get').mockReturnValue(of(batchOfVehicles));
      jest.spyOn(component, 'isVehicleStatusValid', 'get').mockReturnValue(true);

      const dispatchSpy = jest.spyOn(store, 'dispatch').mockImplementation();
      component.handleSubmit();
      tick();
      expect(dispatchSpy).toHaveBeenCalledTimes(40);
    }));
  });
});
