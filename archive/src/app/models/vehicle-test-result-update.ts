import { UserDetails } from '@app/models/user-details';
import { TestResultModel } from '@app/models/test-result.model';

export interface VehicleTestResultUpdate {
  testResult: TestResultModel;
  msUserDetails: UserDetails;
}
