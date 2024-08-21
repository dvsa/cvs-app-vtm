import { FormNode, FormNodeEditTypes, FormNodeTypes, FormNodeViewTypes } from '@forms/services/dynamic-form.types';

export const VehicleSummaryTrl: FormNode = {
	name: 'vehicleSummary',
	label: 'Vehicle Summary',
	type: FormNodeTypes.GROUP,
	children: [
		{
			name: 'vin',
			label: 'Vehicle identification number (VIN)',
			type: FormNodeTypes.CONTROL,
			viewType: FormNodeViewTypes.STRING,
			editType: FormNodeEditTypes.TEXT,
		},
		{
			name: 'trailerId',
			label: 'Trailer ID',
			type: FormNodeTypes.CONTROL,
			viewType: FormNodeViewTypes.STRING,
			editType: FormNodeEditTypes.TEXT,
		},
		{
			name: 'techRecord_vehicleType',
			label: 'Vehicle type',
			type: FormNodeTypes.CONTROL,
			viewType: FormNodeViewTypes.STRING,
			editType: FormNodeEditTypes.TEXT,
		},
		{
			name: 'techRecord_manufactureYear',
			label: 'Year of manufacture',
			type: FormNodeTypes.CONTROL,
			viewType: FormNodeViewTypes.STRING,
			editType: FormNodeEditTypes.TEXT,
		},
		{
			name: 'techRecord_make',
			label: 'Make',
			type: FormNodeTypes.CONTROL,
			viewType: FormNodeViewTypes.STRING,
			editType: FormNodeEditTypes.TEXT,
		},
		{
			name: 'techRecord_model',
			label: 'Model',
			type: FormNodeTypes.CONTROL,
			viewType: FormNodeViewTypes.STRING,
			editType: FormNodeEditTypes.TEXT,
		},
	],
};
