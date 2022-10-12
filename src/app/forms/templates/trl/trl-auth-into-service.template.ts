import { FormNode, FormNodeEditTypes, FormNodeTypes, FormNodeViewTypes } from '../../services/dynamic-form.types';

export const TrlAuthIntoServiceTemplate: FormNode = {
  name: 'authorizationIntoServiceSection',
  label: 'Authorisation into service',
  type: FormNodeTypes.GROUP,
  children: [
    {
      name: 'authIntoService',
      type: FormNodeTypes.GROUP,
      children: [
        {
          name: 'cocIssueDate',
          label: 'COC issue date',
          type: FormNodeTypes.CONTROL,
          viewType: FormNodeViewTypes.DATE,
          editType: FormNodeEditTypes.DATE,
          returnTime: false
        },
        {
          name: 'dateReceived',
          label: 'Date received',
          type: FormNodeTypes.CONTROL,
          viewType: FormNodeViewTypes.DATE,
          editType: FormNodeEditTypes.DATE,
          returnTime: false
        },
        {
          name: 'datePending',
          label: 'Date pending',
          type: FormNodeTypes.CONTROL,
          viewType: FormNodeViewTypes.DATE,
          editType: FormNodeEditTypes.DATE,
          returnTime: false
        },
        {
          name: 'dateAuthorised',
          label: 'Date authorised',
          type: FormNodeTypes.CONTROL,
          viewType: FormNodeViewTypes.DATE,
          editType: FormNodeEditTypes.DATE,
          returnTime: false
        },
        {
          name: 'dateRejected',
          label: 'Date rejected',
          type: FormNodeTypes.CONTROL,
          viewType: FormNodeViewTypes.DATE,
          editType: FormNodeEditTypes.DATE,
          returnTime: false
        }
      ]
    }
  ]
};
