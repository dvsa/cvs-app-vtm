import { ValidatorNames } from '@forms/models/validators.enum';
import { FormNode, FormNodeTypes } from '../../services/dynamic-form.types';

export const PsvBrakesTemplate: FormNode = {
  name: 'psvBrakesSection',
  label: 'Brakes',
  type: FormNodeTypes.SECTION,
  children: [
    {
      name: 'brakes',
      type: FormNodeTypes.GROUP,
      children: [
        {
          name: 'brakeCodeOriginal',
          label: 'Brake code',
          value: '',
          type: FormNodeTypes.CONTROL,
          validators: [{ name: ValidatorNames.MaxLength, args: 6 }]
        },
        {
          name: 'brakeCode',
          label: 'Brake code',
          value: '',
          type: FormNodeTypes.CONTROL,
          validators: [{ name: ValidatorNames.MaxLength, args: 6 }]
        },
        {
          name: 'dataTrBrakeOne',
          label: 'Service *',
          value: '',
          type: FormNodeTypes.CONTROL,
          disabled: true
        },
        {
          name: 'dataTrBrakeTwo',
          label: 'Secondary *',
          value: '',
          type: FormNodeTypes.CONTROL,
          disabled: true
        },
        {
          name: 'dataTrBrakeThree',
          label: 'Parking *',
          value: '',
          type: FormNodeTypes.CONTROL,
          disabled: true
        },
        {
          name: 'retarderBrakeOne',
          label: 'Retarder 1',
          value: '',
          type: FormNodeTypes.CONTROL
        },
        {
          name: 'retarderBrakeTwo',
          label: 'Retarder 2',
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
          value: '',
          type: FormNodeTypes.GROUP,
          children: [
            {
              name: 'axleNumber',
              label: 'Axle Number',
              type: FormNodeTypes.CONTROL
            },
            {
              name: 'parkingBrakeMrk',
              label: 'Parking Brake',
              type: FormNodeTypes.CONTROL
            }
          ]
        }
      ]
    }
  ]
};
