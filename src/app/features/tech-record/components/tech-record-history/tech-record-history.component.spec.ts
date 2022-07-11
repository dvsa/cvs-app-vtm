import { ComponentFixture, TestBed } from '@angular/core/testing';
import { mockVehicleTechnicalRecord } from '@mocks/mock-vehicle-technical-record.mock';

import { TechRecordHistoryComponent } from './tech-record-history.component';

describe('TechRecordHistoryComponent', () => {
  let component: TechRecordHistoryComponent;
  let fixture: ComponentFixture<TechRecordHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TechRecordHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TechRecordHistoryComponent);
    component = fixture.componentInstance;
    component.vehicleTechRecord = mockVehicleTechnicalRecord();
    component.currentRecord = mockVehicleTechnicalRecord().techRecord[0];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
