import { FormNode, FormNodeTypes, FormNodeViewTypes } from '../../services/dynamic-form.types';

export const PsvDdaTemplate: FormNode = {
  name: 'dda',
  type: FormNodeTypes.GROUP,
  label: 'Disability Discrimination Act',
  children: [
    {
      name: 'dda',
      type: FormNodeTypes.GROUP,
      children: [
        {
          name: 'certificateIssued',
          label: 'DDA certificate issued',
          value: '',
          type: FormNodeTypes.CONTROL
        },
        {
          name: 'wheelchairCapacity',
          label: 'Wheelchair capacity',
          value: '',
          type: FormNodeTypes.CONTROL
        },
        {
          name: 'wheelchairFittings',
          label: 'Wheelchair fittings',
          value: '',
          type: FormNodeTypes.CONTROL
        },
        {
          name: 'wheelchairLiftPresent',
          label: 'Wheelchair lift present',
          value: '',
          type: FormNodeTypes.CONTROL
        },
        {
          name: 'wheelchairLiftInformation',
          label: 'Wheelchair lift information',
          value: '',
          type: FormNodeTypes.CONTROL
        },
        {
          name: 'wheelchairRampPresent',
          label: 'Wheelchair ramp present',
          value: '',
          type: FormNodeTypes.CONTROL
        },
        {
          name: 'wheelchairRampInformation',
          label: 'Wheelchair ramp information',
          value: '',
          type: FormNodeTypes.CONTROL
        },
        {
          name: 'minEmergencyExits',
          label: 'Minimum emergency exits needed',
          value: '',
          type: FormNodeTypes.CONTROL
        },
        {
          name: 'outswing',
          label: 'Outswing',
          value: '',
          type: FormNodeTypes.CONTROL
        },
        {
          name: 'ddaSchedules',
          label: 'DDA schedules',
          value: '',
          type: FormNodeTypes.CONTROL
        },
        {
          name: 'seatbeltsFitted',
          label: 'Seatbelts fitted',
          value: '',
          type: FormNodeTypes.CONTROL
        },
        {
          name: 'ddaNotes',
          label: 'DDA notes',
          value: '',
          type: FormNodeTypes.CONTROL
        }
      ]
    }
  ]
};
