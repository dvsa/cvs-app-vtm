import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TechRecHistoryComponent } from './tech-rec-history.component';
import { VehicleTechRecordModel } from '@app/models/vehicle-tech-record.model';
import { TESTING_UTILS } from '../../utils/testing.utils';
import { OrderByStatusPipe } from '@app/pipes/OrderByStatusPipe';
import { DefaultNullOrEmpty } from '@app/pipes/DefaultNullOrEmptyPipe';

const mockedTechRecord = TESTING_UTILS.mockTechRecord({
  statusCode: 'current',
  reasonForCreation: 'reason for creation',
  createdByName: 'test name',
  createdAt: '1-1-2020',
  lastUpdatedByName: 'test 1',
  lastUpdatedAt: '12-3-2020'
});

describe('TechRecHistoryComponent', () => {
  let component: TechRecHistoryComponent;
  let fixture: ComponentFixture<TechRecHistoryComponent>;
  window.scrollTo = jest.fn();

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TechRecHistoryComponent, OrderByStatusPipe, DefaultNullOrEmpty],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(TechRecHistoryComponent);
    component = fixture.componentInstance;
    component.vehicleRecord = {
      techRecord: [mockedTechRecord]
    } as VehicleTechRecordModel;
  });

  it('should create view only with populated data', () => {
    fixture.detectChanges();

    expect(component).toBeDefined();
    expect(fixture).toMatchSnapshot();
  });

  it('should scroll to the top of the page', () => {
    const scrollOptions = { top: 0 };
    spyOn(window, 'scrollTo');
    window.scrollTo(scrollOptions);
    expect(window.scrollTo).toHaveBeenCalledWith(scrollOptions);
  });

  it('should emit the selected techRecord on "view" action', () => {
    spyOn(component.onViewRecord, 'emit');
    component.onViewTechRecord(mockedTechRecord);
    expect(component.onViewRecord.emit).toHaveBeenCalledWith(mockedTechRecord);
  });

  afterAll(() => {
    TestBed.resetTestingModule();
  });
});
