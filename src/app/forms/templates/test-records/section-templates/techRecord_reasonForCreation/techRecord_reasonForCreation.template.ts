import { ValidatorNames } from '@forms/models/validators.enum';
import { FormNode, FormNodeEditTypes, FormNodeTypes, FormNodeViewTypes } from '@forms/services/dynamic-form.types';

export const techRecord_reasonForCreationSection: FormNode = {
  name: 'reasonForCreationSection',
  label: 'Reason for creation',
  type: FormNodeTypes.GROUP,
  children: [
    {
      name: 'techRecord_reasonForCreation',
      label: 'Reason for creation',
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.HIDDEN,
      editType: FormNodeEditTypes.TEXTAREA,
      validators: [{ name: ValidatorNames.MaxLength, args: 500 }, { name: ValidatorNames.Required }]
    }
  ]
};

export const techRecord_reasonForCreationHiddenSection: FormNode = {
  name: 'requiredSection',
  label: 'Reason for creation',
  type: FormNodeTypes.GROUP,
  children: [
    {
      name: 'techRecord_reasonForCreation',
      label: 'Reason for creation',
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.HIDDEN,
      editType: FormNodeEditTypes.HIDDEN
    }
  ]
};
