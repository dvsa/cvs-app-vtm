import { FormNode, FormNodeTypes, FormNodeViewTypes } from '../../services/dynamic-form.types';

export function createSingleSearchResult(vin: string): FormNode {
  return {
    name: 'singleSearchResult',
    type: FormNodeTypes.GROUP,
    label: 'Technical Record',
    viewType: FormNodeViewTypes.SUBHEADING,
    subHeadingLink: {
      label: 'Select technical record',
      url: `/tech-records/${vin}`
    },
    children: [
      {
        name: 'vin',
        label: 'Vehicle identification number (VIN)',
        value: '',
        type: FormNodeTypes.CONTROL,
        viewType: FormNodeViewTypes.STRING
      },
      {
        name: 'vrm',
        label: 'Vehicle registration mark (VRM)',
        value: '',
        type: FormNodeTypes.CONTROL,
        viewType: FormNodeViewTypes.STRING
      },
      {
        name: 'vehicleType',
        label: 'Vehicle type',
        value: '',
        type: FormNodeTypes.CONTROL,
        viewType: FormNodeViewTypes.STRING
      },
      {
        name: 'manufactureYear',
        label: 'Year of manufacture',
        value: '',
        type: FormNodeTypes.CONTROL,
        viewType: FormNodeViewTypes.STRING
      },
      {
        name: 'make',
        label: 'Make',
        value: '',
        type: FormNodeTypes.CONTROL,
        viewType: FormNodeViewTypes.STRING
      },
      {
        name: 'model',
        label: 'Model',
        value: '',
        type: FormNodeTypes.CONTROL,
        viewType: FormNodeViewTypes.STRING
      }
    ]
  };
}
