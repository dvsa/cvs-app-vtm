import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { mockVehicleTechnicalRecord } from '@mocks/mock-vehicle-technical-record.mock';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { provideMockStore } from '@ngrx/store/testing';
import { CustomFormControl, FormNodeTypes } from '@services/dynamic-forms/dynamic-form.types';
import { RouterService } from '@services/router/router.service';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { State, initialAppState } from '@store/index';
import { of } from 'rxjs';
import { AdrExaminerNotesHistoryViewComponent } from '../adr-examiner-notes-history-view.component';

describe('AdrExaminerNotesHistoryViewComponent', () => {
	let component: AdrExaminerNotesHistoryViewComponent;
	let fixture: ComponentFixture<AdrExaminerNotesHistoryViewComponent>;

	const MOCK_HGV = mockVehicleTechnicalRecord(VehicleTypes.HGV) as TechRecordType<'hgv'>;
	const mockTechRecordService = {
		techRecord$: of({ ...MOCK_HGV }),
	};
	const mockRouterService = {};

	const control = new CustomFormControl({
		name: 'techRecord_adrDetails_additionalExaminerNotes',
		type: FormNodeTypes.CONTROL,
		label: 'Additional Examiner Notes History',
	});

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [AdrExaminerNotesHistoryViewComponent],
			providers: [
				provideMockStore<State>({ initialState: initialAppState }),
				{ provide: TechnicalRecordService, useValue: mockTechRecordService },
				{ provide: RouterService, useValue: mockRouterService },
				{ provide: NG_VALUE_ACCESSOR, useExisting: AdrExaminerNotesHistoryViewComponent, multi: true },
				{
					provide: NgControl,
					useValue: {
						control: { key: control.meta.name, value: control },
					},
				},
			],
		}).compileComponents();

		fixture = TestBed.createComponent(AdrExaminerNotesHistoryViewComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('ngOnInit', () => {
		it('should set the currentTechRecord when ngOnInit is fired', () => {
			component.currentTechRecord = undefined;

			component.ngOnInit();
			expect(component.currentTechRecord).toEqual(MOCK_HGV);
		});
	});

	describe('adrNotes', () => {
		it('should return an array of the technical records adr examiner notes', () => {
			component.currentTechRecord = { ...MOCK_HGV };
			component.currentTechRecord.techRecord_adrDetails_additionalExaminerNotes = [
				{ createdAtDate: 'test', lastUpdatedBy: 'test', note: 'test note' },
			];
			expect(component.getAdditionalExaminerNotes()).toEqual([
				{ createdAtDate: 'test', lastUpdatedBy: 'test', note: 'test note' },
			]);
		});

		it('should return an empty array if the adr examiner notes is undefined', () => {
			component.currentTechRecord = { ...MOCK_HGV };
			component.currentTechRecord.techRecord_adrDetails_additionalExaminerNotes = undefined;
			expect(component.getAdditionalExaminerNotes()).toEqual([]);
		});
	});

	describe('currentAdrNotesPage', () => {
		it('should return a sliced array of adr notes depending on the page the user is on', () => {
			component.currentTechRecord = { ...MOCK_HGV };
			component.pageStart = 2;
			component.pageEnd = 3;
			component.currentTechRecord.techRecord_adrDetails_additionalExaminerNotes = [
				{ createdAtDate: 'test1', lastUpdatedBy: 'test1', note: 'test note 1' },
				{ createdAtDate: 'test2', lastUpdatedBy: 'test2', note: 'test note 2' },
				{ createdAtDate: 'test3', lastUpdatedBy: 'test3', note: 'test note 3' },
				{ createdAtDate: 'test4', lastUpdatedBy: 'test4', note: 'test note 4' },
			];
			expect(component.currentAdrNotesPage).toEqual([
				{ createdAtDate: 'test3', lastUpdatedBy: 'test3', note: 'test note 3' },
			]);
		});

		it('should return an empty array if the adr examiner notes is undefined', () => {
			component.currentTechRecord = { ...MOCK_HGV };
			component.pageStart = 1;
			component.pageEnd = 2;
			component.currentTechRecord.techRecord_adrDetails_additionalExaminerNotes = undefined;
			expect(component.currentAdrNotesPage).toEqual([]);
		});
	});

	describe('handlePaginationChange', () => {
		it('should set the start and end pages', () => {
			component.handlePaginationChange({ start: 0, end: 3 });

			expect(component.pageStart).toBe(0);
			expect(component.pageEnd).toBe(3);
		});
	});
});
