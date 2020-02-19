import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleRecordsComponent } from './multiple-records.component';
import { TechRecordHelpersService } from '@app/technical-record/tech-record-helpers.service';
import { SharedModule } from '@app/shared';
import { RouterTestingModule } from '@angular/router/testing';
import { VehicleTechRecordModel } from '@app/models/vehicle-tech-record.model';
import {TechRecord} from '@app/models/tech-record.model';

describe('MultipleRecordsComponent', () => {
  let component: MultipleRecordsComponent;
  let fixture: ComponentFixture<MultipleRecordsComponent>;
  const techRecordItem: TechRecord = {} as TechRecord;
  const vehicleTechRecordModel: VehicleTechRecordModel = { techRecord: [techRecordItem] } as VehicleTechRecordModel;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, SharedModule],
      providers: [TechRecordHelpersService],
      declarations: [MultipleRecordsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultipleRecordsComponent);
    component = fixture.componentInstance;
    component.vehicleTechRecords = [vehicleTechRecordModel];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
