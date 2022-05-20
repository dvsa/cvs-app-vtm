import { FormNode, FormNodeTypes, FormNodeViewTypes } from '../../services/dynamic-form.types';

export const PsvBody: FormNode = {
  name: 'body',
  label: 'Body',
  type: FormNodeTypes.GROUP,
  viewType: FormNodeViewTypes.SUBHEADING,
  children: [
    {
      name: 'modelLiteral',
      label: 'Model literal',
      value: '',
      type: FormNodeTypes.CONTROL
    },
    {
      name: 'chassisMake',
      label: 'Chassis make',
      value: '',
      type: FormNodeTypes.CONTROL,
    },
    {
      name: 'chassisModel',
      label: 'Chassis model',
      value: '',
      type: FormNodeTypes.CONTROL,
    },
    {
      name: 'bodyMake',
      label: 'Body make',
      value: '',
      type: FormNodeTypes.CONTROL,
    },
    {
      name: 'bodyModel',
      label: 'Body model',
      value: '',
      type: FormNodeTypes.CONTROL,
    },
    {
      name: 'bodyType',
      label: 'Body type',
      value: '',
      type: FormNodeTypes.GROUP,
      children: [
        {
          name: 'description',
          label: 'Body type',
          value: '',
          type: FormNodeTypes.CONTROL,
        },
      ]
    },
    {
      name: 'functionCode',
      label: 'Function code',
      value: '',
      type: FormNodeTypes.CONTROL,
    },
    {
      name: 'conversionRefNo',
      label: 'Conversion ref no',
      value: '',
      type: FormNodeTypes.CONTROL,
    },
  ]
}
