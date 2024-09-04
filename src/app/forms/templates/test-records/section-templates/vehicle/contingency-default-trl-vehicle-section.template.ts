import { EUVehicleCategory } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/euVehicleCategory.enum.js';
import { AsyncValidatorNames } from '@models/async-validators.enum';
import { ValidatorNames } from '@models/validators.enum';
import {
	FormNode,
	FormNodeEditTypes,
	FormNodeTypes,
	FormNodeViewTypes,
	FormNodeWidth,
} from '@services/dynamic-forms/dynamic-form.types';
import { getOptionsFromEnum } from '@forms/utils/enum-map';
import { ReferenceDataResourceType } from '@models/reference-data.model';

export const ContingencyVehicleSectionDefaultTrl: FormNode = {
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
			name: 'trailerId',
			label: 'Trailer ID',
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
			width: FormNodeWidth.XL,
			editType: FormNodeEditTypes.AUTOCOMPLETE,
			referenceData: ReferenceDataResourceType.CountryOfRegistration,
			type: FormNodeTypes.CONTROL,
			asyncValidators: [{ name: AsyncValidatorNames.RequiredIfNotAbandoned }],
		},
		{
			name: 'euVehicleCategory',
			label: 'EU Vehicle Category',
			value: '',
			type: FormNodeTypes.CONTROL,
			editType: FormNodeEditTypes.SELECT,
			width: FormNodeWidth.S,
			options: getOptionsFromEnum(EUVehicleCategory),
			validators: [{ name: ValidatorNames.Required }],
		},
		{
			name: 'preparerName',
			label: 'Preparer Name',
			value: '',
			type: FormNodeTypes.CONTROL,
			viewType: FormNodeViewTypes.HIDDEN,
			editType: FormNodeEditTypes.HIDDEN,
			disabled: true,
		},
		{
			name: 'preparerId',
			label: 'Preparer ID',
			value: '',
			type: FormNodeTypes.CONTROL,
			viewType: FormNodeViewTypes.HIDDEN,
			editType: FormNodeEditTypes.HIDDEN,
			disabled: true,
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
