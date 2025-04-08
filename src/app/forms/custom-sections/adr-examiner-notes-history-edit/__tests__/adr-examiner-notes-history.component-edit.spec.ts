import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { AdrExaminerNotesHistoryEditComponent } from '@forms/custom-sections/adr-examiner-notes-history-edit/adr-examiner-notes-history.component-edit';

import { mockVehicleTechnicalRecord } from '@mocks/mock-vehicle-technical-record.mock';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { provideMockStore } from '@ngrx/store/testing';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { initialAppState } from '@store/index';
import { of } from 'rxjs';

const mockTechRecordService = {
	techRecord$: jest.fn(),
};
describe('AdrExaminerNotesHistoryEditComponent', () => {
	let component: AdrExaminerNotesHistoryEditComponent;
	let fixture: ComponentFixture<AdrExaminerNotesHistoryEditComponent>;
	let router: Router;

	const MOCK_HGV = mockVehicleTechnicalRecord(VehicleTypes.HGV) as TechRecordType<'hgv'>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [FormsModule, ReactiveFormsModule, AdrExaminerNotesHistoryEditComponent],
			providers: [
				{ provide: TechnicalRecordService, useValue: mockTechRecordService },
				provideRouter([]),
				provideMockStore({ initialState: initialAppState }),
				{ provide: ActivatedRoute, useValue: { params: of([{ id: 1 }]) } },
			],
		}).compileComponents();
		fixture = TestBed.createComponent(AdrExaminerNotesHistoryEditComponent);
		component = fixture.componentInstance;
		router = TestBed.inject(Router);
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
				createdAtDate: new Date().toISOString(),
				lastUpdatedBy: 'Someone Somewhere',
			};
			component.currentTechRecord.techRecord_adrDetails_additionalExaminerNotes = [testNote];
			const notes = component.getAdditionalExaminerNotes();
			expect(notes).toEqual([testNote]);
		});
	});
	describe('getEditAdditionalExaminerNotePage', () => {
		it('should navigate you to the EditAdditionalExaminerNotePage', () => {
			const routerSpy = jest.spyOn(router, 'navigate');
			component.getEditAdditionalExaminerNotePage(1);
			expect(routerSpy).toHaveBeenCalled();
		});
	});

	describe('handlePaginationChange', () => {
		it('should set the start and end pages', () => {
			component.handlePaginationChange({ start: 0, end: 3 });

			expect(component.pageStart).toBe(0);
			expect(component.pageEnd).toBe(3);
		});
	});

	describe('currentAdrNotesPage', () => {
		it('should return a sliced array of adr notes depending on the page the user is on', () => {
			component.currentTechRecord = { ...MOCK_HGV };
			component.pageStart = 1;
			component.pageEnd = 2;
			component.currentTechRecord.techRecord_adrDetails_additionalExaminerNotes = [
				{ createdAtDate: 'test1', lastUpdatedBy: 'test1', note: 'test note 1' },
				{ createdAtDate: 'test2', lastUpdatedBy: 'test2', note: 'test note 2' },
			];
			expect(component.currentAdrNotesPage).toEqual([
				{ createdAtDate: 'test2', lastUpdatedBy: 'test2', note: 'test note 2' },
			]);
		});

		it('should return an empty array if the adr examiner notes is undefined', () => {
			component.currentTechRecord = { ...MOCK_HGV };
			component.pageStart = 2;
			component.pageEnd = 3;
			component.currentTechRecord.techRecord_adrDetails_additionalExaminerNotes = undefined;
			expect(component.currentAdrNotesPage).toEqual([]);
		});
	});
});
