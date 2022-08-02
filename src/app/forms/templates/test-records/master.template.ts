import { FormNode } from '@forms/services/dynamic-form.types';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { DefectsTpl } from '../general/defect.template';
import { CustomDefectsSection } from './section-templates/customDefects/custom-defects-section.template';
import { EmissionsSection } from './section-templates/emissions/emissions-section.template';
import { NotesSection } from './section-templates/notes/notes-section.template';
import { RequiredSection } from './section-templates/required/required-hidden-section.template';
import { SeatbeltSection } from './section-templates/seatbelt/seatbelt-section.template';
import { TestSectionGroup1 } from './section-templates/test/test-section-group1.template';
import { TestSectionGroup15And16 } from './section-templates/test/test-section-group15And16.template';
import { TestSectionGroup2 } from './section-templates/test/test-section-group2.template';
import { TestSection } from './section-templates/test/test-section.template';
import { VehicleSectionDefaultPsvHgv } from './section-templates/vehicle/default-psv-hgv-vehicle-section.template';
import { VehicleSectionDefaultTrl } from './section-templates/vehicle/default-trl-vehicle-section.template';
import { VisitSection } from './section-templates/visit/visit-section.template';

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
      required: RequiredSection
    },
    testTypesGroup15And16: {
      vehicle: VehicleSectionDefaultPsvHgv,
      test: TestSectionGroup15And16,
      emissions: EmissionsSection,
      visit: VisitSection,
      notes: NotesSection,
      customDefects: CustomDefectsSection,
      required: RequiredSection
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
      required: RequiredSection
    }
  }
};
