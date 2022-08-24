import { AsyncValidatorNames } from '@forms/models/async-validators.enum';
import { ValidatorNames } from '@forms/models/validators.enum';
import { FormNode, FormNodeEditTypes, FormNodeTypes, FormNodeViewTypes } from '@forms/services/dynamic-form.types';
import { TestAbandonmentReasonsPsvData } from '../../test-abandonment-reasons';

export const TestSectionGroup15And16: FormNode = {
  name: 'testSection',
  label: 'Test',
  type: FormNodeTypes.GROUP,
  viewType: FormNodeViewTypes.SUBHEADING,
  children: [
    {
      name: 'createdAt',
      label: 'Created',
      value: '',
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
              editType: FormNodeEditTypes.RADIO,
              options: [
                { value: 'fail', label: 'Fail' },
                { value: 'pass', label: 'Pass' },
                { value: 'prs', label: 'PRS' },
                { value: 'abandoned', label: 'Abandoned' }
              ],
              validators: [
                { name: ValidatorNames.HideIfNotEqual, args: { sibling: 'reasonForAbandoning', value: 'abandoned' } },
                { name: ValidatorNames.HideIfNotEqual, args: { sibling: 'additionalCommentsForAbandon', value: 'abandoned' } }
              ],
              asyncValidators: [{ name: AsyncValidatorNames.ResultDependantOnCustomDefects }],
              type: FormNodeTypes.CONTROL
            },
            {
              name: 'reasonForAbandoning',
              type: FormNodeTypes.CONTROL,
              label: 'Reason for abandoning',
              editType: FormNodeEditTypes.CHECKBOX,
              delimited: { regex: '\\. (?<!\\..\\. )', separator: '. ' },
              required: true,
              validators: [
                {
                  name: ValidatorNames.RequiredIfEquals,
                  args: { sibling: 'testResult', value: 'abandoned' }
                }
              ],
              options: TestAbandonmentReasonsPsvData
            },
            {
              name: 'additionalCommentsForAbandon',
              type: FormNodeTypes.CONTROL,
              value: '',
              label: 'Additional details for abandoning',
              editType: FormNodeEditTypes.TEXTAREA,
              required: true,
              validators: [
                {
                  name: ValidatorNames.RequiredIfEquals,
                  args: { sibling: 'testResult', value: 'abandoned' }
                },
                { name: ValidatorNames.MaxLength, args: { length: 500 } }
              ]
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
            },
            {
              name: 'prohibitionIssued',
              type: FormNodeTypes.CONTROL,
              label: 'Prohibition issued',
              editType: FormNodeEditTypes.RADIO,
              options: [
                { value: true, label: 'Yes' },
                { value: false, label: 'No' }
              ],
              validators: [{ name: ValidatorNames.Required }]
            }
          ]
        }
      ]
    }
  ]
};
