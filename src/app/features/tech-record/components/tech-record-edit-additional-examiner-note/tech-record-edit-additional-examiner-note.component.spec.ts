import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { provideMockStore } from '@ngrx/store/testing';
import { initialAppState } from '@store/index';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { TechRecordEditAdditionalExaminerNoteComponent } from './tech-record-edit-additional-examiner-note.component';


const mockTechRecordService = {
  techRecord$: jest.fn(),
};
describe('TechRecordEditAdditionalExaminerNoteComponent', () => {
  let fixture: ComponentFixture<TechRecordEditAdditionalExaminerNoteComponent>;
  let component: TechRecordEditAdditionalExaminerNoteComponent;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TechRecordEditAdditionalExaminerNoteComponent],
      imports: [DynamicFormsModule, FormsModule, ReactiveFormsModule, RouterTestingModule],
      providers: [
        { provide: TechnicalRecordService, useValue: mockTechRecordService },
        provideMockStore({ initialState: initialAppState }),
        { provide: ActivatedRoute, useValue: { params: of([{ id: 1 }]) } },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(TechRecordEditAdditionalExaminerNoteComponent);
    component = fixture.componentInstance;
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('getTechRecord', () => {

  });
  describe('getExaminerNote', () => {

  });
  describe('setupForm', () => {

  });
  describe('ngOnInit', () => {

  });
  describe('navigateBack', () => {

  });
  describe('handleSubmit', () => {

  });
});
