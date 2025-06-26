import { AsyncValidatorNames } from '@models/async-validators.enum';
import { ValidatorNames } from '@models/validators.enum';
import {
	FormNode,
	FormNodeEditTypes,
	FormNodeTypes,
	FormNodeViewTypes,
	FormNodeWidth,
} from '@services/dynamic-forms/dynamic-form.types';

export const SeatbeltSection: FormNode = {
	name: 'seatbeltSection',
	label: 'Seatbelt',
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
							name: 'seatbeltInstallationCheckDate',
							label: 'Carried out during test',
							type: FormNodeTypes.CONTROL,
							editType: FormNodeEditTypes.RADIO,
							value: null,
							options: [
								{ value: true, label: 'Yes' },
								{ value: false, label: 'No' },
							],
							asyncValidators: [{ name: AsyncValidatorNames.RequiredIfNotAbandoned }],
						},
						{
							name: 'numberOfSeatbeltsFitted',
							label: 'Number of seatbelts fitted',
							type: FormNodeTypes.CONTROL,
							editType: FormNodeEditTypes.NUMBER,
							value: null,
							validators: [
								{
									name: ValidatorNames.RequiredIfEquals,
									args: { sibling: 'seatbeltInstallationCheckDate', value: [true] },
								},
								{ name: ValidatorNames.Max, args: 150 },
							],
							width: FormNodeWidth.M,
						},
						{
							name: 'lastSeatbeltInstallationCheckDate',
							label: 'Most recent installation check',
							type: FormNodeTypes.CONTROL,
							viewType: FormNodeViewTypes.DATE,
							editType: FormNodeEditTypes.DATE,
							value: null,
							validators: [
								{
									name: ValidatorNames.RequiredIfEquals,
									args: { sibling: 'seatbeltInstallationCheckDate', value: [true] },
								},
								{ name: ValidatorNames.PastDate },
							],
						},
					],
				},
			],
		},
	],
};
