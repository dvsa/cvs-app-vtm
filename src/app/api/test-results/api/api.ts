
export * from './default.service';
export * from './getTestResults.service';
import { DefaultService } from './default.service';
import { GetTestResultsService } from './getTestResults.service';
export const APIS = [DefaultService, GetTestResultsService];
