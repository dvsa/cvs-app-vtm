import { ValidatorNames } from '@forms/models/validators.enum';
import { FormNode, FormNodeTypes, FormNodeViewTypes } from '../../services/dynamic-form.types';

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

export const PsvWeight: FormNode = {
  name: 'weightsSection',
  label: 'Weights',
  type: FormNodeTypes.GROUP,
  viewType: FormNodeViewTypes.SUBHEADING,
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
      value: '',
      type: FormNodeTypes.CONTROL,
      validators: requiredValidation
    },
    {
      name: 'grossLadenWeight',
      label: 'Laden',
      value: '',
      type: FormNodeTypes.CONTROL,
      validators: requiredValidation
    },
    {
      name: 'grossGbWeight',
      label: 'GB',
      value: '',
      type: FormNodeTypes.CONTROL,
      validators: requiredValidation
    },
    {
      name: 'grossDesignWeight',
      label: 'Design',
      value: '',
      type: FormNodeTypes.CONTROL,
      validators: requiredValidation
    },
    {
      name: 'unladenWeight',
      label: 'Unladen (optional)',
      value: '',
      type: FormNodeTypes.CONTROL,
      validators: optionalValidation
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
                  value: '',
                  type: FormNodeTypes.CONTROL,
                  validators: requiredValidation
                },
                {
                  name: 'ladenWeight',
                  label: 'Laden weight',
                  value: '',
                  type: FormNodeTypes.CONTROL,
                  validators: requiredValidation
                },
                {
                  name: 'gbWeight',
                  label: 'GB weight',
                  value: '',
                  type: FormNodeTypes.CONTROL,
                  validators: requiredValidation
                },
                {
                  name: 'designWeight',
                  label: 'Design weight',
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
