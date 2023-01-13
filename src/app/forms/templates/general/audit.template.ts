import { ValidatorNames } from '@forms/models/validators.enum';
import { FormNode, FormNodeTypes, FormNodeViewTypes } from '@forms/services/dynamic-form.types';

export const Audit: FormNode = {
  name: 'audit',
  type: FormNodeTypes.GROUP,
  label: 'Audit',
  children: [
    {
      name: 'reasonForCreation',
      label: 'Reason for creation',
      value: '',
      type: FormNodeTypes.CONTROL,
      validators: [{ name: ValidatorNames.Required }]
    },
    {
      name: 'createdAt',
      label: 'Created at',
      value: '',
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.DATETIME
    },
    {
      name: 'createdByName',
      label: 'Created by',
      value: '',
      type: FormNodeTypes.CONTROL
    },
    {
      name: 'createdById',
      label: 'Created by ID',
      value: '',
      type: FormNodeTypes.CONTROL
    },
    {
      name: 'lastUpdatedAt',
      label: 'Last updated at',
      value: '',
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.DATETIME
    },
    {
      name: 'lastUpdatedByName',
      label: 'Last updated by',
      value: '',
      type: FormNodeTypes.CONTROL
    },
    {
      name: 'lastUpdatedById',
      label: 'Last updated by ID',
      value: '',
      type: FormNodeTypes.CONTROL
    }
  ]
};
