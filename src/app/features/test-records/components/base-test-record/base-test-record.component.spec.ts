import { HttpClientTestingModule } from '@angular/common/http/testing';
import { QueryList } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {
	DefaultService as CreateTestResultsService,
	GetTestResultsService,
	UpdateTestResultsService,
} from '@api/test-results';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { DynamicFormGroupComponent } from '@forms/components/dynamic-form-group/dynamic-form-group.component';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormGroup, FormNodeTypes } from '@forms/services/dynamic-form.types';
import { Roles } from '@models/roles.enum';
import { TestResultModel } from '@models/test-results/test-result.model';
import { resultOfTestEnum } from '@models/test-types/test-type.model';
import { provideMockStore } from '@ngrx/store/testing';
import { RouterService } from '@services/router/router.service';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { TestTypesService } from '@services/test-types/test-types.service';
import { UserService } from '@services/user-service/user-service';
import { DefaultNullOrEmpty } from '@shared/pipes/default-null-or-empty/default-null-or-empty.pipe';
import { SharedModule } from '@shared/shared.module';
import { initialAppState } from '@store/.';
import { of } from 'rxjs';
import { VehicleHeaderComponent } from '../vehicle-header/vehicle-header.component';
import { BaseTestRecordComponent } from './base-test-record.component';

describe('BaseTestRecordComponent', () => {
	let component: BaseTestRecordComponent;
	let fixture: ComponentFixture<BaseTestRecordComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [BaseTestRecordComponent, DefaultNullOrEmpty, VehicleHeaderComponent],
			imports: [DynamicFormsModule, HttpClientTestingModule, SharedModule, RouterTestingModule],
			providers: [
				RouterService,
				GlobalErrorService,
				provideMockStore({ initialState: initialAppState }),
				TestTypesService,
				TechnicalRecordService,
				UpdateTestResultsService,
				GetTestResultsService,
				CreateTestResultsService,
				{
					provide: UserService,
					useValue: {
						roles$: of([Roles.TestResultCreateContingency, Roles.TestResultAmend]),
					},
				},
			],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(BaseTestRecordComponent);
		component = fixture.componentInstance;
		component.testResult = { vin: 'ABC002', testTypes: [{ testResult: resultOfTestEnum.fail }] } as TestResultModel;
		jest.clearAllMocks();
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('BaseTestRecordComponent.prototype.handleFormChange.name', () => {
		it('should emit the new test result', (done) => {
			const event = { vin: 'ABC001' } as TestResultModel;
			const expectedValue = { vin: 'ABC001' };

			component.newTestResult.subscribe((testResult) => {
				expect(testResult).toEqual(expectedValue);
				done();
			});

			component.handleFormChange(event);
		});
	});

	describe('validateEuVehicleCategory', () => {
		it('should call the validate function of eu vehicle category', () => {
			component.sections = [
				{ form: new CustomFormGroup({ name: 'vehicleSection', type: FormNodeTypes.GROUP, children: [] }, {}) },
				{
					form: new CustomFormGroup(
						{
							name: 'testSection',
							type: FormNodeTypes.GROUP,
							children: [],
						},
						{}
					),
				},
			] as unknown as QueryList<DynamicFormGroupComponent>;

			const spy = jest.spyOn(DynamicFormService, 'validateControl');
			spy.mockImplementation(() => undefined);

			component.validateEuVehicleCategory('test');

			expect(spy).toHaveBeenCalledTimes(1);
		});

		it('should not call the validate function of eu vehicle category', () => {
			component.sections = [
				{ form: new CustomFormGroup({ name: 'anotherTestSection', type: FormNodeTypes.GROUP, children: [] }, {}) },
				{
					form: new CustomFormGroup(
						{
							name: 'testSection',
							type: FormNodeTypes.GROUP,
							children: [],
						},
						{}
					),
				},
			] as unknown as QueryList<DynamicFormGroupComponent>;

			const spy = jest.spyOn(DynamicFormService, 'validateControl');
			spy.mockImplementation(() => undefined);

			component.validateEuVehicleCategory('test');

			expect(spy).toHaveBeenCalledTimes(0);
		});
	});
});
