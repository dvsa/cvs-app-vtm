import { FormNode } from '@forms/services/dynamic-form.types';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { DefectsTpl } from '../general/defect.template';
import { CustomDefectsSection } from './section-templates/customDefects/custom-defects-section.template';
import { EmissionsSection } from './section-templates/emissions/emissions-section.template';
import { NotesSection } from './section-templates/notes/notes-section.template';
import { CreateRequiredSection } from './section-templates/required/contingency-required-hidden-section.template';
import { SeatbeltSection } from './section-templates/seatbelt/seatbelt-section.template';
import { ContingencyTestSectionGroup1 } from './section-templates/test/contingency-test-section-group1.template';
import { TestSection } from './section-templates/test/test-section.template';
import { ContingencyVehicleSectionDefaultPsvHgv } from './section-templates/vehicle/contingency-default-psv-hgv-vehicle-section.template';
import { ContingencyVisitSection } from './section-templates/visit/contingency-visit-section.template';
import { VisitSection } from './section-templates/visit/visit-section.template';
import { SeatbeltHiddenSection } from './section-templates/required/seatbelt-hidden-section.template';
import { defectsHiddenSection } from './section-templates/required/defect-hidden-section.template';
import { ContingencyVehicleSectionDefaultTrl } from './section-templates/vehicle/contingency-default-trl-vehicle-section.template';
import { ContingencyTestSectionGroup9And10 } from './section-templates/test/contingency-test-section-group9And10.template';
import { ContingencyTestSectionGroup12and14 } from './section-templates/test/contingency-test-section-group12and14.template';
import { CreateRequiredSectionHgvTrl } from './section-templates/required/contingency-required-hidden-section-hgv-trl.template';
import { ContingencyTestSectionGroup3And4And8 } from './section-templates/test/contingency-test-section-group3And4And8.template';
import { ContingencyTestSectionGroup7 } from './section-templates/test/contingency-test-section-group7.template';
import { ContingencyTestSectionSpecialistGroup1 } from './section-templates/test/contingency-test-section-specialist-group1.template';
import { ContingencyTestSectionSpecialistGroup2 } from './section-templates/test/contingency-test-section-specialist-group2.template';
import { ContingencyTestSectionSpecialistGroup5 } from './section-templates/test/contingency-test-section-specialist-group5.template';
import { reasonForCreationSection } from './section-templates/reasonForCreation/reasonForCreation.template';
import { ContingencyTestSectionGroup15and16 } from './section-templates/test/contingency-test-section-group15and16.template';
import { CustomDefectsHiddenSection } from './section-templates/required/custom-defects-hidden-section.template';
import { ContingencyTestSectionGroup5And13 } from './section-templates/test/contingency-test-section-group5And13.template';
import { ContingencyTestSectionGroup6And11 } from './section-templates/test/contingency-test-section-group6And11.template';
import { ContingencyTestSectionSpecialistGroup3And4 } from './section-templates/test/contingency-test-section-specialist-group3And4.template';
import { DeskBasedTestSectionGroup1 } from './section-templates/test/desk-based-test-section-group1.template';
import { DeskBasedTestSectionGroup2PSV } from './section-templates/test/desk-based-test-section-group2-PSV.template';
import { DeskBasedTestSectionGroup4 } from './section-templates/test/desk-based-test-section-group4.template';
import { DeskBasedVehicleSectionDefaultPsvHgv } from './section-templates/vehicle/desk-based-default-psv-hgv-vehicle-section.template';
import { DeskBasedTestSectionGroup3 } from './section-templates/test/desk-based-test-section-group3.template';

