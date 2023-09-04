import { FormNode, FormNodeEditTypes, FormNodeTypes, FormNodeViewTypes } from '../../services/dynamic-form.types';

export const TrlAuthIntoServiceTemplate: FormNode = {
  name: 'authorizationIntoServiceSection',
  label: 'Authorisation into service',
  type: FormNodeTypes.GROUP,
  children: [
    {
      name: 'techRecord_authIntoService_cocIssueDate',
      label: 'COC issue date',
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.DATE,
      editType: FormNodeEditTypes.DATE,
      isoDate: false
    },
    {
      name: 'techRecord_authIntoService_dateReceived',
      label: 'Date received',
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.DATE,
      editType: FormNodeEditTypes.DATE,
      isoDate: false
    },
    {
      name: 'techRecord_authIntoService_datePending',
      label: 'Date pending',
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.DATE,
      editType: FormNodeEditTypes.DATE,
      isoDate: false
    },
    {
      name: 'techRecord_authIntoService_dateAuthorised',
      label: 'Date authorised',
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.DATE,
      editType: FormNodeEditTypes.DATE,
      isoDate: false
    },
    {
      name: 'techRecord_authIntoService_dateRejected',
      label: 'Date rejected',
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.DATE,
      editType: FormNodeEditTypes.DATE,
      isoDate: false
    }
  ]
};
