import { FormNode, FormNodeTypes, FormNodeViewTypes } from '../../services/dynamic-form.types';
import { generateWeights } from '../general/hgv-weights.template';

export const HgvMaxTrainWeight: FormNode = {
  name: 'maxTrainWeight',
  label: 'Max Train Weight',
  value: '',
  type: FormNodeTypes.GROUP,
  viewType: FormNodeViewTypes.SUBHEADING,
  children: generateWeights(true, 'max')
};
