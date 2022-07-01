import { FormNode, FormNodeTypes, FormNodeViewTypes } from '../../services/dynamic-form.types';

export const TrlAuthIntoServiceTemplate: FormNode = {
  name: 'authorizationIntoServiceSection',
  label: 'Authorisation into service',
  type: FormNodeTypes.GROUP,
  viewType: FormNodeViewTypes.SUBHEADING,
  children: [
    {
      name: 'authIntoService',
      type: FormNodeTypes.GROUP,
      children: [
        {
          name: 'cocIssueDate',
          label: 'COC issue date',
          type: FormNodeTypes.CONTROL,
          viewType: FormNodeViewTypes.DATE
        },
        {
          name: 'dateReceived',
          label: 'Date received',
          type: FormNodeTypes.CONTROL,
          viewType: FormNodeViewTypes.DATE
        },
        {
          name: 'datePending',
          label: 'Date pending',
          type: FormNodeTypes.CONTROL,
          viewType: FormNodeViewTypes.DATE
        },
        {
          name: 'dateAuthorised',
          label: 'Date authorised',
          type: FormNodeTypes.CONTROL,
          viewType: FormNodeViewTypes.DATE
        },
        {
          name: 'dateRejected',
          label: 'Date rejected',
          type: FormNodeTypes.CONTROL,
          viewType: FormNodeViewTypes.DATE
        }
      ]
    }
  ]
};
