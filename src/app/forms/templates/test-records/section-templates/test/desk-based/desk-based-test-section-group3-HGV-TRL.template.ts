import { ValidatorNames } from '@forms/models/validators.enum';
import { FormNode, FormNodeEditTypes, FormNodeTypes, FormNodeViewTypes, FormNodeWidth } from '@forms/services/dynamic-form.types';

export const DeskBasedTestSectionGroup3HgvTrl: FormNode = {
  name: 'testSection',
  label: 'Test',
  type: FormNodeTypes.GROUP,
  children: [
    {
      name: 'testStartTimestamp',
      label: 'Test start date',
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.HIDDEN,
      editType: FormNodeEditTypes.HIDDEN
    },
    {
      name: 'testEndTimestamp',
      type: FormNodeTypes.CONTROL,
      label: 'Test end date',
      viewType: FormNodeViewTypes.HIDDEN,
      editType: FormNodeEditTypes.HIDDEN
    },
    {
      name: 'createdAt',
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.HIDDEN,
      viewType: FormNodeViewTypes.HIDDEN
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
              editType: FormNodeEditTypes.HIDDEN,
              viewType: FormNodeViewTypes.HIDDEN,
              type: FormNodeTypes.CONTROL,
              value: 'pass'
            },
            {
              name: 'reasonForAbandoning',
              type: FormNodeTypes.CONTROL,
              viewType: FormNodeViewTypes.HIDDEN,
              editType: FormNodeEditTypes.HIDDEN,
              value: null,
              required: true
            },
            {
              name: 'additionalCommentsForAbandon',
              type: FormNodeTypes.CONTROL,
              viewType: FormNodeViewTypes.HIDDEN,
              editType: FormNodeEditTypes.HIDDEN,
              value: null,
              required: true
            },
            {
              name: 'certificateNumber',
              label: 'Certificate number',
              type: FormNodeTypes.CONTROL,
              viewType: FormNodeViewTypes.HIDDEN,
              editType: FormNodeEditTypes.TEXT,
              width: FormNodeWidth.L,
              validators: [{ name: ValidatorNames.Alphanumeric }],
              value: null
            },
            {
              name: 'secondaryCertificateNumber',
              label: 'Secondary Certificate number',
              type: FormNodeTypes.CONTROL,
              viewType: FormNodeViewTypes.HIDDEN,
              editType: FormNodeEditTypes.HIDDEN,
              value: null
            },
            {
              name: 'testTypeStartTimestamp',
              type: FormNodeTypes.CONTROL,
              value: null,
              label: 'Test start date and time',
              viewType: FormNodeViewTypes.HIDDEN,
              editType: FormNodeEditTypes.HIDDEN
            },
            {
              name: 'testTypeEndTimestamp',
              type: FormNodeTypes.CONTROL,
              value: null,
              label: 'Test end date and time',
              viewType: FormNodeViewTypes.HIDDEN,
              editType: FormNodeEditTypes.HIDDEN
            },
            {
              name: 'testExpiryDate',
              label: 'Expiry Date',
              value: null,
              type: FormNodeTypes.CONTROL,
              viewType: FormNodeViewTypes.HIDDEN,
              editType: FormNodeEditTypes.HIDDEN
            },
            {
              name: 'prohibitionIssued',
              label: 'Prohibition issued',
              type: FormNodeTypes.CONTROL,
              value: null,
              editType: FormNodeEditTypes.HIDDEN,
              required: true
            }
          ]
        }
      ]
    }
  ]
};
