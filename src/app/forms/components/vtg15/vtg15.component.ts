import { Component, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { HazardClassification } from '@dvsa/cvs-type-definitions/types/enums/hazardClassification.enum';
import { ReasonForNotLoading } from '@dvsa/cvs-type-definitions/types/v1/enums/reasonForNotLoading.enum';
import { UnladenBodyType } from '@dvsa/cvs-type-definitions/types/v1/enums/unladenBodyType.enum';
import { VehicleLoadStatusType } from '@dvsa/cvs-type-definitions/types/v1/enums/vehicleLoadStatus.enum';
import { TestResultSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { GovukFormGroupInputComponent } from '@forms/components/govuk-form-group-input/govuk-form-group-input.component';
import { GovukFormGroupRadioComponent } from '@forms/components/govuk-form-group-radio/govuk-form-group-radio.component';
import { RadioComponent } from '@forms/components/govuk-form-group-radio/radio/radio.component';
import { GovukFormGroupSelectComponent } from '@forms/components/govuk-form-group-select/govuk-form-group-select.component';
import { getOptionsFromEnumWithCodeAndDescription } from '@forms/utils/enum-map';
import { CommonValidatorsService } from '@forms/validators/common-validators.service';
import { YES_NO_OPTIONS } from '@models/options.model';
import { Store } from '@ngrx/store';
import { DefaultNullOrEmpty } from '@pipes/default-null-or-empty/default-null-or-empty.pipe';
import { FormNodeWidth } from '@services/dynamic-forms/dynamic-form.types';

@Component({
	selector: 'app-vtg15',
	templateUrl: './vtg15.component.html',
	styleUrls: ['./vtg15.component.scss'],
	imports: [
		ReactiveFormsModule,
		GovukFormGroupRadioComponent,
		RadioComponent,
		GovukFormGroupInputComponent,
		GovukFormGroupSelectComponent,
		DefaultNullOrEmpty,
	],
})
export class Vtg15Component {
	store = inject(Store);
	fb = inject(FormBuilder);
	commonValidators = inject(CommonValidatorsService);

	form = this.fb.group({
		vtg15: this.fb.group({
			vtg15Required: false,
			primaryHazardClassification: '',
			secondaryHazardClassification: '',
			unNumber: '',
		}),
	});

	edit = input(false);
	isContingencyTest = input(true);
	data = input<Partial<TestResultSchema>>({});
	formChange = output<Record<string, any> | [][]>();

	ngOnInit(): void {}

	protected readonly YES_NO_OPTIONS = YES_NO_OPTIONS;
	protected readonly HAZARD_CLASSIFICATION_OPTIONS = getOptionsFromEnumWithCodeAndDescription(HazardClassification);
	protected readonly FORM_NODE_WIDTH = FormNodeWidth;
	protected readonly UNLADEN_BODY_TYPES = UnladenBodyType;
	protected readonly REASONS_FOR_NOT_LOADING = ReasonForNotLoading;
	protected readonly VEHICLE_LOAD_STATUS_TYPES = VehicleLoadStatusType;
}
