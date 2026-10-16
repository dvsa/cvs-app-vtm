import { NoSpaceDirective } from '@/src/app/directives/app-no-space/app-no-space.directive';
import { ToUppercaseDirective } from '@/src/app/directives/app-to-uppercase/app-to-uppercase.directive';
import { TrimWhitespaceDirective } from '@/src/app/directives/app-trim-whitespace/app-trim-whitespace.directive';
import { GovukFormGroupDateComponent } from '@/src/app/forms/components/govuk-form-group-date/govuk-form-group-date.component';
import { GovukFormGroupInputComponent } from '@/src/app/forms/components/govuk-form-group-input/govuk-form-group-input.component';
import { GovukFormGroupRadioComponent } from '@/src/app/forms/components/govuk-form-group-radio/govuk-form-group-radio.component';
import { RadioComponent } from '@/src/app/forms/components/govuk-form-group-radio/radio/radio.component';
import { GovukFormGroupSelectComponent } from '@/src/app/forms/components/govuk-form-group-select/govuk-form-group-select.component';
import { GovukFormGroupTextareaComponent } from '@/src/app/forms/components/govuk-form-group-textarea/govuk-form-group-textarea.component';
import { getOptionsFromEnum } from '@/src/app/forms/utils/enum-map';
import { PASS_FAIL_OPTIONS, YES_NO_OPTIONS } from '@/src/app/models/options.model';
import { TEST_TYPES_GROUP7 } from '@/src/app/models/testTypeId.enum';
import { FormNodeWidth } from '@/src/app/services/dynamic-forms/dynamic-form.types';
import { LoadStatusService } from '@/src/app/services/load-status/load-status.service';
import { TestTypeService } from '@/src/app/services/test-type/test-type.service';
import { TestService } from '@/src/app/services/test/test.service';
import { Component, inject, input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReasonForNotLoading } from '@dvsa/cvs-type-definitions/types/v1/enums/reasonForNotLoading.enum.js';
import { TestResults } from '@dvsa/cvs-type-definitions/types/v1/enums/testResult.enum.js';
import { UnladenBodyType } from '@dvsa/cvs-type-definitions/types/v1/enums/unladenBodyType.enum.js';
import { VehicleLoadStatusType } from '@dvsa/cvs-type-definitions/types/v1/enums/vehicleLoadStatus.enum.js';
import { TestResultSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { GenerateAdrCertificateComponent } from './generate-adr-certificate/generate-adr-certificate.component';

@Component({
	selector: 'app-test-create',
	templateUrl: './test-create.component.html',
	imports: [
		FormsModule,
		ReactiveFormsModule,
		ToUppercaseDirective,
		NoSpaceDirective,
		TrimWhitespaceDirective,
		GovukFormGroupInputComponent,
		GovukFormGroupRadioComponent,
		GovukFormGroupDateComponent,
		GenerateAdrCertificateComponent,
		RadioComponent,
		GovukFormGroupSelectComponent,
		GovukFormGroupTextareaComponent,
		GenerateAdrCertificateComponent,
	],
})
export class TestCreateComponent {
	readonly store = inject(Store);
	readonly testService = inject(TestService);
	readonly actions$ = inject(Actions);
	readonly loadStatusService = inject(LoadStatusService);
	readonly testTypeService = inject(TestTypeService);

	readonly testResult = input<TestResultSchema>();

	readonly form = this.testService.form;

	readonly FormNodeWidth = FormNodeWidth;
	readonly UNLADEN_BODY_TYPES = UnladenBodyType;
	readonly REASONS_FOR_NOT_LOADING = ReasonForNotLoading;
	readonly VEHICLE_LOAD_STATUS_TYPES = VehicleLoadStatusType;
	readonly PASS_FAIL_OPTIONS = PASS_FAIL_OPTIONS;
	readonly YES_NO_OPTIONS = YES_NO_OPTIONS;
	readonly UNLADEN_BODY_TYPES_OPTIONS = getOptionsFromEnum(UnladenBodyType);
	readonly REASON_FOR_NOT_LOADING_OPTIONS = getOptionsFromEnum(ReasonForNotLoading);

	shouldShowExpiryDate(): boolean {
		const isGroup7 = TEST_TYPES_GROUP7.includes(this.testResult()?.testTypes[0].testTypeId ?? '');
		if (this.testResult()?.testTypes[0].testResult === TestResults.ABANDONED) return false;
		if (!isGroup7) return false;
		if (this.testResult()?.testTypes[0].testResult === 'fail') return false;
		return true;
	}
}
