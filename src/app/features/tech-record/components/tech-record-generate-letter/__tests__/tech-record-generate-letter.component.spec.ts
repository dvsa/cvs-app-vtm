import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { ApprovalType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/approvalType.enum.js';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';

import { mockVehicleTechnicalRecord } from '@mocks/mock-vehicle-technical-record.mock';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { DynamicFormService } from '@services/dynamic-forms/dynamic-form.service';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { UserService } from '@services/user-service/user-service';
import { FixNavigationTriggeredOutsideAngularZoneNgModule } from '@shared/custom-module/fixNgZoneError';

import { initialAppState } from '@store/index';
import { generateLetter, generateLetterSuccess } from '@store/technical-records';
import { ReplaySubject, of } from 'rxjs';
import { GenerateLetterComponent } from '../tech-record-generate-letter.component';

const mockTechRecordService = {
	get techRecord$() {
		return of(mockVehicleTechnicalRecord('trl'));
	},
	updateEditingTechRecord: vi.fn(),
	isUnique: vi.fn(),
};

const mockDynamicFormService = {
	createForm: vi.fn(),
};

describe('TechRecordGenerateLetterComponent', () => {
	const actions$ = new ReplaySubject<Action>();
	let component: GenerateLetterComponent;
	let errorService: GlobalErrorService;
	let expectedVehicle = {} as TechRecordType<'trl'>;
	let fixture: ComponentFixture<GenerateLetterComponent>;
	let route: ActivatedRoute;
	let router: Router;
	let store: MockStore;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			providers: [
				GlobalErrorService,
				provideRouter([]),
				provideMockActions(() => actions$),
				provideMockStore({ initialState: initialAppState }),
				{ provide: ActivatedRoute, useValue: { params: of([{ id: 1 }]) } },
				{ provide: DynamicFormService, useValue: mockDynamicFormService },
				{ provide: TechnicalRecordService, useValue: mockTechRecordService },
				{
					provide: UserService,
					useValue: {
						roles$: of(['TechRecord.Amend']),
					},
				},
			],
			imports: [GenerateLetterComponent, ReactiveFormsModule, FixNavigationTriggeredOutsideAngularZoneNgModule],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(GenerateLetterComponent);
		errorService = TestBed.inject(GlobalErrorService);
		route = TestBed.inject(ActivatedRoute);
		router = TestBed.inject(Router);
		store = TestBed.inject(MockStore);
		component = fixture.componentInstance;
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('navigateBack', () => {
		it('should clear all errors', () => {
			vi.spyOn(router, 'navigate').mockImplementation((() => {}) as any);

			const clearErrorsSpy = vi.spyOn(errorService, 'clearErrors');

			component.navigateBack();

			expect(clearErrorsSpy).toHaveBeenCalledTimes(1);
		});

		it('should navigate back to the previous page', () => {
			const navigateSpy = vi.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true));

			component.navigateBack();

			expect(navigateSpy).toHaveBeenCalledWith(['..'], { relativeTo: route });
		});

		it('should navigate back on generateLetterSuccess', () => {
			const navigateBackSpy = vi.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true));

			component.ngOnInit();

			actions$.next(generateLetterSuccess());

			expect(navigateBackSpy).toHaveBeenCalled();
		});
	});

	describe('handleSubmit', () => {
		beforeEach(() => {
			expectedVehicle = mockVehicleTechnicalRecord('trl') as TechRecordType<'trl'>;
		});

		it('should add an error when the field is not filled out', () => {
			const addErrorSpy = vi.spyOn(errorService, 'addError');

			component.handleSubmit();

			expect(addErrorSpy).toHaveBeenCalledWith({ error: 'Letter type is required', anchorLink: 'letterType' });
		});

		describe('it should dispatch the generateLetter action with the correct paragraphIds', () => {
			it('should dispatch with id 3 on acceptance', () => {
				const dispatchSpy = vi.spyOn(store, 'dispatch');
				component.techRecord = expectedVehicle;
				component.techRecord.techRecord_approvalType = ApprovalType.UKNI_WVTA;

				component.form.get('letterType')?.setValue('trailer acceptance');
				component.handleSubmit();

				expect(dispatchSpy).toHaveBeenCalledWith(generateLetter({ letterType: 'trailer acceptance', paragraphId: 3 }));
			});

			it('should dispatch with id 4 on rejection', () => {
				const dispatchSpy = vi.spyOn(store, 'dispatch');
				component.techRecord = expectedVehicle;
				component.techRecord.techRecord_approvalType = ApprovalType.GB_WVTA;

				component.form.get('letterType')?.setValue('trailer rejection');
				component.handleSubmit();

				expect(dispatchSpy).toHaveBeenCalledWith(generateLetter({ letterType: 'trailer rejection', paragraphId: 4 }));
			});

			it('should dispatch with id 6 on acceptance', () => {
				const dispatchSpy = vi.spyOn(store, 'dispatch');
				component.techRecord = expectedVehicle;
				component.techRecord.techRecord_approvalType = ApprovalType.GB_WVTA;

				component.form.get('letterType')?.setValue('trailer acceptance');
				component.handleSubmit();

				expect(dispatchSpy).toHaveBeenCalledWith(generateLetter({ letterType: 'trailer acceptance', paragraphId: 6 }));
			});
		});
	});
});
