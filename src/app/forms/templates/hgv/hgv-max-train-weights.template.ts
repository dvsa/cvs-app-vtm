import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { FormNode, FormNodeTypes } from '../../services/dynamic-form.types';
import { generateWeights } from '../general/weights.template';

export const HgvMaxTrainWeight: FormNode = {
  name: 'maxTrainWeight',
  label: 'Max Train Weight',
  value: '',
  type: FormNodeTypes.GROUP,
  children: generateWeights(VehicleTypes.HGV, 'maxTrain')
};
