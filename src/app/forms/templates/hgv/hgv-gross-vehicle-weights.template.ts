import { FormNode, FormNodeTypes, FormNodeViewTypes } from '../../services/dynamic-form.types';
import { generateWeights } from '../general/hgv-weights.template';

export const HgvGrossVehicleWeight: FormNode = {
  name: 'grossVehicleWeight',
  label: 'Gross Vehicle Weight',
  value: '',
  type: FormNodeTypes.GROUP,
  viewType: FormNodeViewTypes.SUBHEADING,
  children: generateWeights(true, 'gross')
};
