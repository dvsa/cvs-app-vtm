import { AdrCertificateHistoryComponent } from '@forms/custom-sections/adr-certificate-history/adr-certificate-history.component';
import { FormNode, FormNodeTypes, FormNodeViewTypes } from '@services/dynamic-forms/dynamic-form.types';

export const AdrCertificateTemplate: FormNode = {
	name: 'adrCertificateSection',
	type: FormNodeTypes.SECTION,
	label: 'ADR certificates',
	children: [
		{
			name: 'techRecord_adrDetails_certificates',
			type: FormNodeTypes.CONTROL,
			viewType: FormNodeViewTypes.CUSTOM,
			viewComponent: AdrCertificateHistoryComponent,
		},
	],
};
