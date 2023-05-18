import { ValidatorNames } from '@forms/models/validators.enum';
import { FormNode, FormNodeEditTypes, FormNodeTypes } from '@forms/services/dynamic-form.types';

export const template: FormNode = {
  name: 'countryOfRegistraion',
  type: FormNodeTypes.GROUP,
  label: 'Country of Registraion',
  children: [
    {
      name: 'resourceKey',
      label: 'Key',
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.TEXT,
      disabled: true,
      validators: [
        {
          name: ValidatorNames.Required
        }
      ]
    },
    {
      name: 'description',
      label: 'Description',
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.TEXT,
      validators: [
        {
          name: ValidatorNames.Required
        }
      ]
    }
  ]
};

export const templateList = [
  {
    column: 'resourceKey',
    heading: 'Key',
    order: 1
  },
  {
    column: 'description',
    heading: 'Country of Registration',
    order: 2
  }
];
