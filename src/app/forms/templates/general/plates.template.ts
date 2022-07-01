import { FormNode, FormNodeTypes, FormNodeViewTypes } from '../../services/dynamic-form.types';

export const PlatesTemplate: FormNode = {
    name: '',
    label: 'Plates',
    viewType: FormNodeViewTypes.SUBHEADING,
    type: FormNodeTypes.GROUP,
    children: [{
        name: 'plates',
        type: FormNodeTypes.ARRAY,
        children: [
            {
                name: 'plates',
                type: FormNodeTypes.GROUP,
                children: [
                    {
                        name: 'plateSerialNumber',
                        label: 'Plate serial number',
                        value: '',
                        type: FormNodeTypes.CONTROL,
                    },
                    {
                        name: 'plateIssueDate',
                        label: 'Plate issue date',
                        value: '',
                        type: FormNodeTypes.CONTROL,
                    },
                    {
                        name: 'plateReasonForIssue',
                        label: 'Plate reason for issue',
                        value: '',
                        type: FormNodeTypes.CONTROL,
                    },
                    {
                        name: 'plateIssuer',
                        label: 'Plate issuer',
                        value: '',
                        type: FormNodeTypes.CONTROL,
                    }
                ]
            }
        ]
    }]
};
