import { createMockHgv } from '@/src/mocks/hgv-record.mock';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb-vehicle-type';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { initialAppState } from '@store/index';
import { techRecord } from '@store/technical-records';
import { AuditSectionViewComponent } from '../audit-section-view.component';

describe('AuditSectionViewComponent', () => {
	let component: AuditSectionViewComponent;
	let fixture: ComponentFixture<AuditSectionViewComponent>;
	let store: MockStore;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [AuditSectionViewComponent],
			providers: [provideHttpClient(), provideHttpClientTesting(), provideMockStore({ initialState: initialAppState })],
		}).compileComponents();

		store = TestBed.inject(MockStore);

		fixture = TestBed.createComponent(AuditSectionViewComponent);
		component = fixture.componentInstance;
	});

	it('should create', () => {
		fixture.detectChanges();
		expect(component).toBeTruthy();
	});

	describe('techRecord', () => {
		it('should expose the current tech record from the store', () => {
			const mockTechRecord = createMockHgv(0) as TechRecordType<'hgv'>;
			store.overrideSelector(techRecord, mockTechRecord);
			store.refreshState();
			fixture.detectChanges();

			expect(component.techRecord()).toEqual(mockTechRecord);
		});

		it('should return undefined when there is no tech record in the store', () => {
			store.overrideSelector(techRecord, undefined as never);
			store.refreshState();
			fixture.detectChanges();

			expect(component.techRecord()).toBeUndefined();
		});
	});

	describe('template rendering', () => {
		it('should render nothing when there is no tech record', () => {
			store.overrideSelector(techRecord, undefined as never);
			store.refreshState();
			fixture.detectChanges();

			const summaryList = fixture.debugElement.query(By.css('dl.govuk-summary-list'));
			expect(summaryList).toBeFalsy();
		});

		it('should render every audit field from the tech record', () => {
			const mockTechRecord = createMockHgv(0) as TechRecordType<'hgv'> & {
				techRecord_lastUpdatedAt?: string;
				techRecord_lastUpdatedByName?: string;
				techRecord_lastUpdatedById?: string;
			};
			mockTechRecord.techRecord_reasonForCreation = 'Brake Failure';
			mockTechRecord.techRecord_createdByName = 'Original Author';
			mockTechRecord.techRecord_createdById = '1';
			mockTechRecord.techRecord_lastUpdatedAt = '2024-02-02T10:00:00.000Z';
			mockTechRecord.techRecord_lastUpdatedByName = 'New Author';
			mockTechRecord.techRecord_lastUpdatedById = '99';

			store.overrideSelector(techRecord, mockTechRecord);
			store.refreshState();
			fixture.detectChanges();

			expect(
				fixture.debugElement.query(By.css('#test-techRecord_reasonForCreation')).nativeElement.textContent.trim()
			).toBe('Brake Failure');
			expect(
				fixture.debugElement.query(By.css('#test-techRecord_createdByName')).nativeElement.textContent.trim()
			).toBe('Original Author');
			expect(fixture.debugElement.query(By.css('#test-techRecord_createdById')).nativeElement.textContent.trim()).toBe(
				'1'
			);
			expect(
				fixture.debugElement.query(By.css('#test-techRecord_lastUpdatedByName')).nativeElement.textContent.trim()
			).toBe('New Author');
			expect(
				fixture.debugElement.query(By.css('#test-techRecord_lastUpdatedById')).nativeElement.textContent.trim()
			).toBe('99');
		});

		it('should display a placeholder for missing fields via the defaultNullOrEmpty pipe', () => {
			const mockTechRecord = createMockHgv(0) as TechRecordType<'hgv'> & {
				techRecord_lastUpdatedByName?: string | null;
			};
			mockTechRecord.techRecord_lastUpdatedByName = null;

			store.overrideSelector(techRecord, mockTechRecord);
			store.refreshState();
			fixture.detectChanges();

			const element = fixture.debugElement.query(By.css('#test-techRecord_lastUpdatedByName'));
			expect(element.nativeElement.textContent.trim()).toBe('-');
		});
	});
});
