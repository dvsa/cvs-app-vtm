import { FormNode, FormNodeTypes, FormNodeViewTypes } from '@forms/services/dynamic-form.types';

export const Audit: FormNode = {
  name: 'audit',
  type: FormNodeTypes.GROUP,
  label: 'Audit',
  children: [
    {
      name: 'techRecord_reasonForCreation',
      label: 'Reason for creation',
      value: '',
      type: FormNodeTypes.CONTROL,
      validators: []
    },
    {
      name: 'techRecord_createdAt',
      label: 'Created at',
      value: '',
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.DATETIME
    },
    {
      name: 'techRecord_createdByName',
      label: 'Created by',
      value: '',
      type: FormNodeTypes.CONTROL
    },
    {
      name: 'techRecord_createdById',
      label: 'Created by ID',
      value: '',
      type: FormNodeTypes.CONTROL
    },
    {
      name: 'techRecord_lastUpdatedAt',
      label: 'Last updated at',
      value: '',
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.DATETIME
    },
    {
      name: 'techRecord_lastUpdatedByName',
      label: 'Last updated by',
      value: '',
      type: FormNodeTypes.CONTROL
    },
    {
      name: 'techRecord_lastUpdatedById',
      label: 'Last updated by ID',
      value: '',
      type: FormNodeTypes.CONTROL
    }
  ]
};
