import { HgvAndTrlTypeApprovalTemplate } from '@forms/templates/general/approval-type.template';
import { PlatesTemplate } from '@forms/templates/general/plates.template';
import { TechRecordReasonForCreationSection } from '@forms/templates/general/reason-for-creation.template';
import { tyresTemplateHgv } from '@forms/templates/hgv/hgv-tyres.template';
import { HgvWeight } from '@forms/templates/hgv/hgv-weight.template';
import { PsvTypeApprovalTemplate } from '@forms/templates/psv/psv-approval-type.template';
import { PsvNotes } from '@forms/templates/psv/psv-notes.template';
import { PsvTyresTemplate } from '@forms/templates/psv/psv-tyres.template';
import { PsvWeightsTemplate } from '@forms/templates/psv/psv-weight.template';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { FormNode } from '@services/dynamic-forms/dynamic-form.types';
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
const adrCertificateSection = { name: 'adrCertificateSection', label: 'ADR certificates' } as FormNode;
const auditSection = { name: 'auditSection', label: 'Audit' } as FormNode;
const ddaSection = { name: 'dda', label: 'Disability Discrimination Act' } as FormNode;
const lastApplicantSection = { name: 'techRecord', label: 'Last applicant' } as FormNode;
const manufacturerSection = { name: 'manufacturerSection', label: 'Manufacturer' } as FormNode;
const authorisationIntoServiceSection = {
	name: 'authorizationIntoServiceSection',
	label: 'Authorisation into service',
} as FormNode;

export const vehicleTemplateMap = new Map<VehicleTypes, Array<FormNode>>([
	[
		VehicleTypes.PSV,
		[
			/*  1 */ TechRecordReasonForCreationSection,
			/*  2 */ PsvNotes,
			/*  3 */ techRecordSection,
			/*  4 */ PsvTypeApprovalTemplate,
			/*  5 */ brakesSection,
			/*  6 */ ddaSection,
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
			/*  5 */ lastApplicantSection,
			/*  6 */ documentsSection,
			/*  7 */ bodySection,
			/*  8 */ HgvWeight,
			/*  9 */ tyresTemplateHgv,
			/* 10 */ dimensionsSection,
			/* 11 */ PlatesTemplate,
			/* 12 */ adrSection,
			/* 13 */ adrCertificateSection,
		],
	],
	[
		VehicleTypes.TRL,
		[
			/*  1 */ TechRecordReasonForCreationSection,
			/*  2 */ notesSection,
			/*  3 */ techRecordSection,
			/*  4 */ HgvAndTrlTypeApprovalTemplate,
			/*  5 */ lastApplicantSection,
			/*  6 */ documentsSection,
			/*  7 */ lettersSection,
			/*  8 */ bodySection,
			/*  9 */ TrlWeight,
			/* 10 */ tyresTemplateTrl,
			/* 11 */ brakesSection,
			/* 12 */ TrlPurchasers,
			/* 13 */ dimensionsSection,
			/* 14 */ PlatesTemplate,
			/* 15 */ authorisationIntoServiceSection,
			/* 16 */ manufacturerSection,
			/* 17 */ adrSection,
			/* 18 */ adrCertificateSection,
		],
	],
	[
		VehicleTypes.SMALL_TRL,
		[
			TechRecordReasonForCreationSection,
			/* 2 */ techRecordSection,
			/* 3 */ lastApplicantSection,
			/* 4 */ notesSection,
			/* 5 */ auditSection,
		],
	],
	[
		VehicleTypes.LGV,
		[
			/* 1 */ TechRecordReasonForCreationSection,
			/* 2 */ techRecordSection,
			/* 3 */ lastApplicantSection,
			/* 4 */ notesSection,
			/* 5 */ auditSection,
			/* 6 */ adrSection,
			/* 7 */ adrCertificateSection,
		],
	],
	[
		VehicleTypes.CAR,
		[
			TechRecordReasonForCreationSection,
			/* 2 */ techRecordSection,
			/* 3 */ lastApplicantSection,
			/* 4 */ notesSection,
			/* 5 */ auditSection,
		],
	],
	[
		VehicleTypes.MOTORCYCLE,
		[
			TechRecordReasonForCreationSection,
			/* 2 */ techRecordSection,
			/* 3 */ lastApplicantSection,
			/* 4 */ notesSection,
			/* 5 */ auditSection,
		],
	],
]);
