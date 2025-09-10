import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { FormNode } from '@services/dynamic-forms/dynamic-form.types';

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
const auditSection = { name: 'audit', label: 'Audit' } as FormNode;
const ddaSection = { name: 'dda', label: 'Disability Discrimination Act' } as FormNode;
const lastApplicantSection = { name: 'techRecord', label: 'Last applicant' } as FormNode;
const manufacturerSection = { name: 'manufacturerSection', label: 'Manufacturer' } as FormNode;
const authorisationIntoServiceSection = {
	name: 'authorizationIntoServiceSection',
	label: 'Authorisation into service',
} as FormNode;
const purchaserSection = { name: 'purchaserSection', label: 'Purchasers' } as FormNode;
const reasonForCreationSection = { name: 'reasonForCreationSection', label: 'Reason for creation' } as FormNode;
const tyresSection = { name: 'tyreSection', label: 'Tyres' } as FormNode;
const weightsSection = { name: 'weightsSection', label: 'Weights' } as FormNode;
const platesSection = { name: 'platesSection', label: 'Plates' } as FormNode;
const approvalSection = { name: 'approvalSection', label: 'Approval type' } as FormNode;

export const vehicleTemplateMap = new Map<VehicleTypes, Array<FormNode>>([
	[
		VehicleTypes.PSV,
		[
			/*  1 */ reasonForCreationSection,
			/*  2 */ notesSection,
			/*  3 */ techRecordSection,
			/*  4 */ approvalSection,
			/*  5 */ brakesSection,
			/*  6 */ ddaSection,
			/*  7 */ documentsSection,
			/*  8 */ bodySection,
			/*  9 */ weightsSection,
			/* 10 */ tyresSection,
			/* 11 */ dimensionsSection,
		],
	],
	[
		VehicleTypes.HGV,
		[
			/*  1 */ reasonForCreationSection,
			/*  2 */ notesSection,
			/*  3 */ techRecordSection,
			/*  4 */ approvalSection,
			/*  5 */ lastApplicantSection,
			/*  6 */ documentsSection,
			/*  7 */ bodySection,
			/*  8 */ weightsSection,
			/*  9 */ tyresSection,
			/* 10 */ dimensionsSection,
			/* 11 */ platesSection,
			/* 12 */ adrSection,
			/* 13 */ adrCertificateSection,
		],
	],
	[
		VehicleTypes.TRL,
		[
			/*  1 */ reasonForCreationSection,
			/*  2 */ notesSection,
			/*  3 */ techRecordSection,
			/*  4 */ approvalSection,
			/*  5 */ lastApplicantSection,
			/*  6 */ documentsSection,
			/*  7 */ lettersSection,
			/*  8 */ bodySection,
			/*  9 */ weightsSection,
			/* 10 */ tyresSection,
			/* 11 */ brakesSection,
			/* 12 */ purchaserSection,
			/* 13 */ dimensionsSection,
			/* 14 */ platesSection,
			/* 15 */ authorisationIntoServiceSection,
			/* 16 */ manufacturerSection,
			/* 17 */ adrSection,
			/* 18 */ adrCertificateSection,
		],
	],
	[
		VehicleTypes.SMALL_TRL,
		[
			reasonForCreationSection,
			/* 2 */ techRecordSection,
			/* 3 */ lastApplicantSection,
			/* 4 */ notesSection,
			/* 5 */ auditSection,
		],
	],
	[
		VehicleTypes.LGV,
		[
			/* 1 */ reasonForCreationSection,
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
			reasonForCreationSection,
			/* 2 */ techRecordSection,
			/* 3 */ lastApplicantSection,
			/* 4 */ notesSection,
			/* 5 */ auditSection,
		],
	],
	[
		VehicleTypes.MOTORCYCLE,
		[
			reasonForCreationSection,
			/* 2 */ techRecordSection,
			/* 3 */ lastApplicantSection,
			/* 4 */ notesSection,
			/* 5 */ auditSection,
		],
	],
]);
