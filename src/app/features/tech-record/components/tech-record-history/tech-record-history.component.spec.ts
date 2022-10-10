import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { mockVehicleTechnicalRecord } from '@mocks/mock-vehicle-technical-record.mock';
import { SharedModule } from '@shared/shared.module';
import { TechRecordHistoryComponent } from './tech-record-history.component';

describe('TechRecordHistoryComponent', () => {
  let component: TechRecordHistoryComponent;
  let fixture: ComponentFixture<TechRecordHistoryComponent>;
  let router: Router;
  let route: ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TechRecordHistoryComponent],
      imports: [RouterTestingModule, SharedModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TechRecordHistoryComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    route = TestBed.inject(ActivatedRoute);
    component.vehicleTechRecord = mockVehicleTechnicalRecord();
    component.currentRecord = mockVehicleTechnicalRecord().techRecord[0];
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
