import { FormNode, FormNodeTypes, FormNodeViewTypes } from '@forms/services/dynamic-form.types';

export const CustomDefectsSection: FormNode = {
  name: 'customDefectsSection',
  label: 'Custom Defects',
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
                      name: 'referenceNumber',
                      label: 'Reference Number',
                      type: FormNodeTypes.CONTROL
                    },
                    {
                      name: 'defectName',
                      label: 'Defect Name',
                      type: FormNodeTypes.CONTROL
                    },
                    {
                      name: 'defectNotes',
                      label: 'Defect Notes',
                      type: FormNodeTypes.CONTROL
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
