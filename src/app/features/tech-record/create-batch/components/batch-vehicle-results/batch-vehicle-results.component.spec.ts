import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { initialAppState, State } from '@store/.';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { SharedModule } from '@shared/shared.module';
import { BatchVehicleResultsComponent } from './batch-vehicle-results.component';

describe('BatchVehicleResultsComponent', () => {
  let component: BatchVehicleResultsComponent;
  let fixture: ComponentFixture<BatchVehicleResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, SharedModule],
      declarations: [BatchVehicleResultsComponent],
      providers: [provideMockStore({ initialState: initialAppState })],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BatchVehicleResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose relevant observables', () => {
    expect(component.batchCount$).toBeTruthy();
    expect(component.batchSuccessCount$).toBeTruthy();
    expect(component.batchCreatedCount$).toBeTruthy();
    expect(component.batchTotalCreatedCount$).toBeTruthy();
    expect(component.batchUpdatedCount$).toBeTruthy();
    expect(component.batchTotalUpdatedCount$).toBeTruthy();
    expect(component.applicationId$).toBeTruthy();
    expect(component.batchVehiclesSuccess$).toBeTruthy();
    expect(component.vehicleType$).toBeTruthy();
  });
});
