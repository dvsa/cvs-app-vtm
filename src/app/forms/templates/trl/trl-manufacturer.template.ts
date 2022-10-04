import { ValidatorNames } from '@forms/models/validators.enum';
import { FormNode, FormNodeEditTypes, FormNodeTypes, FormNodeViewTypes, Width } from '../../services/dynamic-form.types';

export const TrlManufacturerTemplate: FormNode = {
  name: 'manufacturerSection',
  label: 'Manufacturer',
  type: FormNodeTypes.GROUP,
  children: [
    {
      name: 'manufacturerDetails',
      type: FormNodeTypes.GROUP,
      children: [
        {
          name: 'name',
          label: 'Name',
          type: FormNodeTypes.CONTROL,
          width: Width.THREE_QUARTER,
          validators: [{ name: ValidatorNames.MaxLength, args: 150 }]
        },
        {
          name: 'address1',
          label: 'Building and street',
          type: FormNodeTypes.CONTROL,
          width: Width.THREE_QUARTER,
          validators: [{ name: ValidatorNames.MaxLength, args: 60 }]
        },
        {
          name: 'address2',
          label: 'Building and street',
          type: FormNodeTypes.CONTROL,
          width: Width.THREE_QUARTER,
          validators: [{ name: ValidatorNames.MaxLength, args: 60 }]
        },
        {
          name: 'postTown',
          label: 'Town or city',
          type: FormNodeTypes.CONTROL,
          width: Width.ONE_HALF,
          validators: [{ name: ValidatorNames.MaxLength, args: 60 }]
        },
        {
          name: 'address3',
          label: 'County',
          type: FormNodeTypes.CONTROL,
          width: Width.ONE_HALF,
          validators: [{ name: ValidatorNames.MaxLength, args: 60 }]
        },
        {
          name: 'postCode',
          label: 'Postcode',
          type: FormNodeTypes.CONTROL,
          width: Width.ONE_THIRD,
          validators: [{ name: ValidatorNames.MaxLength, args: 12 }]
        },
        {
          name: 'telephonenumber',
          label: 'Telephone number',
          type: FormNodeTypes.CONTROL,
          width: Width.ONE_HALF,
          validators: [{ name: ValidatorNames.MaxLength, args: 25 }]
        },
        {
          name: 'emailAddress',
          label: 'Email address',
          type: FormNodeTypes.CONTROL,
          width: Width.ONE_HALF,
          validators: [{ name: ValidatorNames.MaxLength, args: 255 }]
        },
        {
          name: 'faxNumber',
          label: 'Fax Number',
          type: FormNodeTypes.CONTROL,
          width: Width.ONE_HALF,
          validators: [{ name: ValidatorNames.MaxLength, args: 25 }]
        },
        {
          name: 'manufacturerNotes',
          label: 'Manufacturer Notes',
          type: FormNodeTypes.CONTROL,
          editType: FormNodeEditTypes.TEXTAREA,
          validators: [{ name: ValidatorNames.MaxLength, args: 1024 }]
        },
      ]
    }
  ]
};
