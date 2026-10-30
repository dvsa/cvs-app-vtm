import { createMockTrl } from '@/src/mocks/trl-record.mock';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { initialAppState } from '@store/index';
import { editingTechRecord, techRecord } from '@store/technical-records';
import { AuthorisationIntoServiceSectionSummaryComponent } from '../authorisation-into-service-section-summary.component';

describe('AuthorisationIntoServiceSectionSummaryComponent', () => {
	let component: AuthorisationIntoServiceSectionSummaryComponent;
	let fixture: ComponentFixture<AuthorisationIntoServiceSectionSummaryComponent>;
	let store: MockStore;

	const setRecords = (current: unknown, amended: unknown) => {
		store.overrideSelector(techRecord, current as never);
		store.overrideSelector(editingTechRecord, amended as never);
		store.refreshState();
	};

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [AuthorisationIntoServiceSectionSummaryComponent],
			providers: [provideHttpClient(), provideHttpClientTesting(), provideMockStore({ initialState: initialAppState })],
		}).compileComponents();

		store = TestBed.inject(MockStore);

		fixture = TestBed.createComponent(AuthorisationIntoServiceSectionSummaryComponent);
		component = fixture.componentInstance;
	});

	it('should create', () => {
		fixture.detectChanges();
		expect(component).toBeTruthy();
	});

	describe('amendedTechRecord', () => {
		it('should expose the amended tech record from the store', () => {
			const amended = createMockTrl(1) as TechRecordType<'trl'>;
			setRecords(createMockTrl(0), amended);
			fixture.detectChanges();

			expect(component.amendedTechRecord()).toEqual(amended);
		});

		it('should return undefined when there is no amended tech record', () => {
			setRecords(createMockTrl(0), undefined);
			fixture.detectChanges();

			expect(component.amendedTechRecord()).toBeUndefined();
		});
	});

	describe('template rendering', () => {
		it('should render nothing when there is no amended tech record', () => {
			setRecords(createMockTrl(0), undefined);
			fixture.detectChanges();

			const summaryList = fixture.debugElement.query(By.css('dl.govuk-summary-list'));
			expect(summaryList).toBeFalsy();
		});

		it('should only render rows for fields that have changed between the current and amended tech record', () => {
			const current = createMockTrl(0) as TechRecordType<'trl'>;
			current.techRecord_authIntoService_cocIssueDate = '2024-01-01';
			current.techRecord_authIntoService_dateReceived = '2024-01-02';

			const amended = { ...current } as TechRecordType<'trl'>;
			amended.techRecord_authIntoService_cocIssueDate = '2024-02-01';
			amended.techRecord_authIntoService_datePending = '2024-02-15';

			setRecords(current, amended);
			fixture.detectChanges();

			// Changed / newly-populated fields should render
			expect(fixture.debugElement.query(By.css('#test-techRecord_authIntoService_cocIssueDate'))).toBeTruthy();
			expect(fixture.debugElement.query(By.css('#test-techRecord_authIntoService_datePending'))).toBeTruthy();

			// Unchanged fields should not render
			expect(fixture.debugElement.query(By.css('#test-techRecord_authIntoService_dateReceived'))).toBeFalsy();
			expect(fixture.debugElement.query(By.css('#test-techRecord_authIntoService_dateAuthorised'))).toBeFalsy();
			expect(fixture.debugElement.query(By.css('#test-techRecord_authIntoService_dateRejected'))).toBeFalsy();
		});

		it('should display the formatted date for a changed field', () => {
			const current = createMockTrl(0) as TechRecordType<'trl'>;
			current.techRecord_authIntoService_cocIssueDate = '2024-01-01';

			const amended = { ...current } as TechRecordType<'trl'>;
			amended.techRecord_authIntoService_cocIssueDate = '2024-02-15';

			setRecords(current, amended);
			fixture.detectChanges();

			const element = fixture.debugElement.query(By.css('#test-techRecord_authIntoService_cocIssueDate'));
			expect(element.nativeElement.textContent.trim()).toBe('15/02/2024');
		});

		it('should render every row when there is no current tech record to compare against', () => {
			setRecords(undefined, createMockTrl(0));
			fixture.detectChanges();

			expect(fixture.debugElement.query(By.css('#test-techRecord_authIntoService_cocIssueDate'))).toBeTruthy();
			expect(fixture.debugElement.query(By.css('#test-techRecord_authIntoService_dateReceived'))).toBeTruthy();
			expect(fixture.debugElement.query(By.css('#test-techRecord_authIntoService_datePending'))).toBeTruthy();
			expect(fixture.debugElement.query(By.css('#test-techRecord_authIntoService_dateAuthorised'))).toBeTruthy();
			expect(fixture.debugElement.query(By.css('#test-techRecord_authIntoService_dateRejected'))).toBeTruthy();
		});

		it('should display a placeholder for a changed field with no value', () => {
			const current = createMockTrl(0) as TechRecordType<'trl'>;
			current.techRecord_authIntoService_dateRejected = '2024-01-01';

			const amended = { ...current } as TechRecordType<'trl'>;
			amended.techRecord_authIntoService_dateRejected = null as unknown as string;

			setRecords(current, amended);
			fixture.detectChanges();

			const element = fixture.debugElement.query(By.css('#test-techRecord_authIntoService_dateRejected'));
			expect(element.nativeElement.textContent.trim()).toBe('-');
		});
	});
});
