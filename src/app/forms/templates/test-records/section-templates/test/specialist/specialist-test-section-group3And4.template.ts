import { AsyncValidatorNames } from '@forms/models/async-validators.enum';
import { ValidatorNames } from '@forms/models/validators.enum';
import { FormNode, FormNodeEditTypes, FormNodeTypes, FormNodeViewTypes, FormNodeWidth } from '@forms/services/dynamic-form.types';
import { ReferenceDataResourceType } from '@models/reference-data.model';

export const SpecialistTestSectionGroup3And4: FormNode = {
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
                { name: ValidatorNames.HideIfNotEqual, args: { sibling: 'secondaryCertificateNumber', value: ['pass', 'abandoned'] } },
                { name: ValidatorNames.HideIfNotEqual, args: { sibling: 'issueDocumentsCentrally', value: ['pass', 'prs'] } },
              ],
              asyncValidators: [{ name: AsyncValidatorNames.ResultDependantOnCustomDefects }],
              type: FormNodeTypes.CONTROL,
            },
            {
              name: 'issueDocumentsCentrally',
              type: FormNodeTypes.CONTROL,
              label: 'Issue documents centrally',
              editType: FormNodeEditTypes.RADIO,
              value: false,
              options: [
                { value: true, label: 'Yes' },
                { value: false, label: 'No' },
              ],
              validators: [{ name: ValidatorNames.HideIfNotEqual, args: { sibling: 'secondaryCertificateNumber', value: false } }],
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
              referenceData: ReferenceDataResourceType.SpecialistReasonsForAbandoning,
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
              name: 'testTypeName',
              label: 'Description',
              value: '',
              disabled: true,
              type: FormNodeTypes.CONTROL,
            },
            {
              name: 'secondaryCertificateNumber',
              label: 'Secondary certificate number',
              value: '',
              required: true,
              type: FormNodeTypes.CONTROL,
              editType: FormNodeEditTypes.TEXT,
              validators: [
                { name: ValidatorNames.Alphanumeric },
                // Make required if test result is pass/prs, but issue documents centrally is false
                { name: ValidatorNames.IssueDocumentsCentrally },
                { name: ValidatorNames.MaxLength, args: 20 },
              ],
              width: FormNodeWidth.XL,
            },
            {
              name: 'testNumber',
              label: 'Test Number',
              value: '',
              disabled: true,
              type: FormNodeTypes.CONTROL,
            },
            {
              name: 'testTypeStartTimestamp',
              type: FormNodeTypes.CONTROL,
              value: '',
              label: 'Start time',
              viewType: FormNodeViewTypes.TIME,
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
              label: 'End time',
              viewType: FormNodeViewTypes.TIME,
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
