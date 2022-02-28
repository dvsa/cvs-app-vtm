import { SortByDatePipe } from '@app/pipes/SortByDatePipe';

const testResultList = [
  {
    vin: '1234568',
    createdAt: '2019-06-25T10:26:54.903Z'
  },
  {
    vin: '1234567',
    statusCode: 'provisional',
    createdAt: '2019-06-29T10:26:54.903Z'
  },
  {
    vin: '1234569',
    createdAt: '2019-06-27T10:26:54.903Z'
  }
];

describe('SortByDatePipe', () => {
  const pipe = new SortByDatePipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should order test results descending by createdAt date value', () => {
    const orderedTestResults = pipe.transform(testResultList, 'createdAt');
    expect(orderedTestResults).toBeDefined();
    expect(orderedTestResults[0].vin).toEqual('1234567');
  });
});
