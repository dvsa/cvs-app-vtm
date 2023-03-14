import { TEST_TYPES } from '@forms/models/testTypeId.enum';
import { FormNode } from '@forms/services/dynamic-form.types';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { DefectsTpl } from '../general/defect.template';
import { CustomDefectsSection } from './section-templates/customDefects/custom-defects-section.template';
import { DeskBasedEmissionsSectionGroup5Lgv } from './section-templates/emissions/desk-based-emissions-section-group5-lgv';
import { DeskBasedEmissionsSection } from './section-templates/emissions/desk-based-emissions-section.template';
import { EmissionsSection } from './section-templates/emissions/emissions-section.template';
import { NotesSection } from './section-templates/notes/notes-section.template';
import { reasonForCreationHiddenSection, reasonForCreationSection } from './section-templates/reasonForCreation/reasonForCreation.template';
import { CreateRequiredSectionHgvTrl } from './section-templates/required/contingency-required-hidden-section-hgv-trl.template';
import { CreateRequiredSectionLgvCar } from './section-templates/required/contingency-required-hidden-section-lgv-car.template';
import { CreateRequiredSectionMotorcycle } from './section-templates/required/contingency-required-hidden-section-motorcycle.template';
import { CreateRequiredSection } from './section-templates/required/contingency-required-hidden-section.template';
import { CustomDefectsHiddenSection } from './section-templates/required/custom-defects-hidden-section.template';
import { defectsHiddenSection } from './section-templates/required/defect-hidden-section.template';
import { DeskBasedRequiredHiddenSectionGroup4Lgv } from './section-templates/required/desk-based-required-hidden-group4-lgv.template';
import { DeskBasedRequiredHiddenSectionGroup4Motorcyle } from './section-templates/required/desk-based-required-hidden-group4-motorcycle.template';
import { SeatbeltHiddenSection } from './section-templates/required/seatbelt-hidden-section.template';
import { SpecialistRequiredSectionLgvCarSmallTrl } from './section-templates/required/specialist-required-hidden-section-lgv-car.template';
import { SeatbeltSection } from './section-templates/seatbelt/seatbelt-section.template';
import { ContingencyTestSectionGroup1 } from './section-templates/test/contingency/contingency-test-section-group1.template';
import { ContingencyTestSectionGroup12and14 } from './section-templates/test/contingency/contingency-test-section-group12and14.template';
import { ContingencyTestSectionGroup15and16 } from './section-templates/test/contingency/contingency-test-section-group15and16.template';
import { ContingencyTestSectionGroup3And4And8 } from './section-templates/test/contingency/contingency-test-section-group3And4And8.template';
import { ContingencyTestSectionGroup5And13 } from './section-templates/test/contingency/contingency-test-section-group5And13.template';
import { ContingencyTestSectionGroup6And11 } from './section-templates/test/contingency/contingency-test-section-group6And11.template';
import { ContingencyTestSectionGroup7 } from './section-templates/test/contingency/contingency-test-section-group7.template';
import { ContingencyTestSectionGroup9And10 } from './section-templates/test/contingency/contingency-test-section-group9And10.template';
import { ContingencyTestSectionSpecialistGroup1 } from './section-templates/test/contingency/contingency-test-section-specialist-group1.template';
import { ContingencyTestSectionSpecialistGroup2 } from './section-templates/test/contingency/contingency-test-section-specialist-group2.template';
import { ContingencyTestSectionSpecialistGroup3And4 } from './section-templates/test/contingency/contingency-test-section-specialist-group3And4.template';
import { ContingencyTestSectionSpecialistGroup5 } from './section-templates/test/contingency/contingency-test-section-specialist-group5.template';
import { DeskBasedTestSectionGroup1Psv } from './section-templates/test/desk-based/desk-based-test-section-group1-PSV.template';
import { DeskBasedTestSectionGroup1And4HgvTrl as DeskBasedTestSectionGroup1And4And5HgvTrl } from './section-templates/test/desk-based/desk-based-test-section-group1And4-HGV-TRL.template';
import {
  AmendDeskBasedTestSectionGroup2And5,
  DeskBasedTestSectionGroup2And5
} from './section-templates/test/desk-based/desk-based-test-section-group2.template';
import { DeskBasedTestSectionGroup3 } from './section-templates/test/desk-based/desk-based-test-section-group3.template';
import { DeskBasedTestSectionGroup4Psv } from './section-templates/test/desk-based/desk-based-test-section-group4-PSV.template';
import { DeskBasedTestSectionLgvGroup5 } from './section-templates/test/desk-based/desk-based-test-section-group5-LGV';
import { SpecialistTestSectionGroup3 } from './section-templates/test/specialist/specialist-test-section-group3.template';
import { TestSection } from './section-templates/test/test-section.template';
import { ContingencyVehicleSectionDefaultPsvHgvLight } from './section-templates/vehicle/contingency-default-psv-hgv-light-vehicle-section.template';
import { ContingencyVehicleSectionDefaultTrl } from './section-templates/vehicle/contingency-default-trl-vehicle-section.template';
import { DeskBasedVehicleSectionDefaultPsvHgv } from './section-templates/vehicle/desk-based-default-psv-hgv-vehicle-section.template';
import { DeskBasedVehicleSectionDefaultTrl } from './section-templates/vehicle/desk-based-default-trl-vehicle-section.template';
import { DeskBasedVehicleSectionHgvGroup1And2And4 as DeskBasedVehicleSectionHgvGroup1And2And4And5 } from './section-templates/vehicle/desk-based-test-hgv-vehicle-section-group1And2And4.template';
import { DeskBasedVehicleSectionGroup4LGV } from './section-templates/vehicle/desk-based-vehicle-section-group4-lgv.template';
import { VehicleSectionGroup3 } from './section-templates/vehicle/group-3-light-vehicle-section.template';
import { ContingencyVisitSection } from './section-templates/visit/contingency-visit-section.template';
import { VisitSection } from './section-templates/visit/visit-section.template';

