import { ValidatorNames } from '@forms/models/validators.enum';
import { FormNode, FormNodeTypes } from '@forms/services/dynamic-form.types';

export const AdditionalDefectsSection: FormNode = {
  name: 'additionalDefectsSection',
  label: 'Additional Defects',
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
              name: 'customDefects',
              type: FormNodeTypes.ARRAY,
              children: [
                {
                  name: '0',
                  type: FormNodeTypes.GROUP,
                  children: [
                    {
                      name: 'defectName',
                      label: 'Defect Name',
                      type: FormNodeTypes.CONTROL,
                      validators: [{ name: ValidatorNames.Required }, { name: ValidatorNames.MaxLength, args: 200 }],
                    },
                    {
                      name: 'defectNotes',
                      label: 'Defect Notes',
                      type: FormNodeTypes.CONTROL,
                      validators: [{ name: ValidatorNames.Required }, { name: ValidatorNames.MaxLength, args: 200 }],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
