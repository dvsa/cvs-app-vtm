import { ValidatorNames } from '@forms/models/validators.enum';
import { FormNode, FormNodeTypes } from '../../services/dynamic-form.types';

const requiredValidation = [
  { name: ValidatorNames.Numeric, args: 99999 },
  { name: ValidatorNames.Max, args: 99999 },
  { name: ValidatorNames.Min, args: 0 },
  { name: ValidatorNames.Required }
];

const optionalValidation = [
  { name: ValidatorNames.Numeric, args: 99999 },
  { name: ValidatorNames.Max, args: 99999 },
  { name: ValidatorNames.Min, args: 0 }
];

export const PsvWeightsTemplate: FormNode = {
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
      name: 'grossKerbWeight',
      label: 'Kerb',
      customValidatorErrorName: 'Gross Kerb Weight',
      value: '',
      type: FormNodeTypes.CONTROL,
      validators: requiredValidation
    },
    {
      name: 'grossLadenWeight',
      label: 'Laden',
      customValidatorErrorName: 'Gross Laden Weight',
      value: '',
      type: FormNodeTypes.CONTROL,
      validators: requiredValidation
    },
    {
      name: 'grossGbWeight',
      label: 'GB',
      customValidatorErrorName: 'Gross GB Weight',
      value: '',
      type: FormNodeTypes.CONTROL,
      validators: requiredValidation
    },
    {
      name: 'grossDesignWeight',
      label: 'Design',
      customValidatorErrorName: 'Gross Design Weight',
      value: '',
      type: FormNodeTypes.CONTROL,
      validators: requiredValidation
    },
    {
      name: 'unladenWeight',
      label: 'Unladen weight',
      value: '',
      type: FormNodeTypes.CONTROL,
      validators: requiredValidation
    },
    {
      name: 'trainSection',
      label: 'Train weight',
      value: '',
      type: FormNodeTypes.SECTION
    },
    {
      name: 'maxTrainGbWeight',
      label: 'Max train GB',
      value: '',
      type: FormNodeTypes.CONTROL,
      validators: optionalValidation
    },
    {
      name: 'trainDesignWeight',
      label: 'Train design',
      value: '',
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
              name: 'weights',
              label: 'Weights',
              value: '',
              type: FormNodeTypes.GROUP,
              children: [
                {
                  name: 'kerbWeight',
                  label: 'Kerb weight',
                  customValidatorErrorName: 'Axle Kerb Weight',
                  value: '',
                  type: FormNodeTypes.CONTROL,
                  validators: requiredValidation
                },
                {
                  name: 'ladenWeight',
                  label: 'Laden weight',
                  customValidatorErrorName: 'Axle Laden Weight',
                  value: '',
                  type: FormNodeTypes.CONTROL,
                  validators: requiredValidation
                },
                {
                  name: 'gbWeight',
                  label: 'GB weight',
                  customValidatorErrorName: 'Axle GB Weight',
                  value: '',
                  type: FormNodeTypes.CONTROL,
                  validators: requiredValidation
                },
                {
                  name: 'designWeight',
                  label: 'Design weight',
                  customValidatorErrorName: 'Axle Design Weight',
                  value: '',
                  type: FormNodeTypes.CONTROL,
                  validators: requiredValidation
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
