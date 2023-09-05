import { ValidatorNames } from '@forms/models/validators.enum';
import { FormNode, FormNodeEditTypes, FormNodeTypes } from '../../services/dynamic-form.types';

const requiredValidation = [
  { name: ValidatorNames.Numeric, args: 99999 },
  { name: ValidatorNames.Max, args: 99999 },
  { name: ValidatorNames.Min, args: 0 }
];

const optionalValidation = [
  { name: ValidatorNames.Numeric, args: 99999 },
  { name: ValidatorNames.Max, args: 99999 },
  { name: ValidatorNames.Min, args: 0 }
];

export const HgvWeight: FormNode = {
  name: 'weightsSection',
  label: 'Weights',
  type: FormNodeTypes.GROUP,
  children: [
    {
      name: 'grossSection',
      label: 'Gross vehicle weight',
      value: '',
      type: FormNodeTypes.SECTION
    },
    {
      name: 'techRecord_grossGbWeight',
      label: 'GB',
      customValidatorErrorName: 'Gross GB Weight',
      value: null,
      type: FormNodeTypes.CONTROL,
      validators: requiredValidation
    },
    {
      name: 'techRecord_grossEecWeight',
      label: 'EEC (optional)',
      customValidatorErrorName: 'Gross EEC Weight',
      value: null,
      editType: FormNodeEditTypes.NUMBER,
      type: FormNodeTypes.CONTROL,
      validators: optionalValidation
    },
    {
      name: 'techRecord_grossDesignWeight',
      label: 'Design',
      customValidatorErrorName: 'Gross Design Weight',
      value: null,
      type: FormNodeTypes.CONTROL,
      validators: requiredValidation
    },
    {
      name: 'grossTrainSection',
      label: 'Gross train weight',
      value: null,
      type: FormNodeTypes.SECTION
    },
    {
      name: 'techRecord_trainGbWeight',
      label: 'GB',
      customValidatorErrorName: 'Train GB Weight',
      value: null,
      type: FormNodeTypes.CONTROL,
      validators: requiredValidation
    },
    {
      name: 'techRecord_trainEecWeight',
      label: 'EEC (optional)',
      customValidatorErrorName: 'Train EEC Weight',
      value: null,
      editType: FormNodeEditTypes.NUMBER,
      type: FormNodeTypes.CONTROL,
      validators: optionalValidation
    },
    {
      name: 'techRecord_trainDesignWeight',
      label: 'Design (optional)',
      customValidatorErrorName: 'Train Design Weight',
      value: null,
      type: FormNodeTypes.CONTROL,
      validators: optionalValidation
    },
    {
      name: 'maxTrainSection',
      label: 'Max train weight',
      value: null,
      type: FormNodeTypes.SECTION
    },
    {
      name: 'techRecord_maxTrainGbWeight',
      label: 'GB',
      customValidatorErrorName: 'Max Train GB Weight',
      value: null,
      type: FormNodeTypes.CONTROL,
      validators: requiredValidation
    },
    {
      name: 'techRecord_maxTrainEecWeight',
      label: 'EEC (optional)',
      customValidatorErrorName: 'Max Train EEC Weight',
      value: null,
      editType: FormNodeEditTypes.NUMBER,
      type: FormNodeTypes.CONTROL,
      validators: optionalValidation
    },
    {
      name: 'techRecord_maxTrainDesignWeight',
      label: 'Design (optional)',
      customValidatorErrorName: 'Max Train Design Weight',
      value: null,
      type: FormNodeTypes.CONTROL,
      validators: optionalValidation
    },
    {
      name: 'axleSection',
      label: 'Axle weights',
      value: '',
      type: FormNodeTypes.SECTION
    },
    {
      name: 'techRecord_axles',
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
              name: 'weights_gbWeight',
              label: 'GB weight',
              customValidatorErrorName: 'Axle GB Weight',
              value: null,
              type: FormNodeTypes.CONTROL,
              validators: requiredValidation
            },
            {
              name: 'weights_eecWeight',
              label: 'EEC (optional)',
              customValidatorErrorName: 'Axle EEC Weight',
              value: null,
              editType: FormNodeEditTypes.NUMBER,
              type: FormNodeTypes.CONTROL,
              validators: optionalValidation
            },
            {
              name: 'weights_designWeight',
              label: 'Design weight',
              customValidatorErrorName: 'Axle Design Weight',
              value: null,
              type: FormNodeTypes.CONTROL,
              validators: requiredValidation
            }
          ]
        }
      ]
    }
  ]
};
