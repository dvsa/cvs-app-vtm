import { ValidatorNames } from '@forms/models/validators.enum';
import { FormNode, FormNodeEditTypes, FormNodeTypes } from '@forms/services/dynamic-form.types';

export const DefectsTpl: FormNode = {
  name: 'defects',
  label: 'Defects',
  type: FormNodeTypes.GROUP,
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
                      value: null,
                      type: FormNodeTypes.CONTROL,
                      disabled: true
                    },
                    {
                      name: 'deficiencySubId',
                      label: 'Deficiency sub ID',
                      value: null,
                      type: FormNodeTypes.CONTROL,
                      disabled: true
                    },
                    {
                      name: 'deficiencyText',
                      label: 'Deficiency text',
                      value: null,
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
                              value: null,
                              type: FormNodeTypes.CONTROL
                            },
                            {
                              name: 'horizontal',
                              label: 'Horizontal',
                              value: null,
                              type: FormNodeTypes.CONTROL
                            },
                            {
                              name: 'lateral',
                              label: 'Lateral',
                              value: null,
                              type: FormNodeTypes.CONTROL
                            },
                            {
                              name: 'longitudinal',
                              label: 'Longitudinal',
                              value: null,
                              type: FormNodeTypes.CONTROL
                            },
                            {
                              name: 'rowNumber',
                              label: 'Row number',
                              value: null,
                              type: FormNodeTypes.CONTROL
                            },
                            {
                              name: 'seatNumber',
                              label: 'Seat number',
                              value: null,
                              type: FormNodeTypes.CONTROL
                            },
                            {
                              name: 'axleNumber',
                              label: 'Axle number',
                              value: null,
                              type: FormNodeTypes.CONTROL
                            }
                          ]
                        },
                        {
                          name: 'notes',
                          label: 'Notes',
                          value: null,
                          type: FormNodeTypes.CONTROL,
                          validators: [{ name: ValidatorNames.ValidateDefectNotes }]
                        }
                      ]
                    },
                    {
                      name: 'prs',
                      label: 'PRS',
                      value: null,
                      type: FormNodeTypes.CONTROL,
                      editType: FormNodeEditTypes.RADIO,
                      options: [
                        { value: true, label: 'Yes' },
                        { value: false, label: 'No' }
                      ]
                    },
                    {
                      name: 'prohibitionIssued',
                      label: 'Prohibition issued',
                      value: null,
                      type: FormNodeTypes.CONTROL,
                      editType: FormNodeEditTypes.RADIO,
                      options: [
                        { value: true, label: 'Yes' },
                        { value: false, label: 'No' }
                      ],
                      validators: [
                        {
                          name: ValidatorNames.RequiredIfEquals,
                          args: { sibling: 'deficiencyCategory', value: ['dangerous', 'dangerous*'] }
                        }
                      ]
                    },
                    {
                      name: 'stdForProhibition',
                      label: 'STD for prohibition',
                      value: null,
                      type: FormNodeTypes.CONTROL,
                      disabled: true
                    }
                  ]
                }
              ]
            },
            {
              name: 'customDefects',
              type: FormNodeTypes.ARRAY,
              viewType: FormNodeViewTypes.HIDDEN,
              editType: FormNodeEditTypes.HIDDEN
            }
          ]
        }
      ]
    }
  ]
};
