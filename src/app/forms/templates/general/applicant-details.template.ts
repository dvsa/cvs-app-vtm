import { FormNode, FormNodeTypes, FormNodeViewTypes } from '../../services/dynamic-form.types';
import { ValidatorNames } from '@forms/models/validators.enum';


export const ApplicantDetails: FormNode = {
    name: 'techRecord',
    type: FormNodeTypes.GROUP,
    label: 'Last Applicant',
    children: [
        {
            name: 'applicantDetails',
            type: FormNodeTypes.GROUP,
            children: [
                {
                    name: 'name',
                    label: 'Name or company',
                    value: '',
                    width: 30,
                    type: FormNodeTypes.CONTROL,
                    validators: [{ name: ValidatorNames.MaxLength, args: 150 }]
                },
                {
                    name: 'address1',
                    label: 'Address line 1',
                    value: '',
                    width: 30,
                    type: FormNodeTypes.CONTROL,
                    validators: [{ name: ValidatorNames.MaxLength, args: 60 }]
                },
                {
                    name: 'address2',
                    label: 'Address line 2',
                    value: '',
                    width: 30,
                    type: FormNodeTypes.CONTROL,
                    validators: [{ name: ValidatorNames.MaxLength, args: 60 }]
                },
                {
                    name: 'postTown',
                    label: 'Town or City',
                    value: '',
                    width: 20,
                    type: FormNodeTypes.CONTROL,
                    validators: [{ name: ValidatorNames.MaxLength, args: 60 }]
                },
                {
                    name: 'address3',
                    label: 'County',
                    value: '',
                    width: 20,
                    type: FormNodeTypes.CONTROL,
                    validators: [{ name: ValidatorNames.MaxLength, args: 60 }]
                },
                {
                    name: 'postCode',
                    label: 'Postcode',
                    value: '',
                    width: 10,
                    type: FormNodeTypes.CONTROL,
                    validators: [{ name: ValidatorNames.MaxLength, args: 12 }]
                },
                {
                    name: 'telephoneNumber',
                    label: 'Telephone number',
                    value: '',
                    width: 20,
                    type: FormNodeTypes.CONTROL,
                    validators: [{ name: ValidatorNames.MaxLength, args: 25 }]
                },
                {
                    name: 'emailAddress',
                    label: 'Email address',
                    value: '',
                    width: 20,
                    type: FormNodeTypes.CONTROL,
                    validators: [{ name: ValidatorNames.MaxLength, args: 255 }]
                },
            ]
        }
    ]
}
