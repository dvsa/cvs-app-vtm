

export * from './getTechRecords.service';
export * from './postTechRecords.service';
export * from './updateTechRecords.service';

import { GetTechRecordsService } from './getTechRecords.service';
import { PostTechRecordsService } from './postTechRecords.service';
import { UpdateTechRecordsService } from './updateTechRecords.service';
export const APIS = [  GetTechRecordsService, PostTechRecordsService, UpdateTechRecordsService];
