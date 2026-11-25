import { createMockHgv } from '@/src/mocks/hgv-record.mock';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdditionalExaminerNotes } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/hgv/complete';
import { TechRecordGETHGV } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb-vehicle-type';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { initialAppState } from '@store/index';
import { techRecord } from '@store/technical-records';
import { AdrSectionViewComponent } from '../adr-section-view.component';

describe('AdrSectionViewComponent', () => {
	let component: AdrSectionViewComponent;
	let fixture: ComponentFixture<AdrSectionViewComponent>;
	let store: MockStore;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [AdrSectionViewComponent],
			providers: [provideHttpClient(), provideHttpClientTesting(), provideMockStore({ initialState: initialAppState })],
		}).compileComponents();

		store = TestBed.inject(MockStore);

		fixture = TestBed.createComponent(AdrSectionViewComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('sortAdditionalExaminerNotes', () => {
		it('should return an empty array when notes is undefined', () => {
			expect(component.sortAdditionalExaminerNotes(undefined)).toEqual([]);
		});

		it('should return an empty array when notes is null', () => {
			expect(component.sortAdditionalExaminerNotes(null)).toEqual([]);
		});

		it('should return an empty array when notes is an empty array', () => {
			expect(component.sortAdditionalExaminerNotes([])).toEqual([]);
		});

		it('should sort notes by createdAtDate in descending order', () => {
			const notes = [
				{ note: 'oldest', createdAtDate: '2020-01-01T00:00:00.000Z' },
				{ note: 'newest', createdAtDate: '2023-01-01T00:00:00.000Z' },
				{ note: 'middle', createdAtDate: '2021-01-01T00:00:00.000Z' },
			] as unknown as AdditionalExaminerNotes[];

			const result = component.sortAdditionalExaminerNotes(notes);

			expect(result.map((n) => n.note)).toEqual(['newest', 'middle', 'oldest']);
		});
	});

	describe('techRecord', () => {
		it('should expose the current tech record from the store', () => {
			const mockTechRecord = createMockHgv(0) as TechRecordGETHGV;
			store.overrideSelector(techRecord, mockTechRecord);
			store.refreshState();

			expect(component.techRecord()).toEqual(mockTechRecord);
		});

		it('should return undefined when there is no tech record in the store', () => {
			store.overrideSelector(techRecord, undefined as never);
			store.refreshState();

			expect(component.techRecord()).toBeUndefined();
		});
	});
});
