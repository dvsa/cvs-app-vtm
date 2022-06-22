import { FormNode, FormNodeTypes, FormNodeViewTypes } from '../../services/dynamic-form.types';

export const HgvTyres: FormNode = {
  name: '',
  label: 'Tyres',
  type: FormNodeTypes.GROUP,
  viewType: FormNodeViewTypes.SUBHEADING,
  children: [
    {
      name: 'tyreUseCode',
      label: 'Tyre use code',
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.STRING,
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
              label: 'Axle number',
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
                  label: 'Tyre code',
                  value: '',
                  type: FormNodeTypes.CONTROL,
                  viewType: FormNodeViewTypes.STRING
                },
                {
                  name: 'tyreSize',
                  label: 'Tyre size',
                  value: '',
                  type: FormNodeTypes.CONTROL,
                  viewType: FormNodeViewTypes.STRING
                },
                {
                  name: 'plyRating',
                  label: 'Ply rating',
                  value: '',
                  type: FormNodeTypes.CONTROL,
                  viewType: FormNodeViewTypes.STRING
                },
                {
                  name: 'fitmentCode',
                  label: 'Fitment code',
                  value: '',
                  type: FormNodeTypes.CONTROL,
                  viewType: FormNodeViewTypes.STRING
                },
                {
                  name: 'dataTrAxles',
                  label: 'Load index',
                  value: '',
                  type: FormNodeTypes.CONTROL,
                  viewType: FormNodeViewTypes.STRING
                },
              ]
            }
          ]
        }
      ]
    }
  ]
}
