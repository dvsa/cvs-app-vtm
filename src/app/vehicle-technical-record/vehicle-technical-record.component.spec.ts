import { ComponentFixture, ComponentFixtureNoNgZone, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { VehicleTechnicalRecordComponent } from './vehicle-technical-record.component';
import { initialAppState } from '@store/.';
import { provideMockStore } from '@ngrx/store/testing';
import { TestRecordSummaryComponent } from '../features/test-record-summary/test-record-summary.component';
import { TechRecordSummaryComponent } from '../features/tech-record-summary/tech-record-summary.component';
import { SharedModule } from '@shared/shared.module';

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
    component.vehicleTechRecord = {
      vrms: [
        {
          vrm: 'vrm1',
          isPrimary: true
        },
        {
          vrm: 'vrm2',
          isPrimary: false
        },
        {
          vrm: 'vrm3',
          isPrimary: false
        },
        {
          vrm: 'vrm4',
          isPrimary: false
        }
      ],
      vin: 'ABC123',
      systemNumber: '123',
      techRecord: []
    };
    expect(component.currentVrm).toEqual('vrm1');
  });

  it('should other Vrms', () => {
    component.vehicleTechRecord = {
      vrms: [
        {
          vrm: 'vrm1',
          isPrimary: true
        },
        {
          vrm: 'vrm2',
          isPrimary: false
        },
        {
          vrm: 'vrm3',
          isPrimary: false
        },
        {
          vrm: 'vrm4',
          isPrimary: false
        }
      ],
      vin: 'ABC123',
      systemNumber: '123',
      techRecord: []
    };
    expect(component.otherVrms).toEqual([
      {
        vrm: 'vrm2',
        isPrimary: false
      },
      {
        vrm: 'vrm3',
        isPrimary: false
      },
      {
        vrm: 'vrm4',
        isPrimary: false
      }
    ]);
  });
});
