import { ValidatorNames } from '@forms/models/validators.enum';
import { FormNode, FormNodeTypes } from '../../services/dynamic-form.types';

export const TrlBrakesTemplate: FormNode = {
  name: 'trlBrakesSection',
  label: 'Brakes',
  type: FormNodeTypes.GROUP,
  children: [
    {
      name: 'brakes',
      type: FormNodeTypes.GROUP,
      children: [
        {
          name: 'loadSensingValve',
          label: 'Load sensing valve',
          value: '',
          type: FormNodeTypes.CONTROL
        },
        {
          name: 'antilockBrakingSystem',
          label: 'Antilock braking system',
          value: '',
          type: FormNodeTypes.CONTROL
        }
      ]
    },
    {
      name: 'axles',
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
              name: 'parkingBrakeMrk',
              label: 'Parking Brake Mark',
              type: FormNodeTypes.CONTROL
            },
            {
              name: 'brakes',
              value: '',
              type: FormNodeTypes.GROUP,
              children: [
                {
                  name: 'brakeActuator',
                  label: 'Brake actuator',
                  type: FormNodeTypes.CONTROL,
                  validators: [{ name: ValidatorNames.Max, args: 999 }]
                },
                {
                  name: 'leverLength',
                  label: 'Lever length',
                  type: FormNodeTypes.CONTROL,
                  validators: [{ name: ValidatorNames.Max, args: 999 }]
                },
                {
                  name: 'springBrakeParking',
                  label: 'Spring brake parking',
                  type: FormNodeTypes.CONTROL
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
