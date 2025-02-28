import { ReferenceDataResourceType } from '@models/reference-data.model';
import { ValidatorNames } from '@models/validators.enum';
import {
	FormNode,
	FormNodeEditTypes,
	FormNodeTypes,
	FormNodeViewTypes,
	FormNodeWidth,
} from '@services/dynamic-forms/dynamic-form.types';
import { AsyncValidatorNames } from '@models/async-validators.enum';

export const VehicleSectionGroup3: FormNode = {
	name: 'vehicleSection',
	label: 'Vehicle Details',
	type: FormNodeTypes.GROUP,
	viewType: FormNodeViewTypes.SUBHEADING,
	children: [
		{
			name: 'vin',
			label: 'VIN/chassis number',
			value: '',
			disabled: true,
			type: FormNodeTypes.CONTROL,
			viewType: FormNodeViewTypes.HIDDEN,
			editType: FormNodeEditTypes.HIDDEN,
		},
		{
			name: 'countryOfRegistration',
			label: 'Country Of Registration',
			value: '',
			options: [],
			width: FormNodeWidth.XXL,
			editType: FormNodeEditTypes.AUTOCOMPLETE,
			referenceData: ReferenceDataResourceType.CountryOfRegistration,
			type: FormNodeTypes.CONTROL,
			validators: [{ name: ValidatorNames.Required }],
		},
		{
			name: 'euVehicleCategory',
			label: 'EU Vehicle Category',
			value: '',
			type: FormNodeTypes.CONTROL,
			editType: FormNodeEditTypes.SELECT,
			width: FormNodeWidth.S,
      asyncValidators: [{ name: AsyncValidatorNames.FilterEuCategoryOnVehicleType }],
			validators: [{ name: ValidatorNames.Required }],
		},
		{
			name: 'odometerReading',
			label: 'Odometer Reading',
			value: '',
			validators: [
				{ name: ValidatorNames.Numeric },
				{ name: ValidatorNames.Required },
				{ name: ValidatorNames.Max, args: 9999999 },
			],
			editType: FormNodeEditTypes.NUMBER,
			type: FormNodeTypes.CONTROL,
			viewType: FormNodeViewTypes.HIDDEN,
			width: FormNodeWidth.L,
		},
		{
			name: 'odometerReadingUnits',
			label: 'Odometer Reading Units',
			value: '',
			options: [
				{ value: 'kilometres', label: 'Kilometres' },
				{ value: 'miles', label: 'Miles' },
			],
			type: FormNodeTypes.CONTROL,
			viewType: FormNodeViewTypes.HIDDEN,
			editType: FormNodeEditTypes.RADIO,
		},
		{
			name: 'make',
			type: FormNodeTypes.CONTROL,
			editType: FormNodeEditTypes.HIDDEN,
			viewType: FormNodeViewTypes.HIDDEN,
		},
		{
			name: 'model',
			type: FormNodeTypes.CONTROL,
			editType: FormNodeEditTypes.HIDDEN,
			viewType: FormNodeViewTypes.HIDDEN,
		},
		{
			name: 'bodyType',
			type: FormNodeTypes.CONTROL,
			editType: FormNodeEditTypes.HIDDEN,
			viewType: FormNodeViewTypes.HIDDEN,
		},
	],
};
