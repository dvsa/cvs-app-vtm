import { ValidatorNames } from '@forms/models/validators.enum';
import { FormNode, FormNodeTypes, FormNodeViewTypes } from '../../services/dynamic-form.types';

export function createSingleSearchResult(systemNumber?: string): FormNode {
  return {
    name: 'singleSearchResult',
    type: FormNodeTypes.GROUP,
    label: 'Technical Record',
    viewType: FormNodeViewTypes.SUBHEADING,
    subHeadingLink: {
      label: 'Select technical record',
      url: `/tech-records/${systemNumber}`
    },
    children: [
      {
        name: 'vin',
        label: 'Vehicle identification number (VIN)',
        type: FormNodeTypes.CONTROL,
        viewType: FormNodeViewTypes.STRING
      },
      {
        name: 'vrm',
        label: 'Vehicle registration mark (VRM)',
        type: FormNodeTypes.CONTROL,
        viewType: FormNodeViewTypes.STRING
      },
      {
        name: 'trailerId',
        label: 'Trailer ID',
        type: FormNodeTypes.CONTROL,
        validators: [{ name: ValidatorNames.HideIfEmpty, args: 'trailerId' }]
      },
      {
        name: 'vehicleType',
        label: 'Vehicle type',
        type: FormNodeTypes.CONTROL,
        viewType: FormNodeViewTypes.STRING
      },
      {
        name: 'manufactureYear',
        label: 'Year of manufacture',
        type: FormNodeTypes.CONTROL,
        viewType: FormNodeViewTypes.STRING
      },
      {
        name: 'make',
        label: 'Make',
        type: FormNodeTypes.CONTROL,
        viewType: FormNodeViewTypes.STRING
      },
      {
        name: 'model',
        label: 'Model',
        type: FormNodeTypes.CONTROL,
        viewType: FormNodeViewTypes.STRING
      }
    ]
  };
}
