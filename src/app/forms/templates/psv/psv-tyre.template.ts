import { ControlContainer } from '@angular/forms';
import { FormNode, FormNodeTypes, FormNodeViewTypes } from '../../services/dynamic-form.types';
export const PsvTyre: FormNode = {
  name: 'tyreSection',
  type: FormNodeTypes.GROUP,
  label: 'Tyres',
  viewType: FormNodeViewTypes.SUBHEADING,
  children: [
    {
      name: 'speedRestriction',
      label: 'Speed Restriction',
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
                  type: FormNodeTypes.CONTROL
                },
                {
                  name: 'plyRating',
                  label: 'Ply Rating',
                  value: '',
                  type: FormNodeTypes.CONTROL
                },
                {
                  name: 'speedCategorySymbol',
                  label: 'Speed category symbol',
                  value: '',
                  type: FormNodeTypes.CONTROL
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
                  type: FormNodeTypes.CONTROL
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
