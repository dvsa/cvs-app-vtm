import { ValidatorNames } from '@forms/models/validators.enum';
import { FormNode, FormNodeEditTypes, FormNodeTypes, FormNodeViewTypes, FormNodeWidth } from '@forms/services/dynamic-form.types';

export const DeskBasedTestSectionGroup2: FormNode = {
  name: 'testSection',
  label: 'Test',
  type: FormNodeTypes.GROUP,
  viewType: FormNodeViewTypes.SUBHEADING,
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
              name: 'testTypeId',
              label: 'Test Type ID',
              width: FormNodeWidth.XS,
              type: FormNodeTypes.CONTROL
            },
            {
              name: 'testCode',
              label: 'Test Code',
              value: '',
              width: FormNodeWidth.XS,
              type: FormNodeTypes.CONTROL
            },
            {
              name: 'testResult',
              label: 'Result',
              type: FormNodeTypes.CONTROL
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
