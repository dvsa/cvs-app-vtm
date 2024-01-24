import { FormNode, FormNodeTypes, FormNodeViewTypes } from '@forms/services/dynamic-form.types';
import {
  TechRecordAdrCertificateHistoryComponent,
} from '@forms/custom-sections/tech-record-adr-certificate-history/tech-record-adr-certificate-history.component';

export const AdrCertificateTemplate: FormNode = {
  name: 'adrCertificateSection',
  type: FormNodeTypes.SECTION,
  label: 'ADR Certificates',
  children: [
    {
      name: 'techRecord_adrDetails_certificates',
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.CUSTOM,
      viewComponent: TechRecordAdrCertificateHistoryComponent,
    },
  ],
};
