import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  AdrExaminerNotesHistoryComponent,
} from '@forms/custom-sections/adr-examiner-notes-history/adr-examiner-notes-history.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { mockVehicleTechnicalRecord } from '@mocks/mock-vehicle-technical-record.mock';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';

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
    fixture = TestBed.createComponent(AdrExaminerNotesHistoryComponent);
    component = fixture.componentInstance;
  });
  describe('ngOnDestroy', () => {
    it('should call destroy$.next and destroy$.complete', () => {
      jest.spyOn(component.destroy$, 'next');
      jest.spyOn(component.destroy$, 'complete');
      component.ngOnDestroy();
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(component.destroy$.next).toHaveBeenCalled();
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(component.destroy$.complete).toHaveBeenCalled();
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
