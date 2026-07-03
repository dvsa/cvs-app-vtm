import {
	FormNodeEditTypes,
	FormNodeTypes,
	FormNodeViewTypes,
} from '@/src/app/services/dynamic-forms/dynamic-form.types';

export const LoadStatusTemplate = {
	name: 'loadStatus',
	type: FormNodeTypes.GROUP,
	children: [
		{
			name: 'vehicleLoadStatus',
			label: 'Load status',
			value: null,
			type: FormNodeTypes.CONTROL,
			viewType: FormNodeViewTypes.HIDDEN,
			editType: FormNodeEditTypes.HIDDEN,
		},
		{
			name: 'unladenBodyType',
			label: 'Body type',
			value: null,
			type: FormNodeTypes.CONTROL,
			viewType: FormNodeViewTypes.HIDDEN,
			editType: FormNodeEditTypes.HIDDEN,
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
		},
		{
			name: 'partiallyLadenReason',
			label: 'Reason for partially laden',
			value: null,
			type: FormNodeTypes.CONTROL,
			viewType: FormNodeViewTypes.HIDDEN,
			editType: FormNodeEditTypes.HIDDEN,
		},
	],
};
