import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { V3TechRecordModel } from '@models/vehicle-tech-record.model';
import { provideMockStore } from '@ngrx/store/testing';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { SharedModule } from '@shared/shared.module';
import { initialAppState } from '@store/index';
import { TechRecordHistoryComponent } from './tech-record-history.component';
import { mockVehicleTechnicalRecord } from '@mocks/mock-vehicle-technical-record.mock';

describe('TechRecordHistoryComponent', () => {
  let component: TechRecordHistoryComponent;
  let fixture: ComponentFixture<TechRecordHistoryComponent>;
  let router: Router;
  let route: ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TechRecordHistoryComponent],
      imports: [HttpClientTestingModule, RouterTestingModule, SharedModule],
      providers: [TechnicalRecordService, provideMockStore({ initialState: initialAppState })]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TechRecordHistoryComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    route = TestBed.inject(ActivatedRoute);
    component.currentTechRecord = mockVehicleTechnicalRecord('hgv');
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
