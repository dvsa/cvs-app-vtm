import { ValidatorNames } from '@models/validators.enum';
import { FormNode, FormNodeTypes, FormNodeWidth } from '@services/dynamic-forms/dynamic-form.types';

export const ApplicantDetails: FormNode = {
	name: 'techRecord',
	type: FormNodeTypes.GROUP,
	label: 'Last applicant',
	children: [
		{
			name: 'techRecord_applicantDetails_name',
			label: 'Name or company',
			value: null,
			width: FormNodeWidth.XXL,
			type: FormNodeTypes.CONTROL,
			validators: [{ name: ValidatorNames.MaxLength, args: 150 }],
		},
		{
			name: 'techRecord_applicantDetails_address1',
			label: 'Address line 1',
			value: null,
			width: FormNodeWidth.XXL,
			type: FormNodeTypes.CONTROL,
			validators: [{ name: ValidatorNames.MaxLength, args: 60 }],
		},
		{
			name: 'techRecord_applicantDetails_address2',
			label: 'Address line 2',
			value: null,
			width: FormNodeWidth.XXL,
			type: FormNodeTypes.CONTROL,
			validators: [{ name: ValidatorNames.MaxLength, args: 60 }],
		},
		{
			name: 'techRecord_applicantDetails_postTown',
			label: 'Town or City',
			value: null,
			width: FormNodeWidth.XL,
			type: FormNodeTypes.CONTROL,
			validators: [{ name: ValidatorNames.MaxLength, args: 60 }],
		},
		{
			name: 'techRecord_applicantDetails_address3',
			label: 'County',
			value: null,
			width: FormNodeWidth.XL,
			type: FormNodeTypes.CONTROL,
			validators: [{ name: ValidatorNames.MaxLength, args: 60 }],
		},
		{
			name: 'techRecord_applicantDetails_postCode',
			label: 'Postcode',
			value: null,
			width: FormNodeWidth.L,
			type: FormNodeTypes.CONTROL,
			validators: [{ name: ValidatorNames.MaxLength, args: 12 }],
		},
		{
			name: 'techRecord_applicantDetails_telephoneNumber',
			label: 'Telephone number',
			value: null,
			width: FormNodeWidth.XL,
			type: FormNodeTypes.CONTROL,
			validators: [{ name: ValidatorNames.MaxLength, args: 25 }],
		},
		{
			name: 'techRecord_applicantDetails_emailAddress',
			label: 'Email address',
			value: null,
			width: FormNodeWidth.XL,
			type: FormNodeTypes.CONTROL,
			validators: [{ name: ValidatorNames.MaxLength, args: 255 }, { name: ValidatorNames.Email }],
		},
	],
};
