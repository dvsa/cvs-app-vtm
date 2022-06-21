import { FormNode, FormNodeTypes } from '../../services/dynamic-form.types';

export function generateWeights(addGrossPrefix: boolean = false): FormNode[] {
  return [
    {
      name: addGrossPrefix ? addPrefix('gbWeight') : 'gbWeight',
      label: 'GB weight',
      value: '',
      type: FormNodeTypes.CONTROL
    },
    {
      name: addGrossPrefix ? addPrefix('eecWeight') : 'eecWeight',
      label: 'EEC weight',
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
  return string.charAt(0).toUpperCase() + string.slice(1);
}
