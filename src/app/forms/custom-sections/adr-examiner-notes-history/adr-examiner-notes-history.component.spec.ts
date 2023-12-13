import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  AdrExaminerNotesHistoryComponent,
} from '@forms/custom-sections/adr-examiner-notes-history/adr-examiner-notes-history.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';

const mockTechRecordService = {
  techRecord$: jest.fn(),
};
describe('ADRExaminerNotesHistoryComponent', () => {
  let component: AdrExaminerNotesHistoryComponent;
  let fixture: ComponentFixture<AdrExaminerNotesHistoryComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdrExaminerNotesHistoryComponent],
      imports: [DynamicFormsModule, FormsModule, ReactiveFormsModule],
      providers: [
        { provide: TechnicalRecordService, useValue: mockTechRecordService },
      ],
    }).compileComponents();
  });

  describe('ngAfterContentInit', () => {
    it('should call', () => {

    });
  });
});
