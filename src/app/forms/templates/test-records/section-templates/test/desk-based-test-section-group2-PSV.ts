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
      value: new Date().toISOString(),
      viewType: FormNodeViewTypes.HIDDEN,
      editType: FormNodeEditTypes.HIDDEN
    },
    {
      name: 'testEndTimestamp',
      type: FormNodeTypes.CONTROL,
      label: 'Test end date',
      value: new Date().toISOString(),
      viewType: FormNodeViewTypes.HIDDEN,
      editType: FormNodeEditTypes.HIDDEN,
      validators: [{ name: ValidatorNames.AheadOfDate, args: 'testStartTimestamp' }]
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
              name: 'testDate',
              type: FormNodeTypes.CONTROL,
              label: 'Test Date',
              value: '',
              viewType: FormNodeViewTypes.DATE,
              editType: FormNodeEditTypes.DATE
            },
            {
              name: 'testType',
              type: FormNodeTypes.CONTROL,
              label: 'Test Type',
              value: '403/404',
              editType: FormNodeEditTypes.TEXT,
              width: FormNodeWidth.L
            },
            {
              name: 'testCode',
              type: FormNodeTypes.CONTROL,
              label: 'Test Code',
              value: '',
              width: FormNodeWidth.L
            },
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
              value: '' || null,
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
              name: 'testNumber',
              type: FormNodeTypes.CONTROL,
              label: 'Test Number',
              value: '',
              width: FormNodeWidth.L
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
              value: new Date().toISOString(),
              viewType: FormNodeViewTypes.HIDDEN,
              editType: FormNodeEditTypes.HIDDEN
            },
            {
              name: 'testTypeEndTimestamp',
              type: FormNodeTypes.CONTROL,
              label: 'Test end date and time',
              value: new Date().toISOString(),
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

console.log(DeskBasedTestSectionGroup2PSV);
console.log(new Date().toISOString());
