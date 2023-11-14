import { ValidatorNames } from '@forms/models/validators.enum';
import { FormNode, FormNodeEditTypes, FormNodeTypes } from '../../services/dynamic-form.types';

export const PsvDdaTemplate: FormNode = {
  name: 'dda',
  type: FormNodeTypes.GROUP,
  label: 'Disability Discrimination Act',
  children: [
    {
      name: 'techRecord_dda_certificateIssued',
      label: 'DDA certificate issued',
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.RADIO,
      options: [
        { value: true, label: 'Yes' },
        { value: false, label: 'No' },
        { value: null, label: 'I do not know' },
      ],
    },
    {
      name: 'techRecord_dda_wheelchairCapacity',
      label: 'Wheelchair capacity',
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.NUMBER,
      validators: [{ name: ValidatorNames.Max, args: 99 }],
    },
    {
      name: 'techRecord_dda_wheelchairFittings',
      label: 'Wheelchair fittings',
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.TEXTAREA,
      validators: [{ name: ValidatorNames.MaxLength, args: 250 }],
    },
    {
      name: 'techRecord_dda_wheelchairLiftPresent',
      label: 'Wheelchair lift present',
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.RADIO,
      options: [
        { value: true, label: 'Yes' },
        { value: false, label: 'No' },
        { value: null, label: 'I do not know' },
      ],
    },
    {
      name: 'techRecord_dda_wheelchairLiftInformation',
      label: 'Wheelchair lift information',
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.TEXTAREA,
      validators: [{ name: ValidatorNames.MaxLength, args: 250 }],
    },
    {
      name: 'techRecord_dda_wheelchairRampPresent',
      label: 'Wheelchair ramp present',
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.RADIO,
      options: [
        { value: true, label: 'Yes' },
        { value: false, label: 'No' },
        { value: null, label: 'I do not know' },
      ],
    },
    {
      name: 'techRecord_dda_wheelchairRampInformation',
      label: 'Wheelchair ramp information',
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.TEXTAREA,
      validators: [{ name: ValidatorNames.MaxLength, args: 250 }],
    },
    {
      name: 'techRecord_dda_minEmergencyExits',
      label: 'Minimum emergency exits needed',
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.NUMBER,
      validators: [{ name: ValidatorNames.Max, args: 99 }],
    },
    {
      name: 'techRecord_dda_outswing',
      label: 'Outswing',
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.TEXTAREA,
      validators: [{ name: ValidatorNames.MaxLength, args: 250 }],
    },
    {
      name: 'techRecord_dda_ddaSchedules',
      label: 'DDA schedules',
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.TEXTAREA,
      validators: [{ name: ValidatorNames.MaxLength, args: 250 }],
    },
    {
      name: 'techRecord_dda_seatbeltsFitted',
      label: 'Seatbelts fitted',
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.NUMBER,
      validators: [{ name: ValidatorNames.Max, args: 999 }],
    },
    {
      name: 'techRecord_dda_ddaNotes',
      label: 'DDA notes',
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.TEXTAREA,
      validators: [{ name: ValidatorNames.MaxLength, args: 1024 }],
    },
  ],
};
