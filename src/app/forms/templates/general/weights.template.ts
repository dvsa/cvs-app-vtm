import { FormNode, FormNodeTypes } from '../../services/dynamic-form.types';

export function generateWeights(prefix: boolean = false, vehicleType: string, prefixName?: string, ): FormNode[] {
    switch(vehicleType) {
        case 'trl':
        case 'hgv':
            return [
                {
                  name: prefix ? addPrefix('gbWeight', prefixName) : 'gbWeight',
                  label: 'GB weight',
                  value: '',
                  type: FormNodeTypes.CONTROL
                },
                {
                  name: prefix ? addPrefix('eecWeight', prefixName) : 'eecWeight',
                  label: 'EEC weight',
                  value: '',
                  type: FormNodeTypes.CONTROL
                },
                {
                  name: prefix ? addPrefix('designWeight', prefixName) : 'designWeight',
                  label: 'Design weight',
                  value: '',
                  type: FormNodeTypes.CONTROL
                }
              ];
        case 'psv': 
          return [
              {
                name: prefix ? addPrefix('kerbWeight', prefixName) : 'kerbWeight',
                label: 'Kerb weight',
                value: '',
                type: FormNodeTypes.CONTROL
              },
              {
                name: prefix ? addPrefix('ladenWeight', prefixName) : 'ladenWeight',
                label: 'Laden weight',
                value: '',
                type: FormNodeTypes.CONTROL
              },
              {
                name: prefix ? addPrefix('gbWeight', prefixName) : 'gbWeight',
                label: 'GB weight',
                value: '',
                type: FormNodeTypes.CONTROL
              },
              {
                name: prefix ? addPrefix('designWeight', prefixName) : 'designWeight',
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
  if (prefix) {
    return prefix + string.charAt(0).toUpperCase() + string.slice(1);
  }
  return string.charAt(0).toUpperCase() + string.slice(1);
}