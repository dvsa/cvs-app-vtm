import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { TestResults } from '@dvsa/cvs-type-definitions/types/v1/enums/testResult.enum.js';
import { TestResultSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { DynamicFormGroupComponent } from '@forms/components/dynamic-form-group/dynamic-form-group.component';
import { Vtg15Component } from '@forms/components/vtg15/vtg15.component';
import { LoadStatusComponent } from '@forms/custom-sections/load-status/load-status.component';
import { Roles } from '@models/roles.enum';
import { provideMockStore } from '@ngrx/store/testing';
import { DefaultNullOrEmpty } from '@pipes/default-null-or-empty/default-null-or-empty.pipe';
import { DynamicFormService } from '@services/dynamic-forms/dynamic-form.service';
import { CustomFormGroup, FormNodeTypes } from '@services/dynamic-forms/dynamic-form.types';
import { HttpService } from '@services/http/http.service';
import { RouterService } from '@services/router/router.service';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { TestTypesService } from '@services/test-types/test-types.service';
import { UserService } from '@services/user-service/user-service';
import { initialAppState } from '@store/index';
import { of } from 'rxjs';
import { VehicleHeaderComponent } from '../../vehicle-header/vehicle-header.component';
import { BaseTestRecordComponent } from '../base-test-record.component';

describe('BaseTestRecordComponent', () => {
	let component: BaseTestRecordComponent;
	let fixture: ComponentFixture<BaseTestRecordComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [BaseTestRecordComponent, DefaultNullOrEmpty, VehicleHeaderComponent],
			providers: [
				RouterService,
				GlobalErrorService,
				provideRouter([]),
				provideHttpClient(),
				provideHttpClientTesting(),
				provideMockStore({ initialState: initialAppState }),
				TestTypesService,
				TechnicalRecordService,
				HttpService,
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
		fixture.componentRef.setInput('testResult', {
			vin: 'ABC002',
			testTypes: [{ testResult: TestResults.FAIL }],
		} as TestResultSchema);
		jest.clearAllMocks();
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('BaseTestRecordComponent.prototype.handleFormChange.name', () => {
		it('should emit the new test result', (done) => {
			const event = { vin: 'ABC001' } as TestResultSchema;
			const expectedValue = { vin: 'ABC001' };

			component.newTestResult.subscribe((testResult) => {
				expect(testResult).toEqual(expectedValue);
				done();
			});

			component.handleFormChange(event);
		});

		it('should keep the load status and vtg15 values when another section emits', (done) => {
			const loadStatus = { testTypes: [{ loadStatus: { vehicleLoadStatus: 'unladen' } }] };
			const vtg15 = { vtg15: { vtg15Required: true, unNumber: 1234 } };

			jest.spyOn(component, 'loadStatus').mockReturnValue({
				form: { getRawValue: () => loadStatus },
			} as unknown as LoadStatusComponent);
			jest.spyOn(component, 'vtg15').mockReturnValue({
				form: { getRawValue: () => vtg15 },
			} as unknown as Vtg15Component);

			component.newTestResult.subscribe((testResult) => {
				expect(testResult).toEqual({
					vin: 'ABC001',
					testTypes: [{ loadStatus: { vehicleLoadStatus: 'unladen' } }],
					vtg15: { vtg15Required: true, unNumber: 1234 },
				});
				done();
			});

			component.handleFormChange({ vin: 'ABC001' } as TestResultSchema);
		});
	});

	describe('validateEuVehicleCategory', () => {
		it('should call the validate function of eu vehicle category', () => {
			jest.spyOn(component, 'sections').mockReturnValue([
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
			] as unknown as DynamicFormGroupComponent[]);

			const spy = jest.spyOn(DynamicFormService, 'validateControl');
			spy.mockImplementation(() => undefined);

			component.validateEuVehicleCategory('test');

			expect(spy).toHaveBeenCalledTimes(1);
		});

		it('should not call the validate function of eu vehicle category', () => {
			jest.spyOn(component, 'sections').mockReturnValue([
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
			] as unknown as DynamicFormGroupComponent[]);

			const spy = jest.spyOn(DynamicFormService, 'validateControl');
			spy.mockImplementation(() => undefined);

			component.validateEuVehicleCategory('test');

			expect(spy).toHaveBeenCalledTimes(0);
		});
	});
});
