import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { FormNode, FormNodeTypes, FormNodeViewTypes } from '../../services/dynamic-form.types';
import { generateWeights } from '../general/weights.template';

export const HgvMaxTrainWeight: FormNode = {
  name: 'maxTrainWeight',
  label: 'Max Train Weight',
  value: '',
  type: FormNodeTypes.GROUP,
  viewType: FormNodeViewTypes.SUBHEADING,
  children: generateWeights(VehicleTypes.HGV, 'maxTrain')
};
