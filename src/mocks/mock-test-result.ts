import { EUVehicleCategory } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/euVehicleCategoryPsv.enum.js';
// eslint-disable-next-line import/no-extraneous-dependencies
import { faker } from '@faker-js/faker';
import { TestResultStatus } from '@models/test-results/test-result-status.enum';
import { TestResultModel } from '@models/test-results/test-result.model';
import { TestStationType } from '@models/test-stations/test-station-type.enum';
import { OdometerReadingUnits } from '@models/test-types/odometer-unit.enum';
import { TestType, resultOfTestEnum } from '@models/test-types/test-type.model';
import * as Emissions from '../app/models/test-types/emissions.enum';
import { VehicleTypes } from '../app/models/vehicle-tech-record.model';
import { mockDefectList } from './mock-defects';

export const mockTestTypeList = (items = 1, data: Partial<TestType> = {}): TestType[] =>
  new Array(items).fill(0).map((_, i) => ({
    testTypeId: `${i + 1}`,
    testNumber: `TestNumber${String(i + 1).padStart(4, '0')}`,
    testCode: `Test${i}`,
    testTypeName: `Test Type Name ${i}`,
    testTypeStartTimestamp: faker.date.future(),
    testTypeEndTimestamp: faker.date.future(),
    testExpiryDate: faker.date.future(),
    certificateNumber: `CertNumber${String(i + 1).padStart(4, '0')}`,
    reasonForAbandoning: 'The vehicle was not submitted for test at the appointed time',
    additionalCommentsForAbandon: 'The vehicle was not submitted for test at the appointed time',
    testAnniversaryDate: faker.date.future(),
    prohibitionIssued: false,
    testResult: resultOfTestEnum.pass,
    seatbeltInstallationCheckDate: true,
    numberOfSeatbeltsFitted: 4,
    lastSeatbeltInstallationCheckDate: new Date().toISOString(),
    emissionStandard: Emissions.EmissionStandard.Euro3,
    smokeTestKLimitApplied: 'yes',
    fuelType: Emissions.FuelType.Diesel,
    modType: {
      code: Emissions.ModTypeCode.g,
      description: Emissions.ModeTypeDescription.Engine,
    },
    modificationTypeUsed: `modifications number ${Math.round(Math.random() * 1000).toString()}`,
    particulateTrapFitted: `particulate trap ${Math.round(Math.random() * 1000).toString()}`,
    particulateTrapSerialNumber: `ABC${Math.round(Math.random() * 1000).toString()}`,
    defects: mockDefectList(),
    additionalNotesRecorded: 'notes for the test record will be displayed here...',
    customDefects: [
      {
        referenceNumber: '90',
        defectName: 'defect',
        defectNotes: 'bad',
      },
    ],
    ...data,
  } as TestType));

export const mockTestResult = (i = 0, data: Partial<TestResultModel> = {}): TestResultModel => ({
  testResultId: `TestResultId${String(i + 1).padStart(4, '0')}`,
  systemNumber: 'SYS0001',
  vin: 'XMGDE02FS0H012345',
  vrm: 'KP02ABC',
  createdAt: new Date().toISOString(),
  testStartTimestamp: new Date().toISOString(),
  testTypes: [...mockTestTypeList(2)],
  trailerId: `C${String(i + 1).padStart(5, '0')}`,
  countryOfRegistration: 'gb',
  euVehicleCategory: EUVehicleCategory.M3,
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
  testStatus: TestResultStatus.SUBMITTED,
  vehicleType: VehicleTypes.PSV,
  testEndTimestamp: faker.date.past(),
  testerStaffId: faker.string.uuid(),
  testVersion: 'Current',
  createdByName: 'Jane Doe',
  testHistory: [],
  ...data,
});

export const mockTestResultArchived = (
  i = 0,
  testResultId = 'TestResultId0001',
  vehicleType: VehicleTypes = VehicleTypes.PSV,
  systemNumber = 'SYS0001',
) => {
  const date = new Date('2022-01-02');
  const createdAt = date.setDate(date.getDate() - (i + 1));
  return {
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
    euVehicleCategory: EUVehicleCategory.M3,
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
    testVersion: 'Archived',
    vehicleType,
  };
};

export const mockTestResultList = (items = 1, systemNumber = 'PSV') => {
  switch (systemNumber.substring(0, 3)) {
    case 'HGV':
      return new Array(items).fill(0).map((_, i) => mockTestResult(i, { vehicleType: VehicleTypes.HGV, systemNumber: 'PSV' }));
    case 'TRL':
      return new Array(items).fill(0).map((_, i) => mockTestResult(i, { vehicleType: VehicleTypes.TRL, systemNumber: 'PSV' }));
    default:
      return new Array(items).fill(0).map((_, i) => mockTestResult(i));
  }
};
