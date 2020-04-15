import { Component, Input, EventEmitter, Output } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs';

import { SharedModule } from '@app/shared';
import { MultipleRecordsContainer } from '@app/multiple-records/multiple-records.container';
import { VehicleTechRecordModel } from '@app/models/vehicle-tech-record.model';
import { MockStore } from '@app/utils';
import { RECORD_STATUS, VIEW_STATE } from '@app/app.enums';
import { SetSelectedVehicleTechnicalRecord } from '@app/store/actions/VehicleTechRecordModel.actions';

describe('MultipleRecordsContainer', () => {
  let fixture: ComponentFixture<MultipleRecordsContainer>;
  let component: MultipleRecordsContainer;
  const mockSelector = new BehaviorSubject<any>(undefined);
  const store: MockStore = new MockStore(mockSelector);

  const mockVehicleRecord = (): VehicleTechRecordModel => {
    return {
      systemNumber: '16228',
      techRecord: [{ statusCode: RECORD_STATUS.PROVISIONAL }]
    } as VehicleTechRecordModel;
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [MultipleRecordsContainer, TestMultipleRecordComponent],
      providers: [{ provide: Store, useValue: store }]
    }).compileComponents();

    fixture = TestBed.createComponent(MultipleRecordsContainer);
    component = fixture.componentInstance;
    jest.spyOn(store, 'dispatch');

    fixture.detectChanges();
  }));

  it('should render the container', () => {
    mockSelector.next({
      selectVehicleTechRecordModelHavingStatusAll: [
        mockVehicleRecord()
      ] as VehicleTechRecordModel[]
    });

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should dispatch the selected record', () => {
    const selectedRecordAction = new SetSelectedVehicleTechnicalRecord({
      vehicleRecord: mockVehicleRecord(),
      viewState: VIEW_STATE.VIEW_ONLY
    });

    const mockMultipleComponent = fixture.debugElement.query(
      By.directive(TestMultipleRecordComponent)
    );
    mockMultipleComponent.componentInstance.setVehicleTechRecord.emit(mockVehicleRecord());

    expect(store.dispatch).toHaveBeenCalledWith(selectedRecordAction);
  });
});

@Component({
  selector: 'vtm-multiple-records',
  template: `
    <div>Vehicle records: {{ vehicleTechRecords | json }}</div>
  `
})
class TestMultipleRecordComponent {
  @Input() vehicleTechRecords: VehicleTechRecordModel[];
  @Output() setVehicleTechRecord = new EventEmitter<VehicleTechRecordModel>();
}
