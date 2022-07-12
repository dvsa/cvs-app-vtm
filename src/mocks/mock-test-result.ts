import { TestResultModel } from '@models/test-result.model';
import { TestType } from '@models/test-type.model';
import { createMock, createMockList } from 'ts-auto-mock';
import * as Emissions from '../app/models/emissions.enum';
import { EuVehicleCategory } from '../app/models/eu-vehicle-category.enum';
import { OdometerReadingUnits } from '../app/models/odometer-unit.enum';
import { TestStationType } from '../app/models/test-station-type.enum';
import { VehicleTypes } from '../app/models/vehicle-tech-record.model';
import { mockDefectList } from './mock-defects';

const mockTestTypeList = (numberOfItems: number = 1) =>
  createMockList<TestType>(numberOfItems, (i: number) => {
    const now = new Date();
    const nextYear = new Date().setFullYear(now.getFullYear());

    return createMock<TestType>({
      testTypeId: `${i + 1}`,
      testNumber: `TestNumber${String(i + 1).padStart(4, '0')}`,

      testCode: `Test${i}`,
      testTypeName: `Test Type Name ${i}`,

      testTypeStartTimestamp: now.toISOString(),
      testTypeEndTimestamp: new Date(now.setFullYear(now.getFullYear() + 1)).toISOString(),
      testExpiryDate: new Date(nextYear).toISOString(),

      certificateNumber: `CertNumber${String(i + 1).padStart(4, '0')}`,
      reasonForAbandoning: 'The vehicle was not submitted for test at the appointed time',
      additionalCommentsForAbandon: 'The vehicle was not submitted for test at the appointed time',
      testAnniversaryDate: new Date(now.setFullYear(now.getFullYear() - 1)).toISOString(),
      prohibitionIssued: false,
      testResult: 'pass',
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
      defects: mockDefectList(),

      additionalNotesRecorded: 'notes for the test record will be displayed here...'
    });
  });

export const mockTestResult = (i: number = 0, vehicleType: VehicleTypes = VehicleTypes.PSV, systemNumber: string = 'SYS0001') =>
  createMock<TestResultModel>({
    testResultId: `TestResultId${String(i + 1).padStart(4, '0')}`,

    systemNumber,
    vin: 'XMGDE02FS0H012345',
    vrm: 'KP02ABC',

    createdAt: new Date().toISOString(),
    testStartTimestamp: new Date().toISOString(),

    testTypes: [...mockTestTypeList(2)],

    trailerId: `C${String(i + 1).padStart(5, '0')}`,
    countryOfRegistration: 'gb',
    euVehicleCategory: EuVehicleCategory.M3,
    odometerReading: 100,
    odometerReadingUnits: OdometerReadingUnits.KILOMETRES,
    reasonForCreation: 'mock test result data',
    preparerName: 'Durrell Truck & Van Centre',
    preparerId: 'CM2254',

    testStationName: 'Abshire-Kub',
    testStationPNumber: 'P12346',
    testStationType: TestStationType.ATF,
    testerName: 'John Smith',
    testerEmailAddress: 'john.smith@dvsa.gov.uk',
    // additionalNotesRecorded: 'notes for the test record will be displayed here...',
    vehicleType,
    testVersion: 'Current',
    createdByName: 'Jane Doe',
    testHistory: [
      ...createMockList<TestResultModel>(5, (j) =>
        mockTestResultArchived(j, `TestResultId${String(i + 1).padStart(4, '0')}`, vehicleType, systemNumber)
      )
    ]
  });

export const mockTestResultArchived = (
  i: number = 0,
  testResultId: string = 'TestResultId0001',
  vehicleType: VehicleTypes = VehicleTypes.PSV,
  systemNumber: string = 'SYS0001'
) => {
  const date = new Date('2022-01-02');
  const createdAt = date.setDate(date.getDate() - (i + 1));
  return createMock<TestResultModel>({
    testResultId,
    createdAt: new Date(createdAt).toISOString(),
    systemNumber,
    vin: 'XMGDE02FS0H012345',
    vrm: 'KP02 ABC',
    testStartTimestamp: new Date().toISOString(),

    testTypes: [...mockTestTypeList(2)],
    createdByName: `Person ${i}`,
    trailerId: `C${String(i + 1).padStart(5, '0')}`,
    countryOfRegistration: 'gb',
    euVehicleCategory: EuVehicleCategory.M3,
    odometerReading: 100,
    odometerReadingUnits: OdometerReadingUnits.KILOMETRES,
    reasonForCreation: `reason ${i}`,
    preparerName: 'Durrell Truck & Van Centre',
    preparerId: 'CM2254',
    testStationName: 'Abshire-Kub',
    testStationPNumber: 'P12346',
    testStationType: TestStationType.ATF,
    testerName: `tester ${i}`,
    testerEmailAddress: 'john.smith@dvsa.gov.uk',
    additionalNotesRecorded: `achived test record ${i}`,
    testVersion: 'Archived',
    vehicleType
  });
};

export const mockTestResultList = (items: number = 1, systemNumber: string = 'PSV') => {
  switch (systemNumber.substring(0, 3)) {
    case 'HGV':
      return createMockList<TestResultModel>(items, (i) => mockTestResult(i, VehicleTypes.HGV, systemNumber));
    case 'TRL':
      return createMockList<TestResultModel>(items, (i) => mockTestResult(i, VehicleTypes.TRL, systemNumber));
    default:
      return createMockList<TestResultModel>(items, (i) => mockTestResult(i));
  }
};
