import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { SharedModule } from '@shared/shared.module';
import { of } from 'rxjs';
import { BatchCreateResultsComponent } from './batch-create-results.component';

const mockTechRecordService = {
  editableVehicleTechRecord$: of({}),
  batchVehiclesCreated$: of([]),
  batchCount$: of(0),
  batchCreatedCount$: of(0)
};

describe('BatchCreateResultsComponent', () => {
  let component: BatchCreateResultsComponent;
  let fixture: ComponentFixture<BatchCreateResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BatchCreateResultsComponent],
      imports: [RouterTestingModule, DynamicFormsModule, SharedModule],
      providers: [{ provide: TechnicalRecordService, useValue: mockTechRecordService }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BatchCreateResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
