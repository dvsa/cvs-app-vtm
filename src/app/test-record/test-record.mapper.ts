import { Injectable } from '@angular/core';
import { TestResultModel } from '@app/models/test-result.model';
import {
  REASON_FOR_ABANDONING_HGV_TRL,
  REASON_FOR_ABANDONING_PSV,
  REASON_FOR_ABANDONING_TIR,
  TEST_STATION_TYPE
} from '@app/test-record/test-record.enums';
import { TestRecordTestType } from '@app/models/test-record-test-type';
import { TestType } from '@app/models/test.type';
import { COUNTRY_OF_REGISTRATION } from '@app/app.enums';
import {
  ANNIVERSARY_DATE_APPLICABLE,
  CERTIFICATE_APPLICABLE,
  DEFECTS_APPLICABLE,
  EMISSION_DETAILS_APPLICABLE,
  EXPIRY_DATE_APPLICABLE,
  SEAT_BELT_APPLICABLE,
  SPECIALIST_CERTIFICATE_APPLICABLE,
  SPECIALIST_COIF_APPLICABLE,
  SPECIALIST_TEST_APPLICABLE
} from '@app/test-record/test-types-applicable.enum';

export interface TestTypesApplicable {
  seatBeltApplicable: {};
  defectsApplicable: {};
  emissionDetailsApplicable: {};
  anniversaryDateApplicable: {};
  expiryDateApplicable: {};
  certificateApplicable: {};
  specialistTestApplicable: {};
  specialistCOIFApplicable: {};
  specialistCertificateApplicable: {};
}

@Injectable({ providedIn: 'root' })
export class TestRecordMapper {
  getTestStationType(type: string) {
    switch (type) {
      case 'atf':
        return TEST_STATION_TYPE.ATF;
        break;
      case 'gvts':
        return TEST_STATION_TYPE.GVTS;
        break;
      case 'hq':
        return TEST_STATION_TYPE.HQ;
        break;
    }
  }

  getReasonsForAbandoning(vehicleType: string, testTypeId: string) {
    const tirTestTypeIds = { 49: 'TIR test', 56: 'Paid TIR retest', 57: 'Free TIR retest' };

    if (Object.keys(tirTestTypeIds).includes(testTypeId)) {
      return Object.values(REASON_FOR_ABANDONING_TIR);
    } else {
      switch (vehicleType) {
        case 'trl':
        case 'hgv':
          return Object.values(REASON_FOR_ABANDONING_HGV_TRL);
          break;
        case 'psv':
          return Object.values(REASON_FOR_ABANDONING_PSV);
          break;
      }
    }
  }

  getTestTypeEnums(applicableEnum: string[]) {
    return applicableEnum.reduce(
      (val, testTypeId) => ({ ...val, [testTypeId]: 'applicable' }),
      {}
    );
  }

  getTestTypeApplicable(sectionName: string) {
    const testTypesApplicable = {
      seatBeltApplicable: this.getTestTypeEnums(Object.values(SEAT_BELT_APPLICABLE)),
      defectsApplicable: this.getTestTypeEnums(Object.values(DEFECTS_APPLICABLE)),
      emissionDetailsApplicable: this.getTestTypeEnums(
        Object.values(EMISSION_DETAILS_APPLICABLE)
      ),
      anniversaryDateApplicable: this.getTestTypeEnums(
        Object.values(ANNIVERSARY_DATE_APPLICABLE)
      ),
      expiryDateApplicable: this.getTestTypeEnums(Object.values(EXPIRY_DATE_APPLICABLE)),
      certificateApplicable: this.getTestTypeEnums(Object.values(CERTIFICATE_APPLICABLE)),
      specialistTestApplicable: this.getTestTypeEnums(Object.values(SPECIALIST_TEST_APPLICABLE)),
      specialistCOIFApplicable: this.getTestTypeEnums(Object.values(SPECIALIST_COIF_APPLICABLE)),
      specialistCertificateApplicable: this.getTestTypeEnums(
        Object.values(SPECIALIST_CERTIFICATE_APPLICABLE)
      )
    };

    return testTypesApplicable[sectionName];
  }

  getCountryOfRegistrationCode(countryName: string) {
    const countryCode = Object.keys(COUNTRY_OF_REGISTRATION)[
      Object.values(COUNTRY_OF_REGISTRATION).indexOf(countryName)
    ];
    return !!countryCode ? countryCode : '';
  }

