import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, flush, tick } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { ButtonGroupComponent } from '@components/button-group/button-group.component';
import { ButtonComponent } from '@components/button/button.component';
import { IconComponent } from '@components/icon/icon.component';
import { NumberPlateComponent } from '@components/number-plate/number-plate.component';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { RoleRequiredDirective } from '@directives/app-role-required/app-role-required.directive';
import { TestResultSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { AbandonDialogComponent } from '@forms/custom-sections/abandon-dialog/abandon-dialog.component';
import { contingencyTestTemplates } from '@forms/templates/test-records/create-master.template';
import { mockTestResult } from '@mocks/mock-test-result';
import { Roles } from '@models/roles.enum';
import { TestModeEnum } from '@models/test-results/test-result-view.enum';
import { V3TechRecordModel } from '@models/vehicle-tech-record.model';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { DefaultNullOrEmpty } from '@pipes/default-null-or-empty/default-null-or-empty.pipe';
import { TestTypeNamePipe } from '@pipes/test-type-name/test-type-name.pipe';
import { DynamicFormService } from '@services/dynamic-forms/dynamic-form.service';
import { HttpService } from '@services/http/http.service';
import { RouterService } from '@services/router/router.service';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { TestRecordsService } from '@services/test-records/test-records.service';
import { UserService } from '@services/user-service/user-service';
import { State, initialAppState } from '@store/index';
import { sectionTemplates, testResultInEdit, toEditOrNotToEdit } from '@store/test-records';
import { Observable, ReplaySubject, of } from 'rxjs';
import { BaseTestRecordComponent } from '../../../../components/base-test-record/base-test-record.component';
import { VehicleHeaderComponent } from '../../../../components/vehicle-header/vehicle-header.component';
import { CreateTestRecordComponent } from '../create-test-record.component';

describe('CreateTestRecordComponent', () => {
	let component: CreateTestRecordComponent;
	let fixture: ComponentFixture<CreateTestRecordComponent>;
	const actions$ = new ReplaySubject<Action>();
	let router: Router;
	let testRecordsService: TestRecordsService;
	let store: MockStore<State>;

	const mockTechnicalRecordService = {
		get viewableTechRecord$() {
			return { systemNumber: 'foo', createdTimestamp: 'bar', vin: 'testVin' };
		},
	};
	const MockUserService = {
		getUserName$: vi.fn().mockReturnValue(new Observable()),
		roles$: of([Roles.TestResultAmend, Roles.TestResultView]),
	};

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				CreateTestRecordComponent,
				BaseTestRecordComponent,
				DefaultNullOrEmpty,
				TestTypeNamePipe,
				ButtonComponent,
				ButtonGroupComponent,
				IconComponent,
				NumberPlateComponent,
				VehicleHeaderComponent,
				RoleRequiredDirective,
			],
			providers: [
				GlobalErrorService,
				RouterService,
				TestRecordsService,
				HttpService,
				{ provide: UserService, useValue: MockUserService },
				provideRouter([]),
				provideHttpClient(),
				provideHttpClientTesting(),
				provideMockStore({ initialState: initialAppState }),
				provideMockActions(() => actions$),
				{ provide: TechnicalRecordService, useValue: mockTechnicalRecordService },
				DynamicFormService,
			],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(CreateTestRecordComponent);
		component = fixture.componentInstance;
		router = TestBed.inject(Router);
		testRecordsService = TestBed.inject(TestRecordsService);
		store = TestBed.inject(MockStore);
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should navigate back to the tech record', () => {
		const navigateSpy = vi.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true));
		component.backToTechRecord();
		expect(navigateSpy).toHaveBeenCalled();
	});

	it('should call createTestResult with value of all forms merged into one', async () => {
		fixture.detectChanges();
		const createTestResultSpy = vi.spyOn(testRecordsService, 'createTestResult').mockImplementation((() => {}) as any);
		const testRecord = { testResultId: '1', testTypes: [{ testTypeId: '2' }] } as TestResultSchema;
		store.overrideSelector(testResultInEdit, testRecord);
		store.overrideSelector(sectionTemplates, Object.values(contingencyTestTemplates.psv['testTypesGroup1'] ?? {}));

		component.isAnyFormInvalid = vi.fn().mockReturnValue(false);

		await component.handleSave();
		fixture.detectChanges();
		expect(createTestResultSpy).toHaveBeenCalledTimes(1);
		expect(createTestResultSpy).toHaveBeenCalledWith(testRecord);
	});

	it('should not call createTestResult if some forms are invalid', async () => {
		const createTestResultSpy = vi.spyOn(testRecordsService, 'createTestResult').mockImplementation((() => {}) as any);
		const testRecord = { testResultId: '1', testTypes: [{ testTypeId: '2' }] } as TestResultSchema;
		store.overrideSelector(testResultInEdit, testRecord);
		store.overrideSelector(sectionTemplates, Object.values(contingencyTestTemplates.psv['testTypesGroup1'] ?? ''));

		fixture.detectChanges();
		component.isAnyFormInvalid = vi.fn().mockReturnValue(true);

		await component.handleSave();

		expect(createTestResultSpy).not.toHaveBeenCalled();
	});

	it('should dispatch the action to update the test result in edit', () => {
		const updateTestResultSpy = vi.spyOn(testRecordsService, 'updateEditingTestResult').mockImplementation((() => {}) as any);
		component.handleNewTestResult({} as TestResultSchema);
		expect(updateTestResultSpy).toHaveBeenCalled();
	});

	describe('CreateTestRecordComponent.prototype.isAnyFormInvalid.name', () => {
		beforeEach(() => {
			store.overrideSelector(testResultInEdit, mockTestResult());
			store.overrideSelector(toEditOrNotToEdit, undefined);
		});

		afterEach(() => {
			store.resetSelectors();
		});

		it('should return true if some forms are invalid', () => {
			vi.spyOn(component, 'abandonDialog').mockReturnValue({
				dynamicFormGroup: signal({ form: { controls: { errors: 'foo' }, invalid: true } }),
			} as unknown as AbandonDialogComponent);
			component.testMode = TestModeEnum.Abandon;
			DynamicFormService.validate = vi.fn();
			expect(component.isAnyFormInvalid()).toBe(true);
		});

		it('should return false if no forms are invalid', fakeAsync(() => {
			vi.spyOn(component, 'baseTestRecordComponent').mockReturnValue({
				sections: vi.fn().mockReturnValue({ forEach: vi.fn().mockReturnValue([{ foo: 'foo' }]) }),
				defects: vi.fn(),
				customDefects: vi.fn(),
			} as unknown as BaseTestRecordComponent);
			tick();
			fixture.detectChanges();
			expect(component.isAnyFormInvalid()).toBe(false);
			flush();
		}));
	});

	describe('CreateTestRecordComponent.prototype.abandon.name', () => {
		it('should set testMode to be abandon', () => {
			vi.spyOn(component, 'isAnyFormInvalid').mockReturnValue(false);
			component.abandon();
			expect(component.testMode).toEqual(TestModeEnum.Abandon);
		});
	});

	describe('CreateTestRecordComponent.prototype.handleAbandonAction.name', () => {
		it('should call handle save', async () => {
			const handleSaveSpy = vi.spyOn(component, 'handleSave');

			await component.handleAbandonAction('yes');

			expect(handleSaveSpy).toHaveBeenCalledTimes(1);
		});

		it('should set testMode to be edit', async () => {
			component.testMode = TestModeEnum.Abandon;

			await component.handleAbandonAction('no');

			expect(component.testMode).toEqual(TestModeEnum.Edit);
		});
	});

	it('should combine forms', async () => {
		vi.spyOn(component, 'baseTestRecordComponent').mockReturnValue({
			sections: vi.fn().mockReturnValue({ forEach: vi.fn().mockReturnValue([{ foo: 'foo' }]) }),
			defects: vi.fn(),
			customDefects: vi.fn(),
		} as unknown as BaseTestRecordComponent);
		// component['baseTestRecordComponent'] = {
		// 	sections: { forEach: vi.fn().mockReturnValue([{ foo: 'foo' }]) },
		// } as unknown as BaseTestRecordComponent;

		// eslint-disable-next-line @typescript-eslint/no-misused-promises
		const createTestResultSpy = vi
			.spyOn(testRecordsService, 'createTestResult')
			.mockImplementation(() => Promise.resolve(true));
		const testRecord = { testResultId: '1', testTypes: [{ testTypeId: '2' }] } as TestResultSchema;
		store.overrideSelector(testResultInEdit, testRecord);
		store.overrideSelector(sectionTemplates, Object.values(contingencyTestTemplates.psv['testTypesGroup1'] ?? ''));

		fixture.detectChanges();

		await component.handleSave();

		fixture.detectChanges();
		expect(createTestResultSpy).toHaveBeenCalledTimes(1);
		expect(createTestResultSpy).toHaveBeenCalledWith(testRecord);
	});

	it('should set testMode to be view', async () => {
		component.techRecord = {} as V3TechRecordModel;
		component.isAnyFormInvalid = vi.fn().mockReturnValue(false);
		await component.handleReview();

		expect(component.testMode).toEqual(TestModeEnum.View);
	});

	it('should set testMode back to edit', async () => {
		component.isAnyFormInvalid = vi.fn().mockReturnValue(false);
		await component.handleReview();
		component.handleCancel();

		expect(component.testMode).toEqual(TestModeEnum.Edit);
	});

	describe('shouldShowAbandonButton', () => {
		it('should return true if test is not a desk based or LEC test', async () => {
			component.testTypeId = '94'; // HGV - Annual Test

			expect(component.shouldShowAbandonButton).toEqual(true);
		});

		it('should return false if test is an LEC test', async () => {
			component.testTypeId = '45'; // HGV - LEC without linked test

			expect(component.shouldShowAbandonButton).toEqual(false);
		});

		it('should return false if test is a desk based test', async () => {
			component.testTypeId = '441'; // HGV - Type approved tractor unit Test

			expect(component.shouldShowAbandonButton).toEqual(false);
		});
	});
});
