import {
	FormNode,
	FormNodeEditTypes,
	FormNodeTypes,
	FormNodeViewTypes,
} from '@services/dynamic-forms/dynamic-form.types';

export const VehicleSummary: FormNode = {
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
			name: 'primaryVrm',
			label: 'Vehicle registration mark (VRM)',
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
