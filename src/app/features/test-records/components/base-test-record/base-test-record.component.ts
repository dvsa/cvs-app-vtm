import { AsyncPipe, NgStyle } from '@angular/common';
import { AfterViewInit, Component, inject, input, output, viewChild, viewChildren } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AccordionControlComponent } from '@components/accordion-control/accordion-control.component';
import { AccordionComponent } from '@components/accordion/accordion.component';
import { BannerComponent } from '@components/banner/banner.component';
import { ButtonGroupComponent } from '@components/button-group/button-group.component';
import { ButtonComponent } from '@components/button/button.component';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { RoleRequiredDirective } from '@directives/app-role-required/app-role-required.directive';
import {
	DynamicFormGroupComponent,
	DynamicFormGroupComponent as DynamicFormGroupComponent_1,
} from '@forms/components/dynamic-form-group/dynamic-form-group.component';
import {
	CustomDefectsComponent,
	CustomDefectsComponent as CustomDefectsComponent_1,
} from '@forms/custom-sections/custom-defects/custom-defects.component';
import {
	DefectsComponent,
	DefectsComponent as DefectsComponent_1,
} from '@forms/custom-sections/defects/defects.component';
import {
	RequiredStandardsComponent,
	RequiredStandardsComponent as RequiredStandardsComponent_1,
} from '@forms/custom-sections/required-standards/required-standards.component';
import { Defect } from '@models/defects/defect.model';
import { Roles } from '@models/roles.enum';
import { TestResultStatus } from '@models/test-results/test-result-status.enum';
import { TestResultModel } from '@models/test-results/test-result.model';
import { resultOfTestEnum } from '@models/test-types/test-type.model';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { DynamicFormService } from '@services/dynamic-forms/dynamic-form.service';
import { CustomFormControl, FormNode } from '@services/dynamic-forms/dynamic-form.types';
import { RouterService } from '@services/router/router.service';
import { TestRecordsService } from '@services/test-records/test-records.service';
import { DefectsState, filteredDefects } from '@store/defects';
import merge from 'lodash.merge';
import { Observable, map } from 'rxjs';
import { VehicleHeaderComponent } from '../vehicle-header/vehicle-header.component';

@Component({
	selector: 'app-base-test-record[testResult]',
	templateUrl: './base-test-record.component.html',
	styleUrls: ['./base-test-record.component.scss'],
	imports: [
		VehicleHeaderComponent,
		ButtonGroupComponent,
		RoleRequiredDirective,
		ButtonComponent,
		RouterLink,
		AccordionControlComponent,
		AccordionComponent,
		DefectsComponent_1,
		RequiredStandardsComponent_1,
		CustomDefectsComponent_1,
		DynamicFormGroupComponent_1,
		NgStyle,
		BannerComponent,
		AsyncPipe,
	],
})
export class BaseTestRecordComponent implements AfterViewInit {
	readonly sections = viewChildren(DynamicFormGroupComponent);
	readonly defects = viewChild(DefectsComponent);
	readonly customDefects = viewChild(CustomDefectsComponent);
	readonly requiredStandards = viewChild(RequiredStandardsComponent);

	readonly testResult = input.required<TestResultModel>();
	readonly isEditing = input(false);
	readonly expandSections = input(false);
	readonly isReview = input(false);

	readonly newTestResult = output<TestResultModel>();

	private defectsStore = inject(Store<DefectsState>);
	private routerService = inject(RouterService);
	private testRecordsService = inject(TestRecordsService);
	private globalErrorService = inject(GlobalErrorService);

	testNumber$ = this.routerService.routeNestedParams$.pipe(map((params) => params['testNumber']));

	ngAfterViewInit(): void {
		this.handleFormChange({});
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	handleFormChange(event: any) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		let latestTest: any;
		this.sections()?.forEach((section) => {
			const { form } = section;
			latestTest = merge(latestTest, form.getCleanValue(form));
		});
		const defects = this.defects();
		const defectsValue = defects?.form.getCleanValue(defects?.form);
		const customDefects = this.customDefects();
		const customDefectsValue = customDefects?.form.getCleanValue(customDefects?.form);
		const requiredStandards = this.requiredStandards();
		const requiredStandardsValue = requiredStandards?.form.getCleanValue(requiredStandards?.form);

		latestTest = merge(latestTest, defectsValue, customDefectsValue, requiredStandardsValue, event);

		if (this.shouldUpdateTest(latestTest)) {
			this.newTestResult.emit(latestTest);
		}
	}

	shouldUpdateTest(latestTest: unknown): latestTest is TestResultModel {
		return !!latestTest && Object.keys(latestTest).length > 0;
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	validateEuVehicleCategory(_event: unknown) {
		this.sections()?.forEach((section) => {
			const { form } = section;
			if (form.meta.name === 'vehicleSection') {
				const errors: GlobalError[] = [];
				DynamicFormService.validateControl(form.get('euVehicleCategory') as CustomFormControl, errors);
				this.globalErrorService.setErrors(errors);
			}
		});
	}

	getDefects$(type: VehicleTypes): Observable<Defect[]> {
		return this.defectsStore.select(filteredDefects(type));
	}

	get isTestTypeGroupEditable$(): Observable<boolean> {
		return this.testRecordsService.isTestTypeGroupEditable$;
	}

	get roles(): typeof Roles {
		return Roles;
	}

	get statuses(): typeof TestResultStatus {
		return TestResultStatus;
	}

	get sectionTemplates$(): Observable<FormNode[] | undefined> {
		return this.testRecordsService.sectionTemplates$;
	}

	get resultOfTest(): resultOfTestEnum {
		return this.testResult()?.testTypes[0].testResult;
	}
}
