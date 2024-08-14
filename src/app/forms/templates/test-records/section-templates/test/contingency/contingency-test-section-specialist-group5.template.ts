import { AsyncValidatorNames } from '@forms/models/async-validators.enum';
import { TEST_TYPES_GROUP5_SPEC_TEST } from '@forms/models/testTypeId.enum';
import { ValidatorNames } from '@forms/models/validators.enum';
import { FormNode, FormNodeEditTypes, FormNodeTypes, FormNodeViewTypes, FormNodeWidth } from '@forms/services/dynamic-form.types';

export const ContingencyTestSectionSpecialistGroup5: FormNode = {
  name: 'testSection',
  label: 'Test',
  type: FormNodeTypes.GROUP,
  children: [
    {
      name: 'contingencyTestNumber',
      label: 'Contingency Test Number',
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.NUMERICSTRING,
      validators: [{ name: ValidatorNames.MaxLength, args: 8 }, { name: ValidatorNames.MinLength, args: 6 }, { name: ValidatorNames.Required }],
      width: FormNodeWidth.L,
    },
    {
      name: 'testStartTimestamp',
      label: 'Test start date',
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.HIDDEN,
      editType: FormNodeEditTypes.HIDDEN,
      validators: [{ name: ValidatorNames.PastDate }],
    },
    {
      name: 'testEndTimestamp',
      type: FormNodeTypes.CONTROL,
      label: 'Test end date',
      viewType: FormNodeViewTypes.HIDDEN,
      editType: FormNodeEditTypes.HIDDEN,
      validators: [{ name: ValidatorNames.AheadOfDate, args: 'testStartTimestamp' }],
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
              viewType: FormNodeViewTypes.HIDDEN,
              editType: FormNodeEditTypes.RADIO,
              options: [
                { value: 'pass', label: 'Pass' },
                { value: 'fail', label: 'Fail' },
                { value: 'prs', label: 'PRS' },
              ],
              validators: [
                {
                  name: ValidatorNames.ShowGroupsWhenIncludes,
                  args: {
                    values: ['fail'],
                    groups: ['failOnly'],
                  },
                },
                {
                  name: ValidatorNames.HideGroupsWhenExcludes,
                  args: {
                    values: ['fail'],
                    groups: ['failOnly'],
                  },
                },
              ],
              asyncValidators: [
                { name: AsyncValidatorNames.ResultDependantOnRequiredStandards },
                {
                  name: AsyncValidatorNames.HideIfEqualsWithCondition,
                  args: {
                    sibling: 'certificateNumber',
                    value: 'fail',
                    conditions: { field: 'testTypeId', operator: 'equals', value: TEST_TYPES_GROUP5_SPEC_TEST },
                  },
                },
              ],
              type: FormNodeTypes.CONTROL,
            },
            {
              name: 'testTypeName',
              label: 'Description',
              value: '',
              disabled: true,

              type: FormNodeTypes.CONTROL,
            },
            {
              name: 'reasonForAbandoning',
              type: FormNodeTypes.CONTROL,
              viewType: FormNodeViewTypes.HIDDEN,
              editType: FormNodeEditTypes.HIDDEN,
              value: null,
              required: true,
            },
            {
              name: 'additionalCommentsForAbandon',
              type: FormNodeTypes.CONTROL,
              viewType: FormNodeViewTypes.HIDDEN,
              editType: FormNodeEditTypes.HIDDEN,
              value: null,
              required: true,
            },
            {
              name: 'certificateNumber',
              label: 'Certificate number',
              value: null,
              type: FormNodeTypes.CONTROL,
              required: true,
              viewType: FormNodeViewTypes.STRING,
              editType: FormNodeEditTypes.TEXT,
              validators: [
                { name: ValidatorNames.Alphanumeric },
                {
                  name: ValidatorNames.RequiredIfEquals,
                  args: {
                    sibling: 'testResult',
                    value: ['pass', 'prs'],
                  },
                },
              ],
            },
            {
              name: 'testTypeStartTimestamp',
              type: FormNodeTypes.CONTROL,
              value: '',
              label: 'Test start date and time',
              viewType: FormNodeViewTypes.DATETIME,
              editType: FormNodeEditTypes.DATETIME,
              validators: [
                { name: ValidatorNames.Required },
                { name: ValidatorNames.PastDate },
                { name: ValidatorNames.CopyValueToRootControl, args: 'testStartTimestamp' },
              ],
            },
            {
              name: 'testTypeEndTimestamp',
              type: FormNodeTypes.CONTROL,
              value: '',
              label: 'Test end date and time',
              viewType: FormNodeViewTypes.DATETIME,
              editType: FormNodeEditTypes.DATETIME,
              validators: [
                { name: ValidatorNames.Required },
                { name: ValidatorNames.PastDate },
                { name: ValidatorNames.AheadOfDate, args: 'testTypeStartTimestamp' },
                { name: ValidatorNames.CopyValueToRootControl, args: 'testEndTimestamp' },
              ],
            },
            {
              name: 'prohibitionIssued',
              type: FormNodeTypes.CONTROL,
              label: 'Prohibition issued',
              value: null,
              editType: FormNodeEditTypes.RADIO,
              options: [
                { value: true, label: 'Yes' },
                { value: false, label: 'No' },
              ],
              validators: [{ name: ValidatorNames.Required }],
            },
          ],
        },
      ],
    },
  ],
};
