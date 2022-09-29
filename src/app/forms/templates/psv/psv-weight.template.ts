import { FormNode, FormNodeTypes, FormNodeViewTypes } from '../../services/dynamic-form.types';

export const PsvWeight: FormNode = {
  name: 'weightsSection',
  label: 'Weights',
  type: FormNodeTypes.GROUP,
  viewType: FormNodeViewTypes.SUBHEADING,
  children: [
    {
      name: 'grossSection',
      label: 'Gross vehicle weight',
      value: '',
      type: FormNodeTypes.SECTION
    },
    {
      name: 'grossKerbWeight',
      label: 'Kerb',
      value: '',
      type: FormNodeTypes.CONTROL
    },
    {
      name: 'grossLadenWeight',
      label: 'Laden',
      value: '',
      type: FormNodeTypes.CONTROL
    },
    {
      name: 'grossGbWeight',
      label: 'GB',
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
      name: 'unladenWeight',
      label: 'Unladen (optional)',
      value: '',
      type: FormNodeTypes.CONTROL
    },
    {
      name: 'trainSection',
      label: 'Train weight',
      value: '',
      type: FormNodeTypes.SECTION
    },
    {
      name: 'maxTrainGbWeight',
      label: 'Max train GB',
      value: '',
      type: FormNodeTypes.CONTROL
    },
    {
      name: 'trainDesignWeight',
      label: 'Train design',
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
                  name: 'kerbWeight',
                  label: 'Kerb weight',
                  value: '',
                  type: FormNodeTypes.CONTROL
                },
                {
                  name: 'ladenWeight',
                  label: 'Laden weight',
                  value: '',
                  type: FormNodeTypes.CONTROL
                },
                {
                  name: 'gbWeight',
                  label: 'GB weight',
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
