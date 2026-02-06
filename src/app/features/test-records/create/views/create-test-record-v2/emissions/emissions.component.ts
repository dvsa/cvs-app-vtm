import { GovukFormGroupInputComponent } from '@/src/app/forms/components/govuk-form-group-input/govuk-form-group-input.component';
import { GovukFormGroupRadioComponent } from '@/src/app/forms/components/govuk-form-group-radio/govuk-form-group-radio.component';
import { getOptionsFromEnum } from '@/src/app/forms/utils/enum-map';
import { FormGroupFrom } from '@/src/app/models/form.model';
import { EmissionStandard } from '@/src/app/models/test-types/emissions.enum';
import { TestTypesService } from '@/src/app/services/test-types/test-types.service';
import { Component, inject, input } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TestResultSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';

@Component({
	selector: 'app-emissions',
	templateUrl: './emissions.component.html',
	imports: [FormsModule, ReactiveFormsModule, GovukFormGroupRadioComponent, GovukFormGroupInputComponent],
})
export class EmissionsComponent {
	testTypesService = inject(TestTypesService);

	form = input.required<FormGroup<FormGroupFrom<TestResultSchema>>>();

	emissionStandardOptions = [
		{ label: '0.10 g/kWh Euro III PM', value: '0.10 g/kWh Euro 3 PM' },
		...getOptionsFromEnum(EmissionStandard),
	];
}
