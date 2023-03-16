import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { provideMockStore } from '@ngrx/store/testing';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { SharedModule } from '@shared/shared.module';
import { initialAppState } from '@store/index';
import { of } from 'rxjs';
import { BatchCreateComponent } from './batch-create.component';

const mockTechRecordService = {
  editableVehicleTechRecord$: of({}),
  batchVehicles$: of([]),
  batchCount$: of(0),
  generateNumber$: of(false),
  upsertVehicleBatch: jest.fn()
};

describe('BatchCreateComponent', () => {
  let component: BatchCreateComponent;
  let fixture: ComponentFixture<BatchCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BatchCreateComponent],
      imports: [FormsModule, ReactiveFormsModule, RouterTestingModule, DynamicFormsModule, SharedModule],
      providers: [
        { provide: TechnicalRecordService, useValue: mockTechRecordService },
        GlobalErrorService,
        provideMockStore({ initialState: initialAppState })
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BatchCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
