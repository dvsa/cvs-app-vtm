import { ValidatorNames } from '@forms/models/validators.enum';
import { FormNode, FormNodeEditTypes, FormNodeTypes } from '@forms/services/dynamic-form.types';

export const template: FormNode = {
  name: 'hgvMake',
  type: FormNodeTypes.GROUP,
  label: 'HGV Make',
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
    heading: 'HGV Make',
    order: 2
  }
];
