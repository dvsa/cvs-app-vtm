import { NoSpaceDirective } from '@/src/app/directives/app-no-space/app-no-space.directive';
import { ToUppercaseDirective } from '@/src/app/directives/app-to-uppercase/app-to-uppercase.directive';
import { TrimWhitespaceDirective } from '@/src/app/directives/app-trim-whitespace/app-trim-whitespace.directive';
import { GovukCheckboxGroupComponent } from '@/src/app/forms/components/govuk-checkbox-group/govuk-checkbox-group.component';
import { GovukFormGroupDateComponent } from '@/src/app/forms/components/govuk-form-group-date/govuk-form-group-date.component';
import { GovukFormGroupInputComponent } from '@/src/app/forms/components/govuk-form-group-input/govuk-form-group-input.component';
import { GovukFormGroupRadioComponent } from '@/src/app/forms/components/govuk-form-group-radio/govuk-form-group-radio.component';
import { RadioComponent } from '@/src/app/forms/components/govuk-form-group-radio/radio/radio.component';
import { GovukFormGroupSelectComponent } from '@/src/app/forms/components/govuk-form-group-select/govuk-form-group-select.component';
import { GovukFormGroupTextareaComponent } from '@/src/app/forms/components/govuk-form-group-textarea/govuk-form-group-textarea.component';
import { getOptionsFromEnum } from '@/src/app/forms/utils/enum-map';
import { MultiOptions, RESULT_OPTIONS, YES_NO_OPTIONS } from '@/src/app/models/options.model';
import { TEST_TYPES_GROUP7 } from '@/src/app/models/testTypeId.enum';
import { FormNodeWidth } from '@/src/app/services/dynamic-forms/dynamic-form.types';
import { LoadStatusService } from '@/src/app/services/load-status/load-status.service';
import { TestTypeService } from '@/src/app/services/test-type/test-type.service';
import { TestService } from '@/src/app/services/test/test.service';
import { selectAllReferenceDataByResourceType } from '@/src/app/store/reference-data';
import { Component, computed, inject, input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReasonForNotLoading } from '@dvsa/cvs-type-definitions/types/v1/enums/reasonForNotLoading.enum.js';
import { TestResults } from '@dvsa/cvs-type-definitions/types/v1/enums/testResult.enum.js';
import { UnladenBodyType } from '@dvsa/cvs-type-definitions/types/v1/enums/unladenBodyType.enum.js';
import { VehicleLoadStatusType } from '@dvsa/cvs-type-definitions/types/v1/enums/vehicleLoadStatus.enum.js';
import { TestResultSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { Store } from '@ngrx/store';

@Component({
	selector: 'app-test-amend',
	templateUrl: './test-amend.component.html',
	imports: [
		GovukFormGroupInputComponent,
		GovukFormGroupRadioComponent,
		GovukFormGroupDateComponent,
		FormsModule,
		ReactiveFormsModule,
		ToUppercaseDirective,
		NoSpaceDirective,
		TrimWhitespaceDirective,
		GovukCheckboxGroupComponent,
		GovukFormGroupTextareaComponent,
		GovukFormGroupSelectComponent,
		RadioComponent,
	],
})
export class TestAmendComponent {
	readonly store = inject(Store);
	readonly testService = inject(TestService);
	readonly testTypeService = inject(TestTypeService);
	readonly loadStatusService = inject(LoadStatusService);

	readonly testResult = input<TestResultSchema>();

	readonly form = this.testService.form;
	readonly abandonReasons = computed(() => this.getAbandonReasonsList());

	readonly TestResults = TestResults;
	readonly FormNodeWidth = FormNodeWidth;
	readonly UNLADEN_BODY_TYPES = UnladenBodyType;
	readonly REASONS_FOR_NOT_LOADING = ReasonForNotLoading;
	readonly VEHICLE_LOAD_STATUS_TYPES = VehicleLoadStatusType;
	readonly YES_NO_OPTIONS = YES_NO_OPTIONS;
	readonly RESULT_OPTIONS = RESULT_OPTIONS;
	readonly UNLADEN_BODY_TYPES_OPTIONS = getOptionsFromEnum(UnladenBodyType);
	readonly REASON_FOR_NOT_LOADING_OPTIONS = getOptionsFromEnum(ReasonForNotLoading);

	// @TODO: move into a ngrx selector
	getAbandonReasonsList(): MultiOptions {
		const testResult = this.testResult();
		if (!testResult) return [];

		const resourceType = this.testTypeService.getAbandonReasonsResourceType(testResult);
		const referenceData = this.store.selectSignal(selectAllReferenceDataByResourceType(resourceType))() || [];
		return referenceData.map((reason) => ({ label: `${reason.description}`, value: `${reason.description}` }));
	}

	shouldShowExpiryDate(): boolean {
		const testType = this.testResult()?.testTypes[0];
		const isGroup7 = TEST_TYPES_GROUP7.includes(testType?.testTypeId ?? '');
		if (testType?.testResult === TestResults.ABANDONED) return false;
		if (!isGroup7) return false;
		if (testType?.testResult === TestResults.FAIL) return false;
		return true;
	}
}
