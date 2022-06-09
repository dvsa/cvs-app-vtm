import { FormNode, FormNodeTypes, FormNodeViewTypes } from '../../services/dynamic-form.types';

export const PsvWeights: FormNode = {
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
};
