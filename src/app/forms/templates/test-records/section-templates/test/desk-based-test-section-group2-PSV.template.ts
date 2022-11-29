import { ValidatorNames } from '@forms/models/validators.enum';
import { FormNode, FormNodeEditTypes, FormNodeTypes, FormNodeViewTypes, FormNodeWidth } from '@forms/services/dynamic-form.types';

export const DeskBasedTestSectionGroup2PSV: FormNode = {
  name: 'testSection',
  label: 'Test',
  type: FormNodeTypes.GROUP,
  children: [
    {
      name: 'testStartTimestamp',
      label: 'Test start date',
      type: FormNodeTypes.CONTROL,
      value: '',
      viewType: FormNodeViewTypes.HIDDEN,
      editType: FormNodeEditTypes.HIDDEN
    },
    {
      name: 'testEndTimestamp',
      type: FormNodeTypes.CONTROL,
      label: 'Test end date',
      value: '',
      viewType: FormNodeViewTypes.HIDDEN,
      editType: FormNodeEditTypes.HIDDEN
    },
    {
      name: 'testTypes',
      type: FormNodeTypes.ARRAY,
      children: [
        {
          name: '0',
          type: FormNodeTypes.GROUP,
          children: [
            {
              name: 'testResult',
              type: FormNodeTypes.CONTROL,
              label: 'Result',
              viewType: FormNodeViewTypes.HIDDEN,
              editType: FormNodeEditTypes.RADIO,
              options: [
                { value: 'pass', label: 'Pass' },
                { value: 'fail', label: 'Fail' }
              ],
              required: true
            },
            {
              name: 'reasonForAbandoning',
              type: FormNodeTypes.CONTROL,
              value: null,
              viewType: FormNodeViewTypes.HIDDEN,
              editType: FormNodeEditTypes.HIDDEN,
              required: true
            },
            {
              name: 'additionalCommentsForAbandon',
              type: FormNodeTypes.CONTROL,
              value: null,
              viewType: FormNodeViewTypes.HIDDEN,
              editType: FormNodeEditTypes.HIDDEN,
              required: true
            },
            {
              name: 'certificateNumber',
              type: FormNodeTypes.CONTROL,
              label: 'Certificate number',
              value: '',
              validators: [
                { name: ValidatorNames.Alphanumeric },
                {
                  name: ValidatorNames.RequiredIfEquals,
                  args: { sibling: 'testResult', value: 'pass' }
                }
              ],
              width: FormNodeWidth.L,
              required: true
            },
            {
              name: 'testExpiryDate',
              type: FormNodeTypes.CONTROL,
              label: 'Expiry Date',
              value: '',
              viewType: FormNodeViewTypes.DATE,
              editType: FormNodeEditTypes.DATE
            },
            {
              name: 'testTypeStartTimestamp',
              type: FormNodeTypes.CONTROL,
              label: 'Test start date and time',
              value: '',
              viewType: FormNodeViewTypes.HIDDEN,
              editType: FormNodeEditTypes.HIDDEN
            },
            {
              name: 'testTypeEndTimestamp',
              type: FormNodeTypes.CONTROL,
              label: 'Test end date and time',
              value: '',
              viewType: FormNodeViewTypes.HIDDEN,
              editType: FormNodeEditTypes.HIDDEN
            },
            {
              name: 'prohibitionIssued',
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
