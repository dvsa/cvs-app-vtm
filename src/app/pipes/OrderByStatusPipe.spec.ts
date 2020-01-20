import {OrderByStatusPipe} from '@app/pipes/OrderByStatusPipe';

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


describe('OrderByStatusPipe', () => {
  const pipe = new OrderByStatusPipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return undefined if technical record list is null', () => {
    const record = pipe.transform(null);
    expect(record).toBeUndefined();
  });

  it('should order technical records having the one with status CURRENT first', () => {
    const orderedTechRec = pipe.transform(techRecordList1);
    expect(orderedTechRec).toBeDefined();
    expect(orderedTechRec[0]).toBeDefined();
    expect(orderedTechRec[0].statusCode).toEqual('current');
  });

  it('should order technical records having the one with status PROVISIONAL first', () => {
    const orderedTechRec = pipe.transform(techRecordList2);
    expect(orderedTechRec).toBeDefined();
    expect(orderedTechRec[0]).toBeDefined();
    expect(orderedTechRec[0].statusCode).toEqual('provisional');
  });

  it('should order technical records having the one with status ARCHIVED first', () => {
    const orderedTechRec = pipe.transform(techRecordList3);
    expect(orderedTechRec).toBeDefined();
    expect(orderedTechRec[0]).toBeDefined();
    expect(orderedTechRec[0].statusCode).toEqual('archived');
  });

  it('should order ARCHIVED records by date', () => {
    const orderedTechRec = pipe.transform(techRecordList3);
    expect(orderedTechRec).toBeDefined();
    for (let i; i < orderedTechRec.length; i++) {
      const date = new Date(orderedTechRec[i + 1].createdAt).getTime() - new Date(orderedTechRec[i].createdAt).getTime();
      expect(date).toBeTruthy();
    }
  });

});
