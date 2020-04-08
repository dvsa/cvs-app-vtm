import { Component, Input, EventEmitter, Output, DebugElement } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { SpyLocation } from '@angular/common/testing';
import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Store, Action } from '@ngrx/store';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { TESTING_UTILS } from './../utils/testing.utils';
import { SharedModule } from '@app/shared';
import {
  getSelectedVehicleTechRecord,
  getVehicleTechRecordMetaData,
  getViewState,
  getTechRecord
} from '@app/store/selectors/VehicleTechRecordModel.selectors';
import {
  UpdateVehicleTechRecord,
  SetViewState
} from '@app/store/actions/VehicleTechRecordModel.actions';
import { TechRecord } from '@app/models/tech-record.model';
import { VehicleTechRecordModel } from '@app/models/vehicle-tech-record.model';
import { MetaData } from '@app/models/meta-data';
import { VIEW_STATE } from '@app/app.enums';
import { TechnicalRecordsContainer } from './technical-record.container';
import { TestResultModel } from '@app/models/test-result.model';

const mockSelector = new BehaviorSubject<any>(undefined);

class MockStore {
  select(selector: any) {
    switch (selector) {
      case getSelectedVehicleTechRecord:
        return mockSelector.pipe(
          map((value: any) =>
            value && value.hasOwnProperty('getSelectedVehicleTechRecord')
              ? value['getSelectedVehicleTechRecord']
              : {}
          )
        );

      case getTechRecord:
        return mockSelector.pipe(
          map((value: any) =>
            value && value.hasOwnProperty('getTechRecord') ? value['getTechRecord'] : {}
          )
        );

      case getVehicleTechRecordMetaData:
        return mockSelector.pipe(
          map((value: any) =>
            value && value.hasOwnProperty('getVehicleTechRecordMetaData')
              ? value['getVehicleTechRecordMetaData']
              : {}
          )
        );

      case getViewState:
        return mockSelector.pipe(
          map((value: any) =>
            value && value.hasOwnProperty('getViewState') ? value['getViewState'] : {}
          )
        );
      default:
        return mockSelector;
    }
  }

  dispatch(action: Action) {
    return [];
  }
}

describe('TechnicalRecordsContainer', () => {
  let fixture: ComponentFixture<TechnicalRecordsContainer>;
  let component: TechnicalRecordsContainer;
  const store: MockStore = new MockStore();

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
      getTechRecord: TESTING_UTILS.mockTechRecord(),
      getVehicleTechRecordMetaData: TESTING_UTILS.mockMetaData(),
      getViewState: VIEW_STATE.VIEW_ONLY
    });

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  describe('action', () => {
    let mockTechComponent: DebugElement;
    beforeEach(() => {
      mockTechComponent = fixture.debugElement.query(By.directive(TestTechnicalRecordsComponent));
    });

    it('should dispatch for the edited techRecord', () => {
      const editedTechRecord = { statusCode: 'current' } as TechRecord;

      const updateVehicleTechRecordAction = new UpdateVehicleTechRecord(editedTechRecord);
      mockTechComponent.componentInstance.submitTechRecord.emit(editedTechRecord);

      expect(store.dispatch).toHaveBeenCalledWith(updateVehicleTechRecordAction);
    });

    it('should dispatch for the view state', () => {
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
    <div>Active record based on Statuscode: {{ activeRecord | json }}</div>
    <div>MetaData: {{ metaData | json }}</div>
    <div>View state is: {{ editState ? 'EDIT' : 'VIEW ONLY' }}</div>
  `
})
class TestTechnicalRecordsComponent {
  @Input() vehicleTechRecord: VehicleTechRecordModel;
  @Input() activeRecord: TechRecord;
  @Input() metaData: MetaData;
  @Input() testResultJson: TestResultModel;
  @Input() editState: VIEW_STATE;
  @Input() canEdit: Observable<boolean>;
  @Output() submitTechRecord = new EventEmitter<TechRecord>();
  @Output() changeViewState = new EventEmitter<VIEW_STATE>();
}
