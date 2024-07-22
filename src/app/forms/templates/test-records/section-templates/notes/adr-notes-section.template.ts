import { AsyncValidatorNames } from '@forms/models/async-validators.enum';
import { ValidatorNames } from '@forms/models/validators.enum';
import { CustomFormControl, FormNode, FormNodeEditTypes, FormNodeTypes } from '@forms/services/dynamic-form.types';
import { Store, select } from '@ngrx/store';
import { State } from '@store/index';
import { testResultInEdit } from '@store/test-records';
import { map, take, tap } from 'rxjs';

export const AdrNotesSection: FormNode = {
  name: 'notesSection',
  label: 'Notes',
  type: FormNodeTypes.GROUP,
  children: [
    {
      name: 'testTypes',
      label: 'Test Types',
      type: FormNodeTypes.ARRAY,
      children: [
        {
          name: '0', // it is important here that the name of the node for an ARRAY type should be an index value
          type: FormNodeTypes.GROUP,
          children: [
            {
              name: 'additionalNotesRecorded',
              label: 'Additional Notes',
              type: FormNodeTypes.CONTROL,
              value: '',
              editType: FormNodeEditTypes.TEXTAREA,
              validators: [
                { name: ValidatorNames.MaxLength, args: 500 },
              ],
              asyncValidators: [
                // @TODO abstract into generic custom validator when used in multiple places 
                { name: AsyncValidatorNames.Custom, args: (control: CustomFormControl, store: Store<State>) => {
                  return store.pipe(
                    select(testResultInEdit), 
                    take(1), 
                    map((testResult) => testResult?.testTypes.at(0)?.issueRequired),
                    tap((issueRequired) => {
                      control.meta.hint = issueRequired ? 'Enter a reason for issuing documents centrally' : ''
                    }),
                    map(() => null),
                  )
                }}
              ]
            },
          ],
        },
      ],
    },
  ],
};
