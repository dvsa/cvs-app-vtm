import { FormNode } from '@forms/services/dynamic-form.types';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { DefectsTpl } from '../general/defect.template';
import { CustomDefectsSection } from './section-templates/customDefects/custom-defects-section.template';
import { EmissionsSection } from './section-templates/emissions/emissions-section.template';
import { NotesSection } from './section-templates/notes/notes-section.template';
import { reasonForCreationSection } from './section-templates/reasonForCreation/resonForCreation.template';
import { CreateRequiredSection } from './section-templates/required/contingency-required-hidden-section.template';
import { SeatbeltSection } from './section-templates/seatbelt/seatbelt-section.template';
import { ContingencyTestSectionGroup1 } from './section-templates/test/contingency-test-section-group1.template';
import { TestSection } from './section-templates/test/test-section.template';
import { ContingencyVehicleSectionDefaultPsvHgv } from './section-templates/vehicle/contingency-default-psv-hgv-vehicle-section.template';
import { ContingencyVisitSection } from './section-templates/visit/contingency-visit-section.template';
import { VisitSection } from './section-templates/visit/visit-section.template';
import { ContingencyVehicleSectionDefaultTrl } from './section-templates/vehicle/contingency-default-trl-vehicle-section.template';
import { ContingencyTestSectionGroup9And10 } from './section-templates/test/contingency-test-section-group9And10.template';
import { ContingencyTestSectionGroup12and14 } from './section-templates/test/contingency-test-section-group12and14.template';
import { CreateRequiredSectionHgvTrl } from './section-templates/required/contingency-required-hidden-section-hgv-trl.template';
import { ContingencyTestSectionGroup3And4And8 } from './section-templates/test/contingency-test-section-group3And4And8.template';
import { ContingencyTestSectionSpecialistGroup5 } from './section-templates/test/contingency-test-section-specialist-group5.template';

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
};

export const contingencyTestTemplates: Record<VehicleTypes, Record<string, Record<string, FormNode>>> = {
  psv: {
    default: {
      vehicle: ContingencyVehicleSectionDefaultPsvHgv,
      test: TestSection,
      seatbelts: SeatbeltSection,
      emissions: EmissionsSection,
      visit: ContingencyVisitSection,
      notes: NotesSection,
      defects: DefectsTpl,
      customDefects: CustomDefectsSection,
      required: CreateRequiredSection
    },
    testTypesGroup1: groups1and2Template,
    testTypesGroup2: groups1and2Template,
    testTypesGroup3And4And8: {
      vehicle: ContingencyVehicleSectionDefaultPsvHgv,
      test: ContingencyTestSectionGroup3And4And8,
      visit: ContingencyVisitSection,
      notes: NotesSection,
      customDefects: CustomDefectsSection,
      reasonForCreation: reasonForCreationSection,
      required: CreateRequiredSection
    },
    testTypesSpecialistGroup5: {
      vehicle: ContingencyVehicleSectionDefaultPsvHgv,
      test: ContingencyTestSectionSpecialistGroup5,
      visit: ContingencyVisitSection,
      notes: NotesSection,
      customDefects: CustomDefectsSection,
      reasonForCreation: reasonForCreationSection,
      required: CreateRequiredSection
    }
  },
  hgv: {
    default: {
      vehicle: ContingencyVehicleSectionDefaultPsvHgv,
      test: TestSection,
      visit: VisitSection,
      notes: NotesSection,
      defects: DefectsTpl,
      customDefects: CustomDefectsSection,
      required: CreateRequiredSectionHgvTrl
    },
    testTypesGroup9And10: {
      required: CreateRequiredSectionHgvTrl,
      vehicle: ContingencyVehicleSectionDefaultPsvHgv,
      test: ContingencyTestSectionGroup9And10,
      visit: ContingencyVisitSection,
      notes: NotesSection,
      defects: DefectsTpl,
      customDefects: CustomDefectsSection,
      reasonForCreation: reasonForCreationSection
    },
    testTypesGroup12And14: {
      required: CreateRequiredSectionHgvTrl,
      vehicle: ContingencyVehicleSectionDefaultPsvHgv,
      test: ContingencyTestSectionGroup12and14,
      visit: ContingencyVisitSection,
      notes: NotesSection,
      defects: DefectsTpl,
      customDefects: CustomDefectsSection,
      reasonForCreation: reasonForCreationSection
    }
  },
  trl: {
    default: {
      vehicle: ContingencyVehicleSectionDefaultTrl,
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
    },
    testTypesGroup12And14: {
      required: CreateRequiredSectionHgvTrl,
      vehicle: ContingencyVehicleSectionDefaultTrl,
      test: ContingencyTestSectionGroup12and14,
      visit: ContingencyVisitSection,
      notes: NotesSection,
      defects: DefectsTpl,
      customDefects: CustomDefectsSection,
      reasonForCreation: reasonForCreationSection
    }
  }
};
