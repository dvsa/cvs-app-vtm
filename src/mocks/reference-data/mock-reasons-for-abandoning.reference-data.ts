import { ReasonsForAbandoning, ReferenceDataResourceType } from '@models/reference-data.model';
import { VehicleTypes } from '@models/vehicle-tech-record.model';

export const mockReasonsForAbandoning: ReasonsForAbandoning[] = [
  {
    resourceType: ReferenceDataResourceType.ReasonsForAbandoning,
    resourceKey: 'The vehicle was not submitted for test at the appointed time',
    description: 'The vehicle was not submitted for test at the appointed time',
    vehicleType: VehicleTypes.PSV
  },
  {
    resourceType: ReferenceDataResourceType.ReasonsForAbandoning,
    resourceKey: 'The relevant test fee has not been paid',
    description: 'The relevant test fee has not been paid',
    vehicleType: VehicleTypes.PSV
  },
  {
    resourceType: ReferenceDataResourceType.ReasonsForAbandoning,
    resourceKey: 'There was no means of identifying the vehicle i.e. the vehicle chassis/serial number was missing or did not relate to the vehicle',
    description: 'There was no means of identifying the vehicle i.e. the vehicle chassis/serial number was missing or did not relate to the vehicle',
    vehicleType: VehicleTypes.PSV
  },
  {
    resourceType: ReferenceDataResourceType.ReasonsForAbandoning,
    resourceKey: 'The registration document or other evidence of the date of first registration was not presented when requested',
    description: 'The registration document or other evidence of the date of first registration was not presented when requested',
    vehicleType: VehicleTypes.PSV
  },
  {
    resourceType: ReferenceDataResourceType.ReasonsForAbandoning,
    resourceKey: 'The vehicle was emitting substantial amounts of exhaust smoke so as to make it unreasonable for the test to be carried out',
    description: 'The vehicle was emitting substantial amounts of exhaust smoke so as to make it unreasonable for the test to be carried out',
    vehicleType: VehicleTypes.PSV
  },
  {
    resourceType: ReferenceDataResourceType.ReasonsForAbandoning,
    resourceKey: 'The vehicle was in such a dirty or dangerous condition as to make it unreasonable for the test to be carried out',
    description: 'The vehicle was in such a dirty or dangerous condition as to make it unreasonable for the test to be carried out',
    vehicleType: VehicleTypes.PSV
  },
  {
    resourceType: ReferenceDataResourceType.ReasonsForAbandoning,
    resourceKey: 'The vehicle did not have sufficient fuel and oil to allow the test to be carried out',
    description: 'The vehicle did not have sufficient fuel and oil to allow the test to be carried out',
    vehicleType: VehicleTypes.PSV
  },
  {
    resourceType: ReferenceDataResourceType.ReasonsForAbandoning,
    resourceKey: 'The test could not be completed due to a failure of a part of the vehicle which made movement under its own power impossible',
    description: 'The test could not be completed due to a failure of a part of the vehicle which made movement under its own power impossible',
    vehicleType: VehicleTypes.PSV
  },
  {
    resourceType: ReferenceDataResourceType.ReasonsForAbandoning,
    resourceKey: 'Current Health and Safety legislation cannot be met in testing the vehicle',
    description: 'Current Health and Safety legislation cannot be met in testing the vehicle',
    vehicleType: VehicleTypes.PSV
  },
  {
    resourceType: ReferenceDataResourceType.ReasonsForAbandoning,
    resourceKey:
      'The driver and/or presenter of the vehicle declined either to remain in the vehicle or in its vicinity throughout the examination or to drive it or to operate controls or doors or to remove or refit panels after being requested to do so',
    description:
      'The driver and/or presenter of the vehicle declined either to remain in the vehicle or in its vicinity throughout the examination or to drive it or to operate controls or doors or to remove or refit panels after being requested to do so',
    vehicleType: VehicleTypes.PSV
  },
  {
    resourceType: ReferenceDataResourceType.ReasonsForAbandoning,
    resourceKey: 'The vehicle exhaust outlet has been modified in such a way as to prevent a metered smoke check being conducted',
    description: 'The vehicle exhaust outlet has been modified in such a way as to prevent a metered smoke check being conducted',
    vehicleType: VehicleTypes.PSV
  },
  {
    resourceType: ReferenceDataResourceType.ReasonsForAbandoning,
    resourceKey:
      'A proper examination cannot be readily carried out as any door, engine cover, hatch or other access device designed to be opened is locked or otherwise cannot be opened',
    description:
      'A proper examination cannot be readily carried out as any door, engine cover, hatch or other access device designed to be opened is locked or otherwise cannot be opened',
    vehicleType: VehicleTypes.PSV
  }
];
