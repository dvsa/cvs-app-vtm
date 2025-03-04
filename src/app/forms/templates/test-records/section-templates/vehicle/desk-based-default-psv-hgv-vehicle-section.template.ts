import { AsyncValidatorNames } from '@models/async-validators.enum';
import { ReferenceDataResourceType } from '@models/reference-data.model';
import { ValidatorNames } from '@models/validators.enum';
import {
	FormNode,
	FormNodeEditTypes,
	FormNodeTypes,
	FormNodeViewTypes,
	FormNodeWidth,
} from '@services/dynamic-forms/dynamic-form.types';

export const DeskBasedVehicleSectionDefaultPsvHgv: FormNode = {
	name: 'vehicleSection',
	label: 'Vehicle Details',
	type: FormNodeTypes.GROUP,
	children: [
		{
			name: 'vin',
			label: 'VIN/chassis number',
			value: '',
			type: FormNodeTypes.CONTROL,
			viewType: FormNodeViewTypes.HIDDEN,
			editType: FormNodeEditTypes.HIDDEN,
		},
		{
			name: 'vrm',
			label: 'VRM',
			value: '',
			type: FormNodeTypes.CONTROL,
			viewType: FormNodeViewTypes.HIDDEN,
			editType: FormNodeEditTypes.HIDDEN,
		},
		{
			name: 'countryOfRegistration',
			label: 'Country Of Registration',
			value: '',
			options: [],
			width: FormNodeWidth.XL,
			editType: FormNodeEditTypes.AUTOCOMPLETE,
			referenceData: ReferenceDataResourceType.CountryOfRegistration,
			type: FormNodeTypes.CONTROL,
		},
		{
			name: 'euVehicleCategory',
			label: 'EU Vehicle Category',
			value: '',
			type: FormNodeTypes.CONTROL,
			editType: FormNodeEditTypes.SELECT,
			width: FormNodeWidth.S,
			asyncValidators: [
				{ name: AsyncValidatorNames.FilterEuCategoryOnVehicleType },
				{ name: AsyncValidatorNames.AsyncRequired },
			],
		},
		{
			name: 'odometerReading',
			label: 'Odometer Reading',
			value: null,
			validators: [{ name: ValidatorNames.Numeric }, { name: ValidatorNames.Max, args: 9999999 }],
			editType: FormNodeEditTypes.NUMBER,
			type: FormNodeTypes.CONTROL,
			viewType: FormNodeViewTypes.HIDDEN,
			width: FormNodeWidth.L,
		},
		{
			name: 'odometerReadingUnits',
			label: 'Odometer Reading Units',
			value: null,
			options: [
				{ value: 'kilometres', label: 'Kilometres' },
				{ value: 'miles', label: 'Miles' },
			],
			type: FormNodeTypes.CONTROL,
			viewType: FormNodeViewTypes.HIDDEN,
			editType: FormNodeEditTypes.RADIO,
		},
		{
			name: 'preparerName',
			label: 'Preparer Name',
			value: '',
			type: FormNodeTypes.CONTROL,
			viewType: FormNodeViewTypes.HIDDEN,
		},
		{
			name: 'preparerId',
			label: 'Preparer ID',
			value: '',
			type: FormNodeTypes.CONTROL,
			viewType: FormNodeViewTypes.HIDDEN,
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
