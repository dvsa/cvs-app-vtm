import { FormNode, FormNodeTypes, FormNodeViewTypes } from '../../services/dynamic-form.types';

export const PsvApprovalTypeSection: FormNode = {
    name: 'approvalSection',
    label: 'Type approval',
    type: FormNodeTypes.GROUP,
    viewType: FormNodeViewTypes.SUBHEADING,
    children: [
        {
            name: 'approvalType',
            label: 'Approval type',
            type: FormNodeTypes.CONTROL
        },
        {
            name: 'approvalTypeNumber',
            label: 'Approval type tumber',
            type: FormNodeTypes.CONTROL
        },
        {
            name: 'ntaNumber',
            label: 'National type number',
            type: FormNodeTypes.CONTROL
        },
        {
            name: 'coifSerialNumber',
            label: 'COIF Serial number',
            type: FormNodeTypes.CONTROL
        },
        {
            name: 'coifCertifierName',
            label: 'COIF Certifier name',
            type: FormNodeTypes.CONTROL
        },
        {
            name: 'coifDate',
            label: 'COIF Certifier date',
            type: FormNodeTypes.CONTROL,
            viewType: FormNodeViewTypes.DATE
        },
        {
            name: 'variantNumber',
            label: 'Variant number',
            type: FormNodeTypes.CONTROL
        },
        {
            name: 'variantVersionNumber',
            label: 'Variant version number',
            type: FormNodeTypes.CONTROL
        }
    ]
};