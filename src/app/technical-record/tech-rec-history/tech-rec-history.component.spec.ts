import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Input, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SharedModule } from '@app/shared';
import { TechRecHistoryComponent } from './tech-rec-history.component';
import { VehicleTechRecordModel } from '@app/models/vehicle-tech-record.model';
import { TechRecord } from '@app/models/tech-record.model';

const mockVehicleRecord = () => {
  return {
    techRecord: [
      {
        statusCode: 'current',
        createdAt: '2020-05-29',
        reasonForCreation: 'reason for creation',
        createdByName: 'test name',
        lastUpdatedByName: 'test 1',
        lastUpdatedAt: '2020-06-11'
      },
      {
        statusCode: 'provisional',
        createdAt: '2020-05-29',
        reasonForCreation: 'reason for creation',
        createdByName: 'test name',
        lastUpdatedByName: 'test 1',
        lastUpdatedAt: '2020-06-11'
      }
    ] as TechRecord[]
  } as VehicleTechRecordModel;
};

const mockFocusedRecord = () =>
  ({
    statusCode: 'current',
    createdAt: '2020-05-29'
  } as TechRecord);

describe('TechRecHistoryComponent', () => {
  let testComponent: TestTechRecHistoryComponent;
  let component: TechRecHistoryComponent;
  let testFixture: ComponentFixture<TestTechRecHistoryComponent>;
  let fixture: ComponentFixture<TechRecHistoryComponent>;
  window.scrollTo = jest.fn();

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [TechRecHistoryComponent, TestTechRecHistoryComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    testFixture = TestBed.createComponent(TestTechRecHistoryComponent);
    fixture = TestBed.createComponent(TechRecHistoryComponent);
    testComponent = testFixture.componentInstance;
    component = fixture.componentInstance;

    testComponent.vehicleTechRecord = mockVehicleRecord();
    testComponent.activeRecord = mockFocusedRecord();
    testFixture.detectChanges();
    fixture.detectChanges();
  });

  it('should create view only with populated data', () => {
    testFixture.detectChanges();
    fixture.detectChanges();

    expect(testComponent).toBeDefined();
    expect(component).toBeDefined();
    expect(testFixture).toMatchSnapshot();
  });

  it('should scroll to the top of the page', () => {
    const scrollOptions = { top: 0 };
    spyOn(window, 'scrollTo');
    window.scrollTo(scrollOptions);
    expect(window.scrollTo).toHaveBeenCalledWith(scrollOptions);
  });

  it('should hide "view" link for selected record', () => {
    spyOn(component, 'hideLinkForSelectedRecord');
    const current = mockVehicleRecord()[0];
    const active = mockFocusedRecord();
    component.hideLinkForSelectedRecord(current, active);
    expect(component.hideLinkForSelectedRecord).toHaveBeenCalledWith(current, active);
  });

  it('should emit the selected techRecord on "view" action', () => {
    spyOn(component.onViewRecord, 'emit');
    component.scrollToTop = jest.fn();
    component.onViewTechRecord(mockFocusedRecord());

    expect(component.scrollToTop).toHaveBeenCalledWith();
    expect(component.onViewRecord.emit).toHaveBeenCalledWith(mockFocusedRecord());
  });
});

@Component({
  selector: 'test-vtm-tech-rec-history',
  template: `
    <vtm-tech-rec-history
      [focusedRecord]="activeRecord"
      [vehicleRecord]="vehicleTechRecord"
    ></vtm-tech-rec-history>
  `
})
class TestTechRecHistoryComponent {
  activeRecord: TechRecord;
  vehicleTechRecord: VehicleTechRecordModel;
}
