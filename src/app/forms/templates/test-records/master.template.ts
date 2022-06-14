import { FormNode } from '@forms/services/dynamic-form.types';
import { TestCodes } from '@models/testCodes.enum';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { EmissionsSection } from './section-templates/emissions/emissions-section.template';
import { NotesSection } from './section-templates/notes/notes-section.template copy';
import { SeatbeltSection } from './section-templates/seatbelt/seatbelt-section.template';
import { TestSection } from './section-templates/test/test-section.template';
import { VehicleSectionDefaultPsvHgv } from './section-templates/vehicle/default-psv-hgv-vehicle-section.template';
import { VehicleSectionDefaultTrl } from './section-templates/vehicle/default-trl-vehicle-section.template';
import { VisitSection } from './section-templates/visit/visit-section.template';

//Keys of root object must a a valid vehicle type.
//Keys of child object must be a valid test code.
//Child object must ALWAYS have a 'default' key.

export const masterTpl: Record<VehicleTypes, Partial<Record<TestCodes | 'default', Record<string, FormNode>>>> = {
  psv: {
    default: {
      vehicle: VehicleSectionDefaultPsvHgv,
      test: TestSection,
      seatbelts: SeatbeltSection,
      emissions: EmissionsSection,
      visit: VisitSection,
      notes: NotesSection
    }
  },
  hgv: {
    default: {
      vehicle: VehicleSectionDefaultPsvHgv,
      test: TestSection,
      emissions: EmissionsSection,
      visit: VisitSection,
      notes: NotesSection
    }
  },
  trl: {
    default: {
      vehicle: VehicleSectionDefaultTrl,
      test: TestSection,
      visit: VisitSection,
      notes: NotesSection
    }
  }
};
