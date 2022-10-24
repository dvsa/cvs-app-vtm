import { ValidatorNames } from '@forms/models/validators.enum';
import { FormNode, FormNodeTypes } from '@forms/services/dynamic-form.types';

const requiredValidation = [
  { name: ValidatorNames.Numeric, args: 99999 },
  { name: ValidatorNames.Max, args: 99999 },
  { name: ValidatorNames.Min, args: 0 },
  { name: ValidatorNames.Required }
];

export const PsvAxleUpdate: FormNode = {
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
      name: 'tyres',
      label: 'Tyres',
      value: '',
      type: FormNodeTypes.GROUP,
      children: [
        {
          name: 'tyreCode',
          label: 'Tyre Code',
          value: '',
          type: FormNodeTypes.CONTROL
        },
        {
          name: 'tyreSize',
          label: 'Tyre Size',
          value: '',
          type: FormNodeTypes.CONTROL
        },
        {
          name: 'speedCategorySymbol',
          label: 'Speed category symbol',
          value: '',
          type: FormNodeTypes.CONTROL
        },
        {
          name: 'plyRating',
          label: 'Ply Rating',
          value: '',
          type: FormNodeTypes.CONTROL
        },
        {
          name: 'fitmentCode',
          label: 'Fitment code',
          value: '',
          type: FormNodeTypes.CONTROL
        },
        {
          name: 'dataTrAxles',
          label: 'Load index',
          value: '',
          type: FormNodeTypes.CONTROL
        }
      ]
    },
    {
      name: 'parkingBrakeMrk',
      label: 'Axles fitted with a parking brake',
      value: '',
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
};
