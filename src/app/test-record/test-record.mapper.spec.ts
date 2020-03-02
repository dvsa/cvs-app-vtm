import { TestRecordMapper } from '@app/test-record/test-record.mapper';
import { TEST_STATION_TYPE } from '@app/test-record/test-record.enums';
import { TestRecordTestType } from '@app/models/test-record-test-type';
import { TESTING_TEST_MODELS_UTILS } from '@app/utils/testing-test-models.utils';

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

  it('should map form values for PSV', () => {
    const testResultObject = {
      testRecord: TESTING_TEST_MODELS_UTILS.mockTestRecord(),
      testType: TESTING_TEST_MODELS_UTILS.mockTestType()
    } as TestRecordTestType;

    const testResultMapped = mapper.mapFormValues(
      { testType: { testTypeId: '1', seatbeltInstallationCheckDate: true } },
      testResultObject
    );
    expect(Object.values(testResultMapped).length).toEqual(15);
  });
});
