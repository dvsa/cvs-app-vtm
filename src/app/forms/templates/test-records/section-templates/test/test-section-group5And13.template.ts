import { AsyncValidatorNames } from '@forms/models/async-validators.enum';
import { ValidatorNames } from '@forms/models/validators.enum';
import { FormNode, FormNodeEditTypes, FormNodeTypes, FormNodeViewTypes, FormNodeWidth } from '@forms/services/dynamic-form.types';
import { ReferenceDataResourceType } from '@models/reference-data.model';

export const TestSectionGroup5And13: FormNode = {
  name: 'testSection',
  label: 'Test',
  type: FormNodeTypes.GROUP,
  children: [
    {
      name: 'createdAt',
      label: 'Created',
      value: '',
      disabled: true,
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.DATE,
      editType: FormNodeEditTypes.DATE,
    },
    {
      name: 'testStartTimestamp',
      label: 'Test Date',
      value: '',
      disabled: true,
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.DATE,
      editType: FormNodeEditTypes.DATE,
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
            },
            {
              name: 'testResult',
              label: 'Result',
              viewType: FormNodeViewTypes.HIDDEN,
              editType: FormNodeEditTypes.RADIO,
              options: [
                { value: 'pass', label: 'Pass' },
                { value: 'fail', label: 'Fail' },
                { value: 'prs', label: 'PRS' },
                { value: 'abandoned', label: 'Abandoned' },
              ],
              validators: [
                { name: ValidatorNames.HideIfNotEqual, args: { sibling: 'reasonForAbandoning', value: 'abandoned' } },
                { name: ValidatorNames.HideIfNotEqual, args: { sibling: 'additionalCommentsForAbandon', value: 'abandoned' } },
                { name: ValidatorNames.HideIfNotEqual, args: { sibling: 'certificateNumber', value: ['pass', 'prs', 'abandoned'] } },
                { name: ValidatorNames.HideIfNotEqual, args: { sibling: 'centralDocs', value: ['pass', 'prs'] } },
              ],
              asyncValidators: [{ name: AsyncValidatorNames.ResultDependantOnCustomDefects }],
              type: FormNodeTypes.CONTROL,
            },
            {
              name: 'centralDocs',
              type: FormNodeTypes.GROUP,
              children: [
                {
                  name: 'issueRequired',
                  type: FormNodeTypes.CONTROL,
                  label: 'Issue documents centrally',
                  editType: FormNodeEditTypes.RADIO,
                  value: false,
                  options: [
                    { value: true, label: 'Yes' },
                    { value: false, label: 'No' },
                  ],
                  validators: [{ name: ValidatorNames.HideIfParentSiblingEqual, args: { sibling: 'certificateNumber', value: true } }],
                },
                {
                  name: 'reasonsForIssue',
                  type: FormNodeTypes.CONTROL,
                  viewType: FormNodeViewTypes.HIDDEN,
                  editType: FormNodeEditTypes.HIDDEN,
                  value: [],
                },
              ],
            },
            {
              name: 'testTypeName',
              label: 'Description',
              value: '',
              disabled: true,
              type: FormNodeTypes.CONTROL,
            },
            {
              name: 'certificateNumber',
              label: 'Certificate number',
              disabled: true,
              type: FormNodeTypes.CONTROL,
              viewType: FormNodeViewTypes.HIDDEN,
              editType: FormNodeEditTypes.HIDDEN,
              validators: [
                // Make required if test result is pass/prs, but issue documents centrally is false
                { name: ValidatorNames.IssueRequired },
              ],
              value: null,
            },
            {
              name: 'testNumber',
              label: 'Test Number',
              value: '',
              disabled: true,
              type: FormNodeTypes.CONTROL,
            },
            {
              name: 'reasonForAbandoning',
              type: FormNodeTypes.CONTROL,
              label: 'Reason for abandoning',
              editType: FormNodeEditTypes.CHECKBOXGROUP,
              delimited: { regex: '\\. (?<!\\..\\. )', separator: '. ' },
              required: true,
              validators: [
                {
                  name: ValidatorNames.RequiredIfEquals,
                  args: { sibling: 'testResult', value: ['abandoned'] },
                },
              ],
              referenceData: ReferenceDataResourceType.TirReasonsForAbandoning,
            },
            {
              name: 'additionalCommentsForAbandon',
              type: FormNodeTypes.CONTROL,
              value: '',
              required: true,
              label: 'Additional details for abandoning',
              editType: FormNodeEditTypes.TEXTAREA,
              validators: [
                {
                  name: ValidatorNames.RequiredIfEquals,
                  args: { sibling: 'testResult', value: ['abandoned'] },
                },
                { name: ValidatorNames.MaxLength, args: 500 },
              ],
            },
            {
              name: 'testTypeStartTimestamp',
              type: FormNodeTypes.CONTROL,
              value: '',
              disabled: true,
              label: 'Start time',
              viewType: FormNodeViewTypes.TIME,
            },
            {
              name: 'testTypeEndTimestamp',
              type: FormNodeTypes.CONTROL,
              value: '',
              disabled: true,
              label: 'End time',
              viewType: FormNodeViewTypes.TIME,
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
