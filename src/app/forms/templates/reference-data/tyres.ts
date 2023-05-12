import { ValidatorNames } from '@forms/models/validators.enum';
import { FormNode, FormNodeEditTypes, FormNodeTypes } from '@forms/services/dynamic-form.types';

export const template: FormNode = {
  name: 'tyres',
  type: FormNodeTypes.GROUP,
  label: 'Tyres',
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
      name: 'code',
      label: 'Code',
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.NUMBER,
      validators: [
        {
          name: ValidatorNames.Max,
          args: 99999
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
      name: 'loadIndexSingleLoad',
      label: 'Load Index Single',
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.NUMBER,
      validators: [
        {
          name: ValidatorNames.Max,
          args: 999
        }
      ]
    },
    {
      name: 'loadIndexTwinLoad',
      label: 'Load Index Twin',
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.NUMBER,
      validators: [
        {
          name: ValidatorNames.Max,
          args: 999
        }
      ]
    },
    {
      name: 'plyRating',
      label: 'Ply rating',
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.TEXT,
      validators: [
        {
          name: ValidatorNames.MaxLength,
          args: 2
        }
      ]
    },
    {
      name: 'tyreSize',
      label: 'Tyre Size',
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.TEXT,
      validators: [
        {
          name: ValidatorNames.MaxLength,
          args: 12
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
    column: 'code',
    heading: 'Code',
    order: 2
  },
  {
    column: 'dateTimeStamp',
    heading: 'Date-Time',
    order: 3
  },
  {
    column: 'description',
    heading: 'TRL Make',
    order: 4
  },
  {
    column: 'loadIndexSingleLoad',
    heading: 'Load Index Single',
    order: 5
  },
  {
    column: 'loadIndexTwinLoad',
    heading: 'Load Index Twin',
    order: 6
  },
  {
    column: 'plyRating',
    heading: 'Ply Rating',
    order: 7
  },
  {
    column: 'tyreSize',
    heading: 'Tyre Size',
    order: 8
  }
];
