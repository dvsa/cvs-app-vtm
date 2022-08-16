import { ValidatorNames } from '@forms/models/validators.enum';
import { FormNode, FormNodeEditTypes, FormNodeTypes, FormNodeViewTypes } from '@forms/services/dynamic-form.types';

export const reasonForCreationSection: FormNode = {
  name: 'reasonForCreationSection',
  type: FormNodeTypes.GROUP,
  children: [
    {
      name: 'reasonForCreation',
      label: 'Reason for creation',
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.HIDDEN,
      editType: FormNodeEditTypes.TEXTAREA,
      validators: [{ name: ValidatorNames.MaxLength, args: 500 }, { name: ValidatorNames.Required }]
    }
  ]
};
