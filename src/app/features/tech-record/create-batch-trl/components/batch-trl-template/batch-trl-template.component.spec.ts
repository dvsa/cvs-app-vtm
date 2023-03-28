import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
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
import { updateEditingTechRecord, updateTechRecords } from '@store/technical-records';
import { StatusCodes, VehicleTechRecordModel } from '@models/vehicle-tech-record.model';

let batchOfVehicles: BatchRecord[] = [];

const mockTechRecordService = (<unknown>{
  editableVehicleTechRecord$: of({}),
  batchVehicles$: of(batchOfVehicles),
  applicationId$: of('TES_1_APPLICATION_ID'),
  isBatchCreate$: of(true),
  batchCount$: of(2)
}) as TechnicalRecordService;

@Component({})
class TechRecordSummaryStubComponent {
  checkForms() {}
}

describe('BatchTrlTemplateComponent', () => {
  let component: BatchTrlTemplateComponent;
  let fixture: ComponentFixture<BatchTrlTemplateComponent>;
  let store: MockStore<State>;
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
      batchOfVehicles = new Array<BatchRecord>();
    });

    it('given a batch of 0', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch').mockImplementation();
      component.handleSubmit();
      expect(dispatchSpy).toHaveBeenCalledTimes(0);
    });

    it('given a batch of 2 vehicles to create', () => {
      batchOfVehicles.push({ vin: 'EXAMPLEVIN000001' });
      batchOfVehicles.push({ vin: 'EXAMPLEVIN000002' });

      const dispatchSpy = jest.spyOn(store, 'dispatch').mockImplementation();
      component.handleSubmit();
      expect(dispatchSpy).toHaveBeenCalledTimes(2);
    });

    it('then given 2 more vehicles, this time to update', () => {
      batchOfVehicles.push({ vin: 'EXAMPLEVIN000003', trailerId: '1000001', systemNumber: '1' });
      batchOfVehicles.push({ vin: 'EXAMPLEVIN000004', trailerId: '1000002', systemNumber: '2' });

      const dispatchSpy = jest.spyOn(store, 'dispatch').mockImplementation();
      component.handleSubmit();
      expect(dispatchSpy).toHaveBeenCalledTimes(2);
      expect(dispatchSpy).toHaveBeenNthCalledWith(
        3,
        updateTechRecords({ systemNumber: '1', recordToArchiveStatus: StatusCodes.PROVISIONAL, newStatus: StatusCodes.CURRENT })
      );

      expect(dispatchSpy).toHaveBeenNthCalledWith(
        4,
        updateTechRecords({ systemNumber: '2', recordToArchiveStatus: StatusCodes.PROVISIONAL, newStatus: StatusCodes.CURRENT })
      );
    });

    it('given a batch of 40', () => {
      for (let i = 1; i <= 40; i++) {
        batchOfVehicles.push({ vin: `EXAMPLEVIN0000${i}`, trailerId: `100000${i}` });
      }

      const dispatchSpy = jest.spyOn(store, 'dispatch').mockImplementation();
      component.handleSubmit();
      expect(dispatchSpy).toHaveBeenCalledTimes(40);
    });
  });
});
