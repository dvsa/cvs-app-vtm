import { ValidatorNames } from '@forms/models/validators.enum';
import { FormNode, FormNodeEditTypes, FormNodeTypes } from '@forms/services/dynamic-form.types';

export const template: FormNode = {
  name: 'brakes',
  type: FormNodeTypes.GROUP,
  label: 'Brakes',
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
    },
    {
      name: 'service',
      label: 'Service',
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.TEXT,
      validators: [
        {
          name: ValidatorNames.MaxLength,
          args: 60
        }
      ]
    },
    {
      name: 'secondary',
      label: 'Secondary',
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.TEXT,
      validators: [
        {
          name: ValidatorNames.MaxLength,
          args: 60
        }
      ]
    },
    {
      name: 'parking',
      label: 'Parking',
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.TEXT,
      validators: [
        {
          name: ValidatorNames.MaxLength,
          args: 60
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
    heading: 'Brakes',
    order: 2
  },
  {
    column: 'service',
    heading: 'Service',
    order: 3
  },
  {
    column: 'secondary',
    heading: 'Secondary',
    order: 4
  },
  {
    column: 'parking',
    heading: 'Parking',
    order: 5
  }
];
