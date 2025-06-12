import { Component, inject } from '@angular/core';
import { AbstractControl, ControlContainer, FormBuilder, FormGroup } from '@angular/forms';
import { CommonValidatorsService } from '@forms/validators/common-validators.service';
import { Store } from '@ngrx/store';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';

@Component({
	selector: 'app-edit-base-component',
	template: '',
})
export class EditBaseComponent {
	controlContainer = inject(ControlContainer);
	fb = inject(FormBuilder);
	store = inject(Store);
	technicalRecordService = inject(TechnicalRecordService);
	commonValidators = inject(CommonValidatorsService);

	init(form: FormGroup) {
		const parent = this.controlContainer.control;
		if (parent instanceof FormGroup) {
			Object.entries(form.controls).forEach(([key, control]) => parent.addControl(key, control, { emitEvent: false }));
		}
	}

	destroy(form: FormGroup) {
		const parent = this.controlContainer.control;
		if (parent instanceof FormGroup) {
			Object.keys(form.controls).forEach((key) => parent.removeControl(key, { emitEvent: false }));
		}
	}

	addControls(vehicleControls: Record<string, AbstractControl>, form: FormGroup) {
		for (const [key, control] of Object.entries(vehicleControls ?? {})) {
			form.addControl(key, control, { emitEvent: false });
		}
	}
}
