import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, provideRouter } from '@angular/router';
import { SpecialistCustomDefectsSchemaPut } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { mockTestResult } from '@mocks/mock-test-result';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { DynamicFormService } from '@services/dynamic-forms/dynamic-form.service';
import { CustomFormGroup, FormNodeTypes } from '@services/dynamic-forms/dynamic-form.types';
import { ResultOfTestService } from '@services/result-of-test/result-of-test.service';
import { State, initialAppState } from '@store/index';
import { getRequiredStandardFromTypeAndRef } from '@store/required-standards/required-standards.selector';
import { selectRouteParams } from '@store/router/router.selectors';
import { testResultInEdit } from '@store/test-records';
import { RequiredStandardComponent } from '../required-standard.component';

describe('RequiredStandardComponent', () => {
	let component: RequiredStandardComponent;
	let fixture: ComponentFixture<RequiredStandardComponent>;
	let router: Router;
	let store: MockStore<State>;
	let resultService: ResultOfTestService;
	let dfs: DynamicFormService;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [FormsModule, ReactiveFormsModule, RequiredStandardComponent],
			providers: [
				DynamicFormService,
				provideRouter([]),
				provideHttpClient(),
				provideHttpClientTesting(),
				provideMockStore({ initialState: initialAppState }),
			],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(RequiredStandardComponent);
		router = TestBed.inject(Router);
		store = TestBed.inject(MockStore);
		resultService = TestBed.inject(ResultOfTestService);
		dfs = TestBed.inject(DynamicFormService);
		component = fixture.componentInstance;
		vi.clearAllMocks();
	});

	afterEach(() => {
		fixture.destroy();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('ngOnInit', () => {
		it('should init and navigate back if no test result', () => {
			component.isEditing = true;
			store.overrideSelector(testResultInEdit, undefined);
			store.refreshState();
			const spy = vi.spyOn(component, 'navigateBack');

			component.ngOnInit();

			expect(spy).toHaveBeenCalledTimes(1);
		});

		it('should init and use index to amend the required standard', () => {
			component.isEditing = true;
			store.overrideSelector(testResultInEdit, mockTestResult());
			store.overrideSelector(selectRouteParams, { requiredStandardIndex: '0' });
			store.refreshState();
			component.ngOnInit();

			expect(component.amendingRs).toBeTruthy();
			expect(component.requiredStandard).toBeDefined();
		});

		it('should init and get required standard from the store', () => {
			component.isEditing = true;
			store.overrideSelector(testResultInEdit, mockTestResult());
			store.overrideSelector(selectRouteParams, {
				ref: '1.1',
				inspectionType: 'basic',
				requiredStandardIndex: undefined,
			});

			store.overrideSelector(getRequiredStandardFromTypeAndRef('basic', '1.1'), {
				sectionNumber: '1',
			} as any);
			store.refreshState();

			component.ngOnInit();

			expect(component.amendingRs).toBeFalsy();
			expect(component.requiredStandard).toBeDefined();
		});

		it('should init and fail to required standard from the store so navigate back', () => {
			component.isEditing = true;
			store.overrideSelector(testResultInEdit, mockTestResult());
			store.overrideSelector(selectRouteParams, {
				ref: '1.1',
				inspectionType: 'basic',
				requiredStandardIndex: undefined,
			});

			store.overrideSelector(getRequiredStandardFromTypeAndRef('basic', '1.1'), undefined);
			store.refreshState();
			const spy = vi.spyOn(component, 'navigateBack');

			component.ngOnInit();

			expect(spy).toHaveBeenCalledTimes(1);
		});
	});

	describe('navigateBack', () => {
		it('should navigate back two levels if in amend mode', () => {
			vi.spyOn(resultService, 'updateResultOfTestRequiredStandards').getMockImplementation();
			component.amendingRs = true;
			const spy = vi.spyOn(router, 'navigate');

			component.navigateBack();

			expect(spy).toHaveBeenCalledWith(['../../'], expect.anything());
		});

		it('should navigate back three levels if not in amend mode', () => {
			vi.spyOn(resultService, 'updateResultOfTestRequiredStandards').getMockImplementation();
			component.amendingRs = false;
			const spy = vi.spyOn(router, 'navigate');

			component.navigateBack();

			expect(spy).toHaveBeenCalledWith(['../../../'], expect.anything());
		});
	});

	describe('toggleRsPrsField', () => {
		it('should error if there is no required standard', () => {
			component.requiredStandard = undefined;

			const res = component.toggleRsPrsField();

			expect(res).toBeUndefined();
		});
		it('should flip bool value of prs', () => {
			component.requiredStandard = { prs: true } as unknown as SpecialistCustomDefectsSchemaPut;

			component.toggleRsPrsField();

			expect(component.requiredStandard).toStrictEqual({ prs: false });
		});
	});

	describe('handleSubmit', () => {
		beforeEach(() => {
			component.form = dfs.createForm(
				{
					name: 'test section',
					type: FormNodeTypes.SECTION,
					children: [{ name: 'prs', type: FormNodeTypes.CONTROL }],
				},
				{ prs: false }
			) as CustomFormGroup;
		});
		it('should return if the form is invalid', () => {
			vi.spyOn(DynamicFormService, 'validate').mockImplementation((() => {}) as any);
			component.form.controls['prs'].setErrors({ incorrect: true });

			const res = component.handleSubmit();

			expect(res).toBeUndefined();
		});

		it('should call update RS if in amend mode', () => {
			vi.spyOn(DynamicFormService, 'validate').mockImplementation((() => {}) as any);
			component.index = 1;
			const dispatchSpy = vi.spyOn(store, 'dispatch');

			component.handleSubmit();

			expect(dispatchSpy).toHaveBeenCalledWith(
				expect.objectContaining({ type: '[test-results] update required standard' })
			);
		});

		it('should call create RS if not in amend mode', () => {
			vi.spyOn(DynamicFormService, 'validate').mockImplementation((() => {}) as any);
			const dispatchSpy = vi.spyOn(store, 'dispatch');

			component.handleSubmit();

			expect(dispatchSpy).toHaveBeenCalledWith(
				expect.objectContaining({ type: '[test-results] create required standard' })
			);
		});
	});
});
