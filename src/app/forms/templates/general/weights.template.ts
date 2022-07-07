import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { FormNode, FormNodeTypes } from '../../services/dynamic-form.types';

export function generateWeights(vehicleType: VehicleTypes, prefix?: string): FormNode[] {
    switch(vehicleType) {
        case VehicleTypes.TRL:
        case VehicleTypes.HGV:
            return [
                {
                  name: addPrefix('gbWeight', prefix),
                  label: 'GB weight',
                  value: '',
                  type: FormNodeTypes.CONTROL
                },
                {
                  name: addPrefix('eecWeight', prefix),
                  label: 'EEC weight',
                  value: '',
                  type: FormNodeTypes.CONTROL
                },
                {
                  name: addPrefix('designWeight', prefix),
                  label: 'Design weight',
                  value: '',
                  type: FormNodeTypes.CONTROL
                }
              ];
        case VehicleTypes.PSV:
          return [
              {
                name: addPrefix('kerbWeight', prefix),
                label: 'Kerb weight',
                value: '',
                type: FormNodeTypes.CONTROL
              },
              {
                name: addPrefix('ladenWeight', prefix),
                label: 'Laden weight',
                value: '',
                type: FormNodeTypes.CONTROL
              },
              {
                name: addPrefix('gbWeight', prefix),
                label: 'GB weight',
                value: '',
                type: FormNodeTypes.CONTROL
              },
              {
                name: addPrefix('designWeight', prefix),
                label: 'Design weight',
                value: '',
                type: FormNodeTypes.CONTROL
              }
            ];
    }
}

function addPrefix(string: string, prefix?: string): string {
  return prefix ? prefix + string.charAt(0).toUpperCase() + string.slice(1) : string;
}
