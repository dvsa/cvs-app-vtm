import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { provideMockStore } from '@ngrx/store/testing';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { SharedModule } from '@shared/shared.module';
import { initialAppState } from '@store/index';
import { of } from 'rxjs';
import { GenerateBatchNumbersComponent } from './generate-batch-numbers.component';

const mockTechRecordService = {
  editableVehicleTechRecord$: of({}),
  setApplicationId: jest.fn(),
  setGenerateNumberFlag: jest.fn()
};

describe('GenerateBatchNumbersComponent', () => {
  let component: GenerateBatchNumbersComponent;
  let fixture: ComponentFixture<GenerateBatchNumbersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GenerateBatchNumbersComponent],
      imports: [FormsModule, ReactiveFormsModule, RouterTestingModule, DynamicFormsModule, SharedModule],
      providers: [{ provide: TechnicalRecordService, useValue: mockTechRecordService }, provideMockStore({ initialState: initialAppState })]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateBatchNumbersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
