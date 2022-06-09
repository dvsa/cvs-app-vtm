import { FormNode, FormNodeTypes, FormNodeViewTypes } from '../../services/dynamic-form.types';
import { generateWeights } from '../general/psv-weights.template';

export const PsvGrossVehicleWeight: FormNode = {
  name: 'grossVehicleWeight',
  label: 'Gross Vehicle Weight',
  value: '',
  type: FormNodeTypes.GROUP,
  viewType: FormNodeViewTypes.SUBHEADING,
  children: generateWeights().concat([
    {
      name: 'unladenWeight',
      label: 'Unladen weight',
      value: '',
      type: FormNodeTypes.CONTROL
    }
  ])
};
