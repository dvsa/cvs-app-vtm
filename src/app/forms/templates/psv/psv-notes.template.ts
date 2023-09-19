import { AbstractControl, ValidationErrors } from '@angular/forms';
import { ValidatorNames } from '@forms/models/validators.enum';
import { FormNode, FormNodeEditTypes, FormNodeTypes, FormNodeViewTypes } from '../../services/dynamic-form.types';

export const PsvNotes: FormNode = {
  name: 'notesSection',
  label: 'Notes',
  type: FormNodeTypes.GROUP,
  children: [
    {
      name: 'techRecord_remarks',
      label: 'Notes',
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.STRING,
      editType: FormNodeEditTypes.TEXTAREA,
      validators: [{ name: ValidatorNames.MaxLength, args: 1024 }],

      // Obviously we don't want to add functions in the JSON templates, but it could be handled using a map, the same way other validators are handled
      warningValidators: [
        (control: AbstractControl): ValidationErrors | null => {
          if (control.value.includes('foobar')) {
            return { test: 'should not equal foobar' };
          }
          return null;
        }
      ]
    },
    {
      name: 'techRecord_dispensations',
      type: FormNodeTypes.CONTROL,
      label: 'Dispensations',
      viewType: FormNodeViewTypes.STRING,
      editType: FormNodeEditTypes.TEXTAREA,
      validators: [{ name: ValidatorNames.MaxLength, args: 160 }]
    }
  ]
};
