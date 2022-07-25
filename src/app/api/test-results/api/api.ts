export * from './archiveTestResults.service';
import { ArchiveTestResultsService } from './archiveTestResults.service';
export * from './default.service';
import { DefaultService } from './default.service';
export * from './getTestResults.service';
import { GetTestResultsService } from './getTestResults.service';
export * from './updateTestResults.service';
import { UpdateTestResultsService } from './updateTestResults.service';
export const APIS = [ArchiveTestResultsService, DefaultService, GetTestResultsService, UpdateTestResultsService];
