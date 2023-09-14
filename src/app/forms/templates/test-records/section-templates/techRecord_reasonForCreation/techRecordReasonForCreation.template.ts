import { ValidatorNames } from '@forms/models/validators.enum';
import { TagTypeLabels, FormNode, FormNodeEditTypes, FormNodeTypes, FormNodeViewTypes } from '@forms/services/dynamic-form.types';
import { TagType } from '@shared/components/tag/tag.component';

export const TechRecordReasonForCreationSection: FormNode = {
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
      validators: [{ name: ValidatorNames.MaxLength, args: 500 }, { name: ValidatorNames.Required }],
      customTags: [{ colour: TagType.RED, label: TagTypeLabels.TESTABLE }]
    }
  ]
};

export const TechRecordReasonForCreationHiddenSection: FormNode = {
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
