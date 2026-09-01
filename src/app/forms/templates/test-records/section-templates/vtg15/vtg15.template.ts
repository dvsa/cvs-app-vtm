import {
	FormNodeEditTypes,
	FormNodeTypes,
	FormNodeViewTypes,
} from '@/src/app/services/dynamic-forms/dynamic-form.types';

export const Vtg15Template = {
	name: 'vtg15',
	type: FormNodeTypes.GROUP,
	children: [
		{
			name: 'vtg15Required',
			label: 'VTG15 required?',
			value: null,
			type: FormNodeTypes.CONTROL,
			viewType: FormNodeViewTypes.HIDDEN,
			editType: FormNodeEditTypes.HIDDEN,
		},
		{
			name: 'unNumber',
			label: 'UN number',
			value: null,
			type: FormNodeTypes.CONTROL,
			viewType: FormNodeViewTypes.HIDDEN,
			editType: FormNodeEditTypes.HIDDEN,
		},
		{
			name: 'primaryHazardClassification',
			label: 'Primary hazard classification',
			value: null,
			type: FormNodeTypes.CONTROL,
			viewType: FormNodeViewTypes.HIDDEN,
			editType: FormNodeEditTypes.HIDDEN,
		},
		{
			name: 'secondaryHazardClassification',
			label: 'Secondary hazard classification',
			value: null,
			type: FormNodeTypes.CONTROL,
			viewType: FormNodeViewTypes.HIDDEN,
			editType: FormNodeEditTypes.HIDDEN,
		},
	],
};