const groups1and2Template: Record<string, FormNode> = {
  required: CreateRequiredSection,
  vehicle: ContingencyVehicleSectionDefaultPsvHgv,
  test: ContingencyTestSectionGroup1,
  seatbelts: SeatbeltSection,
  visit: ContingencyVisitSection,
  notes: NotesSection,
  defects: DefectsTpl,
  customDefects: CustomDefectsHiddenSection,
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
      seatbelts: SeatbeltHiddenSection,
      notes: NotesSection,
      customDefects: CustomDefectsSection,
      defects: defectsHiddenSection,
      reasonForCreation: reasonForCreationSection,
      required: CreateRequiredSection
    },
    testTypesGroup15And16: {
      required: CreateRequiredSection,
      vehicle: ContingencyVehicleSectionDefaultPsvHgv,
      test: ContingencyTestSectionGroup15and16,
      emissions: EmissionsSection,
      seatbelts: SeatbeltHiddenSection,
      visit: ContingencyVisitSection,
      notes: NotesSection,
      customDefects: CustomDefectsSection,
      reasonForCreation: reasonForCreationSection
    },
    testTypesSpecialistGroup1: {
      vehicle: ContingencyVehicleSectionDefaultPsvHgv,
      test: ContingencyTestSectionSpecialistGroup1,
      seatbelts: SeatbeltHiddenSection,
      visit: ContingencyVisitSection,
      notes: NotesSection,
      customDefects: CustomDefectsSection,
      defects: defectsHiddenSection,
      reasonForCreation: reasonForCreationSection,
      required: CreateRequiredSection
    },
    testTypesSpecialistGroup2: {
      vehicle: ContingencyVehicleSectionDefaultPsvHgv,
      test: ContingencyTestSectionSpecialistGroup2,
      seatbelts: SeatbeltSection,
      visit: ContingencyVisitSection,
      notes: NotesSection,
      customDefects: CustomDefectsSection,
      defects: defectsHiddenSection,
      reasonForCreation: reasonForCreationSection,
      required: CreateRequiredSection
    },
    testTypesSpecialistGroup3: {
      vehicle: ContingencyVehicleSectionDefaultPsvHgv,
      test: ContingencyTestSectionSpecialistGroup3And4,
      seatbelts: SeatbeltHiddenSection,
      visit: ContingencyVisitSection,
      notes: NotesSection,
      customDefects: CustomDefectsSection,
      defects: defectsHiddenSection,
      reasonForCreation: reasonForCreationSection,
      required: CreateRequiredSection
    },
    testTypesSpecialistGroup4: {
      vehicle: ContingencyVehicleSectionDefaultPsvHgv,
      test: ContingencyTestSectionSpecialistGroup3And4,
      seatbelts: SeatbeltSection,
      visit: ContingencyVisitSection,
      notes: NotesSection,
      customDefects: CustomDefectsSection,
      defects: defectsHiddenSection,
      reasonForCreation: reasonForCreationSection,
      required: CreateRequiredSection
    },
    testTypesSpecialistGroup5: {
      vehicle: ContingencyVehicleSectionDefaultPsvHgv,
      test: ContingencyTestSectionSpecialistGroup5,
      seatbelts: SeatbeltHiddenSection,
      visit: ContingencyVisitSection,
      notes: NotesSection,
      customDefects: CustomDefectsSection,
      defects: defectsHiddenSection,
      reasonForCreation: reasonForCreationSection,
      required: CreateRequiredSection
    },
    testTypesDeskBasedGroup1: {
      required: CreateRequiredSection,
      vehicle: DeskBasedVehicleSectionDefaultPsvHgv,
      test: DeskBasedTestSectionGroup1,
      seatbelts: SeatbeltSection,
      visit: ContingencyVisitSection,
      notes: NotesSection,
      defects: defectsHiddenSection,
      customDefects: CustomDefectsHiddenSection,
      reasonForCreation: reasonForCreationSection
    },
    testTypesDeskBasedGroup2: {
      vehicle: ContingencyVehicleSectionDefaultPsvHgv,
      required: CreateRequiredSection,
      test: DeskBasedTestSectionGroup2PSV,
      seatbelts: SeatbeltHiddenSection,
      emissions: EmissionsSection,
      visit: ContingencyVisitSection,
      notes: NotesSection,
      defects: defectsHiddenSection,
      customDefects: CustomDefectsHiddenSection
    },
    testTypesDeskBasedGroup3: {
      required: CreateRequiredSection,
      vehicle: DeskBasedVehicleSectionDefaultPsvHgv,
      test: DeskBasedTestSectionGroup3,
      seatbelts: SeatbeltHiddenSection,
      visit: ContingencyVisitSection,
      notes: NotesSection,
      defects: defectsHiddenSection,
      customDefects: CustomDefectsHiddenSection,
      reasonForCreation: reasonForCreationSection
    },
    testTypesDeskBasedGroup4: {
      required: CreateRequiredSection,
      vehicle: DeskBasedVehicleSectionDefaultPsvHgv,
      test: DeskBasedTestSectionGroup4,
      seatbelts: SeatbeltSection,
      visit: ContingencyVisitSection,
      notes: NotesSection,
      defects: defectsHiddenSection,
      customDefects: CustomDefectsHiddenSection,
      reasonForCreation: reasonForCreationSection
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
    testTypesGroup3And4And8: {
      vehicle: ContingencyVehicleSectionDefaultPsvHgv,
      test: ContingencyTestSectionGroup3And4And8,
      visit: ContingencyVisitSection,
      notes: NotesSection,
      customDefects: CustomDefectsSection,
      defects: defectsHiddenSection,
      reasonForCreation: reasonForCreationSection,
      required: CreateRequiredSectionHgvTrl
    },
    testTypesGroup5And13: {
      required: CreateRequiredSectionHgvTrl,
      vehicle: ContingencyVehicleSectionDefaultPsvHgv,
      test: ContingencyTestSectionGroup5And13,
      visit: ContingencyVisitSection,
      notes: NotesSection,
      customDefects: CustomDefectsSection,
      defects: defectsHiddenSection,
      reasonForCreation: reasonForCreationSection
    },
    testTypesGroup6And11: {
      required: CreateRequiredSectionHgvTrl,
      vehicle: ContingencyVehicleSectionDefaultPsvHgv,
      test: ContingencyTestSectionGroup6And11,
      visit: ContingencyVisitSection,
      notes: NotesSection,
      defects: DefectsTpl,
      customDefects: CustomDefectsHiddenSection,
      reasonForCreation: reasonForCreationSection
    },
    testTypesGroup7: {
      required: CreateRequiredSectionHgvTrl,
      vehicle: ContingencyVehicleSectionDefaultPsvHgv,
      test: ContingencyTestSectionGroup7,
      visit: ContingencyVisitSection,
      notes: NotesSection,
      customDefects: CustomDefectsSection,
      defects: defectsHiddenSection,
      reasonForCreation: reasonForCreationSection
    },
    testTypesGroup9And10: {
      required: CreateRequiredSectionHgvTrl,
      vehicle: ContingencyVehicleSectionDefaultPsvHgv,
      test: ContingencyTestSectionGroup9And10,
      visit: ContingencyVisitSection,
      notes: NotesSection,
      defects: DefectsTpl,
      customDefects: CustomDefectsHiddenSection,
      reasonForCreation: reasonForCreationSection
    },
    testTypesGroup12And14: {
      required: CreateRequiredSectionHgvTrl,
      vehicle: ContingencyVehicleSectionDefaultPsvHgv,
      test: ContingencyTestSectionGroup12and14,
      visit: ContingencyVisitSection,
      notes: NotesSection,
      defects: DefectsTpl,
      customDefects: CustomDefectsHiddenSection,
      reasonForCreation: reasonForCreationSection
    },
    testTypesSpecialistGroup1: {
      vehicle: ContingencyVehicleSectionDefaultPsvHgv,
      test: ContingencyTestSectionSpecialistGroup1,
      visit: ContingencyVisitSection,
      notes: NotesSection,
      defects: defectsHiddenSection,
      customDefects: CustomDefectsSection,
      reasonForCreation: reasonForCreationSection,
      required: CreateRequiredSectionHgvTrl
    },
    testTypesSpecialistGroup5: {
      vehicle: ContingencyVehicleSectionDefaultPsvHgv,
      test: ContingencyTestSectionSpecialistGroup5,
      visit: ContingencyVisitSection,
      notes: NotesSection,
      defects: defectsHiddenSection,
      customDefects: CustomDefectsSection,
      reasonForCreation: reasonForCreationSection,
      required: CreateRequiredSectionHgvTrl
    },
    testTypesGroup15And16: {
      required: CreateRequiredSectionHgvTrl,
      vehicle: ContingencyVehicleSectionDefaultPsvHgv,
      test: ContingencyTestSectionGroup15and16,
      emissions: EmissionsSection,
      visit: ContingencyVisitSection,
      notes: NotesSection,
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
    testTypesGroup3And4And8: {
      vehicle: ContingencyVehicleSectionDefaultTrl,
      test: ContingencyTestSectionGroup3And4And8,
      visit: ContingencyVisitSection,
      notes: NotesSection,
      customDefects: CustomDefectsSection,
      defects: defectsHiddenSection,
      reasonForCreation: reasonForCreationSection,
      required: CreateRequiredSectionHgvTrl
    },
    testTypesGroup5And13: {
      required: CreateRequiredSectionHgvTrl,
      vehicle: ContingencyVehicleSectionDefaultTrl,
      test: ContingencyTestSectionGroup5And13,
      visit: ContingencyVisitSection,
      notes: NotesSection,
      customDefects: CustomDefectsSection,
      defects: defectsHiddenSection,
      reasonForCreation: reasonForCreationSection
    },
    testTypesGroup6And11: {
      required: CreateRequiredSectionHgvTrl,
      vehicle: ContingencyVehicleSectionDefaultTrl,
      test: ContingencyTestSectionGroup6And11,
      visit: ContingencyVisitSection,
      notes: NotesSection,
      defects: DefectsTpl,
      customDefects: CustomDefectsHiddenSection,
      reasonForCreation: reasonForCreationSection
    },
    testTypesGroup7: {
      required: CreateRequiredSectionHgvTrl,
      vehicle: ContingencyVehicleSectionDefaultTrl,
      test: ContingencyTestSectionGroup7,
      visit: ContingencyVisitSection,
      notes: NotesSection,
      customDefects: CustomDefectsSection,
      defects: defectsHiddenSection,
      reasonForCreation: reasonForCreationSection
    },
    testTypesGroup9And10: {
      required: CreateRequiredSectionHgvTrl,
      vehicle: ContingencyVehicleSectionDefaultTrl,
      test: ContingencyTestSectionGroup9And10,
      visit: ContingencyVisitSection,
      notes: NotesSection,
      defects: DefectsTpl,
      customDefects: CustomDefectsHiddenSection,
      reasonForCreation: reasonForCreationSection
    },
    testTypesGroup12And14: {
      required: CreateRequiredSectionHgvTrl,
      vehicle: ContingencyVehicleSectionDefaultTrl,
      test: ContingencyTestSectionGroup12and14,
      visit: ContingencyVisitSection,
      notes: NotesSection,
      defects: DefectsTpl,
      customDefects: CustomDefectsHiddenSection,
      reasonForCreation: reasonForCreationSection
    },
    testTypesSpecialistGroup1: {
      vehicle: ContingencyVehicleSectionDefaultTrl,
      test: ContingencyTestSectionSpecialistGroup1,
      visit: ContingencyVisitSection,
      notes: NotesSection,
      defects: defectsHiddenSection,
      customDefects: CustomDefectsSection,
      reasonForCreation: reasonForCreationSection,
      required: CreateRequiredSectionHgvTrl
    },
    testTypesSpecialistGroup5: {
      vehicle: ContingencyVehicleSectionDefaultTrl,
      test: ContingencyTestSectionSpecialistGroup5,
      visit: ContingencyVisitSection,
      notes: NotesSection,
      defects: defectsHiddenSection,
      customDefects: CustomDefectsSection,
      reasonForCreation: reasonForCreationSection,
      required: CreateRequiredSectionHgvTrl
    }
  }
};
