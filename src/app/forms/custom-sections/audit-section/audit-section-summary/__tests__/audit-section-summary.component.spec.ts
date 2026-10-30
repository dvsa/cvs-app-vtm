import { createMockHgv } from '@/src/mocks/hgv-record.mock';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb-vehicle-type';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { initialAppState } from '@store/index';
import { editingTechRecord, techRecord } from '@store/technical-records';
import { AuditSectionSummaryComponent } from '../audit-section-summary.component';

describe('AuditSectionSummaryComponent', () => {
	let component: AuditSectionSummaryComponent;
	let fixture: ComponentFixture<AuditSectionSummaryComponent>;
	let store: MockStore;

	const setRecords = (current: unknown, amended: unknown) => {
		store.overrideSelector(techRecord, current as never);
		store.overrideSelector(editingTechRecord, amended as never);
		store.refreshState();
	};

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [AuditSectionSummaryComponent],
			providers: [provideHttpClient(), provideHttpClientTesting(), provideMockStore({ initialState: initialAppState })],
		}).compileComponents();

		store = TestBed.inject(MockStore);

		fixture = TestBed.createComponent(AuditSectionSummaryComponent);
		component = fixture.componentInstance;
	});

	it('should create', () => {
		fixture.detectChanges();
		expect(component).toBeTruthy();
	});

	describe('currentTechRecord and amendedTechRecord', () => {
		it('should expose the current and amended tech records from the store', () => {
			const current = createMockHgv(1) as TechRecordType<'hgv'>;
			const amended = createMockHgv(2) as TechRecordType<'hgv'>;
			setRecords(current, amended);
			fixture.detectChanges();

			expect(component.currentTechRecord()).toEqual(current);
			expect(component.amendedTechRecord()).toEqual(amended);
		});

		it('should return undefined when there is no amended tech record', () => {
			setRecords(createMockHgv(0), undefined);
			fixture.detectChanges();

			expect(component.amendedTechRecord()).toBeUndefined();
		});
	});

	describe('template rendering', () => {
		it('should render nothing when there is no amended tech record', () => {
			setRecords(createMockHgv(0), undefined);
			fixture.detectChanges();

			const summaryList = fixture.debugElement.query(By.css('dl.govuk-summary-list'));
			expect(summaryList).toBeFalsy();
		});

		it('should only render rows for fields that have changed between the current and amended tech record', () => {
			const current = createMockHgv(0) as TechRecordType<'hgv'>;
			current.techRecord_reasonForCreation = 'original reason';
			current.techRecord_createdByName = 'Original Author';

			const amended = { ...current } as TechRecordType<'hgv'> & {
				techRecord_lastUpdatedAt?: string;
				techRecord_lastUpdatedByName?: string;
				techRecord_lastUpdatedById?: string;
			};
			amended.techRecord_reasonForCreation = 'updated reason';
			amended.techRecord_lastUpdatedAt = '2024-02-02T10:00:00.000Z';
			amended.techRecord_lastUpdatedByName = 'New Author';
			amended.techRecord_lastUpdatedById = '99';

			setRecords(current, amended);
			fixture.detectChanges();

			// Changed fields should render
			expect(fixture.debugElement.query(By.css('#test-techRecord_reasonForCreation'))).toBeTruthy();
			expect(fixture.debugElement.query(By.css('#test-techRecord_lastUpdatedAt'))).toBeTruthy();
			expect(fixture.debugElement.query(By.css('#test-techRecord_lastUpdatedByName'))).toBeTruthy();
			expect(fixture.debugElement.query(By.css('#test-techRecord_lastUpdatedById'))).toBeTruthy();

			// Unchanged fields should not render
			expect(fixture.debugElement.query(By.css('#test-techRecord_createdByName'))).toBeFalsy();
			expect(fixture.debugElement.query(By.css('#test-techRecord_createdAt'))).toBeFalsy();
			expect(fixture.debugElement.query(By.css('#test-techRecord_createdById'))).toBeFalsy();
		});

		it('should display the formatted value for a changed field', () => {
			const current = createMockHgv(0) as TechRecordType<'hgv'>;
			current.techRecord_reasonForCreation = 'original reason';

			const amended = { ...current } as TechRecordType<'hgv'>;
			amended.techRecord_reasonForCreation = 'updated reason';

			setRecords(current, amended);
			fixture.detectChanges();

			const reasonElement = fixture.debugElement.query(By.css('#test-techRecord_reasonForCreation'));
			expect(reasonElement.nativeElement.textContent.trim()).toBe('updated reason');
		});

		it('should render every row when there is no current tech record to compare against', () => {
			setRecords(undefined, createMockHgv(0));
			fixture.detectChanges();

			expect(fixture.debugElement.query(By.css('#test-techRecord_reasonForCreation'))).toBeTruthy();
			expect(fixture.debugElement.query(By.css('#test-techRecord_createdAt'))).toBeTruthy();
			expect(fixture.debugElement.query(By.css('#test-techRecord_createdByName'))).toBeTruthy();
			expect(fixture.debugElement.query(By.css('#test-techRecord_createdById'))).toBeTruthy();
		});
	});
});
