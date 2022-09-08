import { AsyncValidatorNames } from '@forms/models/async-validators.enum';
import { ValidatorNames } from '@forms/models/validators.enum';
import { FormNode, FormNodeEditTypes, FormNodeTypes, FormNodeViewTypes } from '@forms/services/dynamic-form.types';

export const CreateRequiredSection: FormNode = {
  name: 'requiredSection',
  type: FormNodeTypes.GROUP,
  children: [
    {
      name: 'testResultId',
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.HIDDEN,
      editType: FormNodeEditTypes.HIDDEN
    },
    {
      name: 'vehicleType',
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.HIDDEN,
      viewType: FormNodeViewTypes.HIDDEN
    },
    {
      name: 'testStatus',
      type: FormNodeTypes.CONTROL,
      label: 'Test status',
      viewType: FormNodeViewTypes.HIDDEN,
      editType: FormNodeEditTypes.HIDDEN,
      options: [
        { label: 'Submitted', value: 'submitted' },
        { label: 'Cancelled', value: 'cancelled' }
      ]
    },
    {
      name: 'reasonForCancellation',
      type: FormNodeTypes.CONTROL,
      label: 'Reason for cancellation',
      editType: FormNodeEditTypes.HIDDEN,
      viewType: FormNodeViewTypes.HIDDEN
    },
    {
      name: 'systemNumber',
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.HIDDEN,
      viewType: FormNodeViewTypes.HIDDEN
    },
    {
      name: 'vehicleClass',
      type: FormNodeTypes.GROUP,
      children: [
        {
          name: 'code',
          type: FormNodeTypes.CONTROL,
          editType: FormNodeEditTypes.HIDDEN,
          viewType: FormNodeViewTypes.HIDDEN
        },
        {
          name: 'description',
          type: FormNodeTypes.CONTROL,
          editType: FormNodeEditTypes.HIDDEN,
          viewType: FormNodeViewTypes.HIDDEN
        }
      ]
    },
    {
      name: 'vehicleType',
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.HIDDEN,
      viewType: FormNodeViewTypes.HIDDEN
    },
    {
      name: 'noOfAxles',
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.HIDDEN,
      viewType: FormNodeViewTypes.HIDDEN
    },
    {
      name: 'numberOfWheelsDriven',
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.HIDDEN,
      viewType: FormNodeViewTypes.HIDDEN
    },
    {
      name: 'regnDate',
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.HIDDEN,
      viewType: FormNodeViewTypes.HIDDEN
    },
    {
      name: 'firstUseDate',
      type: FormNodeTypes.CONTROL,
      label: 'First use date',
      value: null,
      editType: FormNodeEditTypes.HIDDEN,
      viewType: FormNodeViewTypes.HIDDEN
    },
    {
      name: 'createdByName',
      type: FormNodeTypes.CONTROL,
      label: 'Created by name',
      editType: FormNodeEditTypes.HIDDEN,
      viewType: FormNodeViewTypes.HIDDEN
    },
    {
      name: 'createdById',
      type: FormNodeTypes.CONTROL,
      label: 'Create by ID',
      editType: FormNodeEditTypes.HIDDEN,
      viewType: FormNodeViewTypes.HIDDEN
    },
    {
      name: 'lastUpdatedAt',
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.HIDDEN,
      viewType: FormNodeViewTypes.HIDDEN
    },
    {
      name: 'lastUpdatedByName',
      type: FormNodeTypes.CONTROL,
      label: 'Last update by?',
      editType: FormNodeEditTypes.HIDDEN,
      viewType: FormNodeViewTypes.HIDDEN
    },
    {
      name: 'lastUpdatedById',
      type: FormNodeTypes.CONTROL,
      label: 'Last updated by ID',
      editType: FormNodeEditTypes.HIDDEN,
      viewType: FormNodeViewTypes.HIDDEN
    },
    {
      name: 'shouldEmailCertificate',
      type: FormNodeTypes.CONTROL,
      label: 'Should email certificate?',
      viewType: FormNodeViewTypes.HIDDEN,
      editType: FormNodeEditTypes.HIDDEN,
      options: [
        { label: 'Yes', value: 'yes' },
        { label: 'No', value: 'no' }
      ]
    },
    {
      name: 'numberOfSeats',
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.HIDDEN,
      viewType: FormNodeViewTypes.HIDDEN
    },
    {
      name: 'vehicleConfiguration',
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.HIDDEN,
      viewType: FormNodeViewTypes.HIDDEN
    },
    {
      name: 'vehicleSize',
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
              name: 'testTypeId',
              type: FormNodeTypes.CONTROL,
              label: 'Test Type ID',
              editType: FormNodeEditTypes.HIDDEN,
              viewType: FormNodeViewTypes.HIDDEN
            },
            {
              name: 'testTypeName',
              type: FormNodeTypes.CONTROL,
              viewType: FormNodeViewTypes.HIDDEN,
              editType: FormNodeEditTypes.HIDDEN
            },
            {
              name: 'name',
              type: FormNodeTypes.CONTROL,
              editType: FormNodeEditTypes.HIDDEN,
              viewType: FormNodeViewTypes.HIDDEN
            },
            {
              name: 'secondaryCertificateNumber',
              type: FormNodeTypes.CONTROL,
              label: 'Second ceritificate number',
              value: null,
              editType: FormNodeEditTypes.HIDDEN,
              viewType: FormNodeViewTypes.HIDDEN
            },
            {
              name: 'certificateLink',
              type: FormNodeTypes.CONTROL,
              label: 'Certificate link',
              editType: FormNodeEditTypes.HIDDEN,
              viewType: FormNodeViewTypes.HIDDEN
            },
            {
              name: 'deletionFlag',
              type: FormNodeTypes.CONTROL,
              editType: FormNodeEditTypes.HIDDEN,
              viewType: FormNodeViewTypes.HIDDEN
            },
            {
              name: 'prohibitionIssued',
              label: 'Prohibition issued',
              type: FormNodeTypes.CONTROL,
              value: null,
              editType: FormNodeEditTypes.RADIO,
              options: [
                { value: true, label: 'Yes' },
                { value: false, label: 'No' }
              ],
              asyncValidators: [{ name: AsyncValidatorNames.TestWithDefectTaxonomy }]
            }
          ]
        }
      ]
    }
  ]
};
