import { Injectable } from '@angular/core';
import { TestResultModel } from '@app/models/test-result.model';
import { TEST_STATION_TYPE } from '@app/test-record/test-record.enums';
import { TestRecordTestType } from '@app/models/test-record-test-type';
import { TestType } from '@app/models/test.type';
import { COUNTRY_OF_REGISTRATION } from '@app/app.enums';

export interface TestTypesApplicable {
  seatBeltApplicable: { number: string };
  defectsApplicable: { number: string };
  emissionDetailsApplicable: { number: string };
  testSectionApplicable1: { number: string };
  testSectionApplicable2: { number: string };
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

  getTestTypeApplicable(sectionName: string) {
    const testTypesApplicable = {
      seatBeltApplicable: {
        1: 'Annual Test',
        3: 'Class 6A seatbelt installation check (annual test)',
        4: 'Class 6A seatbelt installation check (first test)',
        7: 'Paid annual test retest',
        8: 'Paid retest with Class 6A seatbelt installation check',
        10: 'Part paid annual test retest',
        14: 'Paid prohibition clearance (full inspection with certificate)',
        15: 'Paid prohibition clearance (full inspection without certificate)',
        16: 'Part paid prohibition clearance (full inspection without certification)',
        18: 'Paid prohibition clearance (retest with certificate)',
        19: 'Paid prohibition clearance (retest without certificate)',
        21: 'Part-paid prohibition clearance (retest with certificate)',
        22: 'Part-paid prohibition clearance (retest without certificate)',
        23: 'Part-paid prohibition clearance (partial inspection without certification)',
        27: 'Paid prohibition clearance with Class 6A seatbelt installation check (full inspection)',
        28: 'Prohibition clearance (retest with Class 6A seatbelt installation check)',
        93: 'Prohibition clearance (retest without Class 6A seatbelt installation check)'
      },
      defectsApplicable: {
        30: 'Voluntary brake test',
        31: 'Voluntary headlamp aim check',
        32: 'Voluntary smoke test',
        33: 'Voluntary multi check',
        34: 'Voluntary speed limiter check',
        35: 'Voluntary Vitesse 100',
        36: 'Voluntary Tempo 100',
        38: 'Notifiable alteration check',
        39: 'Low Emissions Certificate',
        44: 'Low Emissions Certificate',
        45: 'Low Emissions Certificate',
        47: 'Free notifiable alteration',
        48: 'Paid notifiable alteration',
        49: 'TIR test',
        50: 'ADR test',
        56: 'Paid TIR retest',
        57: 'Free TIR retest',
        59: 'Paid ADR retest',
        60: 'Free ADR retest',
        85: 'Voluntary brake test',
        86: 'Voluntary multi-check',
        87: 'Voluntary Shaker plate check',
        88: 'Voluntary Speed limiter check',
        89: 'Voluntary smoke test',
        90: 'Voluntary headlamp aim test',
        100: 'Vitesse 100 Replacement',
        121: 'Vitesse 100 Application'
      },
      emissionDetailsApplicable: {
        44: 'Low Emissions Certificate (LEC) with annual test',
        39: 'Low Emissions Certificate (LEC) with annual test',
        45: 'Low Emissions Certificate (LEC) without annual test'
      },
      testSectionApplicable1: {
        1: 'Annual Test',
        3: 'Class 6A seatbelt installation check (annual test)',
        4: 'Class 6A seatbelt installation check (first test)',
        7: 'Paid annual test retest',
        8: 'Paid retest with Class 6A seatbelt installation check',
        10: 'Part paid annual test retest',
        14: 'Paid prohibition clearance (full inspection with certificate)',
        18: 'Paid prohibition clearance (retest with certificate)',
        21: 'Part-paid prohibition clearance (retest with certificate)',
        27: 'Paid prohibition clearance with Class 6A seatbelt installation check (full inspection)',
        28: 'Prohibition clearance (retest with Class 6A seatbelt installation check)',
        93: 'Prohibition clearance (retest without Class 6A seatbelt installation check)',
        94: 'Annual Test HGV/TRL',
        40: 'Annual Test TRL',
        95: 'First Test',
        41: 'First Test TRL',
        53: 'Paid annual test retest',
        54: 'Part paid annual test retest',
        62: 'Paid roadworthiness retest',
        101: 'Paid roadworthiness retest TRL',
        63: 'Part paid roadworthiness retest HGV/TRL',
        65: 'Paid first test retest HGV/TRL',
        66: 'Part paid first test retest',
        67: 'Free first test retest',
        98: 'Paid annual test retest',
        99: 'Part paid annual test retest',
        103: 'Paid first test retest',
        104: 'Part paid first test retest',
        70: 'Paid prohibition clearance (full inspection with certification)',
        76: 'Paid prohibition clearance (retest with certification)',
        79: 'Part paid prohibition clearance (retest with certification)',
        82: 'Paid prohibition clearance on first test (full inspection with certification)',
        83: 'Paid retest prohibition clearance on first test',
        107: 'Paid prohibition clearance (full inspection with certification)',
        113: 'Paid prohibition clearance (retest with certification)',
        116: 'Part paid prohibition clearance (retest with certification)',
        119: 'Paid prohibition clearance on first test (full inspection with certification)',
        120: 'Paid retest prohibition clearance on first test',
        122: 'Voluntary roadworthiness test HGV/TRL',
        91: 'Voluntary roadworthiness test TRL'
      },
      testSectionApplicable2: {
        30: 'Voluntary brake test',
        31: 'Voluntary headlamp aim check',
        32: 'Voluntary smoke test',
        33: 'Voluntary multi check (headlamp aim, smoke and brake test)',
        34: 'Voluntary speed limiter check',
        35: 'Voluntary Vitesse 100',
        36: 'Voluntary Tempo 100',
        38: 'Notifiable alteration check',
        39: 'Low Emissions Certificate (LEC) with annual test',
        44: 'Low Emissions Certificate (LEC) with annual test',
        45: 'Low Emissions Certificate (LEC)',
        47: 'Free notifiable alteration',
        48: 'Paid notifiable alteration',
        49: 'TIR test',
        50: 'ADR test',
        56: 'Paid TIR retest',
        57: 'Free TIR retest',
        59: 'Paid ADR retest',
        60: 'Free ADR retest',
        85: 'Voluntary brake test',
        86: 'Voluntary multi-check',
        87: 'Voluntary Shaker plate check',
        88: 'Voluntary Speed limiter check',
        89: 'Voluntary smoke test',
        90: 'Voluntary headlamp aim test',
        100: 'Vitesse 100 Replacement',
        121: 'Vitesse 100 Application'
      }
    };

    return testTypesApplicable[sectionName];
  }

