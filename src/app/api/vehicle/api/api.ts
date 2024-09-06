


export * from './postTechRecords.service';
export * from './updateTechRecords.service';


import { PostTechRecordsService } from './postTechRecords.service';
import { UpdateTechRecordsService } from './updateTechRecords.service';
export const APIS = [   PostTechRecordsService, UpdateTechRecordsService];
