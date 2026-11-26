import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { RetrieveDocumentDirective } from '@directives/retrieve-document/retrieve-document.directive';
import { DocumentType } from '@models/document-type.enum';
import { V3TechRecordModel } from '@models/vehicle-tech-record.model';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { initialAppState } from '@store/index';
import { retryInterceptorFailure } from '@store/retry-interceptor/retry-interceptor.actions';
import { generateADRCertificate, generateADRCertificateSuccess, techRecord } from '@store/technical-records';
import { Subject } from 'rxjs';
import { GenerateAdrCertificateComponent } from '../generate-adr-certificate.component';

describe('GenerateAdrCertificateComponent', () => {
	let fixture: ComponentFixture<GenerateAdrCertificateComponent>;
	let component: GenerateAdrCertificateComponent;
	let store: MockStore;
	let actions$: Subject<Action>;

	beforeEach(async () => {
		actions$ = new Subject<Action>();
		await TestBed.configureTestingModule({
			imports: [GenerateAdrCertificateComponent],
			providers: [
				provideRouter([]),
				provideHttpClient(),
				provideHttpClientTesting(),
				provideMockActions(() => actions$),
				provideMockStore({ initialState: initialAppState }),
			],
		}).compileComponents();

		store = TestBed.inject(MockStore);
		fixture = TestBed.createComponent(GenerateAdrCertificateComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	afterEach(() => {
		store.resetSelectors();
	});

	it('dispatches a PASS certificate request using the current route parameters', () => {
		store.setState({
			...initialAppState,
			router: {
				state: {
					root: {
						firstChild: {
							params: { systemNumber: 'system-123' },
							firstChild: { params: { createdTimestamp: '2024-01-15T10:30:00Z' } },
						},
					},
				},
			},
		});
		const dispatch = vi.spyOn(store, 'dispatch');

		fixture.nativeElement.querySelector('button#submit-adr-cert-form').click();

		expect(dispatch).toHaveBeenCalledWith(
			generateADRCertificate({
				systemNumber: 'system-123',
				createdTimestamp: '2024-01-15T10:30:00Z',
				certificateType: 'PASS',
			})
		);
	});

	it('uses empty strings for missing route parameters', () => {
		const dispatch = vi.spyOn(store, 'dispatch');

		component.handleGenerateADRCertificateSubmit();

		expect(dispatch).toHaveBeenCalledWith(
			generateADRCertificate({ systemNumber: '', createdTimestamp: '', certificateType: 'PASS' })
		);
	});

	it('updates the last certificate date when the selected technical record changes', () => {
		expect(component.lastCertificateDate()).toBe('There are no previous ADR certificates for this vehicle');

		store.overrideSelector(techRecord, {
			techRecord_vehicleType: 'hgv',
			techRecord_adrPassCertificateDetails: [
				{ generatedTimestamp: '2023-01-15T12:00:00Z' },
				{ generatedTimestamp: '2024-05-20T12:00:00Z' },
				{ generatedTimestamp: '2022-10-10T12:00:00Z' },
			],
		} as V3TechRecordModel);
		store.refreshState();
		fixture.detectChanges();

		const expected = `An ADR certificate was last generated on ${new Date('2024-05-20T12:00:00Z').toLocaleDateString('en-UK')}`;
		expect(component.lastCertificateDate()).toBe(expected);
		expect(fixture.nativeElement.textContent).toContain(expected);

		store.overrideSelector(techRecord, {
			techRecord_vehicleType: 'psv',
			techRecord_adrPassCertificateDetails: [{ generatedTimestamp: '2024-05-20T12:00:00Z' }],
		} as V3TechRecordModel);
		store.refreshState();
		expect(component.lastCertificateDate()).toBe('There are no previous ADR certificates for this vehicle');
	});

	it('shows no previous certificate for an ADR vehicle without certificates', () => {
		store.overrideSelector(techRecord, {
			techRecord_vehicleType: 'hgv',
			techRecord_adrPassCertificateDetails: [],
		} as V3TechRecordModel);
		store.refreshState();

		expect(component.lastCertificateDate()).toBe('There are no previous ADR certificates for this vehicle');
	});

	it('shows a document link with the generated file details after success', () => {
		expect(fixture.nativeElement.querySelector('#link-div')).toBeNull();

		actions$.next(generateADRCertificateSuccess({ id: 'certificate.pdf' }));
		fixture.detectChanges();

		expect(component.adrCertificateFileName()).toBe('certificate.pdf');
		expect(fixture.nativeElement.querySelector('#link-div').textContent).toContain('View certificate');
		const directive = fixture.debugElement
			.query(By.directive(RetrieveDocumentDirective))
			.injector.get(RetrieveDocumentDirective);
		expect(directive.params()).toEqual(new Map([['fileName', 'certificate.pdf']]));
		expect(directive.fileName()).toBe('certificate.pdf');
		expect(directive.documentType()).toBe(DocumentType.ADR_CERTIFICATE);
	});

	it('shows the retry failure message with the certificate link', () => {
		actions$.next(generateADRCertificateSuccess({ id: 'certificate.pdf' }));
		actions$.next(retryInterceptorFailure({ error: 'Request failed' }));
		fixture.detectChanges();

		expect(component.adrCertificateError()).toBe(
			'Try link again or Enter 000000 in Certificate Number and then press "Pass And Issue Documents Centrally" on TAS'
		);
		expect(fixture.nativeElement.querySelector('#link-div').textContent).toContain(component.adrCertificateError());
	});

	it('stops handling actions when destroyed', () => {
		fixture.destroy();
		actions$.next(generateADRCertificateSuccess({ id: 'certificate.pdf' }));
		actions$.next(retryInterceptorFailure({ error: 'Request failed' }));

		expect(component.adrCertificateFileName()).toBeNull();
		expect(component.adrCertificateError()).toBeNull();
	});
});
