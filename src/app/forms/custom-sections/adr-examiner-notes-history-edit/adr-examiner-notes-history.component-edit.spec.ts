import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import {
  AdrExaminerNotesHistoryEditComponent,
} from '@forms/custom-sections/adr-examiner-notes-history-edit/adr-examiner-notes-history.component-edit';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { mockVehicleTechnicalRecord } from '@mocks/mock-vehicle-technical-record.mock';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';

const mockTechRecordService = {
  techRecord$: jest.fn(),
};
describe('AdrExaminerNotesHistoryEditComponent', () => {
  let component: AdrExaminerNotesHistoryEditComponent;
  let fixture: ComponentFixture<AdrExaminerNotesHistoryEditComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdrExaminerNotesHistoryEditComponent],
      imports: [DynamicFormsModule, FormsModule, ReactiveFormsModule],
      providers: [
        { provide: TechnicalRecordService, useValue: mockTechRecordService },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(AdrExaminerNotesHistoryEditComponent);
    component = fixture.componentInstance;
  });
  describe('ngOnDestroy', () => {
    it('should call destroy$.next and destroy$.complete', () => {
      const nextSpy = jest.spyOn(component.destroy$, 'next');
      const completeSpy = jest.spyOn(component.destroy$, 'complete');
      component.ngOnDestroy();
      expect(nextSpy).toHaveBeenCalled();
      expect(completeSpy).toHaveBeenCalled();
    });
  });

  describe('getAdditionalExaminerNotes', () => {
    it('should return an empty array if additionalExaminerNotes is empty', () => {
      component.currentTechRecord = mockVehicleTechnicalRecord(VehicleTypes.HGV) as TechRecordType<'hgv'>;
      component.currentTechRecord.techRecord_adrDetails_additionalExaminerNotes = [];
      const notes = component.getAdditionalExaminerNotes();
      expect(notes).toEqual([]);
    });
    it('should return a populated array if additionalExaminerNotes is not empty', () => {

      component.currentTechRecord = mockVehicleTechnicalRecord(VehicleTypes.HGV) as TechRecordType<'hgv'>;
      const testNote = {
        note: 'testNote',
        createdAtDate: new Date().toISOString().split('T')[0],
        lastUpdatedBy: 'Someone Somewhere',
      };
      component.currentTechRecord.techRecord_adrDetails_additionalExaminerNotes = [testNote];
      const notes = component.getAdditionalExaminerNotes();
      expect(notes).toEqual([testNote]);
    });
  });
});
