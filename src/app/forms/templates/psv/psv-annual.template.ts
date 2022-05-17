import { FormNode, FormNodeTypes, FormNodeViewTypes } from '../../services/dynamic-form.types';

export const PsvAnnual: FormNode = {
  name: 'psvAnnualTest',
  label: 'Annual test',
  type: FormNodeTypes.GROUP,
  children: [
    {
      name: 'vehicleSection',
      label: 'Vehicle',
      type: FormNodeTypes.SECTION
    },
    {
      name: 'vin',
      label: 'VIN/chassis number',
      value: '',

      type: FormNodeTypes.CONTROL
    },
    {
      name: 'vrm',
      label: 'VRM',
      value: '',

      type: FormNodeTypes.CONTROL
    },
    {
      name: 'trailerId',
      label: 'Trailer ID',
      value: '',

      type: FormNodeTypes.CONTROL
    },
    {
      name: 'countryOfRegistration',
      label: 'Country Of Registration',
      value: '',

      type: FormNodeTypes.CONTROL
    },
    {
      name: 'euVehicleCategory',
      label: 'EU Vehicle Category',
      value: '',

      type: FormNodeTypes.CONTROL
    },
    {
      name: 'odometerCombination',
      label: 'Odometer',
      type: FormNodeTypes.COMBINATION,
      options: {
        leftComponentName: 'odometerReading',
        rightComponentName: 'odometerReadingUnits',
        separator: ' '
      }
    },
    {
      name: 'odometerReading',
      label: 'Odometer Reading',
      value: '',

      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.HIDDEN
    },
    {
      name: 'odometerReadingUnits',
      label: 'Odometer Reading Units',
      value: '',

      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.HIDDEN
    },
    {
      name: 'preparerCombination',
      label: 'Preparer',
      type: FormNodeTypes.COMBINATION,
      options: {
        leftComponentName: 'preparerName',
        rightComponentName: 'preparerId',
        separator: ' - '
      }
    },
    {
      name: 'preparerName',
      label: 'Preparer Name',
      value: '',

      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.HIDDEN
    },
    {
      name: 'preparerId',
      label: 'Preparer ID',
      value: '',

      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.HIDDEN
    },
    {
      name: 'testSection',
      label: 'Test',
      type: FormNodeTypes.SECTION
    },
    {
      name: 'createdAt',
      label: 'Created',
      value: '',

      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.DATE
    },
    {
      name: 'testStartTimestamp',
      label: 'Test Date',
      value: '',

      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.DATE
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

              type: FormNodeTypes.CONTROL
            },
            {
              name: 'testResult',
              label: 'Result',
              value: '',

              type: FormNodeTypes.CONTROL
            },
            {
              name: 'testTypeName',
              label: 'Description',
              value: '',

              type: FormNodeTypes.CONTROL
            },
            {
              name: 'certificateNumber',
              label: 'Certificate number',
              value: '',

              type: FormNodeTypes.CONTROL
            },
            {
              name: 'testNumber',
              label: 'Test Number',
              value: '',

              type: FormNodeTypes.CONTROL
            },
            {
              name: 'testExpiryDate',
              label: 'Expiry Date',
              value: '',

              type: FormNodeTypes.CONTROL,
              viewType: FormNodeViewTypes.DATE
            },
            {
              name: 'reasonForAbandoning',
              type: FormNodeTypes.CONTROL,
              label: 'Reason for abandoning',
              value: ''
            },
            {
              name: 'additionalCommentsForAbandon',
              type: FormNodeTypes.CONTROL,
              value: '',
              label: 'Additional details for abandoning'
            },
            {
              name: 'testAnniversaryDate',
              type: FormNodeTypes.CONTROL,
              value: '',
              label: 'Anniversary date',
              viewType: FormNodeViewTypes.DATE
            },
            {
              name: 'testTypeStartTimestamp',
              type: FormNodeTypes.CONTROL,
              value: '',
              label: 'Start time',
              viewType: FormNodeViewTypes.TIME
            },
            {
              name: 'testTypeEndTimestamp',
              type: FormNodeTypes.CONTROL,
              value: '',
              label: 'End time',
              viewType: FormNodeViewTypes.TIME
            },
            {
              name: 'prohibitionIssued',
              type: FormNodeTypes.CONTROL,
              value: '',
              label: 'Prohibition issued',
              options: [
                { value: true, label: 'Yes' },
                { value: false, label: 'No' }
              ]
            },
            {
              name: 'seatbeltSection',
              label: 'Seatbelts',
              type: FormNodeTypes.SECTION
            },
            {
              name: 'seatbeltInstallationCheckDate',
              label: 'Carried out during test',
              value: '',

              type: FormNodeTypes.CONTROL
            },
            {
              name: 'numberOfSeatbeltsFitted',
              label: 'Number of seatbelts fitted',
              value: '',

              type: FormNodeTypes.CONTROL
            },
            {
              name: 'lastSeatbeltInstallationCheckDate',
              label: 'Most recent installation check',
              value: '',

              type: FormNodeTypes.CONTROL,
              viewType: FormNodeViewTypes.DATE
            },
            {
              name: 'emissionsSection',
              label: 'Emissions',
              type: FormNodeTypes.SECTION
            },
            {
              name: 'emissionStandard',
              label: 'Emissions standard',
              type: FormNodeTypes.CONTROL
            },
            {
              name: 'smokeTestKLimitApplied',
              label: 'Smoke test K limit applied',
              type: FormNodeTypes.CONTROL
            },
            {
              name: 'fuelType',
              label: 'Fuel type',
              type: FormNodeTypes.CONTROL
            },
            {
              name: 'modType',
              label: 'Modification Type',
              type: FormNodeTypes.GROUP,
              children: [
                {
                  name: 'code',
                  label: 'Modification code',
                  type: FormNodeTypes.CONTROL
                },
                {
                  name: 'description',
                  label: 'Modification description',
                  type: FormNodeTypes.CONTROL
                }
              ]
            },
            {
              name: 'modificationTypeUsed',
              label: 'Modification type used',
              type: FormNodeTypes.CONTROL
            },
            {
              name: 'particulateTrapFitted',
              label: 'Particulate trap fitted',
              type: FormNodeTypes.CONTROL
            },
            {
              name: 'particulateTrapSerialNumber',
              label: 'Particulate trap serial number',
              type: FormNodeTypes.CONTROL
            }
          ]
        }
      ]
    }
  ]
};
