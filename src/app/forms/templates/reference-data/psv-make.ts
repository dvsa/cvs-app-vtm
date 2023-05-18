import { ValidatorNames } from '@forms/models/validators.enum';
import { FormNode, FormNodeEditTypes, FormNodeTypes } from '@forms/services/dynamic-form.types';

export const template: FormNode = {
  name: 'dtpNumber',
  type: FormNodeTypes.GROUP,
  label: 'DTp Numbers',
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
      name: 'dtpNumber',
      label: 'DTp Number',
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.HIDDEN,
      validators: [
        {
          name: ValidatorNames.MaxLength,
          args: 6
        }
      ]
    },
    {
      name: 'psvBodyMake',
      label: 'PSV Body Make',
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.TEXT,
      validators: [
        {
          name: ValidatorNames.MaxLength,
          args: 20
        }
      ]
    },
    {
      name: 'psvBodyType',
      label: 'PSV Body Type',
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.DROPDOWN,
      validators: [
        {
          name: ValidatorNames.Required
        }
      ]
    },
    {
      name: 'psvChassisMake',
      label: 'PSV Chassis Make',
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.TEXT,
      validators: [
        {
          name: ValidatorNames.MaxLength,
          args: 20
        }
      ]
    },
    {
      name: 'psvChassisModel',
      label: 'PSV Chassis Model',
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.TEXT,
      validators: [
        {
          name: ValidatorNames.MaxLength,
          args: 20
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
    column: 'dateTimeStamp',
    heading: 'Date-Time',
    order: 2
  },
  {
    column: 'dtpNumber',
    heading: 'DTp Number',
    order: 3
  },
  {
    column: 'psvBodyMake',
    heading: 'PSV Body Make',
    order: 4
  },
  {
    column: 'psvBodyType',
    heading: 'PSV Body Type',
    order: 5
  },
  {
    column: 'psvChassisMake',
    heading: 'PSV Chassis Make',
    order: 6
  },
  {
    column: 'psvChassisModel',
    heading: 'PSV Chassis Model',
    order: 7
  }
];
