import { ContingencyAdrGenerateCertComponent } from '@forms/components/contingency-adr-generate-cert/contingency-adr-generate-cert.component';
import { AsyncValidatorNames } from '@forms/models/async-validators.enum';
import { ValidatorNames } from '@forms/models/validators.enum';
import { FormNode, FormNodeEditTypes, FormNodeTypes, FormNodeViewTypes, FormNodeWidth } from '@forms/services/dynamic-form.types';

export const ContingencyTestSectionGroup7: FormNode = {
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
              ],
              validators: [
                { name: ValidatorNames.HideIfNotEqual, args: { sibling: 'certificateNumber', value: 'pass' } },
                { name: ValidatorNames.HideIfNotEqual, args: { sibling: 'generateCert', value: 'pass' } },
                { name: ValidatorNames.HideIfNotEqual, args: { sibling: 'testExpiryDate', value: 'pass' } },
                { name: ValidatorNames.HideIfNotEqual, args: { sibling: 'issueDocumentsCentrally', value: 'pass' } },
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
              validators: [
                { name: ValidatorNames.HideIfNotEqual, args: { sibling: 'certificateNumber', value: false } },
                { name: ValidatorNames.PatchSiblingWhenEqualTo, args: { sibling: 'certificateNumber', value: true, siblingValue: '000000' } },
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
              name: 'generateCert',
              type: FormNodeTypes.CONTROL,
              viewType: FormNodeViewTypes.HIDDEN,
              editType: FormNodeEditTypes.CUSTOM,
              editComponent: ContingencyAdrGenerateCertComponent,
              validators: [
                {
                  name: ValidatorNames.ShowGroupsWhenEqualTo,
                  args: { sibling: 'testResult', value: ['pass'] },
                },
              ],
            },
            {
              name: 'certificateNumber',
              label: 'Certificate number',
              type: FormNodeTypes.CONTROL,
              validators: [
                { name: ValidatorNames.Alphanumeric },
                {
                  name: ValidatorNames.RequiredIfEquals,
                  args: { sibling: 'testResult', value: ['pass'] },
                },
              ],
              required: true,
              value: null,
            },
            {
              name: 'testExpiryDate',
              label: 'Expiry Date',
              value: '',
              type: FormNodeTypes.CONTROL,
              viewType: FormNodeViewTypes.TIME,
              editType: FormNodeEditTypes.DATE,
              validators: [
                {
                  name: ValidatorNames.RequiredIfEquals,
                  args: { sibling: 'testResult', value: ['pass'] },
                },
                { name: ValidatorNames.FutureDate },
              ],
            },
            {
              name: 'testTypeStartTimestamp',
              type: FormNodeTypes.CONTROL,
              value: '',
              label: 'Test start date and time',
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
              label: 'Test end date and time',
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
