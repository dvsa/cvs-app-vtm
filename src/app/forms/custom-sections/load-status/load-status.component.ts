import { DynamicFormService } from '@/src/app/services/dynamic-forms/dynamic-form.service';
import { CustomFormGroup, FormNodeWidth } from '@/src/app/services/dynamic-forms/dynamic-form.types';
import { NgTemplateOutlet } from '@angular/common';
import { AfterViewInit, Component, inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReasonForNotLoading } from '@dvsa/cvs-type-definitions/types/v1/enums/reasonForNotLoading.enum.js';
import { UnladenBodyType } from '@dvsa/cvs-type-definitions/types/v1/enums/unladenBodyType.enum.js';
import { VehicleLoadStatusType } from '@dvsa/cvs-type-definitions/types/v1/enums/vehicleLoadStatus.enum.js';
import { Store } from '@ngrx/store';
import { ReplaySubject, takeUntil } from 'rxjs';
import { GovukFormGroupInputComponent } from '../../components/govuk-form-group-input/govuk-form-group-input.component';
import { GovukFormGroupRadioComponent } from '../../components/govuk-form-group-radio/govuk-form-group-radio.component';
import { RadioComponent } from '../../components/govuk-form-group-radio/radio/radio.component';
import { GovukFormGroupSelectComponent } from '../../components/govuk-form-group-select/govuk-form-group-select.component';
import { GovukFormGroupTextareaComponent } from '../../components/govuk-form-group-textarea/govuk-form-group-textarea.component';
import { LoadStatusTemplate } from '../../templates/test-records/section-templates/loadStatus/loadStatus.template';
import { getOptionsFromEnum } from '../../utils/enum-map';
import { CommonValidatorsService } from '../../validators/common-validators.service';
import { CustomFormControlComponent } from '../custom-form-control/custom-form-control.component';

@Component({
	selector: 'app-load-status',
	templateUrl: './load-status.component.html',
	styleUrls: ['./load-status.component.scss'],
	imports: [
		FormsModule,
		ReactiveFormsModule,
		GovukFormGroupRadioComponent,
		RadioComponent,
		GovukFormGroupSelectComponent,
		GovukFormGroupInputComponent,
		GovukFormGroupTextareaComponent,
		NgTemplateOutlet,
	],
})
export class LoadStatusComponent extends CustomFormControlComponent implements AfterViewInit, OnDestroy {
	store = inject(Store);
	fb = inject(FormBuilder);
	dfs = inject(DynamicFormService);
	commonValidators = inject(CommonValidatorsService);

	loadStatusForm?: CustomFormGroup;

	FORM_NODE_WIDTH = FormNodeWidth;
	VEHICLE_LOAD_STATUS_TYPES = VehicleLoadStatusType;
	UNLADEN_BODY_TYPES = UnladenBodyType;
	REASONS_FOR_NOT_LOADING = ReasonForNotLoading;
	UNLADEN_BODY_TYPES_OPTIONS = getOptionsFromEnum(UnladenBodyType);
	REASON_FOR_NOT_LOADING_OPTIONS = getOptionsFromEnum(ReasonForNotLoading);

	destroy = new ReplaySubject<boolean>(1);

	ngOnDestroy(): void {
		this.destroy.next(true);
		this.destroy.complete();
	}

	ngAfterViewInit(): void {
		this.loadStatusForm = this.dfs.createForm(LoadStatusTemplate) as CustomFormGroup;

		this.loadStatusForm.valueChanges.pipe(takeUntil(this.destroy)).subscribe((value) => {
			this.writeValue(value);
		});
	}
}
