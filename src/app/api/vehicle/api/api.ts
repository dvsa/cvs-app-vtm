import { AddProvisionalTechRecordService } from './addProvisionalTechRecord.service';
import { ArchiveTechRecordStatusService } from './archiveTechRecordStatus.service';
import { GetTechRecordsService } from './getTechRecords.service';
import { PostTechRecordsService } from './postTechRecords.service';
import { UpdateTechRecordsService } from './updateTechRecords.service';

export * from './addProvisionalTechRecord.service';
export * from './archiveTechRecordStatus.service';
export * from './getTechRecords.service';
export * from './postTechRecords.service';
export * from './updateTechRecords.service';
export const APIS = [AddProvisionalTechRecordService, ArchiveTechRecordStatusService, GetTechRecordsService, PostTechRecordsService, UpdateTechRecordsService];
