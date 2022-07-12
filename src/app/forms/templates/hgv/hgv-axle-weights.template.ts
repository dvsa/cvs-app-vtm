import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { FormNode, FormNodeTypes, FormNodeViewTypes } from '../../services/dynamic-form.types';
import { generateWeights } from '../general/weights.template';

export const HgvAxleWeights: FormNode = {
  name: 'axleWeightsSection',
  label: 'Axle Weights',
  type: FormNodeTypes.GROUP,
  viewType: FormNodeViewTypes.SUBHEADING,
  children: [
    {
      name: 'axles',
      value: '',
      type: FormNodeTypes.ARRAY,
      children: [
        {
          name: '0',
          label: 'Axle',
          value: '',
          type: FormNodeTypes.GROUP,
          children: [
            {
              name: 'axleNumber',
              label: 'Axle Number',
              type: FormNodeTypes.CONTROL
            },
            {
              name: 'weights',
              label: 'Weights',
              value: '',
              type: FormNodeTypes.GROUP,
              children: generateWeights(VehicleTypes.HGV)
            }
          ]
        }
      ]
    }
  ]
};
