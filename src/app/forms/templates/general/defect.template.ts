import { FormNode, FormNodeTypes } from '@forms/services/dynamic-form.types';

export const DefectTpl: FormNode = {
  name: 'defects',
  label: 'Defects',
  type: FormNodeTypes.ARRAY,
  children: [
    {
      name: '0',
      type: FormNodeTypes.GROUP,
      children: [
        {
          name: 'deficiencyRef',
          label: 'Deficiency ref',
          type: FormNodeTypes.CONTROL
        },
        {
          name: 'deficiencyCategory',
          label: 'Deficiency category',
          type: FormNodeTypes.CONTROL
        },
        {
          name: 'imNumber',
          label: 'IM number',
          type: FormNodeTypes.CONTROL
        },
        {
          name: 'imDescription',
          label: 'IM description',
          type: FormNodeTypes.CONTROL
        },
        {
          name: 'itemNumber',
          label: 'Item No.',
          type: FormNodeTypes.CONTROL
        },
        {
          name: 'itemDescription',
          label: 'Item description',
          type: FormNodeTypes.CONTROL
        },
        {
          name: 'deficiencyId',
          label: 'Deficiency ID',
          type: FormNodeTypes.CONTROL
        },
        {
          name: 'deficiencySubId',
          label: 'Deficiency sub ID',
          type: FormNodeTypes.CONTROL
        },
        {
          name: 'deficiencyText',
          label: 'Deficiency text',
          type: FormNodeTypes.CONTROL
        },
        {
          name: 'additionalInformation',
          label: 'Additional deatils',
          type: FormNodeTypes.GROUP,
          children: [
            {
              name: 'location',
              label: 'Location',
              type: FormNodeTypes.GROUP,
              children: [
                {
                  name: 'vertical',
                  label: 'Vertical',
                  type: FormNodeTypes.CONTROL
                },
                {
                  name: 'horizontal',
                  label: 'Horizontal',
                  type: FormNodeTypes.CONTROL
                },
                {
                  name: 'lateral',
                  label: 'Lateral',
                  type: FormNodeTypes.CONTROL
                },
                {
                  name: 'longitudinal',
                  label: 'Longitudinal',
                  type: FormNodeTypes.CONTROL
                },
                {
                  name: 'rowNumber',
                  label: 'Row number',
                  type: FormNodeTypes.CONTROL
                },
                {
                  name: 'seatNumber',
                  label: 'Seat number',
                  type: FormNodeTypes.CONTROL
                },
                {
                  name: 'axleNumber',
                  label: 'Axle number',
                  type: FormNodeTypes.CONTROL
                }
              ]
            },
            {
              name: 'notes',
              label: 'Notes',
              type: FormNodeTypes.CONTROL
            }
          ]
        },
        {
          name: 'prs',
          label: 'PRS',
          type: FormNodeTypes.CONTROL
        },
        {
          name: 'prohibitionIssued',
          label: 'Prohibition issued',
          type: FormNodeTypes.CONTROL
        }
      ]
    }
  ]
};
