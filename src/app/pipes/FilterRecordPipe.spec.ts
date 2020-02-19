import {FilterRecordPipe} from '@app/pipes/FilterRecordPipe';

const techRecordList1 = [
  {
    vin: '1234568',
    statusCode: 'current'
  },
  {
    vin: '1234567',
    statusCode: 'provisional'
  },
  {
    vin: '1234569',
    statusCode: 'archived',
    createdAt: '2019-06-25T10:26:54.903Z'
  },
];

const techRecordList2 = [
  {
    vin: '1234567',
    statusCode: 'provisional'
  },
  {
    vin: '1234569',
    statusCode: 'archived',
    createdAt: '2019-06-25T10:26:54.903Z'
  }
];

const techRecordList3 = [
  {
    vin: '1234569',
    statusCode: 'archived',
    createdAt: '2019-06-25T10:26:54.903Z'
  },
  {
    vin: '1234566',
    statusCode: 'archived',
    createdAt: '2019-06-26T08:26:54.903Z'
  }
];

describe('FilterRecordPipe', () => {
  const pipe = new FilterRecordPipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return undefined if technical record list is null', () => {
    const record = pipe.transform(null);
    expect(record).toBeNull();
  });

  it('should return the technical record having status CURRENT', () => {
    const record = pipe.transform(techRecordList1);
    expect(record).toBeDefined();
    expect(record.statusCode).toEqual('current');
  });

  it('should return the technical record having status PROVISIONAL', () => {
    const record = pipe.transform(techRecordList2);
    expect(record).toBeDefined();
    expect(record.statusCode).toEqual('provisional');
  });

  it('should return the technical record having status ARCHIVED', () => {
    const record = pipe.transform(techRecordList3);
    const recordsList = techRecordList3.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const orderedTechRecList = [
      {
        vin: '1234566',
        statusCode: 'archived',
        createdAt: '2019-06-26T08:26:54.903Z'
      },
      {
        vin: '1234569',
        statusCode: 'archived',
        createdAt: '2019-06-25T10:26:54.903Z'
      }
    ];

    expect(recordsList).toBeDefined();
    expect(recordsList[0].vin).toBe('1234566');
    expect(recordsList).toEqual(orderedTechRecList);
    expect(record).toBeDefined();
    expect(record.statusCode).toEqual('archived');
  });

});
