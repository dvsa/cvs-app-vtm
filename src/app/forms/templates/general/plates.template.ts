import { FormNode, FormNodeTypes } from '../../services/dynamic-form.types';

export const PlatesTemplate: FormNode = {
  name: 'platesSection',
  label: 'Plates',
  type: FormNodeTypes.GROUP,
  children: [
    {
      name: 'plates',
      type: FormNodeTypes.ARRAY,
      children: [
        {
          name: '0',
          type: FormNodeTypes.GROUP,
          children: [
            {
              name: 'plateSerialNumber',
              label: 'Plate serial number',
              value: '',
              type: FormNodeTypes.CONTROL
            },
            {
              name: 'plateIssueDate',
              label: 'Plate issue date',
              value: '',
              type: FormNodeTypes.CONTROL
            },
            {
              name: 'plateReasonForIssue',
              label: 'Plate reason for issue',
              value: '',
              type: FormNodeTypes.CONTROL
            },
            {
              name: 'plateIssuer',
              label: 'Plate issuer',
              value: '',
              type: FormNodeTypes.CONTROL
            }
          ]
        }
      ]
    }
  ]
};
