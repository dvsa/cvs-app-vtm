import { FormNode, FormNodeTypes, FormNodeViewTypes } from '../../services/dynamic-form.types';


export const PsvApplicantDetails: FormNode = {
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
                },
                {
                    name: 'address1',
                    label: 'Building and street (optional) (box 1 of 2)',
                    value: '',
                    type: FormNodeTypes.CONTROL,
                },
                {
                    name: 'address2',
                    label: 'Building and street (optional) (box 2 of 2)',
                    value: '',
                    type: FormNodeTypes.CONTROL,
                },
                {
                    name: 'postTown',
                    label: 'Town or city (optional)',
                    value: '',
                    type: FormNodeTypes.CONTROL,
                },
                {
                    name: 'address3',
                    label: 'County (optional)',
                    value: '',
                    type: FormNodeTypes.CONTROL,
                },
                {
                    name: 'postCode',
                    label: 'Postcode (optional)',
                    value: '',
                    type: FormNodeTypes.CONTROL,
                },
                {
                    name: 'telephoneNumber',
                    label: 'Telephone number (optional)',
                    value: '',
                    type: FormNodeTypes.CONTROL,
                },
                {
                    name: 'emailAddress',
                    label: 'Email address (optional)',
                    value: '',
                    type: FormNodeTypes.CONTROL,
                },
            ]
        }
    ]
}