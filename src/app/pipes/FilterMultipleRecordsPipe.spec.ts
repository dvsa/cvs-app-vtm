import { FilterMultipleRecordsPipe } from '@app/pipes/FilterMultipleRecordsPipe';
import { VehicleTechRecordModel } from '@app/models/vehicle-tech-record.model';

const vehicleTechRecordList: VehicleTechRecordModel[] = [
  {
    techRecord: [
      {
        statusCode: 'current',
        make: 'Isuzu',
        manufactureYear: 2018
      }
    ]
  },
  {
    techRecord: [
      {
        statusCode: 'provisional',
        make: 'AIsuzu',
        manufactureYear: 2019
      }
    ]
  },
  {
    techRecord: [
      {
        statusCode: 'archived',
        createdAt: '2019-06-25T10:26:54.903Z',
        make: 'AIsuzu',
        manufactureYear: 2020
      },
      {
        statusCode: 'archived',
        createdAt: '2019-06-26T08:26:54.903Z',
        make: undefined // make is optional
      }
    ]
  }
] as VehicleTechRecordModel[];

describe('FilterMultipleRecordsPipe', () => {
  const pipe = new FilterMultipleRecordsPipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return a vehicle tech record list sorted by make or manufacturer Year', () => {
    const vTechRecordList = pipe.transform(vehicleTechRecordList);
    expect(vTechRecordList).toBeDefined();
    expect(vTechRecordList).toMatchSnapshot();
  });

  it('should return a technical record having status PROVISIONAL', () => {
    const vTechRecordList = pipe.transform(vehicleTechRecordList);
    expect(vTechRecordList).toBeDefined();
    expect(vTechRecordList[0].techRecord[0].statusCode).toEqual('provisional');
  });

  it('should return a technical record having status CURRENT', () => {
    const vTechRecordList = pipe.transform(vehicleTechRecordList);
    expect(vTechRecordList).toBeDefined();
    expect(vTechRecordList[1].techRecord[0].statusCode).toEqual('current');
  });

  it('should return a technical record having status ARCHIVED', () => {
    const vTechRecordList = pipe.transform(vehicleTechRecordList);
    expect(vTechRecordList).toBeDefined();
    expect(vTechRecordList[2].techRecord[0].statusCode).toEqual('archived');
  });
});
