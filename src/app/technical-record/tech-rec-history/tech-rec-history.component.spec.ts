import { ComponentFixture, getTestBed, TestBed } from '@angular/core/testing';
import { SharedModule } from '@app/shared/shared.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TechRecHistoryComponent } from './tech-rec-history.component';
import { TESTING_UTILS } from '../../utils/testing.utils';
import { VehicleTechRecordModel } from '@app/models/vehicle-tech-record.model';

describe('TechRecHistoryComponent', () => {
  let component: TechRecHistoryComponent;
  let fixture: ComponentFixture<TechRecHistoryComponent>;
  let injector: TestBed;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [TechRecHistoryComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(TechRecHistoryComponent);
    injector = getTestBed();
    component = fixture.componentInstance;
    component.techRecordsJson = {
      techRecord: [
        {
          statusCode: 'current',
          reasonForCreation: 'reason for creation',
          createdByName: 'test name',
          createdAt: '1-1-2020',
          lastUpdatedByName: 'test 1',
          lastUpdatedAt: '12-3-2020'
        }
      ]
    } as VehicleTechRecordModel;
  });

  it('should create view only with populated data', () => {
    fixture.detectChanges();

    expect(component).toBeDefined();
    expect(fixture).toMatchSnapshot();
  });

  afterAll(() => {
    TestBed.resetTestingModule();
  });
});
