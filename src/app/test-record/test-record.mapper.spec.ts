import { TestRecordMapper } from '@app/test-record/test-record.mapper';
import { TEST_STATION_TYPE } from '@app/test-record/test-record.enums';
import { TestRecordTestType } from '@app/models/test-record-test-type';
import {
  EMISSION_DETAILS_APPLICABLE,
  SEAT_BELT_APPLICABLE
} from '@app/test-record/test-types-applicable.enum';
import { TEST_MODEL_UTILS } from '@app/utils/test-model.utils';

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
    expect(Object.keys(type)).toEqual(Object.values(SEAT_BELT_APPLICABLE));
  });

  it('should return test type enum as object', () => {
    const type = mapper.getTestTypeEnums(Object.values(EMISSION_DETAILS_APPLICABLE));
    expect(typeof type).toEqual('object');
  });

  it('should return country of registration code', () => {
    const countryCode = mapper.getCountryOfRegistrationCode('Alderney - GBA');
    expect(countryCode).toEqual('gba');
  });

  it('should return empty string if country of registration is not found', () => {
    const countryCode = mapper.getCountryOfRegistrationCode('Test');
    expect(countryCode).toEqual('');
  });

  it('should map form values for PSV', () => {
    const testResultObject = {
      testRecord: TEST_MODEL_UTILS.mockTestRecord(),
      testType: TEST_MODEL_UTILS.mockTestType()
    } as TestRecordTestType;

    const testResultMapped = mapper.mapFormValues(
      { testType: { testTypeId: '1', seatbeltInstallationCheckDate: true } },
      testResultObject
    );
    expect(Object.values(testResultMapped).length).toEqual(25);
  });
});
