import { FormNode } from '@forms/services/dynamic-form.types';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { DefectsTpl } from '../general/defect.template';
import { CustomDefectsSection } from './section-templates/customDefects/custom-defects-section.template';
import { EmissionsSection } from './section-templates/emissions/emissions-section.template';
import { NotesSection } from './section-templates/notes/notes-section.template';
import { reasonForCreationSection } from './section-templates/reasonForCreation/resonForCreation.template';
import { RequiredSection } from './section-templates/required/required-hidden-section.template';
import { RequiredSectionHGVTRL } from './section-templates/required/required-hidden-section-hgv-trl.template';
import { SeatbeltSection } from './section-templates/seatbelt/seatbelt-section.template';
import { TestSectionGroup1 } from './section-templates/test/test-section-group1.template';
import { TestSectionGroup3And4And8 } from './section-templates/test/test-section-group3And4And8.template';
import { TestSectionGroup5And13 } from './section-templates/test/test-section-group5And13.template';
import { TestSectionGroup6And11 } from './section-templates/test/test-section-group6And11.template';
import { TestSectionGroup7 } from './section-templates/test/test-section-group7.template';
import { TestSectionGroup9And10 } from './section-templates/test/test-section-group9And10.template';
import { TestSectionGroup15And16 } from './section-templates/test/test-section-group15And16.template';
import { TestSectionGroup12And14 } from './section-templates/test/test-section-group12And14.template';
import { TestSectionGroup2 } from './section-templates/test/test-section-group2.template';
import { TestSection } from './section-templates/test/test-section.template';
import { VehicleSectionDefaultPsvHgv } from './section-templates/vehicle/default-psv-hgv-vehicle-section.template';
import { VehicleSectionDefaultTrl } from './section-templates/vehicle/default-trl-vehicle-section.template';
import { VisitSection } from './section-templates/visit/visit-section.template';
import { SpecialistTestSectionGroup1 } from './section-templates/test/specialist-test-section-group1.template';
import { RequiredSpecialistSection } from './section-templates/required/required-hidden-specialist-section.template';
//Keys of root object must a a valid vehicle type.
//Keys of child object must be a valid test type id.
//Child object must ALWAYS have a 'default' key.

export const masterTpl: Record<VehicleTypes, Record<string, Record<string, FormNode>>> = {
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
    testTypesGroup1: {
      vehicle: VehicleSectionDefaultPsvHgv,
      test: TestSectionGroup1,
      seatbelts: SeatbeltSection,
      visit: VisitSection,
      notes: NotesSection,
      defects: DefectsTpl,
      customDefects: CustomDefectsSection,
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
      customDefects: CustomDefectsSection,
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
    }
  },
  hgv: {
    default: {
      vehicle: VehicleSectionDefaultPsvHgv,
      test: TestSection,
      emissions: EmissionsSection,
      visit: VisitSection,
      notes: NotesSection,
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
      reasonForCreation: reasonForCreationSection,
      required: RequiredSectionHGVTRL,
      customDefects: CustomDefectsSection
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
      reasonForCreation: reasonForCreationSection,
      required: RequiredSectionHGVTRL,
      customDefects: CustomDefectsSection
    },
    testTypesGroup12And14: {
      vehicle: VehicleSectionDefaultPsvHgv,
      test: TestSectionGroup12And14,
      visit: VisitSection,
      notes: NotesSection,
      defects: DefectsTpl,
      reasonForCreation: reasonForCreationSection,
      required: RequiredSectionHGVTRL,
      customDefects: CustomDefectsSection
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
    }
  },
  trl: {
    default: {
      vehicle: VehicleSectionDefaultTrl,
      test: TestSection,
      visit: VisitSection,
      notes: NotesSection,
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
      reasonForCreation: reasonForCreationSection,
      required: RequiredSectionHGVTRL,
      customDefects: CustomDefectsSection
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
      reasonForCreation: reasonForCreationSection,
      required: RequiredSectionHGVTRL,
      customDefects: CustomDefectsSection
    },

    testTypesGroup12And14: {
      vehicle: VehicleSectionDefaultTrl,
      test: TestSectionGroup12And14,
      visit: VisitSection,
      notes: NotesSection,
      defects: DefectsTpl,
      reasonForCreation: reasonForCreationSection,
      required: RequiredSectionHGVTRL,
      customDefects: CustomDefectsSection
    }
  }
};
