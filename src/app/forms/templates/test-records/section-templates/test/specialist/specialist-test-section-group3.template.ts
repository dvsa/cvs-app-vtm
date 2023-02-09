import { AsyncValidatorNames } from '@forms/models/async-validators.enum';
import { ValidatorNames } from '@forms/models/validators.enum';
import { FormNode, FormNodeEditTypes, FormNodeTypes, FormNodeViewTypes, FormNodeWidth } from '@forms/services/dynamic-form.types';

export const SpecialistTestSectionGroup3: FormNode = {
  name: 'testSection',
  label: 'Test',
  type: FormNodeTypes.GROUP,
  children: [
    {
      name: 'createdAt',
      label: 'Created',
      disabled: true,
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.DATE,
      editType: FormNodeEditTypes.HIDDEN
    },
    {
      name: 'testStartTimestamp',
      label: 'Test Date',
      value: '',
      disabled: true,
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.DATE,
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
              name: 'testCode',
              label: 'Test Code',
              value: '',
              disabled: true,
              type: FormNodeTypes.CONTROL,
              width: FormNodeWidth.XS,
              editType: FormNodeEditTypes.HIDDEN
            },
            {
              name: 'testResult',
              label: 'Result',
              viewType: FormNodeViewTypes.HIDDEN,
              editType: FormNodeEditTypes.RADIO,
              options: [
                { value: 'pass', label: 'Pass' },
                { value: 'fail', label: 'Fail' },
                { value: 'abandoned', label: 'Abandoned' }
              ],
              validators: [
                { name: ValidatorNames.HideIfNotEqual, args: { sibling: 'reasonForAbandoning', value: 'abandoned' } },
                { name: ValidatorNames.HideIfNotEqual, args: { sibling: 'additionalCommentsForAbandon', value: 'abandoned' } }
              ],
              asyncValidators: [
                { name: AsyncValidatorNames.ResultDependantOnCustomDefects },
                {
                  name: AsyncValidatorNames.HideIfEqualsWithCondition,
                  args: {
                    sibling: 'certificateNumber',
                    value: 'fail',
                    conditions: { field: 'testTypeId', operator: 'equals', value: ['150', '151', '181', '182'] }
                  }
                }
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
              type: FormNodeTypes.CONTROL,
              editType: FormNodeEditTypes.TEXT,
              validators: [{ name: ValidatorNames.Alphanumeric }],
              viewType: FormNodeViewTypes.HIDDEN,
              width: FormNodeWidth.L,
              required: true,
              value: null
            }
          ]
        }
      ]
    }
  ]
};
