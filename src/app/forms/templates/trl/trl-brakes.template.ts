import { ValidatorNames } from '@forms/models/validators.enum';
import { FormNode, FormNodeTypes } from '../../services/dynamic-form.types';

export const TrlBrakesTemplate: FormNode = {
  name: 'trlBrakesSection',
  label: 'Brakes',
  type: FormNodeTypes.GROUP,
  children: [
    {
      name: 'techRecord_brakes_loadSensingValve',
      label: 'Load sensing valve',
      value: null,
      type: FormNodeTypes.CONTROL
    },
    {
      name: 'techRecord_brakes_antilockBrakingSystem',
      label: 'Antilock braking system',
      value: null,
      type: FormNodeTypes.CONTROL
    },
    {
      name: 'techRecord_axles',
      value: '',
      type: FormNodeTypes.ARRAY,
      children: [
        {
          name: '0',
          label: 'Axle',
          type: FormNodeTypes.GROUP,
          children: [
            {
              name: 'axleNumber',
              label: 'Axle number',
              type: FormNodeTypes.CONTROL
            },
            {
              value: false,
              name: 'parkingBrakeMrk',
              label: 'Parking Brake Mark',
              type: FormNodeTypes.CONTROL
            },

            {
              name: 'brakes_brakeActuator',
              label: 'Brake actuator',
              type: FormNodeTypes.CONTROL,
              validators: [{ name: ValidatorNames.Max, args: 999 }]
            },
            {
              name: 'brakes_leverLength',
              label: 'Lever length',
              type: FormNodeTypes.CONTROL,
              validators: [{ name: ValidatorNames.Max, args: 999 }]
            },
            {
              name: 'brakes_springBrakeParking',
              label: 'Spring brake parking',
              type: FormNodeTypes.CONTROL
            }
          ]
        }
      ]
    }
  ]
};
