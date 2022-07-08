import { inject } from '@angular/core/testing';
import { DynamicFormService } from './dynamic-form.service';
import { FormNode, FormNodeTypes } from './dynamic-form.types';

describe('Custom Classes', () => {
  describe('getCleanValue', () => {
    const template = <FormNode>{
      name: 'myForm',
      type: FormNodeTypes.GROUP,
      children: [
        {
          name: 'combinationLevelOne',
          label: 'Combination Level One',
          type: FormNodeTypes.COMBINATION,
          options: {
            leftComponentName: 'levelOneControl1',
            rightComponentName: 'levelOneControl2',
            separator: ' '
          }
        },
        { name: 'levelOneControl1', type: FormNodeTypes.CONTROL, label: 'Level one control 1', value: 'some string' },
        { name: 'levelOneControl2', type: FormNodeTypes.CONTROL, label: 'Level one control 2', value: 'some string' },
        { name: 'sectionLabel', type: FormNodeTypes.SECTION, label: 'Section Label' },
        {
          name: 'levelOneGroup',
          type: FormNodeTypes.GROUP,
          children: [
            { name: 'levelTwoControl', type: FormNodeTypes.CONTROL, label: 'Level two control', value: 'some string' },
            {
              name: 'levelTwoArray',
              type: FormNodeTypes.ARRAY,
              children: [{ name: '0', type: FormNodeTypes.CONTROL, value: '1' }]
            }
          ]
        }
      ]
    };

    const expected = {
      levelOneControl1: 'some string',
      levelOneControl2: 'some string',
      levelOneGroup: { levelTwoControl: 'some string', levelTwoArray: ['1', '2'] }
    };

    it('should return a json object where properties are only FormNodeTypes GROUP | ARRAY | CONTROL', inject(
      [DynamicFormService],
      (dfs: DynamicFormService) => {
        const form = dfs.createForm(template, expected);
        expect(form.getCleanValue(form)).toEqual(expected);
      }
    ));
  });
});
