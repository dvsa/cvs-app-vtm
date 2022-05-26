import { TestResultModel } from '@models/test-result.model';
import { TestType } from '@models/test-type.model';
import { createMock, createMockList } from 'ts-auto-mock';
import { CountryOfRegistration } from '../app/models/country-of-registration.enum';
import * as Emissions from '../app/models/emissions.enum';
import { EuVehicleCategory } from '../app/models/eu-vehicle-category.enum';
import { OdometerReadingUnits } from '../app/models/odometer-unit.enum';
import { TestStationType } from '../app/models/test-station-type.enum';
import { mockDefectList } from './mock-defects';

const mockTestTypeList = (numberOfItems: number = 1) =>
  createMockList<TestType>(numberOfItems, (i: number) => {
    const now = new Date();
    const nextYear = new Date().setFullYear(now.getFullYear());

    return createMock<TestType>({
      testNumber: `TestNumber${String(i + 1).padStart(4, '0')}`,

      testCode: `Test${i}`,
      testTypeName: `Test Type Name ${i}`,

      testTypeStartTimestamp: now.toISOString(),
      testTypeEndTimestamp: now.setFullYear(now.getFullYear() + 1),
      testExpiryDate: nextYear,

      certificateNumber: `CertNumber${String(i + 1).padStart(4, '0')}`,
      reasonForAbandoning: 'The vehicle was not submitted for test at the appointed time',
      additionalCommentsForAbandon: 'The vehicle was not submitted for test at the appointed time',
      testAnniversaryDate: now.setFullYear(now.getFullYear() - 1),
      prohibitionIssued: false,
      testResult: 'Pass',
      seatbeltInstallationCheckDate: true,
      numberOfSeatbeltsFitted: 4,
      lastSeatbeltInstallationCheckDate: new Date().toISOString(),

      emissionStandard: Emissions.EmissionStandard.Euro3,
      smokeTestKLimitApplied: 'yes',
      fuelType: Emissions.FuelType.Diesel,
      modType: {
        code: Emissions.ModTypeCode.g,
        description: Emissions.ModeTypeDescription.Engine
      },
      modificationTypeUsed: 'modifications number ' + Math.round(Math.random() * 1000).toString(),
      particulateTrapFitted: 'particulate trap ' + Math.round(Math.random() * 1000).toString(),
      particulateTrapSerialNumber: 'ABC' + Math.round(Math.random() * 1000).toString(),
      defects: mockDefectList()
    });
  });

export const mockTestResult = (i: number = 0) =>
  createMock<TestResultModel>({
    testResultId: `TestResultId${String(i + 1).padStart(4, '0')}`,

    systemNumber: 'SYS0001',
    vin: 'XMGDE02FS0H012345',
    vrm: 'KP02 ABC',

    createdAt: new Date().toISOString(),
    testStartTimestamp: new Date().toISOString(),

    testTypes: [...mockTestTypeList()],

    trailerId: `C${String(i + 1).padStart(5, '0')}`,
    countryOfRegistration: CountryOfRegistration.GreatBritainandNorthernIreland_GB,
    euVehicleCategory: EuVehicleCategory.M3,
    odometerReading: 100,
    odometerReadingUnits: OdometerReadingUnits.KILOMETERS,
    reasonForCreation: 'mock test result data',
    preparerName: 'Durrell Truck & Van Centre',
    preparerId: 'CM2254',

    testStationName: 'Abshire-Kub',
    testStationPNumber: 'P12346',
    testStationType: TestStationType.atf,
    testerName: 'John Smith',
    testerEmailAddress: 'john.smith@dvsa.gov.uk',
    additionalNotesRecorded: 'notes for the test record will be displayed here...',
    vehicleType: 'psv'
  });

export const mockTestResultList = (items: number = 1) => createMockList<TestResultModel>(items, (i) => mockTestResult(i));
