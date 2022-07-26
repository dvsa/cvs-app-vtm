import { ValidatorNames } from '@forms/models/validators.enum';
import { FormNode, FormNodeEditTypes, FormNodeTypes, FormNodeViewTypes } from '@forms/services/dynamic-form.types';

export const DefectsTpl: FormNode = {
  name: 'defects',
  label: 'Defects',
  type: FormNodeTypes.GROUP,
  viewType: FormNodeViewTypes.SUBHEADING,
  children: [
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
              name: 'defects',
              type: FormNodeTypes.ARRAY,
              children: [
                {
                  name: '0',
                  type: FormNodeTypes.GROUP,
                  children: [
                    {
                      name: 'deficiencyRef',
                      label: 'Deficiency ref',
                      type: FormNodeTypes.CONTROL,
                      disabled: true
                    },
                    {
                      name: 'deficiencyCategory',
                      label: 'Deficiency category',
                      type: FormNodeTypes.CONTROL,
                      disabled: true
                    },
                    {
                      name: 'imNumber',
                      label: 'IM number',
                      type: FormNodeTypes.CONTROL,
                      disabled: true
                    },
                    {
                      name: 'imDescription',
                      label: 'IM description',
                      type: FormNodeTypes.CONTROL,
                      disabled: true
                    },
                    {
                      name: 'itemNumber',
                      label: 'Item No.',
                      type: FormNodeTypes.CONTROL,
                      disabled: true
                    },
                    {
                      name: 'itemDescription',
                      label: 'Item description',
                      type: FormNodeTypes.CONTROL,
                      disabled: true
                    },
                    {
                      name: 'deficiencyId',
                      label: 'Deficiency ID',
                      type: FormNodeTypes.CONTROL,
                      disabled: true
                    },
                    {
                      name: 'deficiencySubId',
                      label: 'Deficiency sub ID',
                      type: FormNodeTypes.CONTROL,
                      disabled: true
                    },
                    {
                      name: 'deficiencyText',
                      label: 'Deficiency text',
                      type: FormNodeTypes.CONTROL,
                      disabled: true
                    },
                    {
                      name: 'additionalInformation',
                      label: 'Additional details',
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
                              type: FormNodeTypes.CONTROL,
                              disabled: false
                            },
                            {
                              name: 'horizontal',
                              label: 'Horizontal',
                              type: FormNodeTypes.CONTROL,
                              disabled: false
                            },
                            {
                              name: 'lateral',
                              label: 'Lateral',
                              type: FormNodeTypes.CONTROL,
                              disabled: false
                            },
                            {
                              name: 'longitudinal',
                              label: 'Longitudinal',
                              type: FormNodeTypes.CONTROL,
                              disabled: false
                            },
                            {
                              name: 'rowNumber',
                              label: 'Row number',
                              type: FormNodeTypes.CONTROL,
                              disabled: false
                            },
                            {
                              name: 'seatNumber',
                              label: 'Seat number',
                              type: FormNodeTypes.CONTROL,
                              disabled: false
                            },
                            {
                              name: 'axleNumber',
                              label: 'Axle number',
                              type: FormNodeTypes.CONTROL,
                              disabled: false
                            }
                          ]
                        },
                        {
                          name: 'notes',
                          label: 'Notes',
                          type: FormNodeTypes.CONTROL,
                          validators: [{ name: ValidatorNames.validateDefectNotes }],
                          disabled: false
                        }
                      ]
                    },
                    {
                      name: 'prs',
                      label: 'PRS',
                      type: FormNodeTypes.CONTROL,
                      disabled: true
                    },
                    {
                      name: 'prohibitionIssued',
                      label: 'Prohibition issued',
                      type: FormNodeTypes.CONTROL,
                      editType: FormNodeEditTypes.RADIO,
                      options: [
                        { value: true, label: 'Yes' },
                        { value: false, label: 'No' }
                      ],
                      validators: [
                        {
                          name: ValidatorNames.RequiredIfEquals,
                          args: { sibling: 'deficiencyCategory', value: ['dangerous', 'dangerous*', 'dangerous#'] }
                        }
                      ],
                      disabled: false
                    },
                    {
                      name: 'stdForProhibition',
                      label: 'STD for prohibition',
                      type: FormNodeTypes.CONTROL,
                      disabled: true
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
