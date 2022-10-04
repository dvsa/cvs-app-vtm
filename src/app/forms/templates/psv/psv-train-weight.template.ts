import { FormNode, FormNodeTypes } from '../../services/dynamic-form.types';

export const PsvTrainWeight: FormNode = {
  name: 'trainWeight',
  label: 'Train Weight',
  type: FormNodeTypes.GROUP,
  children: [
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
    }
  ]
};
