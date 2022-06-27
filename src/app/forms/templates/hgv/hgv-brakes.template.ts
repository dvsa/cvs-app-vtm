import { FormNode, FormNodeTypes, FormNodeViewTypes } from '../../services/dynamic-form.types';

export const Brakes: FormNode = {
  name: '',
  label: 'Brakes',
  type: FormNodeTypes.GROUP,
  viewType: FormNodeViewTypes.SUBHEADING,
  children: [
    {
      name: 'brakes',
      value: '',
      type: FormNodeTypes.GROUP,
      children: [
        {
          name: 'loadSensingValve',
          label: 'Load sensing valve',
          value: '',
          type: FormNodeTypes.CONTROL,
          viewType: FormNodeViewTypes.STRING
        },
        {
          name: 'antilockBrakingSystem',
          label: 'Antilock braking system',
          value: '',
          type: FormNodeTypes.CONTROL,
          viewType: FormNodeViewTypes.STRING
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
              label: 'Axle number',
              type: FormNodeTypes.CONTROL,
              viewType: FormNodeViewTypes.STRING
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
                  viewType: FormNodeViewTypes.STRING
                },
                {
                  name: 'leverLength',
                  label: 'Lever length',
                  type: FormNodeTypes.CONTROL,
                  viewType: FormNodeViewTypes.STRING
                },
                {
                  name: 'springBrakeParking',
                  label: 'Spring brake parking',
                  type: FormNodeTypes.CONTROL,
                  viewType: FormNodeViewTypes.STRING
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
