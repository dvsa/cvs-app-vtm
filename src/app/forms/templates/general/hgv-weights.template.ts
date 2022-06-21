import { FormNode, FormNodeTypes } from '../../services/dynamic-form.types';

export function generateWeights(addGrossPrefix: boolean = false, prefix?: string): FormNode[] {
  return [
    {
      name: addGrossPrefix ? addPrefix('gbWeight', prefix) : 'gbWeight',
      label: 'GB weight',
      value: '',
      type: FormNodeTypes.CONTROL
    },
    {
      name: addGrossPrefix ? addPrefix('eecWeight', prefix) : 'eecWeight',
      label: 'EEC weight',
      value: '',
      type: FormNodeTypes.CONTROL
    },
    {
      name: addGrossPrefix ? addPrefix('designWeight', prefix) : 'designWeight',
      label: 'Design weight',
      value: '',
      type: FormNodeTypes.CONTROL
    }
  ];
}

function addPrefix(string: string, prefix?: string): string {
  return prefix + string.charAt(0).toUpperCase() + string.slice(1);
}
