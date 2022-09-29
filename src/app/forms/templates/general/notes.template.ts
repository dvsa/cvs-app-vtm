import { ValidatorNames } from '@forms/models/validators.enum';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { FormNode, FormNodeEditTypes, FormNodeTypes, FormNodeViewTypes } from '../../services/dynamic-form.types';

export function getNotesTemplate(vehicleType: VehicleTypes): FormNode {
  let form: FormNode = {
    name: 'notesSection',
    label: 'Notes',
    type: FormNodeTypes.GROUP,
    viewType: FormNodeViewTypes.SUBHEADING,
    children: []
  }

  if(vehicleType === VehicleTypes.PSV) {
    form.children?.push({
      name: 'remarks',
      label: 'Notes',
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.STRING,
      editType: FormNodeEditTypes.TEXTAREA,
      validators: [{ name: ValidatorNames.MaxLength, args: 800 }]
    },
    {
      name: 'dispensations',
      type: FormNodeTypes.CONTROL,
      label: 'Dispensations',
      viewType: FormNodeViewTypes.STRING,
      editType: FormNodeEditTypes.TEXTAREA,
      validators: [{ name: ValidatorNames.MaxLength, args: 160 }]
    })
    return form;
  }

  form.children?.push({
    name: 'notes',
    type: FormNodeTypes.CONTROL,
    viewType: FormNodeViewTypes.FULLWIDTH
  })
  return form;
};
