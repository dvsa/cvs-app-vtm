import { Params } from '@angular/router';
import { ValidatorNames } from '@forms/models/validators.enum';
import { FormNode, FormNodeTypes, FormNodeViewTypes } from '../../services/dynamic-form.types';

export function createSingleSearchResult(systemNumber: string, createdTimestamp: string, queryParams?: Params): FormNode {
  return {
    name: 'singleSearchResult',
    type: FormNodeTypes.GROUP,
    label: 'Technical Record',
    viewType: FormNodeViewTypes.SUBHEADING,
    subHeadingLink: {
      label: 'Select technical record',
      url: `/tech-records/${systemNumber}/${createdTimestamp}`,
      queryParams
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
        viewType: FormNodeViewTypes.VRM
      },
      {
        name: 'trailerId',
        label: 'Trailer ID',
        type: FormNodeTypes.CONTROL
      },
      {
        name: 'techRecord_vehicleType',
        label: 'Vehicle type',
        type: FormNodeTypes.CONTROL,
        viewType: FormNodeViewTypes.STRING,
        validators: [
          { name: ValidatorNames.HideIfNotEqual, args: { sibling: 'trailerId', value: 'TRL' } },
          { name: ValidatorNames.HideIfNotEqual, args: { sibling: 'vrm', value: ['HGV', 'PSV'] } }
        ]
      },
      {
        name: 'techRecord_manufactureYear',
        label: 'Year of manufacture',
        type: FormNodeTypes.CONTROL,
        viewType: FormNodeViewTypes.STRING
      },
      {
        name: 'techRecord_make',
        label: 'Make',
        type: FormNodeTypes.CONTROL,
        viewType: FormNodeViewTypes.STRING
      },
      {
        name: 'techRecord_model',
        label: 'Model',
        type: FormNodeTypes.CONTROL,
        viewType: FormNodeViewTypes.STRING
      }
    ]
  };
}
