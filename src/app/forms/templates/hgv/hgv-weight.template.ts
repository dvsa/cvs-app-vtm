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
      name: 'grossGbWeight',
      label: 'GB',
      value: '',
      type: FormNodeTypes.CONTROL,
      validators: requiredValidation
    },
    {
      name: 'grossEecWeight',
      label: 'EEC (optional)',
      value: '',
      type: FormNodeTypes.CONTROL,
      validators: optionalValidation
    },
    {
      name: 'grossDesignWeight',
      label: 'Design',
      value: '',
      type: FormNodeTypes.CONTROL,
      validators: requiredValidation
    },
    {
      name: 'grossTrainSection',
      label: 'Gross train weight',
      value: '',
      type: FormNodeTypes.SECTION
    },
    {
      name: 'trainGbWeight',
      label: 'GB',
      value: '',
      type: FormNodeTypes.CONTROL,
      validators: requiredValidation
    },
    {
      name: 'trainEecWeight',
      label: 'EEC (optional)',
      value: '',
      type: FormNodeTypes.CONTROL,
      validators: optionalValidation
    },
    {
      name: 'trainDesignWeight',
      label: 'Design (optional)',
      value: '',
      type: FormNodeTypes.CONTROL,
      validators: optionalValidation
    },
    {
      name: 'maxTrainSection',
      label: 'Max train weight',
      value: '',
      type: FormNodeTypes.SECTION
    },
    {
      name: 'maxTrainGbWeight',
      label: 'GB',
      value: '',
      type: FormNodeTypes.CONTROL,
      validators: requiredValidation
    },
    {
      name: 'maxTrainEecWeight',
      label: 'EEC (optional)',
      value: '',
      type: FormNodeTypes.CONTROL,
      validators: optionalValidation
    },
    {
      name: 'maxTrainDesignWeight',
      label: 'Design (optional)',
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
                  name: 'gbWeight',
                  label: 'GB weight',
                  value: '',
                  type: FormNodeTypes.CONTROL,
                  validators: requiredValidation
                },
                {
                  name: 'eecWeight',
                  label: 'EEC (optional)',
                  value: '',
                  type: FormNodeTypes.CONTROL,
                  validators: optionalValidation
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
