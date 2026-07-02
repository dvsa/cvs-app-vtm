import { LoadStatusComponent } from '@/src/app/forms/custom-sections/load-status/load-status.component';
import { ValidatorNames } from '@/src/app/models/validators.enum';
import {
	FormNodeEditTypes,
	FormNodeTypes,
	FormNodeViewTypes,
} from '@/src/app/services/dynamic-forms/dynamic-form.types';
import { AbstractControl } from '@angular/forms';
import { ReasonForNotLoading } from '@dvsa/cvs-type-definitions/types/v1/enums/reasonForNotLoading.enum.js';
import { VehicleLoadStatusType } from '@dvsa/cvs-type-definitions/types/v1/enums/vehicleLoadStatus.enum.js';

export const LoadStatusTemplate = {
	name: 'loadStatus',
	type: FormNodeTypes.GROUP,
	viewType: FormNodeViewTypes.CUSTOM,
	editType: FormNodeEditTypes.CUSTOM,
	viewComponent: LoadStatusComponent,
	editComponent: LoadStatusComponent,
	children: [
		{
			name: 'vehicleLoadStatus',
			label: 'Load status',
			value: null,
			type: FormNodeTypes.CONTROL,
			viewType: FormNodeViewTypes.HIDDEN,
			editType: FormNodeEditTypes.RADIO,
			validators: [
				{
					name: ValidatorNames.Custom,
					args: (control: AbstractControl) => {
						if (control.value === null || control.value === undefined || control.value === '') {
							const message = 'Load status is required';
							return { custom: { error: message, message } };
						}

						return null;
					},
				},
			],
		},
		{
			name: 'unladenBodyType',
			label: 'Body type',
			value: null,
			type: FormNodeTypes.CONTROL,
			viewType: FormNodeViewTypes.HIDDEN,
			editType: FormNodeEditTypes.DROPDOWN,
			validators: [
				{
					name: ValidatorNames.Custom,
					args: (control: AbstractControl) => {
						if (control.value) return null;

						const vehicleLoadStatus = control.parent?.get('vehicleLoadStatus')?.getRawValue();
						if (vehicleLoadStatus !== VehicleLoadStatusType.UNLADEN) return null;

						const message = 'Body type is required';
						return { custom: { error: message, message } };
					},
				},
			],
		},
		{
			name: 'otherUnladenBodyType',
			label: 'Enter body type',
			value: null,
			type: FormNodeTypes.CONTROL,
			viewType: FormNodeViewTypes.HIDDEN,
			editType: FormNodeEditTypes.HIDDEN,
		},
		{
			name: 'reasonForNotLoading',
			label: 'Reason for not loading',
			value: null,
			type: FormNodeTypes.CONTROL,
			viewType: FormNodeViewTypes.HIDDEN,
			editType: FormNodeEditTypes.HIDDEN,
		},
		{
			name: 'otherReasonForNotLoading',
			label: 'Enter reason for not loading',
			value: null,
			type: FormNodeTypes.CONTROL,
			viewType: FormNodeViewTypes.HIDDEN,
			editType: FormNodeEditTypes.HIDDEN,
			validators: [
				{ name: ValidatorNames.MaxLength, args: 200 },
				{
					name: ValidatorNames.RequiredIfEquals,
					args: { sibling: 'reasonForNotLoading', value: ReasonForNotLoading.OTHER },
				},
			],
		},
		{
			name: 'partiallyLadenReason',
			label: 'Reason for partially laden',
			value: null,
			type: FormNodeTypes.CONTROL,
			viewType: FormNodeViewTypes.HIDDEN,
			editType: FormNodeEditTypes.HIDDEN,
			validators: [
				{ name: ValidatorNames.MaxLength, args: 200 },
				{
					name: ValidatorNames.RequiredIfEquals,
					args: { sibling: 'reasonForNotLoading', value: VehicleLoadStatusType.PARTIALLY_LADEN },
				},
			],
		},
	],
};
