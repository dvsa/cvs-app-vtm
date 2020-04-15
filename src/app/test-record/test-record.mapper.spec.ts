import { TestRecordMapper } from '@app/test-record/test-record.mapper';
import {
  REASON_FOR_ABANDONING_HGV_TRL,
  REASON_FOR_ABANDONING_PSV,
  REASON_FOR_ABANDONING_TIR,
  TEST_STATION_TYPE
} from '@app/test-record/test-record.enums';
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
      {
        testType: {
          testTypeId: '1',
          seatbeltInstallationCheckDate: true,
          testTypeEndTimestampDate: '2121-12-17',
          testTypeEndTimestampTime: '11:11',
          testTypeStartTimestamp: '22:11',
          reasonForAbandoning: ['true', 'true']
        }
      },
      testResultObject
    );
    expect(Object.values(testResultMapped).length).toEqual(25);
  });

  describe('should return reasons for abandoning based on vehicle type & test type id', () => {
    it('PSV vehicle type', () => {
      const testTypeId = '22';
      const reasonsForAbandoning = mapper.getReasonsForAbandoning('psv', testTypeId);
      expect(reasonsForAbandoning).toEqual(Object.values(REASON_FOR_ABANDONING_PSV));
    });
    it('HGV vehicle type', () => {
      const testTypeId = '22';
      const reasonsForAbandoning = mapper.getReasonsForAbandoning('hgv', testTypeId);
      expect(reasonsForAbandoning).toEqual(Object.values(REASON_FOR_ABANDONING_HGV_TRL));
    });
    it('TRL vehicle type', () => {
      const testTypeId = '22';
      const reasonsForAbandoning = mapper.getReasonsForAbandoning('trl', testTypeId);
      expect(reasonsForAbandoning).toEqual(Object.values(REASON_FOR_ABANDONING_HGV_TRL));
    });
    it('TIR test type', () => {
      const testTypeId = '49';
      const reasonsForAbandoning = mapper.getReasonsForAbandoning('trl', testTypeId);
      expect(reasonsForAbandoning).toEqual(Object.values(REASON_FOR_ABANDONING_TIR));
    });
  });

  // TODO: Fix to re-implement  in CVSB-12376
  // it('returns proper date value for the time inputs', () => {
  //   const dateToISO = mapper.getDateTime('2121-12-17T03:24:00', '1900-11-11T10:11:00');
  //   expect(dateToISO).toEqual('2121-12-17T08:26:00.000Z');
  // });

  it('returns string with reasons for abandoning selected by user', () => {
    const reasonsSelected = mapper.getReasonsForAbandoningValue(
      ['true', 'true'],
      Object.values(REASON_FOR_ABANDONING_PSV)
    );
    expect(reasonsSelected).toEqual(
      'The vehicle was not submitted for test at the appointed time,The relevant test fee has not been paid'
    );
  });
});
