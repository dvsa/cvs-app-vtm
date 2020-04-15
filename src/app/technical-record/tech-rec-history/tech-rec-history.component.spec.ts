import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Input, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';

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
  let testFixture: ComponentFixture<TestTechRecHistoryComponent>;
  window.scrollTo = jest.fn();

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [TechRecHistoryComponent, TestTechRecHistoryComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    testFixture = TestBed.createComponent(TestTechRecHistoryComponent);
    testComponent = testFixture.componentInstance;

    spyOn(window, 'scrollTo');

    testComponent.vehicleTechRecord = mockVehicleRecord();
    testComponent.activeRecord = mockFocusedRecord();
    testFixture.detectChanges();
  });

  it('should create view only with populated data', () => {
    testFixture.detectChanges();

    expect(testComponent).toBeDefined();
    expect(testFixture).toMatchSnapshot();
  });

  it('should hide "view" link for selected record', () => {
    spyOn(testComponent, 'hideLinkForSelectedRecord');
    const current = mockVehicleRecord()[0];
    const active = mockFocusedRecord();
    testComponent.hideLinkForSelectedRecord(current, active);
    expect(testComponent.hideLinkForSelectedRecord).toHaveBeenCalledWith(current, active);
  });

  it('should emit the selected techRecord on "view" action', () => {
    testFixture.detectChanges();

    const selectedElem: HTMLElement = testFixture.debugElement.query(
      By.css('[id=test-tech-rec-1]')
    ).nativeElement;

    selectedElem.click();

    expect(testComponent.viewRecordHandler).toHaveBeenCalledWith(
      mockVehicleRecord().techRecord[1]
    );
  });
});

@Component({
  selector: 'test-vtm-tech-rec-history',
  template: `
    <vtm-tech-rec-history
      [focusedRecord]="activeRecord"
      [vehicleRecord]="vehicleTechRecord"
      (viewRecord)="viewRecordHandler($event)"
    ></vtm-tech-rec-history>
  `
})
class TestTechRecHistoryComponent {
  activeRecord: TechRecord;
  vehicleTechRecord: VehicleTechRecordModel;
  viewRecordHandler = jest.fn();
  hideLinkForSelectedRecord = jest.fn();
}
