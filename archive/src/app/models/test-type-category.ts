import { TestCode } from '@app/models/test-code';

export interface TestTypeCategory {
  id: string;
  linkedIds: string[];
  name: string;
  testTypeName: string;
  forVehicleType: string[];
  forVehicleSize: string[];
  forVehicleConfiguration: string[];
  forVehicleAxles: number[];
  forEuVehicleCategory: string[];
  forVehicleClass: string[];
  forVehicleSubclass: string[];
  forVehicleWheels: number[];
  testCodes?: TestCode[];
  nextTestTypesOrCategories?: TestTypeCategory[];
}
