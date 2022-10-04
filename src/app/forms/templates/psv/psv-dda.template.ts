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
          value: '',
          type: FormNodeTypes.CONTROL,
          viewType: FormNodeViewTypes.STRING,
          editType: FormNodeEditTypes.RADIO,
          options: [
            { value: true, label: 'Yes' },
            { value: false, label: 'No' },
            { value: '', label: 'I do not know' }
          ],
        },
        {
          name: 'wheelchairCapacity',
          label: 'Wheelchair capacity',
          value: '',
          type: FormNodeTypes.CONTROL,
          viewType: FormNodeViewTypes.STRING,
          editType: FormNodeEditTypes.NUMBER,
          validators: [
            { name: ValidatorNames.Max, args: 99 }
          ],
        },
        {
          name: 'wheelchairFittings',
          label: 'Wheelchair fittings',
          value: '',
          type: FormNodeTypes.CONTROL,
          viewType: FormNodeViewTypes.STRING,
          editType: FormNodeEditTypes.TEXTAREA,
          validators: [
            { name: ValidatorNames.MaxLength, args: 250 }
          ],
        },
        {
          name: 'wheelchairLiftPresent',
          label: 'Wheelchair lift present',
          value: '',
          type: FormNodeTypes.CONTROL,
          viewType: FormNodeViewTypes.STRING,
          editType: FormNodeEditTypes.RADIO,
          options: [
            { value: true, label: 'Yes' },
            { value: false, label: 'No' },
            { value: '', label: 'I do not know' }
          ],
        },
        {
          name: 'wheelchairLiftInformation',
          label: 'Wheelchair lift information',
          value: '',
          type: FormNodeTypes.CONTROL,
          viewType: FormNodeViewTypes.STRING,
          editType: FormNodeEditTypes.TEXTAREA,
          validators: [
            { name: ValidatorNames.MaxLength, args: 250 }
          ],
        },
        {
          name: 'wheelchairRampPresent',
          label: 'Wheelchair ramp present',
          value: '',
          type: FormNodeTypes.CONTROL,
          viewType: FormNodeViewTypes.STRING,
          editType: FormNodeEditTypes.RADIO,
          options: [
            { value: true, label: 'Yes' },
            { value: false, label: 'No' },
            { value: '', label: 'I do not know' }
          ],
        },
        {
          name: 'wheelchairRampInformation',
          label: 'Wheelchair ramp information',
          value: '',
          type: FormNodeTypes.CONTROL,
          viewType: FormNodeViewTypes.STRING,
          editType: FormNodeEditTypes.TEXTAREA,
          validators: [
            { name: ValidatorNames.MaxLength, args: 250 }
          ],
        },
        {
          name: 'minEmergencyExits',
          label: 'Minimum emergency exits needed',
          value: '',
          type: FormNodeTypes.CONTROL,
          viewType: FormNodeViewTypes.STRING,
          editType: FormNodeEditTypes.NUMBER,
          validators: [
            { name: ValidatorNames.Max, args: 99 }
          ],
        },
        {
          name: 'outswing',
          label: 'Outswing',
          value: '',
          type: FormNodeTypes.CONTROL,
          viewType: FormNodeViewTypes.STRING,
          editType: FormNodeEditTypes.TEXTAREA,
          validators: [
            { name: ValidatorNames.MaxLength, args: 250 }
          ],
        },
        {
          name: 'ddaSchedules',
          label: 'DDA schedules',
          value: '',
          type: FormNodeTypes.CONTROL,
          viewType: FormNodeViewTypes.STRING,
          editType: FormNodeEditTypes.TEXTAREA,
          validators: [
            { name: ValidatorNames.MaxLength, args: 250 }
          ],
        },
        {
          name: 'seatbeltsFitted',
          label: 'Seatbelts fitted',
          value: '',
          type: FormNodeTypes.CONTROL,
          viewType: FormNodeViewTypes.STRING,
          editType: FormNodeEditTypes.NUMBER,
          validators: [
            { name: ValidatorNames.Max, args: 999 }
          ],
        },
        {
          name: 'ddaNotes',
          label: 'DDA notes',
          value: '',
          type: FormNodeTypes.CONTROL,
          viewType: FormNodeViewTypes.STRING,
          editType: FormNodeEditTypes.TEXTAREA,
          validators: [
            { name: ValidatorNames.MaxLength, args: 1024 }
          ],
        }
      ]
    }
  ]
};
