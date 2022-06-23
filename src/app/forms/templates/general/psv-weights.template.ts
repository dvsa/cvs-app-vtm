import { FormNode, FormNodeTypes } from '../../services/dynamic-form.types';

export function generateWeights(addGrossPrefix: boolean = false): FormNode[] {
  return [
    {
      name: addGrossPrefix ? addPrefix('kerbWeight') : 'kerbWeight',
      label: 'Kerb weight',
      value: '',
      type: FormNodeTypes.CONTROL
    },
    {
      name: addGrossPrefix ? addPrefix('ladenWeight') : 'ladenWeight',
      label: 'Laden weight',
      value: '',
      type: FormNodeTypes.CONTROL
    },
    {
      name: addGrossPrefix ? addPrefix('gbWeight') : 'gbWeight',
      label: 'GB weight',
      value: '',
      type: FormNodeTypes.CONTROL
    },
    {
      name: addGrossPrefix ? addPrefix('designWeight') : 'designWeight',
      label: 'Design weight',
      value: '',
      type: FormNodeTypes.CONTROL
    }
  ];
}

function addPrefix(string: string): string {
  return 'gross' + string.charAt(0).toUpperCase() + string.slice(1);
}
