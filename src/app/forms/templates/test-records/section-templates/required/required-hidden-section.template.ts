import { FormNode, FormNodeTypes, FormNodeViewTypes } from '@forms/services/dynamic-form.types';

export const RequiredSection: FormNode = {
  name: 'requiredSection',
  type: FormNodeTypes.GROUP,
  children: [
    {
      name: 'testResultId',
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.HIDDEN
    },
    {
      name: 'vehicleType',
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.HIDDEN
    },
    {
      name: 'testStatus',
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.HIDDEN
    },
    {
      name: 'systemNumber',
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.HIDDEN
    },
    {
      name: 'testerStaffId',
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.HIDDEN
    },
    {
      name: 'testEndTimestamp',
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.HIDDEN
    },
    {
      name: 'vehicleClass',
      type: FormNodeTypes.GROUP,
      viewType: FormNodeViewTypes.HIDDEN,
      children: [
        {
          name: 'code',
          type: FormNodeTypes.CONTROL,
          viewType: FormNodeViewTypes.HIDDEN
        },
        {
          name: 'description',
          type: FormNodeTypes.CONTROL,
          viewType: FormNodeViewTypes.HIDDEN
        }
      ]
    },
    {
      name: 'vehicleType',
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.HIDDEN
    },
    {
      name: 'noOfAxles',
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.HIDDEN
    },
    {
      name: 'numberOfWheelsDriven',
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.HIDDEN
    },
    {
      name: 'regnDate',
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.HIDDEN
    },
    {
      name: 'firstUseDate',
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.HIDDEN
    },
    {
      name: 'reasonForCreation',
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.HIDDEN
    },
    {
      name: 'createdByName',
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.HIDDEN
    },
    {
      name: 'createdById',
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.HIDDEN
    },
    {
      name: 'lastUpdatedAt',
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.HIDDEN
    },
    {
      name: 'lastUpdatedByName',

      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.HIDDEN
    },
    {
      name: 'lastUpdatedById',

      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.HIDDEN
    },
    {
      name: 'shouldEmailCertificate',
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.HIDDEN
    },
    {
      name: 'numberOfSeats',
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.HIDDEN
    },
    {
      name: 'vehicleConfiguration',
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.HIDDEN
    },
    {
      name: 'vehicleSize',
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.HIDDEN
    },
    {
      name: 'reasonForCancellation',
      type: FormNodeTypes.CONTROL,
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
              viewType: FormNodeViewTypes.HIDDEN
            },
            {
              name: 'name',
              type: FormNodeTypes.CONTROL,
              viewType: FormNodeViewTypes.HIDDEN
            },

            {
              name: 'secondaryCertificateNumber',
              type: FormNodeTypes.CONTROL,
              viewType: FormNodeViewTypes.HIDDEN
            },
            {
              name: 'customDefects',
              type: FormNodeTypes.ARRAY,
              viewType: FormNodeViewTypes.HIDDEN,
              children: [
                {
                  name: '0',
                  type: FormNodeTypes.GROUP,
                  children: [
                    {
                      name: 'referenceNumber',
                      type: FormNodeTypes.CONTROL,
                      viewType: FormNodeViewTypes.HIDDEN
                    },
                    {
                      name: 'defectName',
                      type: FormNodeTypes.CONTROL,
                      viewType: FormNodeViewTypes.HIDDEN
                    },
                    {
                      name: 'defectNotes',
                      type: FormNodeTypes.CONTROL,
                      viewType: FormNodeViewTypes.HIDDEN
                    }
                  ]
                }
              ]
            },
            {
              name: 'createdAt',
              type: FormNodeTypes.CONTROL,
              viewType: FormNodeViewTypes.HIDDEN
            },
            {
              name: 'lastUpdatedAt',
              type: FormNodeTypes.CONTROL,
              viewType: FormNodeViewTypes.HIDDEN
            },
            {
              name: 'certificateLink',

              type: FormNodeTypes.CONTROL,
              viewType: FormNodeViewTypes.HIDDEN
            },
            {
              name: 'testTypeClassification',
              type: FormNodeTypes.CONTROL,
              viewType: FormNodeViewTypes.HIDDEN
            },
            {
              name: 'deletionFlag',
              type: FormNodeTypes.CONTROL,
              viewType: FormNodeViewTypes.HIDDEN
            }
          ]
        }
      ]
    }
  ]
};
