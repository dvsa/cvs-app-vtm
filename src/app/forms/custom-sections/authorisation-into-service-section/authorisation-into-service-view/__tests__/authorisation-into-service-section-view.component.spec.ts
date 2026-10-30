import { createMockTrl } from '@/src/mocks/trl-record.mock';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { initialAppState } from '@store/index';
import { techRecord } from '@store/technical-records';
import { AuthorisationIntoServiceSectionViewComponent } from '../authorisation-into-service-section-view.component';

describe('AuthorisationIntoServiceSectionViewComponent', () => {
	let component: AuthorisationIntoServiceSectionViewComponent;
	let fixture: ComponentFixture<AuthorisationIntoServiceSectionViewComponent>;
	let store: MockStore;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [AuthorisationIntoServiceSectionViewComponent],
			providers: [
				provideRouter([]),
				provideHttpClient(),
				provideHttpClientTesting(),
				provideMockStore({ initialState: initialAppState }),
			],
		}).compileComponents();

		store = TestBed.inject(MockStore);

		fixture = TestBed.createComponent(AuthorisationIntoServiceSectionViewComponent);
		component = fixture.componentInstance;
	});

	it('should create', () => {
		fixture.detectChanges();
		expect(component).toBeTruthy();
	});

	describe('techRecord', () => {
		it('should expose the current tech record from the store', () => {
			const mockTechRecord = createMockTrl(0) as TechRecordType<'trl'>;
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

		it('should render every authorisation into service field from the tech record', () => {
			const mockTechRecord = createMockTrl(0) as TechRecordType<'trl'>;
			mockTechRecord.techRecord_authIntoService_cocIssueDate = '2024-01-01';
			mockTechRecord.techRecord_authIntoService_dateReceived = '2024-01-02';
			mockTechRecord.techRecord_authIntoService_datePending = '2024-01-03';
			mockTechRecord.techRecord_authIntoService_dateAuthorised = '2024-01-04';
			mockTechRecord.techRecord_authIntoService_dateRejected = '2024-01-05';

			store.overrideSelector(techRecord, mockTechRecord);
			store.refreshState();
			fixture.detectChanges();

			expect(
				fixture.debugElement
					.query(By.css('#test-techRecord_authIntoService_cocIssueDate'))
					.nativeElement.textContent.trim()
			).toBe('01/01/2024');
			expect(
				fixture.debugElement
					.query(By.css('#test-techRecord_authIntoService_dateReceived'))
					.nativeElement.textContent.trim()
			).toBe('02/01/2024');
			expect(
				fixture.debugElement
					.query(By.css('#test-techRecord_authIntoService_datePending'))
					.nativeElement.textContent.trim()
			).toBe('03/01/2024');
			expect(
				fixture.debugElement
					.query(By.css('#test-techRecord_authIntoService_dateAuthorised'))
					.nativeElement.textContent.trim()
			).toBe('04/01/2024');
			expect(
				fixture.debugElement
					.query(By.css('#test-techRecord_authIntoService_dateRejected'))
					.nativeElement.textContent.trim()
			).toBe('05/01/2024');
		});

		it('should display a placeholder for missing fields via the defaultNullOrEmpty pipe', () => {
			const mockTechRecord = createMockTrl(0) as TechRecordType<'trl'>;
			mockTechRecord.techRecord_authIntoService_cocIssueDate = null as unknown as string;

			store.overrideSelector(techRecord, mockTechRecord);
			store.refreshState();
			fixture.detectChanges();

			const element = fixture.debugElement.query(By.css('#test-techRecord_authIntoService_cocIssueDate'));
			expect(element.nativeElement.textContent.trim()).toBe('-');
		});
	});
});
