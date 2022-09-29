import { ValidatorNames } from '@forms/models/validators.enum';
import { FormNode, FormNodeEditTypes, FormNodeTypes, FormNodeViewTypes } from '@forms/services/dynamic-form.types';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { generateWeights } from './weights.template';

const vehicleType = VehicleTypes.PSV;

export const weightsNew: FormNode = {
  name: 'Weights',
  type: FormNodeTypes.GROUP,
  label: 'Weights',
  viewType: FormNodeViewTypes.SUBHEADING,
  children:
    vehicleType !== VehicleTypes.PSV
      ? generateWeights(vehicleType, 'gross')
      : generateWeights(VehicleTypes.PSV, 'gross').concat([
          {
            name: 'unladenWeight',
            label: 'Unladen weight',
            value: '',
            type: FormNodeTypes.CONTROL
          },
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
        ])
};
