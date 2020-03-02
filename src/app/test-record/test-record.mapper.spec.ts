import { TestRecordMapper } from '@app/test-record/test-record.mapper';
import { TEST_STATION_TYPE } from '@app/test-record/test-record.enums';

describe('TestRecordMapper', () => {
  const mapper = new TestRecordMapper();

  it('should return test station type', () => {
    const type = mapper.getTestStationType('atf');
    expect(type).toEqual(TEST_STATION_TYPE.ATF);
  });

  it('should return test station type', () => {
    const type = mapper.getTestStationType('gvts');
    expect(type).toEqual(TEST_STATION_TYPE.GVTS);
  });

  it('should return test station type', () => {
    const type = mapper.getTestStationType('hq');
    expect(type).toEqual(TEST_STATION_TYPE.HQ);
  });

  it('should return test type applicable', () => {
    const type = mapper.getTestTypeApplicable('seatBeltApplicable');
    expect(Object.values(type)).toHaveLength(17);
  });

  it('should return defectsApplicable', () => {
    const type = mapper.getTestTypeApplicable('defectsApplicable');
    expect(Object.values(type)).toHaveLength(27);
  });

  it('should return emissionDetailsApplicable', () => {
    const type = mapper.getTestTypeApplicable('emissionDetailsApplicable');
    expect(Object.values(type)).toHaveLength(3);
  });

  it('should return testSectionApplicable1', () => {
    const type = mapper.getTestTypeApplicable('testSectionApplicable1');
    expect(Object.values(type)).toHaveLength(40);
  });

  it('should return testSectionApplicable2', () => {
    const type = mapper.getTestTypeApplicable('testSectionApplicable2');
    expect(Object.values(type)).toHaveLength(27);
  });

  it('should return country of registration code', () => {
    const countryCode = mapper.getCountryOfRegistrationCode('Alderney - GBA');
    expect(countryCode).toEqual('gba');
  });

  // it('should map form values', () => {
  //   const testType = {}  as TestType;
  //   const testRecord = {} as TestResultModel;
  //   const testResultObject = {
  //     testRecord: testRecord,
  //     testType: testType
  //   } as TestRecordTestType;
  //
  //   const testResultMapped = mapper.mapFormValues({} as TestResultModel, testResultObject);
  //   expect(testResultMapped).toBe('');
  // });

});
