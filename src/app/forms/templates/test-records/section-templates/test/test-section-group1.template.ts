import { ValidatorNames } from '@forms/models/validators.enum';
import { FormNode, FormNodeEditTypes, FormNodeTypes, FormNodeViewTypes } from '@forms/services/dynamic-form.types';

export const TestSectionGroup1: FormNode = {
  name: 'testSection',
  label: 'Test',
  type: FormNodeTypes.GROUP,
  viewType: FormNodeViewTypes.SUBHEADING,
  children: [
    {
      name: 'createdAt',
      label: 'Created',
      disabled: true,

      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.DATE,
      editType: FormNodeEditTypes.DATE
    },

    {
      name: 'testStartTimestamp',
      label: 'Test Date',
      value: '',
      disabled: true,

      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.DATE,
      editType: FormNodeEditTypes.DATE
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
              name: 'testCode',
              label: 'Test Code',
              value: '',
              disabled: true,
              type: FormNodeTypes.CONTROL
            },
            {
              name: 'testResult',
              label: 'Result',
              value: '',
              validators: [
                { name: ValidatorNames.enableIfEquals, args: { sibling: 'reasonForAbandoning', value: 'abandoned' } },
                { name: ValidatorNames.enableIfEquals, args: { sibling: 'additionalCommentsForAbandon', value: 'abandoned' } },
                { name: ValidatorNames.disableIfEquals, args: { sibling: 'testResult', value: ['pass', 'fail', 'prs', 'abandoned'] } }
              ],
              type: FormNodeTypes.CONTROL
            },
            {
              name: 'testTypeName',
              label: 'Description',
              value: '',
              disabled: true,
              type: FormNodeTypes.CONTROL
            },
            {
              name: 'certificateNumber',
              label: 'Certificate number',
              value: '',
              disabled: true,
              type: FormNodeTypes.CONTROL
            },
            {
              name: 'testNumber',
              label: 'Test Number',
              value: '',
              disabled: true,
              type: FormNodeTypes.CONTROL
            },
            {
              name: 'testExpiryDate',
              label: 'Expiry Date',
              value: '',
              disabled: true,
              type: FormNodeTypes.CONTROL,
              viewType: FormNodeViewTypes.DATE,
              editType: FormNodeEditTypes.DATE
            },
            {
              name: 'reasonForAbandoning',
              type: FormNodeTypes.CONTROL,
              label: 'Reason for abandoning',
              disabled: true,
              value: ''
            },
            {
              name: 'additionalCommentsForAbandon',
              type: FormNodeTypes.CONTROL,
              value: '',
              label: 'Additional details for abandoning',
              disabled: true
            },
            {
              name: 'testAnniversaryDate',
              type: FormNodeTypes.CONTROL,
              value: null,
              disabled: true,
              label: 'Anniversary date',
              viewType: FormNodeViewTypes.DATE,
              editType: FormNodeEditTypes.DATE
            },
            {
              name: 'testTypeStartTimestamp',
              type: FormNodeTypes.CONTROL,
              value: '',
              disabled: true,
              label: 'Start time',
              viewType: FormNodeViewTypes.TIME
            },
            {
              name: 'testTypeEndTimestamp',
              type: FormNodeTypes.CONTROL,
              value: '',
              disabled: true,
              label: 'End time',
              viewType: FormNodeViewTypes.TIME
            }
          ]
        }
      ]
    }
  ]
};
