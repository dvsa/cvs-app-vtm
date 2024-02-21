import { FormNode, FormNodeEditTypes, FormNodeTypes } from '@forms/services/dynamic-form.types';

export const RequiredStandardsTpl: FormNode = {
  name: 'requiredStandards',
  label: 'Required Standards',
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
              name: 'requiredStandards',
              type: FormNodeTypes.ARRAY,
              children: [
                {
                  name: '0',
                  type: FormNodeTypes.GROUP,
                  children: [
                    {
                      name: 'sectionNumber',
                      label: 'Section number',
                      type: FormNodeTypes.CONTROL,
                      disabled: true,
                    },
                    {
                      name: 'sectionDescription',
                      label: 'Section description',
                      type: FormNodeTypes.CONTROL,
                      disabled: true,
                    },
                    {
                      name: 'rsNumber',
                      label: 'Required standard number',
                      type: FormNodeTypes.CONTROL,
                      disabled: true,
                    },
                    {
                      name: 'requiredStandard',
                      label: 'Required standard description',
                      type: FormNodeTypes.CONTROL,
                      disabled: true,
                    },
                    {
                      name: 'refCalculation',
                      label: 'Ref calculation',
                      type: FormNodeTypes.CONTROL,
                      disabled: true,
                    },
                    {
                      name: 'additionalNotes',
                      label: 'Notes',
                      value: null,
                      type: FormNodeTypes.CONTROL,
                    },
                    {
                      name: 'prs',
                      label: 'PRS',
                      value: null,
                      type: FormNodeTypes.CONTROL,
                      editType: FormNodeEditTypes.RADIO,
                      options: [
                        { value: true, label: 'Yes' },
                        { value: false, label: 'No' },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
