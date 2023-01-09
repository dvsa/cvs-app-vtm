import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { FormNode } from '@forms/services/dynamic-form.types';
import { PsvNotes } from '@forms/templates/psv/psv-notes.template';
import { PsvTechRecord } from '@forms/templates/psv/psv-tech-record.template';
import { PsvTypeApprovalTemplate } from '@forms/templates/psv/psv-approval-type.template';
import { PsvBrakesTemplate } from '@forms/templates/psv/psv-brakes.template';
import { PsvDdaTemplate } from '@forms/templates/psv/psv-dda.template';
import { DocumentsTemplate } from '@forms/templates/general/documents.template';
import { PsvBodyTemplate } from '@forms/templates/psv/psv-body.template';
import { PsvWeightsTemplate } from '@forms/templates/psv/psv-weight.template';
import { PsvTyresTemplate } from '@forms/templates/psv/psv-tyres.template';
import { PsvDimensionsTemplate } from '@forms/templates/psv/psv-dimensions.template';
import { NotesTemplate } from '@forms/templates/general/notes.template';
import { HgvTechRecord } from '@forms/templates/hgv/hgv-tech-record.template';
import { HgvAndTrlTypeApprovalTemplate } from '@forms/templates/general/approval-type.template';
import { ApplicantDetails } from '@forms/templates/general/applicant-details.template';
import { HgvAndTrlBodyTemplate } from '@forms/templates/general/hgv-trl-body.template';
import { HgvWeight } from '@forms/templates/hgv/hgv-weight.template';
import { tyresTemplateHgv } from '@forms/templates/hgv/hgv-tyres.template';
import { HgvDimensionsTemplate } from '@forms/templates/hgv/hgv-dimensions.template';
import { PlatesTemplate } from '@forms/templates/general/plates.template';
import { TrlTechRecordTemplate } from '@forms/templates/trl/trl-tech-record.template';
import { TrlWeight } from '@forms/templates/trl/trl-weight.template';
import { tyresTemplateTrl } from '@forms/templates/trl/trl-tyres.template';
import { TrlBrakesTemplate } from '@forms/templates/trl/trl-brakes.template';
import { TrlPurchasers } from '@forms/templates/trl/trl-purchaser.template';
import { TrlDimensionsTemplate } from '@forms/templates/trl/trl-dimensions.template';
import { TrlAuthIntoServiceTemplate } from '@forms/templates/trl/trl-auth-into-service.template';
import { ManufacturerTemplate } from '@forms/templates/general/manufacturer.template';
import { LgvTechRecord } from '@forms/templates/lgv/lgv-tech-record.template';
import { Audit } from '@forms/templates/general/audit.template';
import { CarTechRecord } from '@forms/templates/car/car-tech-record.template';
import { MotorcycleTechRecord } from '@forms/templates/motorcycle/motorcycle-tech-record.template';

// The map below initialize the array of sections that the *ngFor in the component's template will iterate over.
// The order in which each section is introduced in the array will determine its order on the page when rendered.
// Sections which use custom components require a FormNode object with 'name' and 'label' properties.

export const vehicleTemplateMap = new Map<VehicleTypes, Array<FormNode>>([
  [
    VehicleTypes.PSV,
    [
      /*  1 */ // reasonForCreationSection added when editing
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
      /*  1 */ // reasonForCreationSection added when editing
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
      /*  1 */ // reasonForCreationSection added when editing
      /*  2 */ NotesTemplate,
      /*  3 */ TrlTechRecordTemplate,
      /*  4 */ HgvAndTrlTypeApprovalTemplate,
      /*  5 */ ApplicantDetails,
      /*  6 */ DocumentsTemplate,
      /*  7 */ HgvAndTrlBodyTemplate,
      /*  8 */ TrlWeight,
      /*  9 */ tyresTemplateTrl,
      /* 10 */ TrlBrakesTemplate,
      /* 11 */ TrlPurchasers,
      /* 12 */ TrlDimensionsTemplate,
      /* 13 */ PlatesTemplate,
      /* 14 */ TrlAuthIntoServiceTemplate,
      /* 15 */ ManufacturerTemplate
    ]
  ],
  [
    VehicleTypes.LGV,
    [
      /*  1 */ // reasonForCreationSection added when editing
      /*  2*/ LgvTechRecord,
      /*  3 */ ApplicantDetails,
      /*  4 */ NotesTemplate,
      /*  5 */ Audit
    ]
  ],
  [
    VehicleTypes.CAR,
    [
      /*  1 */ // reasonForCreationSection added when editing
      /*  2 */ CarTechRecord,
      /*  3 */ ApplicantDetails,
      /*  4 */ NotesTemplate,
      /*  5 */ Audit
    ]
  ],
  [
    VehicleTypes.MOTORCYCLE,
    [
      /*  1 */ // reasonForCreationSection added when editing
      /*  2 */ MotorcycleTechRecord,
      /*  3 */ ApplicantDetails,
      /*  4 */ NotesTemplate,
      /*  5 */ Audit
    ]
  ]
]);