  getCountryOfRegistrationCode(countryName: string) {
    const countryCode = Object.keys(COUNTRY_OF_REGISTRATION)[
      Object.values(COUNTRY_OF_REGISTRATION).indexOf(countryName)
    ];
    return !!countryCode ? countryCode : '';
  }

  mapFormValues(testResultFormData, testResultObject: TestRecordTestType): TestResultModel {
    const testResultMapped: TestResultModel = testResultObject.testRecord;
    const testTypeMapped: TestType = testResultObject.testType;
    const testTypesApplicable = {
      seatBeltApplicable: this.getTestTypeApplicable('seatBeltApplicable'),
      defectsApplicable: this.getTestTypeApplicable('defectsApplicable'),
      emissionDetailsApplicable: this.getTestTypeApplicable('emissionDetailsApplicable'),
      testSectionApplicable1: this.getTestTypeApplicable('testSectionApplicable1'),
      testSectionApplicable2: this.getTestTypeApplicable('testSectionApplicable2')
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
      testResultFormData.testType.seatbeltInstallationCheckDate;
    testTypeMapped.numberOfSeatbeltsFitted = testResultFormData.testType.numberOfSeatbeltsFitted;
    testTypeMapped.lastSeatbeltInstallationCheckDate =
      testResultFormData.testType.lastSeatbeltInstallationCheckDate;
    testTypeMapped.emissionStandard = testResultFormData.testType.emissionStandard;
    testTypeMapped.smokeTestKLimitApplied = testResultFormData.testType.smokeTestKLimitApplied;
    testTypeMapped.fuelType = testResultFormData.testType.fuelType;
    if (!!testTypeMapped.modType) {
      testTypeMapped.modType.code = !!testResultFormData.testType.modType.length
        ? testResultFormData.testType.modType.split('-')[0].trim()
        : '';
      testTypeMapped.modType.description = !!testResultFormData.testType.modType.length
        ? testResultFormData.testType.modType.split('-')[1].trim()
        : '';
    }
    testTypeMapped.modificationTypeUsed = testResultFormData.testType.modificationTypeUsed;
    testTypeMapped.particulateTrapFitted = testResultFormData.testType.particulateTrapFitted;
    testTypeMapped.particulateTrapSerialNumber =
      testResultFormData.testType.particulateTrapSerialNumber;
    testTypeMapped.additionalNotesRecorded = testResultFormData.testType.additionalNotesRecorded;

    if (
      !testTypesApplicable.seatBeltApplicable.hasOwnProperty(testTypeMapped.testTypeId) &&
      !(testResultMapped.vehicleType === 'psv')
    ) {
      testTypeMapped.seatbeltInstallationCheckDate = undefined;
      testTypeMapped.numberOfSeatbeltsFitted = undefined;
      testTypeMapped.lastSeatbeltInstallationCheckDate = undefined;
    }

    if (
      !testTypesApplicable.emissionDetailsApplicable.hasOwnProperty(testTypeMapped.testTypeId) &&
      (!(testResultMapped.vehicleType === 'psv') ||
        !(testResultMapped.vehicleType.valueOf() === 'hgv'))
    ) {
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

    if (testTypesApplicable.defectsApplicable.hasOwnProperty(testTypeMapped.testTypeId)) {
      testTypeMapped.defects = undefined;
    }

    if (!testTypesApplicable.testSectionApplicable1.hasOwnProperty(testTypeMapped.testTypeId)) {
      testTypeMapped.certificateNumber = undefined;
      testTypeMapped.testExpiryDate = undefined;
      testTypeMapped.testAnniversaryDate = undefined;
    }

    if (!testTypesApplicable.testSectionApplicable2.hasOwnProperty(testTypeMapped.testTypeId)) {
      testTypeMapped.prohibitionIssued = undefined;
    }

    switch (true) {
      case !(testResultMapped.vehicleType === 'psv'):
        testResultMapped.vehicleSize = undefined;
        testResultMapped.numberOfSeats = undefined;
        break;
      case !(testResultMapped.vehicleType === 'psv') ||
        !(testResultMapped.vehicleType.valueOf() === 'hgv'):
        testResultMapped.vrm = undefined;
        testResultMapped.vehicleId = undefined;
        testResultMapped.odometerReading = undefined;
        testResultMapped.odometerReadingUnits = undefined;
        testResultMapped.regnDate = undefined;
        break;
      case !(testResultMapped.vehicleType === 'trl'):
        testResultMapped.trailerId = undefined;
        testResultMapped.firstUseDate = undefined;
        break;
    }

    testResultMapped.deletionFlag = undefined;
    testResultMapped.testHistory = undefined;

    testResultMapped.testTypes.forEach((tType) => {
      if (tType.testNumber === testTypeMapped.testNumber) {
        tType = testTypeMapped;
      }
    });

    return testResultMapped;
  }

  constructor() {}
}
