import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ApiModule as TestResultsApiModule } from '@api/test-results';
import { StatusCodes } from '@models/vehicle-tech-record.model';
import { mockVehicleTechnicalRecord } from '@mocks/mock-vehicle-technical-record.mock';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { SharedModule } from '@shared/shared.module';
import { initialAppState, State } from '@store/.';
import { selectRouteNestedParams } from '@store/router/selectors/router.selectors';
import { TechRecordSummaryComponent } from '../tech-record-summary/tech-record-summary.component';
import { TestRecordSummaryComponent } from '../test-record-summary/test-record-summary.component';
import { VehicleTechnicalRecordComponent } from './vehicle-technical-record.component';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { TechRecordHistoryComponent } from '../tech-record-history/tech-record-history.component';
import { UserService } from '@services/user-service/user-service';
import { of } from 'rxjs';

describe('VehicleTechnicalRecordComponent', () => {
  let component: VehicleTechnicalRecordComponent;
  let fixture: ComponentFixture<VehicleTechnicalRecordComponent>;
  let store: MockStore<State>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SharedModule, RouterTestingModule, TestResultsApiModule, DynamicFormsModule],
      declarations: [VehicleTechnicalRecordComponent, TestRecordSummaryComponent, TechRecordSummaryComponent, TechRecordHistoryComponent],
      providers: [
        provideMockStore({ initialState: initialAppState }),
        {
          provide: UserService,
          useValue: {
            roles$: of(['TestResult.View'])
          }
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(VehicleTechnicalRecordComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should get current vrm', () => {
    fixture.detectChanges();
    component.vehicleTechRecord = mockVehicleTechnicalRecord();
    expect(component.currentVrm).toEqual('KP01 ABC');
  });

  it('should get other Vrms', () => {
    fixture.detectChanges();
    component.vehicleTechRecord = mockVehicleTechnicalRecord();
    expect(component.otherVrms).toEqual([
      {
        vrm: '609859Z',
        isPrimary: false
      },
      {
        vrm: '609959Z',
        isPrimary: false
      }
    ]);
  });

  it('should get current tech record', () => {
    component.vehicleTechRecord = mockVehicleTechnicalRecord();
    component.vehicleTechRecord.techRecord = component.vehicleTechRecord.techRecord.filter(record => record.statusCode === StatusCodes.CURRENT);
    fixture.detectChanges();

    component.currentTechRecord$?.subscribe(record => expect(record).toBeTruthy());
  });

  it('should get archived tech record', () => {
    component.vehicleTechRecord = mockVehicleTechnicalRecord();
    component.vehicleTechRecord.techRecord = component.vehicleTechRecord.techRecord.filter(record => record.statusCode === StatusCodes.ARCHIVED);
    fixture.detectChanges();

    component.currentTechRecord$?.subscribe(record => expect(record).toBeTruthy());
  });

  it('should get tech record using created date', () => {
    const expectedDate = new Date();
    store.overrideSelector(selectRouteNestedParams, { techCreatedAt: expectedDate });
    component.vehicleTechRecord = mockVehicleTechnicalRecord();
    component.vehicleTechRecord.techRecord[0].createdAt = expectedDate;
    fixture.detectChanges();

    component.currentTechRecord$?.subscribe(record => expect(record).toBeTruthy());
  });
});
