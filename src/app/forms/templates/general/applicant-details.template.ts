import { FormNode, FormNodeTypes, FormNodeViewTypes } from '../../services/dynamic-form.types';
import { ValidatorNames } from '@forms/models/validators.enum';


export const ApplicantDetails: FormNode = {
    name: 'techRecord',
    type: FormNodeTypes.GROUP,
    label: 'Last Applicant',
    viewType: FormNodeViewTypes.SUBHEADING,
    children: [
        {
            name: 'applicantDetails',
            type: FormNodeTypes.GROUP,
            children: [
                {
                    name: 'name',
                    label: 'Name (optional)',
                    value: '',
                    type: FormNodeTypes.CONTROL,
                    validators: [{ name: ValidatorNames.MaxLength, args: 150 }]
                },
                {
                    name: 'address1',
                    label: 'Building and street (optional) (box 1 of 2)',
                    value: '',
                    type: FormNodeTypes.CONTROL,
                    validators: [{ name: ValidatorNames.MaxLength, args: 60 }]
                },
                {
                    name: 'address2',
                    label: 'Building and street (optional) (box 2 of 2)',
                    value: '',
                    type: FormNodeTypes.CONTROL,
                    validators: [{ name: ValidatorNames.MaxLength, args: 60 }]
                },
                {
                    name: 'postTown',
                    label: 'Town or city (optional)',
                    value: '',
                    type: FormNodeTypes.CONTROL,
                    validators: [{ name: ValidatorNames.MaxLength, args: 60 }]
                },
                {
                    name: 'address3',
                    label: 'County (optional)',
                    value: '',
                    type: FormNodeTypes.CONTROL,
                    validators: [{ name: ValidatorNames.MaxLength, args: 60 }]
                },
                {
                    name: 'postCode',
                    label: 'Postcode (optional)',
                    value: '',
                    type: FormNodeTypes.CONTROL,
                    validators: [{ name: ValidatorNames.MaxLength, args: 12 }]
                },
                {
                    name: 'telephoneNumber',
                    label: 'Telephone number (optional)',
                    value: '',
                    type: FormNodeTypes.CONTROL,
                    validators: [{ name: ValidatorNames.MaxLength, args: 25 }]
                },
                {
                    name: 'emailAddress',
                    label: 'Email address (optional)',
                    value: '',
                    type: FormNodeTypes.CONTROL,
                    validators: [{ name: ValidatorNames.MaxLength, args: 255 }]
                },
            ]
        }
    ]
}
