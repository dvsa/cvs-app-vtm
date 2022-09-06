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
      viewType: FormNodeViewTypes.STRING,
      editType: FormNodeEditTypes.RADIO,
      options: [
        { label: 'Submitted', value: 'submitted' },
        { label: 'Cancelled', value: 'cancelled' }
      ]
    },
    {
      name: 'systemNumber',
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.HIDDEN,
      viewType: FormNodeViewTypes.HIDDEN
    },
    {
      name: 'testerStaffId',
      type: FormNodeTypes.CONTROL,
      label: 'Tester staff ID',
      viewType: FormNodeViewTypes.STRING,
      editType: FormNodeEditTypes.TEXT
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
      editType: FormNodeEditTypes.DATE,
      viewType: FormNodeViewTypes.DATE
    },
    {
      name: 'createdByName',
      type: FormNodeTypes.CONTROL,
      label: 'Created by name',
      editType: FormNodeEditTypes.TEXT,
      viewType: FormNodeViewTypes.STRING
    },
    {
      name: 'createdById',
      type: FormNodeTypes.CONTROL,
      label: 'Create by ID',
      editType: FormNodeEditTypes.TEXT,
      viewType: FormNodeViewTypes.STRING
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
      editType: FormNodeEditTypes.TEXT,
      viewType: FormNodeViewTypes.STRING
    },
    {
      name: 'lastUpdatedById',
      type: FormNodeTypes.CONTROL,
      label: 'Last updated by ID',
      editType: FormNodeEditTypes.TEXT,
      viewType: FormNodeViewTypes.STRING
    },
    {
      name: 'shouldEmailCertificate',
      type: FormNodeTypes.CONTROL,
      label: 'Should email certificate?',
      viewType: FormNodeViewTypes.STRING,
      editType: FormNodeEditTypes.RADIO,
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
      name: 'reasonForCancellation',
      type: FormNodeTypes.CONTROL,
      label: 'Reason for cancellation',
      editType: FormNodeEditTypes.TEXTAREA,
      viewType: FormNodeViewTypes.STRING
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
              editType: FormNodeEditTypes.TEXT,
              viewType: FormNodeViewTypes.STRING,
              validators: [{ name: ValidatorNames.Required }, { name: ValidatorNames.MaxLength, args: [20] }]
            },
            {
              name: 'certificateLink',
              type: FormNodeTypes.CONTROL,
              label: 'Certificate link',
              editType: FormNodeEditTypes.TEXT,
              viewType: FormNodeViewTypes.STRING
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
              ]
            }
          ]
        }
      ]
    }
  ]
};
