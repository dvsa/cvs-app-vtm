import { FormNode, FormNodeTypes, FormNodeViewTypes } from '../../services/dynamic-form.service';

export const PsvAnnual: FormNode = {
  name: 'testDetails',
  label: 'Test Details',
  type: FormNodeTypes.GROUP,
  children: [
    {
      name: 'vrm',
      label: 'VRM',
      value: '',
      children: [],
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.STRING
    },
    {
      name: 'vin',
      label: 'VIN/chassis number',
      value: '',
      children: [],
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.STRING
    },
    {
      name: 'createdAt',
      label: 'Created',
      value: '',
      children: [],
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.DATE
    },
    {
      name: 'testStatus',
      label: 'Test status',
      value: '',
      children: [],
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.STRING
    },
    {
      name: 'testStartTimestamp',
      label: 'Test Date',
      value: '',
      children: [],
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.DATETIME
    },
    {
      name: 'testTypes',
      label: 'Test Types',
      type: FormNodeTypes.GROUP,
      path: 'testTypes',
      children: [
        {
          name: 'testCode',
          label: 'Test Code',
          value: '',
          children: [],
          type: FormNodeTypes.CONTROL,
          viewType: FormNodeViewTypes.STRING
        },
        {
          name: 'testTypeName',
          label: 'Description',
          value: '',
          children: [],
          type: FormNodeTypes.CONTROL,
          viewType: FormNodeViewTypes.STRING
        },
        {
          name: 'certificateNumber',
          label: 'Certificate number',
          value: '',
          children: [],
          type: FormNodeTypes.CONTROL,
          viewType: FormNodeViewTypes.STRING
        },
        {
          name: 'testNumber',
          label: 'Test Number',
          value: '',
          children: [],
          type: FormNodeTypes.CONTROL,
          viewType: FormNodeViewTypes.STRING
        },
        {
          name: 'testExpiryDate',
          label: 'Expiry Date',
          value: '',
          children: [],
          type: FormNodeTypes.CONTROL,
          viewType: FormNodeViewTypes.DATE
        }
      ]
    }
  ]
};
