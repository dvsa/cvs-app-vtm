import { GovukCheckboxGroupComponent } from '@/src/app/forms/components/govuk-checkbox-group/govuk-checkbox-group.component';
import { GovukFormGroupTextareaComponent } from '@/src/app/forms/components/govuk-form-group-textarea/govuk-form-group-textarea.component';
import { CommonValidatorsService } from '@/src/app/forms/validators/common-validators.service';
import { MultiOptions } from '@/src/app/models/options.model';
import { ReferenceDataResourceType } from '@/src/app/models/reference-data.model';
import {
	TEST_TYPES_GROUP1_SPEC_TEST,
	TEST_TYPES_GROUP2_SPEC_TEST,
	TEST_TYPES_GROUP3_SPEC_TEST,
	TEST_TYPES_GROUP4_SPEC_TEST,
	TEST_TYPES_GROUP5_13,
	TEST_TYPES_GROUP5_SPEC_TEST,
	TEST_TYPES_MSVA,
} from '@/src/app/models/testTypeId.enum';
import { VehicleTypes } from '@/src/app/models/vehicle-tech-record.model';
import { MultiOptionsService } from '@/src/app/services/multi-options/multi-options.service';
import { TestService } from '@/src/app/services/test/test.service';
import { selectAllReferenceDataByResourceType } from '@/src/app/store/reference-data';
import { testResultInEdit } from '@/src/app/store/test-records';
import { ChangeDetectionStrategy, Component, OnInit, computed, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';

@Component({
	selector: 'app-abandon',
	templateUrl: './abandon.component.html',
	styleUrls: ['./abandon.component.scss'],
	imports: [FormsModule, ReactiveFormsModule, GovukCheckboxGroupComponent, GovukFormGroupTextareaComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AbandonComponent implements OnInit {
	store = inject(Store);
	testService = inject(TestService);
	optionsService = inject(MultiOptionsService);
	commonValidators = inject(CommonValidatorsService);

	form = this.testService.form;
	testResult = this.store.selectSignal(testResultInEdit);
	abandonReasons = computed(() => this.getAbandonReasonsList());

	ngOnInit(): void {
		this.loadOptions();
		this.addValidators();
	}

	getAbandonReasonsResourceType() {
		const testTypeId = this.testResult()?.testTypes[0].testTypeId || '';

		// Display TIR reasons when abandoning TIR tests
		if (TEST_TYPES_GROUP5_13.includes(testTypeId)) {
			return ReferenceDataResourceType.TirReasonsForAbandoning;
		}

		// Display MSVA reasons when abandoning MSVA tests
		if (TEST_TYPES_MSVA.includes(testTypeId)) {
			return ReferenceDataResourceType.MsvaReasonsForAbandoning;
		}

		// Display specialist reasons when abandoning non-MSVA specialist tests
		if (
			[
				...TEST_TYPES_GROUP1_SPEC_TEST,
				...TEST_TYPES_GROUP2_SPEC_TEST,
				...TEST_TYPES_GROUP3_SPEC_TEST,
				...TEST_TYPES_GROUP4_SPEC_TEST,
				...TEST_TYPES_GROUP5_SPEC_TEST,
			].includes(testTypeId)
		) {
			return ReferenceDataResourceType.SpecialistReasonsForAbandoning;
		}

		// Otherwise, display vehicle type specific reasons
		const vehicleType = this.testResult()?.vehicleType;

		if (vehicleType === VehicleTypes.PSV) {
			return ReferenceDataResourceType.ReasonsForAbandoningPsv;
		}

		if (vehicleType === VehicleTypes.HGV) {
			return ReferenceDataResourceType.ReasonsForAbandoningHgv;
		}

		if (vehicleType === VehicleTypes.TRL) {
			return ReferenceDataResourceType.ReasonsForAbandoningTrl;
		}

		// If we reach here, then we have invalid data
		throw new Error('Unexpected vehicle type');
	}

	getAbandonReasonsList(): MultiOptions {
		const resourceType = this.getAbandonReasonsResourceType();
		const referenceData = this.store.selectSignal(selectAllReferenceDataByResourceType(resourceType))() || [];
		return referenceData.map((reason) => ({ label: `${reason.description}`, value: `${reason.description}` }));
	}

	loadOptions(): void {
		this.optionsService.loadOptions(this.getAbandonReasonsResourceType());
	}

	addValidators(): void {
		const testTypeGroup = this.form.controls.testTypes.at(0);
		testTypeGroup.controls.reasonForAbandoning.setValidators([
			this.commonValidators.required('Why was this test abandoned?'),
		]);
		testTypeGroup.controls.additionalCommentsForAbandon.setValidators([
			this.commonValidators.maxLength(500, 'Additional notes as to why this test was abandoned (optional)'),
		]);
	}
}
