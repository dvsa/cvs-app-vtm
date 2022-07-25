import { TestStationType } from "./test-station-type.enum";

export interface TestStation {
  testStationId: string;
  testStationAccessNotes?: string;
  testStationAddress: string;
  testStationContactNumber: number;
  testStationEmails: string[];
  testStationGeneralNotes: string;
  testStationLatitude?: number;
  testStationLongitude?: number;
  testStationName: string;
  testStationPNumber: string;
  testStationPostcode: string;
  testStationStatus: TestStationStatuses;
  testStationTown: string;
  testStationType: TestStationType;
}

export enum TestStationStatuses {
  active = 'active',
  inactive = 'inactive',
  pending = 'pending'
}
