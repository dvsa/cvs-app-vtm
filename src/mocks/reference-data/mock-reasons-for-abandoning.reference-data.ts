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
  },
  {
    resourceType: ReferenceDataResourceType.ReasonsForAbandoning,
    resourceKey: 'The vehicle was not submitted for test at the appointed time',
    description: 'The vehicle was not submitted for test at the appointed time',
    vehicleType: VehicleTypes.HGV
  },
  {
    resourceType: ReferenceDataResourceType.ReasonsForAbandoning,
    resourceKey: 'The relevant test fee has not been paid',
    description: 'The relevant test fee has not been paid',
    vehicleType: VehicleTypes.HGV
  },
  {
    resourceType: ReferenceDataResourceType.ReasonsForAbandoning,
    resourceKey: 'The trailer was not accompanied by a suitable motor vehicle',
    description: 'The trailer was not accompanied by a suitable motor vehicle',
    vehicleType: VehicleTypes.HGV
  },
  {
    resourceType: ReferenceDataResourceType.ReasonsForAbandoning,
    resourceKey:
      'There is not permanently fixed to the chassis serial number as shown on the registration document (motor vehicle) or the identification mark issued by the Secretary of State (trailer)',
    description:
      'There is not permanently fixed to the chassis serial number as shown on the registration document (motor vehicle) or the identification mark issued by the Secretary of State (trailer)',
    vehicleType: VehicleTypes.HGV
  },
  {
    resourceType: ReferenceDataResourceType.ReasonsForAbandoning,
    resourceKey: 'A Ministry Plate has been issued and is not fitted to the vehicle or trailer',
    description: 'A Ministry Plate has been issued and is not fitted to the vehicle or trailer',
    vehicleType: VehicleTypes.HGV
  },
  {
    resourceType: ReferenceDataResourceType.ReasonsForAbandoning,
    resourceKey:
      'The particulars of the motor vehicle or trailer (e.g. number of axles / axle weights) do not match the VTG6 Ministry Plate fitted to the vehicle',
    description:
      'The particulars of the motor vehicle or trailer (e.g. number of axles / axle weights) do not match the VTG6 Ministry Plate fitted to the vehicle',
    vehicleType: VehicleTypes.HGV
  },
  {
    resourceType: ReferenceDataResourceType.ReasonsForAbandoning,
    resourceKey:
      'The vehicle or motor vehicle by which it is accompanied emits substantial amounts of smoke so as to make it unreasonable for the test to be carried out',
    description:
      'The vehicle or motor vehicle by which it is accompanied emits substantial amounts of smoke so as to make it unreasonable for the test to be carried out',
    vehicleType: VehicleTypes.HGV
  },
  {
    resourceType: ReferenceDataResourceType.ReasonsForAbandoning,
    resourceKey:
      'The vehicle or trailer (any part) was in such a dirty or dangerous condition as to make it unreasonable for the test to be carried out',
    description:
      'The vehicle or trailer (any part) was in such a dirty or dangerous condition as to make it unreasonable for the test to be carried out',
    vehicleType: VehicleTypes.HGV
  },
  {
    resourceType: ReferenceDataResourceType.ReasonsForAbandoning,
    resourceKey:
      'No proof was given that the vehicle used for carrying dangerous/toxic/corrosive or inflammable goods had been cleaned or otherwise rendered safe for test',
    description:
      'No proof was given that the vehicle used for carrying dangerous/toxic/corrosive or inflammable goods had been cleaned or otherwise rendered safe for test',
    vehicleType: VehicleTypes.HGV
  },
  {
    resourceType: ReferenceDataResourceType.ReasonsForAbandoning,
    resourceKey: 'The vehicle did not have sufficient fuel and oil to allow the test to be carried out',
    description: 'The vehicle did not have sufficient fuel and oil to allow the test to be carried out',
    vehicleType: VehicleTypes.HGV
  },
  {
    resourceType: ReferenceDataResourceType.ReasonsForAbandoning,
    resourceKey: 'The vehicle was not loaded as required',
    description: 'The vehicle was not loaded as required',
    vehicleType: VehicleTypes.HGV
  },
  {
    resourceType: ReferenceDataResourceType.ReasonsForAbandoning,
    resourceKey:
      'The test could not be completed due to a failure of a part of the vehicle, or trailer and accompanying motor vehicle which made movement impossible',
    description:
      'The test could not be completed due to a failure of a part of the vehicle, or trailer and accompanying motor vehicle which made movement impossible',
    vehicleType: VehicleTypes.HGV
  },
  {
    resourceType: ReferenceDataResourceType.ReasonsForAbandoning,
    resourceKey: 'The vehicle was presented for test carrying livestock or other unsuitable material',
    description: 'The vehicle was presented for test carrying livestock or other unsuitable material',
    vehicleType: VehicleTypes.HGV
  },
  {
    resourceType: ReferenceDataResourceType.ReasonsForAbandoning,
    resourceKey: 'Current Health and Safety legislation cannot be met in testing the vehicle',
    description: 'Current Health and Safety legislation cannot be met in testing the vehicle',
    vehicleType: VehicleTypes.HGV
  },
  {
    resourceType: ReferenceDataResourceType.ReasonsForAbandoning,
    resourceKey: 'The vehicle exhaust outlet has been modified preventing a metered smoke check',
    description: 'The vehicle exhaust outlet has been modified preventing a metered smoke check',
    vehicleType: VehicleTypes.HGV
  },
  {
    resourceType: ReferenceDataResourceType.ReasonsForAbandoning,
    resourceKey: 'The examiner could not open the tachograph',
    description: 'The examiner could not open the tachograph',
    vehicleType: VehicleTypes.HGV
  },
  {
    resourceType: ReferenceDataResourceType.ReasonsForAbandoning,
    resourceKey:
      'The driver and/or presenter of the vehicle refused to or was unable to comply with the instructions of DVSA staff making it impractical or unsafe to continue the test',
    description:
      'The driver and/or presenter of the vehicle refused to or was unable to comply with the instructions of DVSA staff making it impractical or unsafe to continue the test',
    vehicleType: VehicleTypes.HGV
  },
  {
    resourceType: ReferenceDataResourceType.ReasonsForAbandoning,
    resourceKey: 'The vehicle was not submitted for test at the appointed time',
    description: 'The vehicle was not submitted for test at the appointed time',
    vehicleType: VehicleTypes.TRL
  },
  {
    resourceType: ReferenceDataResourceType.ReasonsForAbandoning,
    resourceKey: 'The relevant test fee has not been paid',
    description: 'The relevant test fee has not been paid',
    vehicleType: VehicleTypes.TRL
  },
  {
    resourceType: ReferenceDataResourceType.ReasonsForAbandoning,
    resourceKey: 'The trailer was not accompanied by a suitable motor vehicle',
    description: 'The trailer was not accompanied by a suitable motor vehicle',
    vehicleType: VehicleTypes.TRL
  },
  {
    resourceType: ReferenceDataResourceType.ReasonsForAbandoning,
    resourceKey:
      'There is not permanently fixed to the chassis serial number as shown on the registration document (motor vehicle) or the identification mark issued by the Secretary of State (trailer)',
    description:
      'There is not permanently fixed to the chassis serial number as shown on the registration document (motor vehicle) or the identification mark issued by the Secretary of State (trailer)',
    vehicleType: VehicleTypes.TRL
  },
  {
    resourceType: ReferenceDataResourceType.ReasonsForAbandoning,
    resourceKey: 'A Ministry Plate has been issued and is not fitted to the vehicle or trailer',
    description: 'A Ministry Plate has been issued and is not fitted to the vehicle or trailer',
    vehicleType: VehicleTypes.TRL
  },
  {
    resourceType: ReferenceDataResourceType.ReasonsForAbandoning,
    resourceKey:
      'The particulars of the motor vehicle or trailer (e.g. number of axles / axle weights) do not match the VTG6 Ministry Plate fitted to the vehicle',
    description:
      'The particulars of the motor vehicle or trailer (e.g. number of axles / axle weights) do not match the VTG6 Ministry Plate fitted to the vehicle',
    vehicleType: VehicleTypes.TRL
  },
  {
    resourceType: ReferenceDataResourceType.ReasonsForAbandoning,
    resourceKey:
      'The vehicle or motor vehicle by which it is accompanied emits substantial amounts of smoke so as to make it unreasonable for the test to be carried out',
    description:
      'The vehicle or motor vehicle by which it is accompanied emits substantial amounts of smoke so as to make it unreasonable for the test to be carried out',
    vehicleType: VehicleTypes.TRL
  },
  {
    resourceType: ReferenceDataResourceType.ReasonsForAbandoning,
    resourceKey:
      'The vehicle or trailer (any part) was in such a dirty or dangerous condition as to make it unreasonable for the test to be carried out',
    description:
      'The vehicle or trailer (any part) was in such a dirty or dangerous condition as to make it unreasonable for the test to be carried out',
    vehicleType: VehicleTypes.TRL
  },
  {
    resourceType: ReferenceDataResourceType.ReasonsForAbandoning,
    resourceKey:
      'No proof was given that the vehicle used for carrying dangerous/toxic/corrosive or inflammable goods had been cleaned or otherwise rendered safe for test',
    description:
      'No proof was given that the vehicle used for carrying dangerous/toxic/corrosive or inflammable goods had been cleaned or otherwise rendered safe for test',
    vehicleType: VehicleTypes.TRL
  },
  {
    resourceType: ReferenceDataResourceType.ReasonsForAbandoning,
    resourceKey: 'The vehicle did not have sufficient fuel and oil to allow the test to be carried out',
    description: 'The vehicle did not have sufficient fuel and oil to allow the test to be carried out',
    vehicleType: VehicleTypes.TRL
  },
  {
    resourceType: ReferenceDataResourceType.ReasonsForAbandoning,
    resourceKey: 'The vehicle was not loaded as required',
    description: 'The vehicle was not loaded as required',
    vehicleType: VehicleTypes.TRL
  },
  {
    resourceType: ReferenceDataResourceType.ReasonsForAbandoning,
    resourceKey:
      'The test could not be completed due to a failure of a part of the vehicle, or trailer and accompanying motor vehicle which made movement impossible',
    description:
      'The test could not be completed due to a failure of a part of the vehicle, or trailer and accompanying motor vehicle which made movement impossible',
    vehicleType: VehicleTypes.TRL
  },
  {
    resourceType: ReferenceDataResourceType.ReasonsForAbandoning,
    resourceKey: 'The vehicle was presented for test carrying livestock or other unsuitable material',
    description: 'The vehicle was presented for test carrying livestock or other unsuitable material',
    vehicleType: VehicleTypes.TRL
  },
  {
    resourceType: ReferenceDataResourceType.ReasonsForAbandoning,
    resourceKey: 'Current Health and Safety legislation cannot be met in testing the vehicle',
    description: 'Current Health and Safety legislation cannot be met in testing the vehicle',
    vehicleType: VehicleTypes.TRL
  },
  {
    resourceType: ReferenceDataResourceType.ReasonsForAbandoning,
    resourceKey: 'The vehicle exhaust outlet has been modified preventing a metered smoke check',
    description: 'The vehicle exhaust outlet has been modified preventing a metered smoke check',
    vehicleType: VehicleTypes.TRL
  },
  {
    resourceType: ReferenceDataResourceType.ReasonsForAbandoning,
    resourceKey: 'The examiner could not open the tachograph',
    description: 'The examiner could not open the tachograph',
    vehicleType: VehicleTypes.TRL
  },
  {
    resourceType: ReferenceDataResourceType.ReasonsForAbandoning,
    resourceKey:
      'The driver and/or presenter of the vehicle refused to or was unable to comply with the instructions of DVSA staff making it impractical or unsafe to continue the test',
    description:
      'The driver and/or presenter of the vehicle refused to or was unable to comply with the instructions of DVSA staff making it impractical or unsafe to continue the test',
    vehicleType: VehicleTypes.TRL
  }
];
