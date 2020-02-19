import { FilterMultipleRecordsPipe } from '@app/pipes/FilterMultipleRecordsPipe';

const vehicleTechRecordList = [
  {
    techRecord: [
      {
        vin: '1234568',
        statusCode: 'current',
        make: 'Isuzu',
        manufactureYear: 2018
      }
    ]
  },
  {
    techRecord: [
      {
        vin: '1234567',
        statusCode: 'provisional',
        make: 'AIsuzu',
        manufactureYear: 2019
      },
    ]
  },
  {
    techRecord: [
      {
        vin: '1234569',
        statusCode: 'archived',
        createdAt: '2019-06-25T10:26:54.903Z',
        make: 'AIsuzu',
        manufactureYear: 2020
      },
      {
        vin: '1234566',
        statusCode: 'archived',
        createdAt: '2019-06-26T08:26:54.903Z'
      }
    ]
  }
];

const orderedVehicleTechRecordList = [
  {
    techRecord: [
      {
        vin: '1234568',
        statusCode: 'current',
        make: 'Isuzu',
        manufactureYear: 2018
      }
    ]
  },
  {
    techRecord: [
      {
        vin: '1234567',
        statusCode: 'provisional',
        make: 'AIsuzu',
        manufactureYear: 2019
      },
    ]
  },
];



describe('FilterMultipleRecordsPipe', () => {
  const pipe = new FilterMultipleRecordsPipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return undefined if technical record list is null', () => {
    const vTechRecordList = pipe.transform(null);
    expect(vTechRecordList).toBeUndefined();
  });

  it('should return a vehicle tech record list sorted by make or manufacturer Year', () => {
    const vTechRecordList = pipe.transform(orderedVehicleTechRecordList);
    expect(vTechRecordList).toBeDefined();
    expect(vTechRecordList).toEqual(orderedVehicleTechRecordList);
  });

  it('if it CURRENT techRec it should set the technical record having status CURRENT for sorting', () => {
    const vTechRecordList = pipe.transform(vehicleTechRecordList);
    expect(vTechRecordList).toBeDefined();
    expect(vTechRecordList[0].techRecord[1].statusCode).toEqual('provisional');
  });

  it('if it hasn;t CURRENT techRec it should set the technical record having status PROVISIONAL for sorting', () => {
    const vTechRecordList = pipe.transform(vehicleTechRecordList);
    expect(vTechRecordList).toBeDefined();
    expect(vTechRecordList[1].techRecord[1].statusCode).toEqual('current');
  });

  it('if it hasn;t CURRENT/PROVISIONAL techRec it should set the technical record having status ARCHIVED for sorting', () => {
    const vTechRecordList = pipe.transform(vehicleTechRecordList);
    expect(vTechRecordList).toBeDefined();
    expect(vTechRecordList[2].techRecord[1].statusCode).toEqual('archived');
  });

});
