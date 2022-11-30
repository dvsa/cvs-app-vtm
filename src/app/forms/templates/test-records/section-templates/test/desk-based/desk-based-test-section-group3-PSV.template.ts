import { ValidatorNames } from '@forms/models/validators.enum';
import { FormNode, FormNodeEditTypes, FormNodeTypes, FormNodeViewTypes, FormNodeWidth } from '@forms/services/dynamic-form.types';

export const DeskBasedTestSectionGroup3Psv: FormNode = {
  name: 'testSection',
  label: 'Test',
  type: FormNodeTypes.GROUP,
  children: [
    {
      name: 'testStartTimestamp',
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.HIDDEN,
      editType: FormNodeEditTypes.HIDDEN
    },
    {
      name: 'testEndTimestamp',
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.HIDDEN,
      editType: FormNodeEditTypes.HIDDEN
    },
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
              editType: FormNodeEditTypes.HIDDEN,
              viewType: FormNodeViewTypes.HIDDEN,
              type: FormNodeTypes.CONTROL,
              value: 'pass'
            },
            {
              name: 'reasonForAbandoning',
              type: FormNodeTypes.CONTROL,
              viewType: FormNodeViewTypes.HIDDEN,
              editType: FormNodeEditTypes.HIDDEN,
              value: null
            },
            {
              name: 'additionalCommentsForAbandon',
              type: FormNodeTypes.CONTROL,
              viewType: FormNodeViewTypes.HIDDEN,
              editType: FormNodeEditTypes.HIDDEN,
              value: null
            },
            {
              name: 'certificateNumber',
              label: 'Certificate number',
              type: FormNodeTypes.CONTROL,
              width: FormNodeWidth.L,
              validators: [{ name: ValidatorNames.Alphanumeric }],
              required: true,
              value: null
            },
            {
              name: 'testTypeStartTimestamp',
              type: FormNodeTypes.CONTROL,
              value: '',
              viewType: FormNodeViewTypes.HIDDEN,
              editType: FormNodeEditTypes.HIDDEN
            },
            {
              name: 'testTypeEndTimestamp',
              type: FormNodeTypes.CONTROL,
              value: '',
              viewType: FormNodeViewTypes.HIDDEN,
              editType: FormNodeEditTypes.HIDDEN
            },
            {
              name: 'testExpiryDate',
              value: null,
              type: FormNodeTypes.CONTROL,
              viewType: FormNodeViewTypes.HIDDEN,
              editType: FormNodeEditTypes.HIDDEN
            },
            {
              name: 'prohibitionIssued',
              label: 'Prohibition issued',
              type: FormNodeTypes.CONTROL,
              value: null,
              viewType: FormNodeViewTypes.HIDDEN,
              editType: FormNodeEditTypes.HIDDEN
            }
          ]
        }
      ]
    }
  ]
};
