import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { VehicleTechnicalRecordComponent } from './vehicle-technical-record.component';
import { initialAppState } from '@store/.';
import { provideMockStore } from '@ngrx/store/testing';
import { TestRecordSummaryComponent } from '../../../test-record-summary/test-record-summary.component';
import { TechRecordSummaryComponent } from '../tech-record-summary/tech-record-summary.component';
import { SharedModule } from '@shared/shared.module';
import { mockVehicleTechnicalRecord } from '@mocks/mock-vehicle-technical-record.mock';

describe('VehicleTechnicalRecordComponent', () => {
  let component: VehicleTechnicalRecordComponent;
  let fixture: ComponentFixture<VehicleTechnicalRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SharedModule],
      declarations: [VehicleTechnicalRecordComponent, TestRecordSummaryComponent, TechRecordSummaryComponent],
      providers: [provideMockStore({ initialState: initialAppState })]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleTechnicalRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get current vrm', () => {
    component.vehicleTechRecord = mockVehicleTechnicalRecord();
    expect(component.currentVrm).toEqual('KP01 ABC');
  });

  it('should get other Vrms', () => {
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
});