  getDateTime(dateValue: string, timeValue: string) {
    const dateToSave = new Date(dateValue);
    const timeToSave = new Date(timeValue);

    dateToSave.setUTCMinutes(timeToSave.getUTCMinutes());
    dateToSave.setUTCHours(timeToSave.getUTCHours());

    return !!dateToSave.toJSON() ? dateToSave.toISOString() : '';
  }

  getReasonsForAbandoningValue(currentValue: string[], reasonsForAbandoning: string[]): string {
    const selectedReasons = reasonsForAbandoning.map((elem, index) => {
      return !!currentValue ? (currentValue[index] ? elem : '') : '';
    });
    return selectedReasons.length > 1 ? selectedReasons.filter((item) => item).join(',') : '';
  }

  mapFormValues(testResultFormData, testResultObject: TestRecordTestType): TestResultModel {
    const testResultMapped: TestResultModel = testResultObject.testRecord;
    const testTypeMapped: TestType = testResultObject.testType;
    const testTypesApplicable = {
      seatBeltApplicable: this.getTestTypeApplicable('seatBeltApplicable'),
      defectsApplicable: this.getTestTypeApplicable('defectsApplicable'),
      emissionDetailsApplicable: this.getTestTypeApplicable('emissionDetailsApplicable'),
      anniversaryDateApplicable: this.getTestTypeApplicable('anniversaryDateApplicable'),
      expiryDateApplicable: this.getTestTypeApplicable('expiryDateApplicable'),
      certificateApplicable: this.getTestTypeApplicable('certificateApplicable')
    };

    const mapPreparer = !!testResultFormData.preparer
      ? testResultFormData.preparer.match(/\((.*)\)/)
      : '';
    const mapTestStation = !!testResultFormData.testStationNameNumber
      ? testResultFormData.testStationNameNumber.match(/\((.*)\)/)
      : '';

    testResultMapped.countryOfRegistration = this.getCountryOfRegistrationCode(
      testResultFormData.countryOfRegistration
    );
    testResultMapped.euVehicleCategory = testResultFormData.euVehicleCategory;
    testResultMapped.odometerReading = testResultFormData.odometerReading;
    testResultMapped.odometerReadingUnits = testResultFormData.odometerReadingUnits;
    testResultMapped.preparerName = !!testResultFormData.preparer
      ? testResultFormData.preparer.split('(')[0]
      : '';
    testResultMapped.preparerId = !!mapPreparer ? mapPreparer.pop() : '';

    testResultMapped.testStationName = !!testResultFormData.testStationNameNumber
      ? testResultFormData.testStationNameNumber.split('(')[0]
      : '';
    testResultMapped.testStationPNumber = !!mapTestStation ? mapTestStation.pop() : '';
    testResultMapped.testStationType = !!testResultFormData.testStationType
      ? testResultFormData.testStationType.toLowerCase()
      : '';
    testResultMapped.testerName = testResultFormData.testerName;
    testResultMapped.testerEmailAddress = testResultFormData.testerEmailAddress;
    testTypeMapped.seatbeltInstallationCheckDate =
      testResultFormData.testType.seatbeltInstallationCheckDate === 'Yes';
    testTypeMapped.numberOfSeatbeltsFitted = testResultFormData.testType.numberOfSeatbeltsFitted;
    testTypeMapped.lastSeatbeltInstallationCheckDate =
      testResultFormData.testType.lastSeatbeltInstallationCheckDate;
    testTypeMapped.emissionStandard = testResultFormData.testType.emissionStandard;
    testTypeMapped.smokeTestKLimitApplied = testResultFormData.testType.smokeTestKLimitApplied;
    testTypeMapped.fuelType = testResultFormData.testType.fuelType;

    if (!!testTypeMapped.modType && testTypesApplicable.emissionDetailsApplicable[testTypeMapped.testTypeId]) {
      testTypeMapped.modType.code = !!testResultFormData.testType.modType.length
        ? testResultFormData.testType.modType.split('-')[0].trim()
        : testTypeMapped.modType.code;
      testTypeMapped.modType.description = !!testResultFormData.testType.modType.length
        ? testResultFormData.testType.modType.split('-')[1].trim()
        : testTypeMapped.modType.description;
    }
    testTypeMapped.modificationTypeUsed = testResultFormData.testType.modificationTypeUsed;
    testTypeMapped.particulateTrapFitted = testResultFormData.testType.particulateTrapFitted;
    testTypeMapped.particulateTrapSerialNumber =
      testResultFormData.testType.particulateTrapSerialNumber;
    testTypeMapped.additionalNotesRecorded = testResultFormData.testType.additionalNotesRecorded;
    testTypeMapped.testResult = testResultFormData.testType.testResult;
    testTypeMapped.reasonForAbandoning = this.getReasonsForAbandoningValue(
      testResultFormData.testType.reasonForAbandoning,
      this.getReasonsForAbandoning(testResultMapped.vehicleType, testTypeMapped.testTypeId)
    );
    testTypeMapped.additionalCommentsForAbandon =
      testResultFormData.testType.additionalCommentsForAbandon;
    testTypeMapped.certificateNumber = testResultFormData.testType.certificateNumber;
    testTypeMapped.testExpiryDate = testResultFormData.testType.testExpiryDate;
    testTypeMapped.testAnniversaryDate = testResultFormData.testType.testAnniversaryDate;
    testTypeMapped.testTypeStartTimestamp = this.getDateTime(
      testResultFormData.testType.testTypeEndTimestampDate,
      testResultFormData.testType.testTypeStartTimestamp
    );
    testTypeMapped.testTypeEndTimestamp = this.getDateTime(
      testResultFormData.testType.testTypeEndTimestampDate,
      testResultFormData.testType.testTypeEndTimestampTime
    );

    if (!!testTypeMapped.prohibitionIssued) {
      testTypeMapped.prohibitionIssued = testResultFormData.prohibitionIssued;
    }

    if (!testTypesApplicable.seatBeltApplicable[testTypeMapped.testTypeId]) {
      testTypeMapped.seatbeltInstallationCheckDate = undefined;
      testTypeMapped.numberOfSeatbeltsFitted = undefined;
      testTypeMapped.lastSeatbeltInstallationCheckDate = undefined;
    }

    if (!testTypesApplicable.emissionDetailsApplicable[testTypeMapped.testTypeId]) {
      testTypeMapped.emissionStandard = undefined;
      testTypeMapped.smokeTestKLimitApplied = undefined;
      testTypeMapped.fuelType = undefined;
      testTypeMapped.modType = undefined;
      testTypeMapped.modificationTypeUsed = undefined;
      testTypeMapped.particulateTrapFitted = undefined;
      testTypeMapped.particulateTrapSerialNumber = undefined;
      testTypeMapped.testExpiryDate = undefined;
      testResultMapped.testExpiryDate = undefined;
    }

    if (!testTypesApplicable.anniversaryDateApplicable[testTypeMapped.testTypeId]) {
      testTypeMapped.testAnniversaryDate = undefined;
    } else {
      testTypeMapped.testAnniversaryDate = null;
    }

    if (!testTypesApplicable.expiryDateApplicable[testTypeMapped.testTypeId]) {
      testTypeMapped.testExpiryDate = undefined;
    }

    if (!testTypesApplicable.certificateApplicable[testTypeMapped.testTypeId]) {
      testTypeMapped.certificateNumber = undefined;
    }

    if (!!testTypesApplicable.defectsApplicable[testTypeMapped.testTypeId]) {
      testTypeMapped.defects = undefined;
    } else {
      testTypeMapped.prohibitionIssued = undefined;
    }

    switch (testResultMapped.vehicleType) {
      case 'psv':
        testResultMapped.trailerId = undefined;
        testResultMapped.firstUseDate = undefined;
        break;
      case 'hgv':
        testResultMapped.trailerId = undefined;
        testResultMapped.firstUseDate = undefined;
        testResultMapped.vehicleSize = undefined;
        testResultMapped.numberOfSeats = undefined;
        break;
      case 'trl':
        testResultMapped.vrm = undefined;
        testResultMapped.vehicleId = undefined;
        testResultMapped.odometerReading = undefined;
        testResultMapped.odometerReadingUnits = undefined;
        testResultMapped.regnDate = undefined;
        testResultMapped.vehicleSize = undefined;
        testResultMapped.numberOfSeats = undefined;
        break;
    }

    testResultMapped.deletionFlag = undefined;
    testResultMapped.testHistory = undefined;

    testResultMapped.testTypes.forEach((tType, index) => {
      if (tType.testNumber === testTypeMapped.testNumber) {
        testResultMapped.testTypes[index] = testTypeMapped;
      }
    });

    return testResultMapped;
  }

  constructor() {}
}
