import { ValidatorNames } from '@forms/models/validators.enum';
import { FormNode, FormNodeEditTypes, FormNodeTypes, FormNodeViewTypes, FormNodeWidth } from '@forms/services/dynamic-form.types';

export const DeskBasedTestSectionGroup2PSV: FormNode = {
  name: 'testSection',
  label: 'Test',
  type: FormNodeTypes.GROUP,
  children: [
    {
      name: 'testTypes',
      type: FormNodeTypes.ARRAY,
      children: [
        {
          name: '0',
          type: FormNodeTypes.GROUP,
          children: [
            {
              name: 'testType',
              label: 'Test Type',
              value: '403/404',
              type: FormNodeTypes.CONTROL,
              width: FormNodeWidth.M
            },
            {
              name: 'testCode',
              label: 'Test Code',
              value: '',
              type: FormNodeTypes.CONTROL,
              width: FormNodeWidth.L
            },
            {
              name: 'testResult',
              label: 'Result',
              value: '',
              type: FormNodeTypes.CONTROL,
              width: FormNodeWidth.L,
              editType: FormNodeEditTypes.RADIO,
              options: [
                { label: 'Pass', value: 'pass' },
                { label: 'Fail', value: 'fail' }
              ],
              required: true
            },
            {
              name: 'reasonForAbandoning',
              type: FormNodeTypes.CONTROL,
              value: null,
              editType: FormNodeEditTypes.HIDDEN,
              viewType: FormNodeViewTypes.HIDDEN
            },
            {
              name: 'additionalCommentsForAbandon',
              type: FormNodeTypes.CONTROL,
              value: null,
              editType: FormNodeEditTypes.HIDDEN,
              viewType: FormNodeViewTypes.HIDDEN
            },
            {
              name: 'certificateNumber',
              label: 'Certificate number',
              type: FormNodeTypes.CONTROL,
              width: FormNodeWidth.L,
              value: '' || null,
              validators: [
                { name: ValidatorNames.Alphanumeric },
                {
                  name: ValidatorNames.RequiredIfEquals,
                  args: { sibling: 'testResult', value: 'pass' }
                }
              ],
              required: true
            },
            {
              name: 'testNumber',
              label: 'Test Number',
              type: FormNodeTypes.CONTROL,
              width: FormNodeWidth.L,
              value: ''
            },
            {
              name: 'testExpiryDate',
              label: 'Expiry Date',
              value: '',
              type: FormNodeTypes.CONTROL,
              viewType: FormNodeViewTypes.DATE,
              editType: FormNodeEditTypes.DATE
            },
            {
              name: 'testTypeStartTimestamp',
              type: FormNodeTypes.CONTROL,
              value: null,
              editType: FormNodeEditTypes.HIDDEN,
              viewType: FormNodeViewTypes.HIDDEN
            },

            {
              name: 'testTypeEndTimestamp',
              type: FormNodeTypes.CONTROL,
              value: null,
              editType: FormNodeEditTypes.HIDDEN,
              viewType: FormNodeViewTypes.HIDDEN
            },
            {
              name: 'prohibitionIssued',
              type: FormNodeTypes.CONTROL,
              value: null,
              editType: FormNodeEditTypes.HIDDEN,
              viewType: FormNodeViewTypes.HIDDEN
            }
          ]
        }
      ]
    },
    {
      name: 'testStartTimestamp',
      label: 'Test Date',
      value: '',
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.DATE,
      viewType: FormNodeViewTypes.DATE,
      isoDate: false
    },
    {
      name: 'testEndTimestamp',
      type: FormNodeTypes.CONTROL,
      value: '',
      editType: FormNodeEditTypes.HIDDEN,
      viewType: FormNodeViewTypes.HIDDEN
    }
  ]
};
