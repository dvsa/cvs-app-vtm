import { FormNode, FormNodeTypes } from '@forms/services/dynamic-form.types';

export const tyresTemplateTrl: FormNode = {
  name: 'tyreSection',
  type: FormNodeTypes.GROUP,
  label: 'Tyres',
  children: [
    {
      name: 'tyreUseCode',
      label: 'Tyre use code',
      value: '',
      type: FormNodeTypes.CONTROL
    },
    {
      name: 'axles',
      value: '',
      type: FormNodeTypes.ARRAY,
      children: [
        {
          name: '0',
          label: 'Axle',
          value: '',
          type: FormNodeTypes.GROUP,
          children: [
            {
              name: 'axleNumber',
              label: 'Axle Number',
              type: FormNodeTypes.CONTROL
            },
            {
              name: 'tyres',
              label: 'Tyres',
              value: '',
              type: FormNodeTypes.GROUP,
              children: [
                {
                  name: 'tyreCode',
                  label: 'Tyre Code',
                  value: '',
                  type: FormNodeTypes.CONTROL
                },
                {
                  name: 'tyreSize',
                  label: 'Tyre Size',
                  value: '',
                  type: FormNodeTypes.CONTROL,
                  disabled: true
                },
                {
                  name: 'plyRating',
                  label: 'Ply Rating',
                  value: '',
                  type: FormNodeTypes.CONTROL,
                  disabled: true
                },
                {
                  name: 'fitmentCode',
                  label: 'Fitment code',
                  value: '',
                  type: FormNodeTypes.CONTROL
                },
                {
                  name: 'dataTrAxles',
                  label: 'Load index',
                  value: '',
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
};
