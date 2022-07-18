import { FormNode, FormNodeTypes, FormNodeViewTypes } from '../../services/dynamic-form.types';

export function getBodyTemplate(isPsv: boolean = false): FormNode {
  let bodyFormControl: FormNode = {
    name: 'body',
    label: 'Body',
    type: FormNodeTypes.GROUP,
    viewType: FormNodeViewTypes.SUBHEADING,
    children: []
  };
  if(isPsv) {
    bodyFormControl.children!.push(
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
      }
    )
  }

  bodyFormControl.children!.push(
      {
        name: 'make',
        label: 'Body make',
        value: '',
        type: FormNodeTypes.CONTROL,
      },
      {
        name: 'model',
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
      }
  )
  return bodyFormControl;
}
