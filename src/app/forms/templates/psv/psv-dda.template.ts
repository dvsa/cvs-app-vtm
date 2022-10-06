import { ValidatorNames } from '@forms/models/validators.enum';
import { FormNode, FormNodeEditTypes, FormNodeTypes, FormNodeViewTypes } from '../../services/dynamic-form.types';

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
          type: FormNodeTypes.CONTROL,
          editType: FormNodeEditTypes.RADIO,
          options: [
            { value: true, label: 'Yes' },
            { value: false, label: 'No' },
            { value: null, label: 'I do not know' }
          ],
        },
        {
          name: 'wheelchairCapacity',
          label: 'Wheelchair capacity',
          type: FormNodeTypes.CONTROL,
          editType: FormNodeEditTypes.NUMBER,
          validators: [
            { name: ValidatorNames.Max, args: 99 }
          ],
        },
        {
          name: 'wheelchairFittings',
          label: 'Wheelchair fittings',
          type: FormNodeTypes.CONTROL,
          editType: FormNodeEditTypes.TEXTAREA,
          validators: [
            { name: ValidatorNames.MaxLength, args: 250 }
          ],
        },
        {
          name: 'wheelchairLiftPresent',
          label: 'Wheelchair lift present',
          type: FormNodeTypes.CONTROL,
          editType: FormNodeEditTypes.RADIO,
          options: [
            { value: true, label: 'Yes' },
            { value: false, label: 'No' },
            { value: null, label: 'I do not know' }
          ],
        },
        {
          name: 'wheelchairLiftInformation',
          label: 'Wheelchair lift information',
          type: FormNodeTypes.CONTROL,
          editType: FormNodeEditTypes.TEXTAREA,
          validators: [
            { name: ValidatorNames.MaxLength, args: 250 }
          ],
        },
        {
          name: 'wheelchairRampPresent',
          label: 'Wheelchair ramp present',
          type: FormNodeTypes.CONTROL,
          editType: FormNodeEditTypes.RADIO,
          options: [
            { value: true, label: 'Yes' },
            { value: false, label: 'No' },
            { value: null, label: 'I do not know' }
          ],
        },
        {
          name: 'wheelchairRampInformation',
          label: 'Wheelchair ramp information',
          type: FormNodeTypes.CONTROL,
          editType: FormNodeEditTypes.TEXTAREA,
          validators: [
            { name: ValidatorNames.MaxLength, args: 250 }
          ],
        },
        {
          name: 'minEmergencyExits',
          label: 'Minimum emergency exits needed',
          type: FormNodeTypes.CONTROL,
          editType: FormNodeEditTypes.NUMBER,
          validators: [
            { name: ValidatorNames.Max, args: 99 }
          ],
        },
        {
          name: 'outswing',
          label: 'Outswing',
          type: FormNodeTypes.CONTROL,
          editType: FormNodeEditTypes.TEXTAREA,
          validators: [
            { name: ValidatorNames.MaxLength, args: 250 }
          ],
        },
        {
          name: 'ddaSchedules',
          label: 'DDA schedules',
          type: FormNodeTypes.CONTROL,
          editType: FormNodeEditTypes.TEXTAREA,
          validators: [
            { name: ValidatorNames.MaxLength, args: 250 }
          ],
        },
        {
          name: 'seatbeltsFitted',
          label: 'Seatbelts fitted',
          type: FormNodeTypes.CONTROL,
          editType: FormNodeEditTypes.NUMBER,
          validators: [
            { name: ValidatorNames.Max, args: 999 }
          ],
        },
        {
          name: 'ddaNotes',
          label: 'DDA notes',
          type: FormNodeTypes.CONTROL,
          editType: FormNodeEditTypes.TEXTAREA,
          validators: [
            { name: ValidatorNames.MaxLength, args: 1024 }
          ],
        }
      ]
    }
  ]
};
