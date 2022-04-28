import { FormNode, FormNodeTypes, FormNodeViewTypes } from '../../services/dynamic-form.types';

export const PsvAnnual: FormNode = {
  name: 'psvAnnualTest',
  label: 'Annual test',
  type: FormNodeTypes.ROOT,
  children: [
    {
      name: 'vehicleSection',
      label: 'Vehicle',
      type: FormNodeTypes.SECTION,
      children: [
        {
          name: 'vin',
          label: 'VIN/chassis number',
          value: '',
          children: [],
          type: FormNodeTypes.CONTROL
        },
        {
          name: 'vrm',
          label: 'VRM',
          value: '',
          children: [],
          type: FormNodeTypes.CONTROL
        },
        {
          name: 'trailerId',
          label: 'Trailer ID',
          value: '',
          children: [],
          type: FormNodeTypes.CONTROL
        },
        {
          name: 'countryOfRegistration',
          label: 'Country Of Registration',
          value: '',
          children: [],
          type: FormNodeTypes.CONTROL
        },
        {
          name: 'euVehicleCategory',
          label: 'EU Vehicle Category',
          value: '',
          children: [],
          type: FormNodeTypes.CONTROL
        },
        {
          name: 'odometerReading',
          label: 'Odometer Reading',
          value: '',
          children: [],
          type: FormNodeTypes.CONTROL
        },
        {
          name: 'odometerReadingUnits',
          label: 'Odometer Reading Units',
          value: '',
          children: [],
          type: FormNodeTypes.CONTROL
        },
        {
          name: 'preparerName',
          label: 'Preparer Name',
          value: '',
          children: [],
          type: FormNodeTypes.CONTROL
        },
        {
          name: 'preparerId',
          label: 'Preparer ID',
          value: '',
          children: [],
          type: FormNodeTypes.CONTROL
        }
      ]
    },
    {
      name: 'testSection',
      label: 'Test',
      type: FormNodeTypes.SECTION,
      children: [
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
                  label: 'Reasons for abandoning',
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
                  name: 'additionalCommentsForAbandon',
                  type: FormNodeTypes.CONTROL,
                  value: '',
                  label: 'Additional details for abandoning',
                  children: []
                },
                {
                  name: 'testAnniversaryDate',
                  type: FormNodeTypes.CONTROL,
                  value: '',
                  label: 'Anniversary date',
                  viewType: FormNodeViewTypes.DATE,
                  children: []
                },
                {
                  name: 'testTypeStartTimestamp',
                  type: FormNodeTypes.CONTROL,
                  value: '',
                  label: 'Start time',
                  viewType: FormNodeViewTypes.DATETIME,
                  children: []
                },
                {
                  name: 'testTypeEndTimestamp',
                  type: FormNodeTypes.CONTROL,
                  value: '',
                  label: 'End time',
                  viewType: FormNodeViewTypes.DATETIME,
                  children: []
                },
                {
                  name: 'prohibitionIssued',
                  type: FormNodeTypes.CONTROL,
                  value: '',
                  label: 'Prohibition issued',
                  options: [
                    { value: true, label: 'Yes' },
                    { value: false, label: 'No' }
                  ],
                  children: []
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
