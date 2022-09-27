import { FormNode } from '@forms/services/dynamic-form.types';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { DefectsTpl } from '../general/defect.template';
import { CustomDefectsSection } from './section-templates/customDefects/custom-defects-section.template';
import { EmissionsSection } from './section-templates/emissions/emissions-section.template';
import { NotesSection } from './section-templates/notes/notes-section.template';
import { reasonForCreationSection } from './section-templates/reasonForCreation/resonForCreation.template';
import { CreateRequiredSection } from './section-templates/required/contingency-required-hidden-section.template';
import { RequiredSection } from './section-templates/required/required-hidden-section.template';
import { SeatbeltSection } from './section-templates/seatbelt/seatbelt-section.template';
import { ContingencyTestSectionGroup1 } from './section-templates/test/contingency-test-section-group1.template';
import { TestSection } from './section-templates/test/test-section.template';
import { ContingencyVehicleSectionDefaultPsvHgv } from './section-templates/vehicle/contingency-default-psv-hgv-vehicle-section.template';
import { VehicleSectionDefaultPsvHgv } from './section-templates/vehicle/default-psv-hgv-vehicle-section.template';
import { ContingencyVisitSection } from './section-templates/visit/contingency-visit-section.template';
import { VisitSection } from './section-templates/visit/visit-section.template';
import { VehicleSectionDefaultTrl } from './section-templates/vehicle/default-trl-vehicle-section.template';
import { ContingencyVehicleSectionDefaultTrl } from './section-templates/vehicle/contingency-default-trl-vehicle-section.template';
import { ContingencyTestSectionGroup9And10 } from './section-templates/test/contingency-test-section-group9And10.template';
import { CreateRequiredSectionHgvTrl } from './section-templates/required/contingency-required-hidden-section-hgv-trl.template';

const groups1and2Template: Record<string, FormNode> = {
  required: CreateRequiredSection,
  vehicle: ContingencyVehicleSectionDefaultPsvHgv,
  test: ContingencyTestSectionGroup1,
  seatbelts: SeatbeltSection,
  visit: ContingencyVisitSection,
  notes: NotesSection,
  defects: DefectsTpl,
  customDefects: CustomDefectsSection,
  reasonForCreation: reasonForCreationSection
}

export const contingencyTestTemplates: Record<VehicleTypes, Record<string, Record<string, FormNode>>> = {
  psv: {
    default: {
      vehicle: VehicleSectionDefaultPsvHgv,
      test: TestSection,
      seatbelts: SeatbeltSection,
      emissions: EmissionsSection,
      visit: VisitSection,
      notes: NotesSection,
      defects: DefectsTpl,
      customDefects: CustomDefectsSection,
      required: RequiredSection
    },
    testTypesGroup1: groups1and2Template,
    testTypesGroup2: groups1and2Template
  },
  hgv: {
    default: {}
  },
  trl: {
    default: {
      vehicle: VehicleSectionDefaultTrl,
      test: TestSection,
      visit: VisitSection,
      notes: NotesSection,
      defects: DefectsTpl,
      customDefects: CustomDefectsSection,
      required: CreateRequiredSectionHgvTrl
    },
    testTypesGroup9And10: {
      required: CreateRequiredSectionHgvTrl,
      vehicle: ContingencyVehicleSectionDefaultTrl,
      test: ContingencyTestSectionGroup9And10,
      visit: ContingencyVisitSection,
      notes: NotesSection,
      defects: DefectsTpl,
      customDefects: CustomDefectsSection,
      reasonForCreation: reasonForCreationSection
    }
  }
};
