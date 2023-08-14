import { FormNode } from '@forms/services/dynamic-form.types';
import { CarTechRecord } from '@forms/templates/car/car-tech-record.template';
import { ApplicantDetails } from '@forms/templates/general/applicant-details.template';
import { HgvAndTrlTypeApprovalTemplate } from '@forms/templates/general/approval-type.template';
import { Audit } from '@forms/templates/general/audit.template';
import { DocumentsTemplate } from '@forms/templates/general/documents.template';
import { HgvAndTrlBodyTemplate } from '@forms/templates/general/hgv-trl-body.template';
import { LettersTemplate } from '@forms/templates/general/letters.template';
import { ManufacturerTemplate } from '@forms/templates/general/manufacturer.template';
import { NotesTemplate } from '@forms/templates/general/notes.template';
import { PlatesTemplate } from '@forms/templates/general/plates.template';
import { HgvDimensionsTemplate } from '@forms/templates/hgv/hgv-dimensions.template';
import { HgvTechRecord } from '@forms/templates/hgv/hgv-tech-record.template';
import { tyresTemplateHgv } from '@forms/templates/hgv/hgv-tyres.template';
import { HgvWeight } from '@forms/templates/hgv/hgv-weight.template';
import { LgvTechRecord } from '@forms/templates/lgv/lgv-tech-record.template';
import { MotorcycleTechRecord } from '@forms/templates/motorcycle/motorcycle-tech-record.template';
import { PsvTypeApprovalTemplate } from '@forms/templates/psv/psv-approval-type.template';
import { PsvBodyTemplate } from '@forms/templates/psv/psv-body.template';
import { PsvBrakesTemplate } from '@forms/templates/psv/psv-brakes.template';
import { PsvDdaTemplate } from '@forms/templates/psv/psv-dda.template';
import { PsvDimensionsTemplate } from '@forms/templates/psv/psv-dimensions.template';
import { PsvNotes } from '@forms/templates/psv/psv-notes.template';
import { PsvTechRecord } from '@forms/templates/psv/psv-tech-record.template';
import { PsvTyresTemplate } from '@forms/templates/psv/psv-tyres.template';
import { PsvWeightsTemplate } from '@forms/templates/psv/psv-weight.template';
import { SmallTrailerTechRecord } from '@forms/templates/small-trailer/small-trailer-tech-record.template';

import { TechRecordReasonForCreationSection } from '@forms/templates/test-records/section-templates/techRecord_reasonForCreation/techRecordReasonForCreation.template';
import { TrlAuthIntoServiceTemplate } from '@forms/templates/trl/trl-auth-into-service.template';
import { TrlBrakesTemplate } from '@forms/templates/trl/trl-brakes.template';
import { TrlDimensionsTemplate } from '@forms/templates/trl/trl-dimensions.template';
import { TrlPurchasers } from '@forms/templates/trl/trl-purchaser.template';
import { TrlTechRecordTemplate } from '@forms/templates/trl/trl-tech-record.template';
import { tyresTemplateTrl } from '@forms/templates/trl/trl-tyres.template';
import { TrlWeight } from '@forms/templates/trl/trl-weight.template';
import { VehicleTypes } from '@models/vehicle-tech-record.model';

// The map below initializes the array of sections that the *ngFor in tech summary component's template will iterate over.
// The order in which each section is introduced in the array will determine its order on the page when rendered.
// Sections which use custom components require a FormNode object with 'name' and 'label' properties.

export const vehicleTemplateMap = new Map<VehicleTypes, Array<FormNode>>([
  [
    VehicleTypes.PSV,
    [
      /*  1 */ TechRecordReasonForCreationSection,
      /*  2 */ PsvNotes,
      /*  3 */ PsvTechRecord,
      /*  4 */ PsvTypeApprovalTemplate,
      /*  5 */ PsvBrakesTemplate,
      /*  6 */ PsvDdaTemplate,
      /*  7 */ DocumentsTemplate,
      /*  8 */ PsvBodyTemplate,
      /*  9 */ PsvWeightsTemplate,
      /* 10 */ PsvTyresTemplate,
      /* 11 */ PsvDimensionsTemplate
    ]
  ],
  [
    VehicleTypes.HGV,
    [
      /*  1 */ TechRecordReasonForCreationSection,
      /*  2 */ NotesTemplate,
      /*  3 */ HgvTechRecord,
      /*  4 */ HgvAndTrlTypeApprovalTemplate,
      /*  5 */ ApplicantDetails,
      /*  6 */ DocumentsTemplate,
      /*  7 */ HgvAndTrlBodyTemplate,
      /*  8 */ HgvWeight,
      /*  9 */ tyresTemplateHgv,
      /* 10 */ HgvDimensionsTemplate,
      /* 11 */ PlatesTemplate
    ]
  ],
  [
    VehicleTypes.TRL,
    [
      /*  1 */ TechRecordReasonForCreationSection,
      /*  2 */ NotesTemplate,
      /*  3 */ TrlTechRecordTemplate,
      /*  4 */ HgvAndTrlTypeApprovalTemplate,
      /*  5 */ ApplicantDetails,
      /*  6 */ DocumentsTemplate,
      /*  7 */ LettersTemplate,
      /*  8 */ HgvAndTrlBodyTemplate,
      /*  9 */ TrlWeight,
      /* 10 */ tyresTemplateTrl,
      /* 11 */ TrlBrakesTemplate,
      /* 12 */ TrlPurchasers,
      /* 13 */ TrlDimensionsTemplate,
      /* 14 */ PlatesTemplate,
      /* 15 */ TrlAuthIntoServiceTemplate,
      /* 16 */ ManufacturerTemplate
    ]
  ],
  [
    VehicleTypes.SMALL_TRL,
    [/* 1 */ TechRecordReasonForCreationSection, /* 2 */ SmallTrailerTechRecord, /* 3 */ ApplicantDetails, /* 4 */ NotesTemplate, /* 5 */ Audit]
  ],
  [
    VehicleTypes.LGV,
    [/* 1 */ TechRecordReasonForCreationSection, /* 2 */ LgvTechRecord, /* 3 */ ApplicantDetails, /* 4 */ NotesTemplate, /* 5 */ Audit]
  ],
  [
    VehicleTypes.CAR,
    [/* 1 */ TechRecordReasonForCreationSection, /* 2 */ CarTechRecord, /* 3 */ ApplicantDetails, /* 4 */ NotesTemplate, /* 5 */ Audit]
  ],
  [
    VehicleTypes.MOTORCYCLE,
    [/* 1 */ TechRecordReasonForCreationSection, /* 2 */ MotorcycleTechRecord, /* 3 */ ApplicantDetails, /* 4 */ NotesTemplate, /* 5 */ Audit]
  ]
]);
