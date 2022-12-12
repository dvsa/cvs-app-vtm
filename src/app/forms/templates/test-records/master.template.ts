import { TEST_TYPES } from '@forms/models/testTypeId.enum';
import { FormNode } from '@forms/services/dynamic-form.types';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { DefectsTpl } from '../general/defect.template';
import { CustomDefectsSection } from './section-templates/customDefects/custom-defects-section.template';
import { EmissionsSection } from './section-templates/emissions/emissions-section.template';
import { NotesSection } from './section-templates/notes/notes-section.template';
import { reasonForCreationSection } from './section-templates/reasonForCreation/reasonForCreation.template';
import { CustomDefectsHiddenSection } from './section-templates/required/custom-defects-hidden-section.template';
import { defectsHiddenSection } from './section-templates/required/defect-hidden-section.template';
import { DeskBasedRequiredSectionHgvTrl } from './section-templates/required/desk-based-required-hidden-section-hgv-trl.template';
import { DeskBasedRequiredSectionPsv } from './section-templates/required/desk-based-required-hidden-section-psv.template';
import { RequiredSectionHGVTRL } from './section-templates/required/required-hidden-section-hgv-trl.template';
import { RequiredSection } from './section-templates/required/required-hidden-section.template';
import { SeatbeltHiddenSection } from './section-templates/required/seatbelt-hidden-section.template';
import { SpecialistRequiredSectionHGVTRL } from './section-templates/required/specialist-required-hidden-section-hgv-trl.template';
import { RequiredSpecialistSection } from './section-templates/required/specialist-required-hidden-section.template';
import { SeatbeltSection } from './section-templates/seatbelt/seatbelt-section.template';
import { AmendDeskBasedTestSectionGroup2 } from './section-templates/test/desk-based/desk-based-test-section-group2.template';
import { AmendDeskBasedTestSectionGroup1Psv } from './section-templates/test/desk-based/desk-based-test-section-group1-PSV.template';
import { amendDeskBasedTestSectionGroup1And4HgvTrl } from './section-templates/test/desk-based/desk-based-test-section-group1And4-HGV-TRL.template';
import { amendDeskBasedTestSectionGroup4Psv } from './section-templates/test/desk-based/desk-based-test-section-group4-PSV.template';
import { SpecialistTestSectionGroup1 } from './section-templates/test/specialist/specialist-test-section-group1.template';
import { SpecialistTestSectionGroup2 } from './section-templates/test/specialist/specialist-test-section-group2.template';
import { SpecialistTestSectionGroup3And4 } from './section-templates/test/specialist/specialist-test-section-group3And4.template';
import { SpecialistTestSectionGroup5 } from './section-templates/test/specialist/specialist-test-section-group5.template';
import { TestSectionGroup1 } from './section-templates/test/test-section-group1.template';
import { TestSectionGroup12And14 } from './section-templates/test/test-section-group12And14.template';
import { TestSectionGroup15And16 } from './section-templates/test/test-section-group15And16.template';
import { TestSectionGroup2 } from './section-templates/test/test-section-group2.template';
import { TestSectionGroup3And4And8 } from './section-templates/test/test-section-group3And4And8.template';
import { TestSectionGroup5And13 } from './section-templates/test/test-section-group5And13.template';
import { TestSectionGroup6And11 } from './section-templates/test/test-section-group6And11.template';
import { TestSectionGroup7 } from './section-templates/test/test-section-group7.template';
import { TestSectionGroup9And10 } from './section-templates/test/test-section-group9And10.template';
import { TestSection } from './section-templates/test/test-section.template';
import { ContingencyVehicleSectionDefaultPsvHgv } from './section-templates/vehicle/contingency-default-psv-hgv-vehicle-section.template';
import { VehicleSectionDefaultPsvHgv } from './section-templates/vehicle/default-psv-hgv-vehicle-section.template';
import { VehicleSectionDefaultTrl } from './section-templates/vehicle/default-trl-vehicle-section.template';
import { DeskBasedVehicleSectionDefaultPsvHgv } from './section-templates/vehicle/desk-based-default-psv-hgv-vehicle-section.template';
import { DeskBasedVehicleSectionDefaultTrl } from './section-templates/vehicle/desk-based-default-trl-vehicle-section.template';
import { DeskBasedVehicleSectionHgvGroup1And2And4 } from './section-templates/vehicle/desk-based-test-hgv-vehicle-section-group1And2And4.template';
import { VisitSection } from './section-templates/visit/visit-section.template';
import { AmendDeskBasedTestSectionGroup3 } from '@forms/templates/test-records/section-templates/test/desk-based/desk-based-test-section-group3.template';

