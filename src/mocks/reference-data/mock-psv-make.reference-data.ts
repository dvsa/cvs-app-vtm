import { PsvMake, ReferenceDataResourceType } from '@models/reference-data.model';

export const mockPsvMakes: PsvMake[] = [
  {
    resourceType: ReferenceDataResourceType.PsvMake,
    resourceKey: '007000',
    description: '',
    dtpNumber: '007000',
    psvChassisMake: 'AEC',
    psvChassisModel: 'RELIANCE',
    psvBodyMake: 'ALEXANDER',
    psvBodyModel: 'S'
  },
  {
    resourceType: ReferenceDataResourceType.PsvMake,
    resourceKey: '007001',
    description: '',
    dtpNumber: '007001',
    psvChassisMake: 'AEC',
    psvChassisModel: 'RELIANCE',
    psvBodyMake: 'CORROSSERIE',
    psvBodyModel: 'S'
  },
  {
    resourceType: ReferenceDataResourceType.PsvMake,
    resourceKey: '009276',
    description: '',
    dtpNumber: '009276',
    psvChassisMake: 'FORD',
    psvChassisModel: 'TRANSIT',
    psvBodyMake: 'MACNEILLE',
    psvBodyModel: 'M'
  },
  {
    resourceType: ReferenceDataResourceType.PsvMake,
    resourceKey: '009277',
    description: '',
    dtpNumber: '009277',
    psvChassisMake: 'MERCEDES',
    psvChassisModel: '815D',
    psvBodyMake: 'SITCAR',
    psvBodyModel: 'S'
  }
];
