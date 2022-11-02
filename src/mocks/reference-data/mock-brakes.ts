import { Brake, ReferenceDataResourceType } from '@models/reference-data.model';

export const mockBrakes: Brake[] = [
  {
    resourceType: ReferenceDataResourceType.BodyModel,
    resourceKey: '202',
    description: '202',
    service: '2 axle F/R split axel (axel 1/axle 2)',
    secondary: 'Split service brake (designated) or handbrake',
    parking: 'Axle 2'
  },
  {
    resourceType: ReferenceDataResourceType.BodyModel,
    resourceKey: '303',
    description: '303',
    service: 'Some placeholder service text',
    secondary: 'Some placeholder secondary text',
    parking: 'Axle 1'
  },
  {
    resourceType: ReferenceDataResourceType.BodyModel,
    resourceKey: '404',
    description: '404',
    service: 'More text',
    secondary: 'Some more text',
    parking: 'Axle -1'
  }
];
