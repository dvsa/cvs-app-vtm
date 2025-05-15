import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { V3TechRecordModel } from '@models/vehicle-tech-record.model';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { DynamicFormService } from '@services/dynamic-forms/dynamic-form.service';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { UserService } from '@services/user-service/user-service';
import { initialAppState } from '@store/index';
import { generateADRCertificate, generateADRCertificateSuccess } from '@store/technical-records';
import { ReplaySubject, of } from 'rxjs';

import { provideHttpClient } from '@angular/common/http';
import { AdrGenerateCertificateComponent } from '../adr-generate-certificate.component';

const mockDynamicFormService = {
	createForm: jest.fn(),
};

describe('AdrGenerateCertificateComponent', () => {
	let component: AdrGenerateCertificateComponent;
	let fixture: ComponentFixture<AdrGenerateCertificateComponent>;
	const actions$ = new ReplaySubject<Action>();
	let errorService: GlobalErrorService;
	let route: ActivatedRoute;
	let router: Router;
	let store: MockStore;
	let technicalRecordService: TechnicalRecordService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [AdrGenerateCertificateComponent, ReactiveFormsModule],
			providers: [
				GlobalErrorService,
				provideRouter([]),
				provideHttpClient(),
				provideHttpClientTesting(),
				provideMockActions(() => actions$),
				provideMockStore({ initialState: initialAppState }),
				{ provide: ActivatedRoute, useValue: { params: of([{ id: 1 }]) } },
				{ provide: DynamicFormService, useValue: mockDynamicFormService },
				TechnicalRecordService,
				{
					provide: UserService,
					useValue: {
						roles$: of(['TechRecord.Amend']),
					},
				},
			],
		}).compileComponents();
	});
	beforeEach(() => {
		fixture = TestBed.createComponent(AdrGenerateCertificateComponent);
		errorService = TestBed.inject(GlobalErrorService);
		route = TestBed.inject(ActivatedRoute);
		router = TestBed.inject(Router);
		store = TestBed.inject(MockStore);
		technicalRecordService = TestBed.inject(TechnicalRecordService);
		component = fixture.componentInstance;
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('navigateBack', () => {
		beforeEach(() => {
			jest
				.spyOn(technicalRecordService, 'techRecord$', 'get')
				.mockReturnValue(of({ systemNumber: 'foo', createdTimestamp: 'bar', vin: 'testVin' } as V3TechRecordModel));
		});
		it('should clear all errors', () => {
			jest.spyOn(router, 'navigate').mockImplementation();

			const clearErrorsSpy = jest.spyOn(errorService, 'clearErrors');

			component.navigateBack();

			expect(clearErrorsSpy).toHaveBeenCalledTimes(1);
		});

		it('should navigate back to the previous page', () => {
			const navigateSpy = jest.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true));

			component.navigateBack();

			expect(navigateSpy).toHaveBeenCalledWith(['..'], { relativeTo: route });
		});

		it('should navigate back on generateADRCertificateSuccess', fakeAsync(() => {
			fixture.ngZone?.run(() => {
				component.ngOnInit();
				component.form.get('certificateType')?.setValue('PASS');

				const navigateBackSpy = jest.spyOn(component, 'navigateBack').mockImplementation();

				component.handleSubmit();

				actions$.next(generateADRCertificateSuccess({ id: '' }));
				tick();

				expect(navigateBackSpy).toHaveBeenCalled();
			});
		}));
	});

	describe('handleSubmit', () => {
		beforeEach(() => {
			jest
				.spyOn(technicalRecordService, 'techRecord$', 'get')
				.mockReturnValue(of({ systemNumber: 'foo', createdTimestamp: 'bar', vin: 'testVin' } as V3TechRecordModel));
		});
		it('should add an error when the field is not filled out', () => {
			const addErrorSpy = jest.spyOn(errorService, 'addError');

			component.handleSubmit();

			expect(addErrorSpy).toHaveBeenCalledWith({
				error: 'ADR Certificate Type is required',
				anchorLink: 'certificateType',
			});
		});

		it('should dispatch the generateADRCertificate action', () => {
			const dispatchSpy = jest.spyOn(store, 'dispatch');

			component.form.get('certificateType')?.setValue('PASS');

			component.handleSubmit();
			expect(dispatchSpy).toHaveBeenCalledTimes(2);
			expect(dispatchSpy).toHaveBeenLastCalledWith(
				generateADRCertificate({ systemNumber: '', createdTimestamp: '', certificateType: 'PASS' })
			);
		});

		it('should dispatch action with default values when systemNumber and createdTimestamp are null', () => {
			const dispatchSpy = jest.spyOn(store, 'dispatch');

			component.form.get('certificateType')?.setValue('PASS');
			component.systemNumber = '123';
			component.createdTimestamp = '2021';

			component.handleSubmit();
			expect(dispatchSpy).toHaveBeenCalled();
			expect(dispatchSpy).toHaveBeenLastCalledWith(
				generateADRCertificate({ systemNumber: '123', createdTimestamp: '2021', certificateType: 'PASS' })
			);
		});
	});

	describe('certificateTypes', () => {
		it('should get correct value when call get functions', () => {
			const expectedValue = [
				{ label: 'New ADR Certificate', value: 'PASS' },
				{ label: 'Replacement ADR Certificate', value: 'REPLACEMENT' },
			];
			expect(component.width).toBe(10);
			expect(component.certificateTypes).toEqual(expectedValue);
		});
	});
});
