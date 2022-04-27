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
      type: FormNodeTypes.CONTROL
    },
    {
      name: 'vin',
      label: 'VIN/chassis number',
      value: '',
      children: [],
      type: FormNodeTypes.CONTROL
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
      name: 'testResult',
      label: 'Test status',
      value: '',
      children: [],
      type: FormNodeTypes.CONTROL
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
      type: FormNodeTypes.ARRAY,
      children: [
        {
          name: 'test0',
          type: FormNodeTypes.GROUP,
          children: [
            {
              name: 'testCode',
              label: 'Test Code',
              value: '',
              children: [],
              type: FormNodeTypes.CONTROL
            },
            {
              name: 'testTypeName',
              label: 'Description',
              value: '',
              children: [],
              type: FormNodeTypes.CONTROL
            },
            {
              name: 'certificateNumber',
              label: 'Certificate number',
              value: '',
              children: [],
              type: FormNodeTypes.CONTROL
            },
            {
              name: 'testNumber',
              label: 'Test Number',
              value: '',
              children: [],
              type: FormNodeTypes.CONTROL
            },
            {
              name: 'testExpiryDate',
              label: 'Expiry Date',
              value: '',
              children: [],
              type: FormNodeTypes.CONTROL,
              viewType: FormNodeViewTypes.DATE
            },
            {
              name: 'reasonForAbandoning',
              type: FormNodeTypes.ARRAY,
              label: 'Reason for abandoning',
              children: [
                {
                  name: '0',
                  type: FormNodeTypes.CONTROL,
                  label: 'Reason for abandoning',
                  value: '',
                  children: []
                },
                {
                  name: '0',
                  type: FormNodeTypes.CONTROL,
                  label: 'Reason for abandoning',
                  value: '',
                  children: []
                }
              ]
            },
            {
              name: 'additionalDetailsForAbandoning',
              type: FormNodeTypes.CONTROL,
              value: '',
              label: 'Additional details for abandoning',
              children: []
            }
          ]
        }
      ]
    }
  ]
};
