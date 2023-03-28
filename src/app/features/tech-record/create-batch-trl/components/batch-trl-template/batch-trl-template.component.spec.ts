import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { initialAppState, State } from '@store/.';
import { BatchTrlTemplateComponent } from './batch-trl-template.component';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { of } from 'rxjs';
import { Component } from '@angular/core';
import { TechRecordSummaryComponent } from '../../../components/tech-record-summary/tech-record-summary.component';
import { BatchRecord } from '@store/technical-records/reducers/batch-create.reducer';
import { updateTechRecords } from '@store/technical-records';
import { StatusCodes } from '@models/vehicle-tech-record.model';
import { Router } from '@angular/router';

let batchOfVehicles: BatchRecord[] = [];

const mockTechRecordService = (<unknown>{
  editableVehicleTechRecord$: of({}),
  get batchVehicles$() {
    return of(batchOfVehicles);
  },
  applicationId$: of('TES_1_APPLICATION_ID'),
  isBatchCreate$: of(true),
  batchCount$: of(2),
  updateEditingTechRecord: jest.fn(),
  createVehicleRecord: jest.fn()
}) as TechnicalRecordService;

@Component({})
class TechRecordSummaryStubComponent {
  checkForms() {}
}

describe('BatchTrlTemplateComponent', () => {
  let component: BatchTrlTemplateComponent;
  let fixture: ComponentFixture<BatchTrlTemplateComponent>;
  let store: MockStore<State>;
  let router: Router;
  let errorService: GlobalErrorService;
  let technicalRecordService: TechnicalRecordService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      declarations: [BatchTrlTemplateComponent, TechRecordSummaryStubComponent],
      providers: [
        GlobalErrorService,
        provideMockStore({ initialState: initialAppState }),
        { provide: TechnicalRecordService, useValue: mockTechRecordService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BatchTrlTemplateComponent);
    store = TestBed.inject(MockStore);
    technicalRecordService = TestBed.inject(TechnicalRecordService);
    errorService = TestBed.inject(GlobalErrorService);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

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

  describe('should dispatch the createVehicleTechRecord action for every vin and trailerId given', () => {
    beforeEach(() => {
      component.summary = TestBed.createComponent(TechRecordSummaryStubComponent).componentInstance as TechRecordSummaryComponent;
      //batchOfVehicles = new Array<BatchRecord>();
    });

    it('given a batch of 0', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch').mockImplementation();
      component.handleSubmit();
      expect(dispatchSpy).toHaveBeenCalledTimes(0);
    });

    it('given a batch of 2 vehicles to create', () => {
      batchOfVehicles = [{ vin: 'EXAMPLEVIN000001' }, { vin: 'EXAMPLEVIN000002' }];

      const dispatchSpy = jest.spyOn(store, 'dispatch').mockImplementation();
      component.handleSubmit();
      expect(dispatchSpy).toHaveBeenCalledTimes(2);
    });

    it('given a batch of 2 vehicles to update', fakeAsync(() => {
      jest.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true));

      batchOfVehicles = [
        { vin: 'EXAMPLEVIN000001', trailerId: '1000001', systemNumber: '1' },
        { vin: 'EXAMPLEVIN000002', trailerId: '1000002', systemNumber: '2' }
      ];
      jest.spyOn(mockTechRecordService, 'batchVehicles$', 'get').mockReturnValue(of(batchOfVehicles));

      const dispatchSpy = jest.spyOn(store, 'dispatch').mockImplementation();
      component.handleSubmit();

      tick();

      expect(dispatchSpy).toHaveBeenCalledTimes(2);
      expect(dispatchSpy).toHaveBeenNthCalledWith(
        1,
        updateTechRecords({ systemNumber: '1', recordToArchiveStatus: StatusCodes.PROVISIONAL, newStatus: StatusCodes.CURRENT })
      );

      expect(dispatchSpy).toHaveBeenNthCalledWith(
        2,
        updateTechRecords({ systemNumber: '2', recordToArchiveStatus: StatusCodes.PROVISIONAL, newStatus: StatusCodes.CURRENT })
      );
    }));

    it('given a batch of 5 vehicles to create and update', fakeAsync(() => {
      jest.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true));

      batchOfVehicles = [
        { vin: 'EXAMPLEVIN000001', trailerId: '1000001', systemNumber: '1' },
        { vin: 'EXAMPLEVIN000002' },
        { vin: 'EXAMPLEVIN000003', trailerId: '1000002', systemNumber: '3' },
        { vin: 'EXAMPLEVIN000004' },
        { vin: 'EXAMPLEVIN000005' }
      ];

      jest.spyOn(mockTechRecordService, 'batchVehicles$', 'get').mockReturnValue(of(batchOfVehicles));

      const dispatchSpy = jest.spyOn(store, 'dispatch').mockImplementation();
      component.handleSubmit();

      tick();

      expect(dispatchSpy).toHaveBeenCalledTimes(5);
      expect(dispatchSpy).toHaveBeenNthCalledWith(
        1,
        updateTechRecords({ systemNumber: '1', recordToArchiveStatus: StatusCodes.PROVISIONAL, newStatus: StatusCodes.CURRENT })
      );
      expect(dispatchSpy).toHaveBeenNthCalledWith(
        3,
        updateTechRecords({ systemNumber: '3', recordToArchiveStatus: StatusCodes.PROVISIONAL, newStatus: StatusCodes.CURRENT })
      );
    }));

    it('given a batch of 40', fakeAsync(() => {
      jest.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true));
      batchOfVehicles = [];
      for (let i = 1; i <= 40; i++) {
        batchOfVehicles.push({ vin: `EXAMPLEVIN0000${i}`, trailerId: `100000${i}` });
      }

      jest.spyOn(mockTechRecordService, 'batchVehicles$', 'get').mockReturnValue(of(batchOfVehicles));

      const dispatchSpy = jest.spyOn(store, 'dispatch').mockImplementation();
      component.handleSubmit();
      tick();
      expect(dispatchSpy).toHaveBeenCalledTimes(40);
    }));
  });
});
