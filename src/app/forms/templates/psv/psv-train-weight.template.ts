import { FormNode, FormNodeTypes, FormNodeViewTypes } from '../../services/dynamic-form.types';

export const PsvTrainWeight: FormNode = {
  name: 'trainWeight',
  label: 'Train Weight',
  type: FormNodeTypes.GROUP,
  viewType: FormNodeViewTypes.SUBHEADING,
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
