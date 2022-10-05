import { FormNode, FormNodeTypes } from '../../services/dynamic-form.types';


export const PsvBrakeSectionWheelsHalfLocked: FormNode = {
  name: 'halfLockedBrakesSection',
  label: 'Brake force wheels up to half locked',
  type: FormNodeTypes.GROUP,
  children: [
    {
      name: 'brakes',
      type: FormNodeTypes.GROUP,
      children: [
        {
          name: 'brakeForceWheelsUpToHalfLocked',
          type: FormNodeTypes.GROUP,
          children: [
            {
              name: 'serviceBrakeForceB',
              label: 'Service',
              value: '',
              type: FormNodeTypes.CONTROL,
            },
            {
              name: 'secondaryBrakeForceB',
              label: 'Secondary',
              value: '',
              type: FormNodeTypes.CONTROL,
            },
            {
              name: 'parkingBrakeForceB',
              label: 'Parking',
              value: '',
              type: FormNodeTypes.CONTROL,
            },
          ]
        }
      ]
    }

  ]
};
