import { GovukCheckboxGroupComponent } from '@/src/app/forms/components/govuk-checkbox-group/govuk-checkbox-group.component';
import { GovukFormGroupTextareaComponent } from '@/src/app/forms/components/govuk-form-group-textarea/govuk-form-group-textarea.component';
import { CommonValidatorsService } from '@/src/app/forms/validators/common-validators.service';
import { MultiOptions } from '@/src/app/models/options.model';
import { MultiOptionsService } from '@/src/app/services/multi-options/multi-options.service';
import { TestTypeService } from '@/src/app/services/test-type/test-type.service';
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
	testTypeService = inject(TestTypeService);
	optionsService = inject(MultiOptionsService);
	commonValidators = inject(CommonValidatorsService);

	form = this.testService.form;
	testResult = this.store.selectSignal(testResultInEdit);
	abandonReasons = computed(() => this.getAbandonReasonsList());

	ngOnInit(): void {
		this.loadOptions();
		this.addValidators();
	}

	getAbandonReasonsList(): MultiOptions {
		const testResult = this.testResult();
		if (!testResult) return [];

		const resourceType = this.testTypeService.getAbandonReasonsResourceType(testResult);
		const referenceData = this.store.selectSignal(selectAllReferenceDataByResourceType(resourceType))() || [];
		return referenceData.map((reason) => ({ label: `${reason.description}`, value: `${reason.description}` }));
	}

	loadOptions(): void {
		const testResult = this.testResult();
		if (!testResult) return;
		this.optionsService.loadOptions(this.testTypeService.getAbandonReasonsResourceType(testResult));
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
