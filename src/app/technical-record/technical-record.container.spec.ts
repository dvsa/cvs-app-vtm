import { Component, Input, EventEmitter, Output, DebugElement } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { SpyLocation } from '@angular/common/testing';
import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs';

import { SharedModule } from '@app/shared';
import {
  CreateVehicleTechRecord,
  SetViewState,
  UpdateVehicleTechRecord
} from '@app/store/actions/VehicleTechRecordModel.actions';
import {
  VehicleTechRecordModel,
  VehicleTechRecordEdit,
  VehicleTechRecordEditState
} from '@app/models/vehicle-tech-record.model';
import { MetaData } from '@app/models/meta-data';
import { VIEW_STATE, RECORD_STATUS } from '@app/app.enums';
import { TechnicalRecordsContainer } from './technical-record.container';
import { TestResultModel } from '@app/models/test-result.model';
import { TESTING_UTILS, MockStore } from '@app/utils/';

describe('TechnicalRecordsContainer', () => {
  let fixture: ComponentFixture<TechnicalRecordsContainer>;
  let component: TechnicalRecordsContainer;
  const mockSelector = new BehaviorSubject<any>(undefined);
  const store: MockStore = new MockStore(mockSelector);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, RouterTestingModule],
      declarations: [TechnicalRecordsContainer, TestTechnicalRecordsComponent],
      providers: [
        { provide: Store, useValue: store },
        { provide: Location, useClass: SpyLocation }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TechnicalRecordsContainer);
    component = fixture.componentInstance;
    jest.spyOn(store, 'dispatch');

    fixture.detectChanges();
  });

  it('should render the container', () => {
    mockSelector.next({
      getSelectedVehicleTechRecord: {
        techRecord: [TESTING_UTILS.mockTechRecord()]
      } as VehicleTechRecordModel,
      getActiveVehicleTechRecord: () => {
        return {
          vin: 'ABENE777',
          primaryVrm: 'LMEFE',
          techRecord: [{ statusCode: RECORD_STATUS.PROVISIONAL }]
        } as VehicleTechRecordEdit;
      },
      getVehicleTestResultModel: [] as TestResultModel[],
      getVehicleTechRecordMetaData: TESTING_UTILS.mockMetaData(),
      getTechViewState: VIEW_STATE.VIEW_ONLY
    });

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  describe('handlers', () => {
    let mockTechComponent: DebugElement;
    let recordState: VehicleTechRecordEditState;

    beforeEach(() => {
      mockTechComponent = fixture.debugElement.query(By.directive(TestTechnicalRecordsComponent));
      recordState = {
        vehicleRecordEdit: {} as VehicleTechRecordEdit
      } as VehicleTechRecordEditState;
    });

    it('should dispatch created vehicle record in create view state', () => {
      recordState = { ...recordState, viewState: VIEW_STATE.CREATE };

      const updateVehicleTechRecordAction = new CreateVehicleTechRecord(
        recordState.vehicleRecordEdit
      );
      mockTechComponent.componentInstance.submitVehicleRecord.emit(recordState);

      expect(store.dispatch).toHaveBeenCalledWith(updateVehicleTechRecordAction);
    });

    it('should dispatch edited vehicle record in edit view state', () => {
      recordState = { ...recordState, viewState: VIEW_STATE.EDIT };

      const updateVehicleTechRecordAction = new UpdateVehicleTechRecord(
        recordState.vehicleRecordEdit
      );
      mockTechComponent.componentInstance.submitVehicleRecord.emit(recordState);

      expect(store.dispatch).toHaveBeenCalledWith(updateVehicleTechRecordAction);
    });

    it('should dispatch the view state', () => {
      const viewStateAction = new SetViewState(VIEW_STATE.EDIT);
      mockTechComponent.componentInstance.changeViewState.emit(VIEW_STATE.EDIT);

      expect(store.dispatch).toHaveBeenCalledWith(viewStateAction);
    });
  });
});

@Component({
  selector: 'vtm-technical-record',
  template: `
    <div>Current or Selected Vehicle Tech Record: {{ vehicleTechRecord | json }}</div>
    <div>Active vehicle record: {{ activeVehicleTechRecord | json }}</div>
    <div>MetaData: {{ metaData | json }}</div>
    <div>View state is: {{ currentState ? 'EDIT' : 'VIEW ONLY' }}</div>
  `
})
class TestTechnicalRecordsComponent {
  @Input() activeVehicleTechRecord: VehicleTechRecordEdit;
  @Input() vehicleTechRecord: VehicleTechRecordModel;
  @Input() metaData: MetaData;
  @Input() testResultJson: TestResultModel[];
  @Input() currentState: VIEW_STATE;
  @Output() submitVehicleRecord = new EventEmitter<VehicleTechRecordEditState>();
  @Output() changeViewState = new EventEmitter<VIEW_STATE>();
}
