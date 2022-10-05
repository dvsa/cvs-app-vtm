import { FormNode, FormNodeTypes, FormNodeViewTypes } from '../../services/dynamic-form.types';

export const TrlWeight: FormNode = {
  name: 'weightsSection',
  label: 'Weights',
  type: FormNodeTypes.GROUP,
  children: [
    {
      name: 'grossSection',
      label: 'Gross vehicle weight',
      value: '',
      type: FormNodeTypes.SECTION
    },
    {
      name: 'grossGbWeight',
      label: 'GB',
      value: '',
      type: FormNodeTypes.CONTROL
    },
    {
      name: 'grossEecWeight',
      label: 'EEC (optional)',
      value: '',
      type: FormNodeTypes.CONTROL
    },
    {
      name: 'grossDesignWeight',
      label: 'Design',
      value: '',
      type: FormNodeTypes.CONTROL
    },
    {
      name: 'axleSection',
      label: 'Axle weights',
      value: '',
      type: FormNodeTypes.SECTION
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
              name: 'weights',
              label: 'Weights',
              value: '',
              type: FormNodeTypes.GROUP,
              children: [
                {
                  name: 'gbWeight',
                  label: 'GB weight',
                  value: '',
                  type: FormNodeTypes.CONTROL
                },
                {
                  name: 'eecWeight',
                  label: 'EEC (optional)',
                  value: '',
                  type: FormNodeTypes.CONTROL
                },
                {
                  name: 'designWeight',
                  label: 'Design weight',
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
