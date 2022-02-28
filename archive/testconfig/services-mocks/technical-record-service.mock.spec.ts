import { TechnicalRecordServiceMock } from './technical-record-service.mock';

describe('TechnicalRecordServiceMock', () => {
  let techinicalRecordServiceMockInstance: TechnicalRecordServiceMock;

  beforeEach(() => {
    techinicalRecordServiceMockInstance = new TechnicalRecordServiceMock();
  });

  test('getTechnicalRecords', () => {
    techinicalRecordServiceMockInstance.getTechnicalRecords().subscribe(res =>
      expect(res).toMatchObject({ vin: 'XXXXX11XX1X111111', techRecord: [], vrms: [] })
    );
  });

  test('getTechnicalRecordsAllStatuses', () => {
    techinicalRecordServiceMockInstance.getTechnicalRecordsAllStatuses().subscribe(res =>
      expect(res).toMatchObject({ techRecord: [], vin: 'XXXXX11XX1X111111', vrms: []})
    );
  });
});