/**
 * Keys of root object must a a valid vehicle type.
 * Keys of child object must be a valid test type id.
 * Child object must ALWAYS have a 'default' key.
 */
export const masterTpl: Record<VehicleTypes, Partial<Record<keyof typeof TEST_TYPES | 'default', Record<string, FormNode>>>> = {
  psv: {
    default: {
      vehicle: VehicleSectionDefaultPsvHgv,
      test: TestSection,
      seatbelts: SeatbeltSection,
      emissions: EmissionsSection,
      visit: VisitSection,
      notes: NotesSection,
      defects: DefectsTpl,
      reasonForCreation: reasonForCreationSection,
      customDefects: CustomDefectsSection,
      required: RequiredSection
    },
    testTypesGroup1: {
      vehicle: VehicleSectionDefaultPsvHgv,
      test: TestSectionGroup1,
      seatbelts: SeatbeltSection,
      visit: VisitSection,
      notes: NotesSection,
      defects: DefectsTpl,
      customDefects: CustomDefectsHiddenSection,
      reasonForCreation: reasonForCreationSection,
      required: RequiredSection
    },
    testTypesGroup2: {
      vehicle: VehicleSectionDefaultPsvHgv,
      test: TestSectionGroup2,
      seatbelts: SeatbeltSection,
      visit: VisitSection,
      notes: NotesSection,
      defects: DefectsTpl,
      customDefects: CustomDefectsHiddenSection,
      reasonForCreation: reasonForCreationSection,
      required: RequiredSection
    },
    testTypesGroup3And4And8: {
      vehicle: VehicleSectionDefaultPsvHgv,
      test: TestSectionGroup3And4And8,
      visit: VisitSection,
      notes: NotesSection,
      customDefects: CustomDefectsSection,
      reasonForCreation: reasonForCreationSection,
      required: RequiredSection
    },
    testTypesGroup15And16: {
      vehicle: VehicleSectionDefaultPsvHgv,
      test: TestSectionGroup15And16,
      emissions: EmissionsSection,
      visit: VisitSection,
      notes: NotesSection,
      customDefects: CustomDefectsSection,
      reasonForCreation: reasonForCreationSection,
      required: RequiredSection
    },
    testTypesSpecialistGroup1: {
      vehicle: VehicleSectionDefaultPsvHgv,
      test: SpecialistTestSectionGroup1,
      visit: VisitSection,
      notes: NotesSection,
      customDefects: CustomDefectsSection,
      reasonForCreation: reasonForCreationSection,
      required: RequiredSpecialistSection
    },
    testTypesSpecialistGroup2: {
      vehicle: VehicleSectionDefaultPsvHgv,
      test: SpecialistTestSectionGroup2,
      seatbelts: SeatbeltSection,
      visit: VisitSection,
      notes: NotesSection,
      customDefects: CustomDefectsSection,
      reasonForCreation: reasonForCreationSection,
      required: RequiredSpecialistSection
    },
    testTypesSpecialistGroup3: {
      vehicle: VehicleSectionDefaultPsvHgv,
      test: SpecialistTestSectionGroup3And4,
      visit: VisitSection,
      notes: NotesSection,
      customDefects: CustomDefectsSection,
      reasonForCreation: reasonForCreationSection,
      required: RequiredSpecialistSection
    },
    testTypesSpecialistGroup4: {
      vehicle: VehicleSectionDefaultPsvHgv,
      test: SpecialistTestSectionGroup3And4,
      seatbelts: SeatbeltSection,
      visit: VisitSection,
      notes: NotesSection,
      customDefects: CustomDefectsSection,
      reasonForCreation: reasonForCreationSection,
      required: RequiredSpecialistSection
    },
    testTypesSpecialistGroup5: {
      vehicle: VehicleSectionDefaultPsvHgv,
      test: SpecialistTestSectionGroup5,
      visit: VisitSection,
      notes: NotesSection,
      customDefects: CustomDefectsSection,
      reasonForCreation: reasonForCreationSection,
      required: RequiredSpecialistSection
    },
    testTypesDeskBasedGroup2: {
      vehicle: ContingencyVehicleSectionDefaultPsvHgv,
      required: DeskBasedRequiredSectionPsv,
      test: AmendDeskBasedTestSectionGroup2,
      seatbelts: SeatbeltHiddenSection,
      emissions: EmissionsSection,
      visit: VisitSection,
      notes: NotesSection,
      defects: defectsHiddenSection,
      customDefects: CustomDefectsHiddenSection,
      reasonForCreation: reasonForCreationSection
    },
    testTypesDeskBasedGroup3: {
      required: DeskBasedRequiredSectionPsv,
      vehicle: DeskBasedVehicleSectionDefaultPsvHgv,
      test: AmendDeskBasedTestSectionGroup3,
      visit: VisitSection,
      notes: NotesSection,
      defects: defectsHiddenSection,
      customDefects: CustomDefectsHiddenSection,
      reasonForCreation: reasonForCreationSection
    },
    testTypesDeskBasedGroup4: {
      required: RequiredSection,
      vehicle: DeskBasedVehicleSectionDefaultPsvHgv,
      test: amendDeskBasedTestSectionGroup4Psv,
      visit: VisitSection,
      notes: NotesSection,
      defects: defectsHiddenSection,
      customDefects: CustomDefectsHiddenSection,
      reasonForCreation: reasonForCreationSection
    },
    testTypesDeskBasedGroup1: {
      required: RequiredSection,
      vehicle: DeskBasedVehicleSectionDefaultPsvHgv,
      test: AmendDeskBasedTestSectionGroup1Psv,
      visit: VisitSection,
      notes: NotesSection,
      defects: defectsHiddenSection,
      customDefects: CustomDefectsHiddenSection,
      reasonForCreation: reasonForCreationSection
    }
  },
  hgv: {
    default: {
      vehicle: VehicleSectionDefaultPsvHgv,
      test: TestSection,
      emissions: EmissionsSection,
      visit: VisitSection,
      notes: NotesSection,
      reasonForCreation: reasonForCreationSection,
      customDefects: CustomDefectsSection,
      required: RequiredSectionHGVTRL
    },
    testTypesGroup3And4And8: {
      vehicle: VehicleSectionDefaultPsvHgv,
      test: TestSectionGroup3And4And8,
      visit: VisitSection,
      notes: NotesSection,
      customDefects: CustomDefectsSection,
      reasonForCreation: reasonForCreationSection,
      required: RequiredSectionHGVTRL
    },
    testTypesGroup5And13: {
      vehicle: VehicleSectionDefaultPsvHgv,
      test: TestSectionGroup5And13,
      visit: VisitSection,
      notes: NotesSection,
      reasonForCreation: reasonForCreationSection,
      customDefects: CustomDefectsSection,
      required: RequiredSectionHGVTRL
    },
    testTypesGroup6And11: {
      vehicle: VehicleSectionDefaultPsvHgv,
      test: TestSectionGroup6And11,
      visit: VisitSection,
      notes: NotesSection,
      defects: DefectsTpl,
      customDefects: CustomDefectsHiddenSection,
      reasonForCreation: reasonForCreationSection,
      required: RequiredSectionHGVTRL
    },
    testTypesGroup7: {
      vehicle: VehicleSectionDefaultPsvHgv,
      test: TestSectionGroup7,
      visit: VisitSection,
      notes: NotesSection,
      reasonForCreation: reasonForCreationSection,
      customDefects: CustomDefectsSection,
      required: RequiredSectionHGVTRL
    },
    testTypesGroup9And10: {
      vehicle: VehicleSectionDefaultPsvHgv,
      test: TestSectionGroup9And10,
      visit: VisitSection,
      notes: NotesSection,
      defects: DefectsTpl,
      customDefects: CustomDefectsHiddenSection,
      reasonForCreation: reasonForCreationSection,
      required: RequiredSectionHGVTRL
    },
    testTypesGroup12And14: {
      vehicle: VehicleSectionDefaultPsvHgv,
      test: TestSectionGroup12And14,
      visit: VisitSection,
      notes: NotesSection,
      defects: DefectsTpl,
      customDefects: CustomDefectsHiddenSection,
      reasonForCreation: reasonForCreationSection,
      required: RequiredSectionHGVTRL
    },
    testTypesGroup15And16: {
      vehicle: VehicleSectionDefaultPsvHgv,
      test: TestSectionGroup15And16,
      emissions: EmissionsSection,
      visit: VisitSection,
      notes: NotesSection,
      customDefects: CustomDefectsSection,
      reasonForCreation: reasonForCreationSection,
      required: RequiredSection
    },
    testTypesSpecialistGroup1: {
      vehicle: VehicleSectionDefaultPsvHgv,
      test: SpecialistTestSectionGroup1,
      visit: VisitSection,
      notes: NotesSection,
      customDefects: CustomDefectsSection,
      reasonForCreation: reasonForCreationSection,
      required: SpecialistRequiredSectionHGVTRL
    },
    testTypesSpecialistGroup5: {
      vehicle: VehicleSectionDefaultPsvHgv,
      test: SpecialistTestSectionGroup5,
      visit: VisitSection,
      notes: NotesSection,
      reasonForCreation: reasonForCreationSection,
      required: SpecialistRequiredSectionHGVTRL,
      customDefects: CustomDefectsSection
    },
    testTypesDeskBasedGroup1: {
      required: RequiredSection,
      vehicle: DeskBasedVehicleSectionHgvGroup1And2And4,
      test: amendDeskBasedTestSectionGroup1And4HgvTrl,
      visit: VisitSection,
      notes: NotesSection,
      defects: defectsHiddenSection,
      customDefects: CustomDefectsHiddenSection,
      reasonForCreation: reasonForCreationSection
    },
    testTypesDeskBasedGroup2: {
      required: DeskBasedRequiredSectionHgvTrl,
      vehicle: DeskBasedVehicleSectionHgvGroup1And2And4,
      test: AmendDeskBasedTestSectionGroup2,
      visit: VisitSection,
      notes: NotesSection,
      defects: defectsHiddenSection,
      customDefects: CustomDefectsHiddenSection,
      reasonForCreation: reasonForCreationSection
    },
    testTypesDeskBasedGroup3: {
      required: RequiredSection,
      vehicle: DeskBasedVehicleSectionDefaultTrl,
      test: AmendDeskBasedTestSectionGroup3,
      visit: VisitSection,
      notes: NotesSection,
      defects: defectsHiddenSection,
      customDefects: CustomDefectsHiddenSection,
      reasonForCreation: reasonForCreationSection
    },
    testTypesDeskBasedGroup4: {
      required: RequiredSection,
      vehicle: DeskBasedVehicleSectionHgvGroup1And2And4,
      test: amendDeskBasedTestSectionGroup1And4HgvTrl,
      visit: VisitSection,
      notes: NotesSection,
      defects: defectsHiddenSection,
      customDefects: CustomDefectsHiddenSection,
      reasonForCreation: reasonForCreationSection
    }
  },
  trl: {
    default: {
      vehicle: VehicleSectionDefaultTrl,
      test: TestSection,
      visit: VisitSection,
      notes: NotesSection,
      reasonForCreation: reasonForCreationSection,
      customDefects: CustomDefectsSection,
      required: RequiredSectionHGVTRL
    },
    testTypesGroup3And4And8: {
      vehicle: VehicleSectionDefaultTrl,
      test: TestSectionGroup3And4And8,
      visit: VisitSection,
      notes: NotesSection,
      customDefects: CustomDefectsSection,
      reasonForCreation: reasonForCreationSection,
      required: RequiredSectionHGVTRL
    },
    testTypesGroup5And13: {
      vehicle: VehicleSectionDefaultTrl,
      test: TestSectionGroup5And13,
      visit: VisitSection,
      notes: NotesSection,
      reasonForCreation: reasonForCreationSection,
      customDefects: CustomDefectsSection,
      required: RequiredSectionHGVTRL
    },
    testTypesGroup6And11: {
      vehicle: VehicleSectionDefaultTrl,
      test: TestSectionGroup6And11,
      visit: VisitSection,
      notes: NotesSection,
      defects: DefectsTpl,
      customDefects: CustomDefectsHiddenSection,
      reasonForCreation: reasonForCreationSection,
      required: RequiredSectionHGVTRL
    },
    testTypesGroup7: {
      vehicle: VehicleSectionDefaultTrl,
      test: TestSectionGroup7,
      visit: VisitSection,
      notes: NotesSection,
      reasonForCreation: reasonForCreationSection,
      customDefects: CustomDefectsSection,
      required: RequiredSectionHGVTRL
    },
    testTypesGroup9And10: {
      vehicle: VehicleSectionDefaultTrl,
      test: TestSectionGroup9And10,
      visit: VisitSection,
      notes: NotesSection,
      defects: DefectsTpl,
      customDefects: CustomDefectsHiddenSection,
      reasonForCreation: reasonForCreationSection,
      required: RequiredSectionHGVTRL
    },
    testTypesGroup12And14: {
      vehicle: VehicleSectionDefaultTrl,
      test: TestSectionGroup12And14,
      visit: VisitSection,
      notes: NotesSection,
      defects: DefectsTpl,
      customDefects: CustomDefectsHiddenSection,
      reasonForCreation: reasonForCreationSection,
      required: RequiredSectionHGVTRL
    },
    testTypesSpecialistGroup1: {
      vehicle: VehicleSectionDefaultTrl,
      test: SpecialistTestSectionGroup1,
      visit: VisitSection,
      notes: NotesSection,
      customDefects: CustomDefectsSection,
      reasonForCreation: reasonForCreationSection,
      required: SpecialistRequiredSectionHGVTRL
    },
    testTypesSpecialistGroup5: {
      vehicle: VehicleSectionDefaultTrl,
      test: SpecialistTestSectionGroup5,
      visit: VisitSection,
      notes: NotesSection,
      reasonForCreation: reasonForCreationSection,
      required: SpecialistRequiredSectionHGVTRL,
      customDefects: CustomDefectsSection
    },
    testTypesDeskBasedGroup1: {
      required: RequiredSection,
      vehicle: DeskBasedVehicleSectionDefaultTrl,
      test: amendDeskBasedTestSectionGroup1And4HgvTrl,
      visit: VisitSection,
      notes: NotesSection,
      defects: defectsHiddenSection,
      customDefects: CustomDefectsHiddenSection,
      reasonForCreation: reasonForCreationSection
    },
    testTypesDeskBasedGroup2: {
      required: DeskBasedRequiredSectionHgvTrl,
      vehicle: DeskBasedVehicleSectionHgvGroup1And2And4,
      test: AmendDeskBasedTestSectionGroup2,
      visit: VisitSection,
      notes: NotesSection,
      defects: defectsHiddenSection,
      customDefects: CustomDefectsHiddenSection,
      reasonForCreation: reasonForCreationSection
    },
    testTypesDeskBasedGroup3: {
      required: RequiredSection,
      vehicle: DeskBasedVehicleSectionDefaultTrl,
      test: AmendDeskBasedTestSectionGroup3,
      visit: VisitSection,
      notes: NotesSection,
      defects: defectsHiddenSection,
      reasonForCreation: reasonForCreationSection
    },
    testTypesDeskBasedGroup4: {
      required: RequiredSection,
      vehicle: DeskBasedVehicleSectionDefaultTrl,
      test: amendDeskBasedTestSectionGroup1And4HgvTrl,
      visit: VisitSection,
      notes: NotesSection,
      defects: defectsHiddenSection,
      customDefects: CustomDefectsHiddenSection,
      reasonForCreation: reasonForCreationSection
    }
  }
};
