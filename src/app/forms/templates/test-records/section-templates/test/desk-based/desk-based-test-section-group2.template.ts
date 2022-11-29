import { ValidatorNames } from '@forms/models/validators.enum';
import { FormNode, FormNodeEditTypes, FormNodeTypes, FormNodeViewTypes, FormNodeWidth } from '@forms/services/dynamic-form.types';

export const DeskBasedTestSectionGroup2: FormNode = {
  name: 'testSection',
  label: 'Test',
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
              name: 'testResult',
              label: 'Result',
              type: FormNodeTypes.CONTROL,
              editType: FormNodeEditTypes.HIDDEN,
              viewType: FormNodeViewTypes.HIDDEN
            },
            {
              name: 'certificateNumber',
              label: 'Certificate number',
              value: null,
              type: FormNodeTypes.CONTROL,
              validators: [{ name: ValidatorNames.Alphanumeric }]
            },
            {
              name: 'testExpiryDate',
              label: 'Expiry Date',
              value: '',
              type: FormNodeTypes.CONTROL,
              viewType: FormNodeViewTypes.DATE,
              editType: FormNodeEditTypes.DATE,
              validators: [{ name: ValidatorNames.AheadOfDate, args: 'testTypeStartTimestamp' }]
            }
          ]
        }
      ]
    }
  ]
};
