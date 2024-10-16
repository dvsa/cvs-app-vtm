import { EUVehicleCategory } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/euVehicleCategory.enum.js';
import { getOptionsFromEnum } from '@forms/utils/enum-map';
import { ReferenceDataResourceType } from '@models/reference-data.model';
import { ValidatorNames } from '@models/validators.enum';
import {
	FormNode,
	FormNodeEditTypes,
	FormNodeTypes,
	FormNodeViewTypes,
	FormNodeWidth,
} from '@services/dynamic-forms/dynamic-form.types';

export const VehicleSectionDefaultTrl: FormNode = {
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
			width: FormNodeWidth.L,
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
			validators: [{ name: ValidatorNames.Required }],
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
			name: 'preparerCombination',
			label: 'Preparer',
			type: FormNodeTypes.COMBINATION,
			options: {
				leftComponentName: 'preparerName',
				rightComponentName: 'preparerId',
				separator: ' - ',
			},
			disabled: true,
		},
		{
			name: 'preparerName',
			label: 'Preparer Name',
			value: '',
			type: FormNodeTypes.CONTROL,
			viewType: FormNodeViewTypes.HIDDEN,
			disabled: true,
			width: FormNodeWidth.XL,
		},
		{
			name: 'preparerId',
			label: 'Preparer ID',
			value: '',
			type: FormNodeTypes.CONTROL,
			viewType: FormNodeViewTypes.HIDDEN,
			disabled: true,
			width: FormNodeWidth.L,
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
