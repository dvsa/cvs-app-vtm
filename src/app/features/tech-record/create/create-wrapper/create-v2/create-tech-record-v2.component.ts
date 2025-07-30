import { ButtonGroupComponent } from '@/src/app/components/button-group/button-group.component';
import { ButtonComponent } from '@/src/app/components/button/button.component';
import { Component } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { CheckboxGroupComponent } from '@forms/components/checkbox-group/checkbox-group.component';
import { CustomValidators } from '@forms/validators/custom-validators/custom-validators';
import { MultiOptions } from '@models/options.model';
import { StatusCodes } from '@models/vehicle-tech-record.model';
import { CustomFormControl, CustomFormGroup, FormNodeTypes } from '@services/dynamic-forms/dynamic-form.types';

@Component({
	selector: 'app-create-tech-record-v2',
	templateUrl: './create-tech-record-v2.component.html',
	styleUrls: ['./create-tech-record-v2.component.scss'],
	imports: [ButtonGroupComponent, ButtonComponent, CheckboxGroupComponent, ReactiveFormsModule],
})
export class CreateTechRecordV2Component {
	form = new CustomFormGroup(
		{ name: 'main-form', type: FormNodeTypes.GROUP },
		{
			vin: new CustomFormControl({ name: 'input-vin', label: 'Vin', type: FormNodeTypes.CONTROL }, '', [
				CustomValidators.alphanumeric(),
				CustomValidators.validateVinCharacters(),
				Validators.minLength(3),
				Validators.maxLength(21),
				Validators.required,
			]),
			vrmTrm: new CustomFormControl(
				{ name: 'input-vrm-or-trailer-id', label: 'VRM/TRM', type: FormNodeTypes.CONTROL },
				'',
				[
					CustomValidators.alphanumeric(),
					CustomValidators.notZNumber,
					CustomValidators.validateVRMTrailerIdLength('vehicleType'),
					Validators.required,
				]
			),
			vehicleStatus: new CustomFormControl(
				{ name: 'change-vehicle-status-select', label: 'Vehicle status', type: FormNodeTypes.CONTROL },
				StatusCodes.PROVISIONAL,
				[Validators.required]
			),
			vehicleType: new CustomFormControl(
				{ name: 'change-vehicle-type-select', label: 'Vehicle type', type: FormNodeTypes.CONTROL },
				'',
				[Validators.required]
			),
			generateID: new CustomFormControl({ name: 'generate-c-or-z-num', type: FormNodeTypes.CONTROL }, null),
		}
	);

	get checkboxOptions(): MultiOptions {
		return [{ value: true, label: 'Generate a C/T/Z number on submission of the new record' }];
	}

	toggleVrmInput(checked: CheckboxGroupComponent) {
		const { vrmTrm } = this.form.controls;

		if (checked.value) {
			vrmTrm.removeValidators(Validators.required);
			vrmTrm.setValue(null);
			vrmTrm.disable();
		} else {
			vrmTrm.addValidators(Validators.required);
			vrmTrm.setValue('');
			vrmTrm.enable();
		}
	}
}
