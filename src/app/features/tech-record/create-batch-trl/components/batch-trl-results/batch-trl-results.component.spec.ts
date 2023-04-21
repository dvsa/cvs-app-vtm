import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { initialAppState, State } from '@store/.';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { BatchTrlResultsComponent } from './batch-trl-results.component';
import { SharedModule } from '@shared/shared.module';

describe('BatchTrlResultsComponent', () => {
  let component: BatchTrlResultsComponent;
  let fixture: ComponentFixture<BatchTrlResultsComponent>;
  let store: MockStore<State>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, SharedModule],
      declarations: [BatchTrlResultsComponent],
      providers: [provideMockStore({ initialState: initialAppState })]
    }).compileComponents();
  });

  beforeEach(() => {
    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(BatchTrlResultsComponent);
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
  });
});
