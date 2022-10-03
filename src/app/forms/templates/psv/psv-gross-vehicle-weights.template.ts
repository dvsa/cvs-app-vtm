import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { FormNode, FormNodeTypes, FormNodeViewTypes } from '../../services/dynamic-form.types';
import { generateWeights } from '../general/weights.template';

export const PsvGrossVehicleWeight: FormNode = {
  name: 'grossVehicleWeight',
  label: 'Gross Vehicle Weight',
  value: '',
  type: FormNodeTypes.GROUP,
  children: generateWeights(VehicleTypes.PSV, 'gross').concat([
    {
      name: 'unladenWeight',
      label: 'Unladen weight',
      value: '',
      type: FormNodeTypes.CONTROL
    }
  ])
};