const groups1and2Template: Record<string, FormNode> = {
  required: CreateRequiredSection,
  vehicle: ContingencyVehicleSectionDefaultPsvHgvLight,
  test: ContingencyTestSectionGroup1,
  seatbelts: SeatbeltSection,
  visit: ContingencyVisitSection,
  notes: NotesSection,
  defects: DefectsTpl,
  customDefects: CustomDefectsHiddenSection,
  reasonForCreation: reasonForCreationSection
};

export const contingencyTestTemplates: Record<VehicleTypes, Partial<Record<keyof typeof TEST_TYPES | 'default', Record<string, FormNode>>>> = {
  psv: {
    default: {
      vehicle: ContingencyVehicleSectionDefaultPsvHgvLight,
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
      vehicle: ContingencyVehicleSectionDefaultPsvHgvLight,
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
      vehicle: ContingencyVehicleSectionDefaultPsvHgvLight,
      test: ContingencyTestSectionGroup15and16,
      emissions: EmissionsSection,
      seatbelts: SeatbeltHiddenSection,
      visit: ContingencyVisitSection,
      notes: NotesSection,
      customDefects: CustomDefectsSection,
      reasonForCreation: reasonForCreationSection
    },
    testTypesSpecialistGroup1: {
      vehicle: ContingencyVehicleSectionDefaultPsvHgvLight,
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
      vehicle: ContingencyVehicleSectionDefaultPsvHgvLight,
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
      vehicle: ContingencyVehicleSectionDefaultPsvHgvLight,
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
      vehicle: ContingencyVehicleSectionDefaultPsvHgvLight,
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
      vehicle: ContingencyVehicleSectionDefaultPsvHgvLight,
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
      test: DeskBasedTestSectionGroup1Psv,
      seatbelts: SeatbeltHiddenSection,
      visit: ContingencyVisitSection,
      notes: NotesSection,
      defects: defectsHiddenSection,
      customDefects: CustomDefectsHiddenSection,
      reasonForCreation: reasonForCreationHiddenSection
    },
    testTypesDeskBasedGroup2: {
      vehicle: DeskBasedVehicleSectionDefaultPsvHgv,
      required: CreateRequiredSection,
      test: DeskBasedTestSectionGroup2And5,
      seatbelts: SeatbeltHiddenSection,
      emissions: DeskBasedEmissionsSection,
      visit: ContingencyVisitSection,
      notes: NotesSection,
      defects: defectsHiddenSection,
      customDefects: CustomDefectsHiddenSection,
      reasonForCreation: reasonForCreationHiddenSection
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
      reasonForCreation: reasonForCreationHiddenSection
    },
    testTypesDeskBasedGroup4: {
      required: CreateRequiredSection,
      vehicle: DeskBasedVehicleSectionDefaultPsvHgv,
      test: DeskBasedTestSectionGroup4Psv,
      seatbelts: SeatbeltHiddenSection,
      visit: ContingencyVisitSection,
      notes: NotesSection,
      defects: defectsHiddenSection,
      customDefects: CustomDefectsHiddenSection,
      reasonForCreation: reasonForCreationHiddenSection
    }
  },
  hgv: {
    default: {
      vehicle: ContingencyVehicleSectionDefaultPsvHgvLight,
      test: TestSection,
      visit: VisitSection,
      notes: NotesSection,
      defects: DefectsTpl,
      customDefects: CustomDefectsSection,
      required: CreateRequiredSectionHgvTrl
    },
    testTypesGroup3And4And8: {
      vehicle: ContingencyVehicleSectionDefaultPsvHgvLight,
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
      vehicle: ContingencyVehicleSectionDefaultPsvHgvLight,
      test: ContingencyTestSectionGroup5And13,
      visit: ContingencyVisitSection,
      notes: NotesSection,
      customDefects: CustomDefectsSection,
      defects: defectsHiddenSection,
      reasonForCreation: reasonForCreationSection
    },
    testTypesGroup6And11: {
      required: CreateRequiredSectionHgvTrl,
      vehicle: ContingencyVehicleSectionDefaultPsvHgvLight,
      test: ContingencyTestSectionGroup6And11,
      visit: ContingencyVisitSection,
      notes: NotesSection,
      defects: DefectsTpl,
      customDefects: CustomDefectsHiddenSection,
      reasonForCreation: reasonForCreationSection
    },
    testTypesGroup7: {
      required: CreateRequiredSectionHgvTrl,
      vehicle: ContingencyVehicleSectionDefaultPsvHgvLight,
      test: ContingencyTestSectionGroup7,
      visit: ContingencyVisitSection,
      notes: NotesSection,
      customDefects: CustomDefectsSection,
      defects: defectsHiddenSection,
      reasonForCreation: reasonForCreationSection
    },
    testTypesGroup9And10: {
      required: CreateRequiredSectionHgvTrl,
      vehicle: ContingencyVehicleSectionDefaultPsvHgvLight,
      test: ContingencyTestSectionGroup9And10,
      visit: ContingencyVisitSection,
      notes: NotesSection,
      defects: DefectsTpl,
      customDefects: CustomDefectsHiddenSection,
      reasonForCreation: reasonForCreationSection
    },
    testTypesGroup12And14: {
      required: CreateRequiredSectionHgvTrl,
      vehicle: ContingencyVehicleSectionDefaultPsvHgvLight,
      test: ContingencyTestSectionGroup12and14,
      visit: ContingencyVisitSection,
      notes: NotesSection,
      defects: DefectsTpl,
      customDefects: CustomDefectsHiddenSection,
      reasonForCreation: reasonForCreationSection
    },
    testTypesSpecialistGroup1: {
      vehicle: ContingencyVehicleSectionDefaultPsvHgvLight,
      test: ContingencyTestSectionSpecialistGroup1,
      visit: ContingencyVisitSection,
      notes: NotesSection,
      defects: defectsHiddenSection,
      customDefects: CustomDefectsSection,
      reasonForCreation: reasonForCreationSection,
      required: CreateRequiredSectionHgvTrl
    },
    testTypesSpecialistGroup5: {
      vehicle: ContingencyVehicleSectionDefaultPsvHgvLight,
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
      vehicle: ContingencyVehicleSectionDefaultPsvHgvLight,
      test: ContingencyTestSectionGroup15and16,
      emissions: EmissionsSection,
      visit: ContingencyVisitSection,
      notes: NotesSection,
      customDefects: CustomDefectsSection,
      reasonForCreation: reasonForCreationSection
    },
    testTypesDeskBasedGroup1: {
      required: CreateRequiredSectionHgvTrl,
      vehicle: DeskBasedVehicleSectionHgvGroup1And2And4And5,
      test: DeskBasedTestSectionGroup1And4And5HgvTrl,
      visit: ContingencyVisitSection,
      notes: NotesSection,
      defects: defectsHiddenSection,
      customDefects: CustomDefectsHiddenSection,
      reasonForCreation: reasonForCreationHiddenSection
    },
    testTypesDeskBasedGroup2: {
      required: CreateRequiredSectionHgvTrl,
      vehicle: DeskBasedVehicleSectionHgvGroup1And2And4And5,
      test: DeskBasedTestSectionGroup2And5,
      emissions: DeskBasedEmissionsSection,
      visit: ContingencyVisitSection,
      notes: NotesSection,
      defects: defectsHiddenSection,
      customDefects: CustomDefectsHiddenSection,
      reasonForCreation: reasonForCreationHiddenSection
    },
    testTypesDeskBasedGroup3: {
      required: CreateRequiredSectionHgvTrl,
      vehicle: DeskBasedVehicleSectionDefaultPsvHgv,
      test: DeskBasedTestSectionGroup3,
      visit: ContingencyVisitSection,
      notes: NotesSection,
      defects: defectsHiddenSection,
      customDefects: CustomDefectsHiddenSection,
      reasonForCreation: reasonForCreationHiddenSection
    },
    testTypesDeskBasedGroup4: {
      required: CreateRequiredSectionHgvTrl,
      vehicle: DeskBasedVehicleSectionHgvGroup1And2And4And5,
      test: DeskBasedTestSectionGroup1And4And5HgvTrl,
      visit: ContingencyVisitSection,
      notes: NotesSection,
      defects: defectsHiddenSection,
      customDefects: CustomDefectsHiddenSection,
      reasonForCreation: reasonForCreationHiddenSection
    },
    testTypesDeskBasedGroup5: {
      required: CreateRequiredSectionHgvTrl,
      vehicle: DeskBasedVehicleSectionHgvGroup1And2And4And5,
      test: DeskBasedTestSectionGroup2And5,
      visit: ContingencyVisitSection,
      notes: NotesSection,
      defects: defectsHiddenSection,
      customDefects: CustomDefectsHiddenSection,
      reasonForCreation: reasonForCreationHiddenSection
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
    },
    testTypesDeskBasedGroup1: {
      required: CreateRequiredSectionHgvTrl,
      vehicle: DeskBasedVehicleSectionDefaultTrl,
      test: DeskBasedTestSectionGroup1And4And5HgvTrl,
      visit: ContingencyVisitSection,
      notes: NotesSection,
      defects: defectsHiddenSection,
      customDefects: CustomDefectsHiddenSection,
      reasonForCreation: reasonForCreationHiddenSection
    },
    testTypesDeskBasedGroup2: {
      required: CreateRequiredSectionHgvTrl,
      vehicle: DeskBasedVehicleSectionDefaultTrl,
      test: DeskBasedTestSectionGroup2And5,
      emissions: DeskBasedEmissionsSection,
      visit: ContingencyVisitSection,
      notes: NotesSection,
      defects: defectsHiddenSection,
      customDefects: CustomDefectsHiddenSection,
      reasonForCreation: reasonForCreationHiddenSection
    },
    testTypesDeskBasedGroup3: {
      required: CreateRequiredSectionHgvTrl,
      vehicle: DeskBasedVehicleSectionDefaultTrl,
      test: DeskBasedTestSectionGroup3,
      visit: ContingencyVisitSection,
      notes: NotesSection,
      defects: defectsHiddenSection,
      customDefects: CustomDefectsHiddenSection,
      reasonForCreation: reasonForCreationHiddenSection
    },
    testTypesDeskBasedGroup4: {
      required: CreateRequiredSectionHgvTrl,
      vehicle: DeskBasedVehicleSectionDefaultTrl,
      test: DeskBasedTestSectionGroup1And4And5HgvTrl,
      visit: ContingencyVisitSection,
      notes: NotesSection,
      defects: defectsHiddenSection,
      customDefects: CustomDefectsHiddenSection,
      reasonForCreation: reasonForCreationHiddenSection
    }
  },
  lgv: {
    default: {
      required: CreateRequiredSectionLgvCar,
      vehicle: ContingencyVehicleSectionDefaultPsvHgvLight,
      test: TestSection,
      defects: defectsHiddenSection,
      visit: ContingencyVisitSection,
      notes: NotesSection,
      reasonForCreation: reasonForCreationSection
    },
    testTypesSpecialistGroup1: {
      required: CreateRequiredSectionLgvCar,
      vehicle: ContingencyVehicleSectionDefaultPsvHgvLight,
      test: ContingencyTestSectionSpecialistGroup1,
      customDefects: CustomDefectsSection,
      visit: ContingencyVisitSection,
      notes: NotesSection,
      reasonForCreation: reasonForCreationSection
    },
    testTypesDeskBasedGroup4: {
      required: DeskBasedRequiredHiddenSectionGroup4Lgv,
      vehicle: DeskBasedVehicleSectionGroup4LGV,
      test: AmendDeskBasedTestSectionGroup2And5,
      visit: VisitSection,
      notes: NotesSection,
      customDefects: CustomDefectsHiddenSection,
      reasonForCreation: reasonForCreationSection
    },
    testTypesSpecialistGroup5: {
      required: CreateRequiredSectionLgvCar,
      vehicle: ContingencyVehicleSectionDefaultPsvHgvLight,
      test: ContingencyTestSectionSpecialistGroup5,
      customDefects: CustomDefectsSection,
      visit: ContingencyVisitSection,
      notes: NotesSection,
      reasonForCreation: reasonForCreationSection
    },
    testTypesDeskBasedGroup5: {
      required: CreateRequiredSectionLgvCar,
      vehicle: ContingencyVehicleSectionDefaultPsvHgvLight,
      test: DeskBasedTestSectionLgvGroup5,
      emissions: DeskBasedEmissionsSectionGroup5Lgv,
      visit: ContingencyVisitSection,
      notes: NotesSection,
      defects: defectsHiddenSection,
      customDefects: CustomDefectsHiddenSection,
      reasonForCreation: reasonForCreationSection
    }
  },
  car: {
    default: {
      required: CreateRequiredSectionLgvCar,
      vehicle: ContingencyVehicleSectionDefaultPsvHgvLight,
      test: TestSection,
      defects: defectsHiddenSection,
      visit: ContingencyVisitSection,
      notes: NotesSection,
      reasonForCreation: reasonForCreationSection
    },
    testTypesSpecialistGroup1: {
      required: CreateRequiredSectionLgvCar,
      vehicle: ContingencyVehicleSectionDefaultPsvHgvLight,
      test: ContingencyTestSectionSpecialistGroup1,
      customDefects: CustomDefectsSection,
      visit: ContingencyVisitSection,
      notes: NotesSection,
      reasonForCreation: reasonForCreationSection
    },
    testTypesDeskBasedGroup4: {
      required: DeskBasedRequiredHiddenSectionGroup4Lgv,
      vehicle: DeskBasedVehicleSectionGroup4LGV,
      test: AmendDeskBasedTestSectionGroup2And5,
      visit: VisitSection,
      notes: NotesSection,
      customDefects: CustomDefectsHiddenSection,
      reasonForCreation: reasonForCreationSection
    },
    testTypesSpecialistGroup5: {
      required: CreateRequiredSectionLgvCar,
      vehicle: ContingencyVehicleSectionDefaultPsvHgvLight,
      test: ContingencyTestSectionSpecialistGroup5,
      customDefects: CustomDefectsSection,
      visit: ContingencyVisitSection,
      notes: NotesSection,
      reasonForCreation: reasonForCreationSection
    }
  },
  'small trl': {
    default: {
      required: CreateRequiredSection,
      vehicle: ContingencyVehicleSectionDefaultPsvHgvLight,
      test: TestSection,
      defects: defectsHiddenSection,
      visit: ContingencyVisitSection,
      notes: NotesSection,
      reasonForCreation: reasonForCreationSection
    },
    testTypesDeskBasedGroup3: {
      required: SpecialistRequiredSectionLgvCarSmallTrl,
      vehicle: VehicleSectionGroup3,
      test: SpecialistTestSectionGroup3,
      customDefects: CustomDefectsHiddenSection,
      visit: VisitSection,
      notes: NotesSection,
      reasonForCreation: reasonForCreationSection
    }
  },
  motorcycle: {
    default: {
      required: CreateRequiredSection,
      vehicle: ContingencyVehicleSectionDefaultPsvHgvLight,
      test: TestSection,
      defects: defectsHiddenSection,
      visit: ContingencyVisitSection,
      notes: NotesSection,
      reasonForCreation: reasonForCreationSection
    },
    testTypesSpecialistGroup1: {
      required: CreateRequiredSectionMotorcycle,
      vehicle: ContingencyVehicleSectionDefaultPsvHgvLight,
      test: ContingencyTestSectionSpecialistGroup1,
      customDefects: CustomDefectsSection,
      visit: ContingencyVisitSection,
      notes: NotesSection,
      reasonForCreation: reasonForCreationSection
    },
    testTypesDeskBasedGroup4: {
      required: DeskBasedRequiredHiddenSectionGroup4Motorcyle,
      vehicle: DeskBasedVehicleSectionGroup4LGV,
      test: AmendDeskBasedTestSectionGroup2And5,
      visit: VisitSection,
      notes: NotesSection,
      customDefects: CustomDefectsHiddenSection,
      reasonForCreation: reasonForCreationSection
    }
  }
};
