import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { VehicleTechnicalRecordComponent } from './vehicle-technical-record.component';
import { initialAppState } from '@store/.';
import { provideMockStore } from '@ngrx/store/testing';
import { TestRecordSummaryComponent } from '../features/test-record-summary/test-record-summary.component';

describe('VehicleTechnicalRecordComponent', () => {
  let component: VehicleTechnicalRecordComponent;
  let fixture: ComponentFixture<VehicleTechnicalRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ VehicleTechnicalRecordComponent, TestRecordSummaryComponent ],
      providers: [provideMockStore({ initialState: initialAppState })]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleTechnicalRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
