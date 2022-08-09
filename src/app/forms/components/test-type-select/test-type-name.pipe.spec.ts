import { TestTypesTaxonomy } from '@api/test-types';
import { TestTypeNamePipe } from './test-type-name.pipe';

const testTypes: TestTypesTaxonomy = [
  {
    id: '1',
    suggestedTestTypeDisplayName: 'Test Type Display Name 1'
  },
  {
    id: '2',
    testTypeName: 'Test Type Name 2'
  },
  {
    id: '3',
    nextTestTypesOrCategories: [
      {
        id: '4',
        name: 'Test Name 4',
        nextTestTypesOrCategories: [
          {
            id: '5',
            name: 'Test Name 5'
          }
        ]
      }
    ]
  }
];

describe('TestTypeNamePipe', () => {
  it('create an instance', () => {
    const pipe = new TestTypeNamePipe();
    expect(pipe).toBeTruthy();
  });

  it.each([
    ['Test Name 5', '5'],
    ['Test Name 4', '4'],
    ['-', '3'],
    ['Test Type Name 2', '2'],
    ['Test Type Display Name 1', '1']
  ])('should %s for id: %s', (expected: string, id: string) => {
    const pipe = new TestTypeNamePipe();
    console.log(id, expected);
    expect(pipe.transform(id, testTypes)).toBe(expected);
  });
});
