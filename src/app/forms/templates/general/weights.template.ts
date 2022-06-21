import { FormNode, FormNodeTypes } from '../../services/dynamic-form.types';

export function generateWeights(prefix: boolean = false, vehicleType: string, prefixName?: string, ): FormNode[] {
    switch(vehicleType) {
        case 'trl':
        case 'hgv':
            return [
                {
                  name: addPrefix('gbWeight', prefixName),
                  label: 'GB weight',
                  value: '',
                  type: FormNodeTypes.CONTROL
                },
                {
                  name: addPrefix('eecWeight', prefixName),
                  label: 'EEC weight',
                  value: '',
                  type: FormNodeTypes.CONTROL
                },
                {
                  name: addPrefix('designWeight', prefixName),
                  label: 'Design weight',
                  value: '',
                  type: FormNodeTypes.CONTROL
                }
              ];
        case 'psv': 
          return [
              {
                name: addPrefix('kerbWeight', prefixName),
                label: 'Kerb weight',
                value: '',
                type: FormNodeTypes.CONTROL
              },
              {
                name: addPrefix('ladenWeight', prefixName),
                label: 'Laden weight',
                value: '',
                type: FormNodeTypes.CONTROL
              },
              {
                name: addPrefix('gbWeight', prefixName),
                label: 'GB weight',
                value: '',
                type: FormNodeTypes.CONTROL
              },
              {
                name: addPrefix('designWeight', prefixName),
                label: 'Design weight',
                value: '',
                type: FormNodeTypes.CONTROL
              }
            ];
        default:
          return []
    }
}

function addPrefix(string: string, prefix?: string): string {
  return prefix ? prefix + string.charAt(0).toUpperCase() + string.slice(1) : string;
}