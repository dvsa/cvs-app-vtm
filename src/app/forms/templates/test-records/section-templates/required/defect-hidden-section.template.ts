import { FormNode, FormNodeEditTypes, FormNodeTypes, FormNodeViewTypes } from '@services/dynamic-forms/dynamic-form.types';

export const defectsHiddenSection: FormNode = {
	name: 'requiredSection',
	type: FormNodeTypes.GROUP,
	children: [
		{
			name: 'testTypes',
			label: 'Test Types',
			type: FormNodeTypes.ARRAY,
			children: [
				{
					name: '0', // it is important here that the name of the node for an ARRAY type should be an index value
					type: FormNodeTypes.GROUP,
					children: [
						{
							name: 'defects',
							type: FormNodeTypes.ARRAY,
							viewType: FormNodeViewTypes.HIDDEN,
							editType: FormNodeEditTypes.HIDDEN,
						},
					],
				},
			],
		},
	],
};
