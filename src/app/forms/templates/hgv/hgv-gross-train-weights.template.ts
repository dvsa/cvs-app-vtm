import { FormNode, FormNodeTypes, FormNodeViewTypes } from '../../services/dynamic-form.types';
import { generateWeights } from '../general/weights.template';

export const HgvGrossTrainWeight: FormNode = {
  name: 'grossTrainWeight',
  label: 'Gross Train Weight',
  value: '',
  type: FormNodeTypes.GROUP,
  viewType: FormNodeViewTypes.SUBHEADING,
  children: generateWeights(true, 'hgv', 'train')
};
