import { AdrCertificateTemplate } from '@forms/templates/general/adr-certificate.template';
import { ApplicantDetails } from '@forms/templates/general/applicant-details.template';
import { HgvAndTrlTypeApprovalTemplate } from '@forms/templates/general/approval-type.template';
import { Audit } from '@forms/templates/general/audit.template';
import { PlatesTemplate } from '@forms/templates/general/plates.template';
import { TechRecordReasonForCreationSection } from '@forms/templates/general/reason-for-creation.template';
import { tyresTemplateHgv } from '@forms/templates/hgv/hgv-tyres.template';
import { HgvWeight } from '@forms/templates/hgv/hgv-weight.template';
import { PsvTypeApprovalTemplate } from '@forms/templates/psv/psv-approval-type.template';
import { PsvDdaTemplate } from '@forms/templates/psv/psv-dda.template';
import { PsvNotes } from '@forms/templates/psv/psv-notes.template';
import { PsvTyresTemplate } from '@forms/templates/psv/psv-tyres.template';
import { PsvWeightsTemplate } from '@forms/templates/psv/psv-weight.template';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { FormNode } from '@services/dynamic-forms/dynamic-form.types';
import { ManufacturerTemplate } from '../templates/general/manufacturer.template';
import { TrlAuthIntoServiceTemplate } from '../templates/trl/trl-auth-into-service.template';
import { TrlPurchasers } from '../templates/trl/trl-purchaser.template';
import { tyresTemplateTrl } from '../templates/trl/trl-tyres.template';
import { TrlWeight } from '../templates/trl/trl-weight.template';

// The map below initializes the array of sections that the *ngFor in tech summary component's template will iterate over.
// The order in which each section is introduced in the array will determine its order on the page when rendered.
// Sections which use custom components require a FormNode object with 'name' and 'label' properties.
const adrSection = { name: 'adrSection', label: 'ADR' } as FormNode;
const techRecordSection = { name: 'techRecordSummary', label: 'Vehicle summary' } as FormNode;
const notesSection = { name: 'notesSection', label: 'Notes' } as FormNode;
const bodySection = { name: 'bodySection', label: 'Body' } as FormNode;
const documentsSection = { name: 'documentsSection', label: 'Documents' } as FormNode;
const lettersSection = { name: 'lettersSection', label: 'Letters' } as FormNode;
const dimensionsSection = { name: 'dimensionsSection', label: 'Dimensions' } as FormNode;
const brakesSection = { name: 'brakesSection', label: 'Brakes' } as FormNode;

export const vehicleTemplateMap = new Map<VehicleTypes, Array<FormNode>>([
	[
		VehicleTypes.PSV,
		[
			/*  1 */ TechRecordReasonForCreationSection,
			/*  2 */ PsvNotes,
			/*  3 */ techRecordSection,
			/*  4 */ PsvTypeApprovalTemplate,
			/*  5 */ brakesSection,
			/*  6 */ PsvDdaTemplate,
			/*  7 */ documentsSection,
			/*  8 */ bodySection,
			/*  9 */ PsvWeightsTemplate,
			/* 10 */ PsvTyresTemplate,
			/* 11 */ dimensionsSection,
		],
	],
	[
		VehicleTypes.HGV,
		[
			/*  1 */ TechRecordReasonForCreationSection,
			/*  2 */ notesSection,
			/*  3 */ techRecordSection,
			/*  4 */ HgvAndTrlTypeApprovalTemplate,
			/*  5 */ ApplicantDetails,
			/*  6 */ documentsSection,
			/*  7 */ bodySection,
			/*  8 */ HgvWeight,
			/*  9 */ tyresTemplateHgv,
			/* 10 */ dimensionsSection,
			/* 11 */ PlatesTemplate,
			/* 12 */ adrSection,
			/* 13 */ AdrCertificateTemplate,
		],
	],
	[
		VehicleTypes.TRL,
		[
			/*  1 */ TechRecordReasonForCreationSection,
			/*  2 */ notesSection,
			/*  3 */ techRecordSection,
			/*  4 */ HgvAndTrlTypeApprovalTemplate,
			/*  5 */ ApplicantDetails,
			/*  6 */ documentsSection,
			/*  7 */ lettersSection,
			/*  8 */ bodySection,
			/*  9 */ TrlWeight,
			/* 10 */ tyresTemplateTrl,
			/* 11 */ brakesSection,
			/* 12 */ TrlPurchasers,
			/* 13 */ dimensionsSection,
			/* 14 */ PlatesTemplate,
			/* 15 */ TrlAuthIntoServiceTemplate,
			/* 16 */ ManufacturerTemplate,
			/* 17 */ adrSection,
			/* 18 */ AdrCertificateTemplate,
		],
	],
	[
		VehicleTypes.SMALL_TRL,
		[
			TechRecordReasonForCreationSection,
			/* 2 */ techRecordSection,
			/* 3 */ ApplicantDetails,
			/* 4 */ notesSection,
			/* 5 */ Audit,
		],
	],
	[
		VehicleTypes.LGV,
		[
			/* 1 */ TechRecordReasonForCreationSection,
			/* 2 */ techRecordSection,
			/* 3 */ ApplicantDetails,
			/* 4 */ notesSection,
			/* 5 */ Audit,
			/* 6 */ adrSection,
			/* 7 */ AdrCertificateTemplate,
		],
	],
	[
		VehicleTypes.CAR,
		[
			TechRecordReasonForCreationSection,
			/* 2 */ techRecordSection,
			/* 3 */ ApplicantDetails,
			/* 4 */ notesSection,
			/* 5 */ Audit,
		],
	],
	[
		VehicleTypes.MOTORCYCLE,
		[
			TechRecordReasonForCreationSection,
			/* 2 */ techRecordSection,
			/* 3 */ ApplicantDetails,
			/* 4 */ notesSection,
			/* 5 */ Audit,
		],
	],
]);
