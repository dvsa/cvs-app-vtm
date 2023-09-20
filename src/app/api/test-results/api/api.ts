import { ArchiveTestResultsService } from './archiveTestResults.service';
import { DefaultService } from './default.service';
import { GetTestResultsService } from './getTestResults.service';
import { UpdateTestResultsService } from './updateTestResults.service';

export * from './archiveTestResults.service';
export * from './default.service';
export * from './getTestResults.service';
export * from './updateTestResults.service';
export const APIS = [ArchiveTestResultsService, DefaultService, GetTestResultsService, UpdateTestResultsService];
