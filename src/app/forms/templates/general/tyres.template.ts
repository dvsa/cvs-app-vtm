import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { FormNode, FormNodeTypes } from '../../services/dynamic-form.types';

export function getTyresSection(vehicleType: VehicleTypes): FormNode {
  const subSections: FormNode[] = [
    {
      name: 'tyreCode',
      label: 'Tyre Code',
      value: '',
      type: FormNodeTypes.CONTROL
    },
    {
      name: 'tyreSize',
      label: 'Tyre Size',
      value: '',
      type: FormNodeTypes.CONTROL,
      disabled: true
    },
    {
      name: 'plyRating',
      label: 'Ply Rating',
      value: '',
      type: FormNodeTypes.CONTROL,
      disabled: true
    },
    {
      name: 'fitmentCode',
      label: 'Fitment code',
      value: '',
      type: FormNodeTypes.CONTROL
    },
    {
      name: 'dataTrAxles',
      label: 'Load index',
      value: '',
      type: FormNodeTypes.CONTROL,
      disabled: true
    }
  ];

  if (vehicleType === VehicleTypes.PSV) {
    subSections.splice(3, 0, { name: 'speedCategorySymbol', label: 'Speed category symbol', value: '', type: FormNodeTypes.CONTROL });
  }

  const section: FormNode = {
    name: 'tyreSection',
    type: FormNodeTypes.GROUP,
    label: 'Tyres',
    children: [
      { name: 'speedRestriction', label: 'Speed Restriction', value: '', type: FormNodeTypes.CONTROL },
      {
        name: 'axles',
        value: '',
        type: FormNodeTypes.ARRAY,
        children: [
          {
            name: '0',
            label: 'Axle',
            value: '',
            type: FormNodeTypes.GROUP,
            children: [
              {
                name: 'axleNumber',
                label: 'Axle Number',
                type: FormNodeTypes.CONTROL
              },
              {
                name: 'tyres',
                label: 'Tyres',
                value: '',
                type: FormNodeTypes.GROUP,
                children: subSections
              }
            ]
          }
        ]
      }
    ]
  };

  return section;
}
