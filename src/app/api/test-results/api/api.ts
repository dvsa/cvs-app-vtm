export * from './archiveTestResults.service';
export * from './default.service';
export * from './getTestResults.service';
import { ArchiveTestResultsService } from './archiveTestResults.service';
import { DefaultService } from './default.service';
import { GetTestResultsService } from './getTestResults.service';
export const APIS = [ArchiveTestResultsService, DefaultService, GetTestResultsService];
