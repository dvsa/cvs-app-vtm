import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { initialAppState } from '@store/index';
import { Observable } from 'rxjs';

import { HydrateNewVehicleRecordComponent } from './hydrate-new-vehicle-record.component';

describe('HydrateNewVehicleRecordComponent', () => {
  let component: HydrateNewVehicleRecordComponent;
  let fixture: ComponentFixture<HydrateNewVehicleRecordComponent>;
  let techRecordService: TechnicalRecordService;
  let actions$ = new Observable<Action>();
  let route: ActivatedRoute;
  let router: Router;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HydrateNewVehicleRecordComponent],
      providers: [provideMockActions(() => actions$), provideMockStore({ initialState: initialAppState })],
      imports: [HttpClientTestingModule, RouterTestingModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HydrateNewVehicleRecordComponent);
    route = TestBed.inject(ActivatedRoute);
    router = TestBed.inject(Router);
    store = TestBed.inject(MockStore);
    techRecordService = TestBed.inject(TechnicalRecordService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
