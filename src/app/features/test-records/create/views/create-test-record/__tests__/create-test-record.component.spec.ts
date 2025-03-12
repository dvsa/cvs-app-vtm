import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, fakeAsync, flush, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ButtonGroupComponent } from '@components/button-group/button-group.component';
import { ButtonComponent } from '@components/button/button.component';
import { IconComponent } from '@components/icon/icon.component';
import { NumberPlateComponent } from '@components/number-plate/number-plate.component';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { RoleRequiredDirective } from '@directives/app-role-required/app-role-required.directive';
import { AbandonDialogComponent } from '@forms/custom-sections/abandon-dialog/abandon-dialog.component';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { contingencyTestTemplates } from '@forms/templates/test-records/create-master.template';
import { mockTestResult } from '@mocks/mock-test-result';
import { Roles } from '@models/roles.enum';
import { TestModeEnum } from '@models/test-results/test-result-view.enum';
import { TestResultModel } from '@models/test-results/test-result.model';
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
import { SharedModule } from '@shared/shared.module';
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
		getUserName$: jest.fn().mockReturnValue(new Observable()),
		roles$: of([Roles.TestResultAmend, Roles.TestResultView]),
	};

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [
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
			imports: [DynamicFormsModule, HttpClientTestingModule, RouterTestingModule, SharedModule],
			providers: [
				GlobalErrorService,
				RouterService,
				TestRecordsService,
				HttpService,
				{ provide: UserService, useValue: MockUserService },
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
		const navigateSpy = jest.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true));
		component.backToTechRecord();
		expect(navigateSpy).toHaveBeenCalled();
	});

	it('should call createTestResult with value of all forms merged into one', async () => {
		fixture.detectChanges();
		const createTestResultSpy = jest.spyOn(testRecordsService, 'createTestResult').mockImplementation(() => {});
		const testRecord = { testResultId: '1', testTypes: [{ testTypeId: '2' }] } as TestResultModel;
		store.overrideSelector(testResultInEdit, testRecord);
		store.overrideSelector(sectionTemplates, Object.values(contingencyTestTemplates.psv['testTypesGroup1'] ?? {}));

		component.isAnyFormInvalid = jest.fn().mockReturnValue(false);

		await component.handleSave();
		fixture.detectChanges();
		expect(createTestResultSpy).toHaveBeenCalledTimes(1);
		expect(createTestResultSpy).toHaveBeenCalledWith(testRecord);
	});

	it('should not call createTestResult if some forms are invalid', async () => {
		const createTestResultSpy = jest.spyOn(testRecordsService, 'createTestResult').mockImplementation(() => {});
		const testRecord = { testResultId: '1', testTypes: [{ testTypeId: '2' }] } as TestResultModel;
		store.overrideSelector(testResultInEdit, testRecord);
		store.overrideSelector(sectionTemplates, Object.values(contingencyTestTemplates.psv['testTypesGroup1'] ?? ''));

		fixture.detectChanges();
		component.isAnyFormInvalid = jest.fn().mockReturnValue(true);

		await component.handleSave();

		expect(createTestResultSpy).not.toHaveBeenCalled();
	});

	it('should dispatch the action to update the test result in edit', () => {
		const updateTestResultSpy = jest.spyOn(testRecordsService, 'updateEditingTestResult').mockImplementation(() => {});
		component.handleNewTestResult({} as TestResultModel);
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
			component.abandonDialog = {
				dynamicFormGroup: { form: { controls: { errors: 'foo' }, invalid: true } },
			} as unknown as AbandonDialogComponent;
			component.testMode = TestModeEnum.Abandon;
			DynamicFormService.validate = jest.fn();
			expect(component.isAnyFormInvalid()).toBe(true);
		});

		it('should return false if no forms are invalid', fakeAsync(() => {
			tick();
			fixture.detectChanges();
			expect(component.isAnyFormInvalid()).toBe(false);
			flush();
		}));
	});

	describe('CreateTestRecordComponent.prototype.abandon.name', () => {
		it('should set testMode to be abandon', () => {
			component.abandon();
			expect(component.testMode).toEqual(TestModeEnum.Abandon);
		});
	});

	describe('CreateTestRecordComponent.prototype.handleAbandonAction.name', () => {
		it('should call handle save', async () => {
			const handleSaveSpy = jest.spyOn(component, 'handleSave');

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
		component['baseTestRecordComponent'] = {
			sections: { forEach: jest.fn().mockReturnValue([{ foo: 'foo' }]) },
		} as unknown as BaseTestRecordComponent;

		// eslint-disable-next-line @typescript-eslint/no-misused-promises
		const createTestResultSpy = jest
			.spyOn(testRecordsService, 'createTestResult')
			.mockImplementation(() => Promise.resolve(true));
		const testRecord = { testResultId: '1', testTypes: [{ testTypeId: '2' }] } as TestResultModel;
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
		component.isAnyFormInvalid = jest.fn().mockReturnValue(false);
		await component.handleReview();

		expect(component.testMode).toEqual(TestModeEnum.View);
	});

	it('should set testMode back to edit', async () => {
		component.isAnyFormInvalid = jest.fn().mockReturnValue(false);
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
