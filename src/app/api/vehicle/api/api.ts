export * from './addProvisionalTechRecord.service';
import { AddProvisionalTechRecordService } from './addProvisionalTechRecord.service';
export * from './archiveTechRecordStatus.service';
import { ArchiveTechRecordStatusService } from './archiveTechRecordStatus.service';
export * from './getTechRecords.service';
import { GetTechRecordsService } from './getTechRecords.service';
export * from './postTechRecords.service';
import { PostTechRecordsService } from './postTechRecords.service';
export * from './updateTechRecords.service';
import { UpdateTechRecordsService } from './updateTechRecords.service';
export const APIS = [AddProvisionalTechRecordService, ArchiveTechRecordStatusService, GetTechRecordsService, PostTechRecordsService, UpdateTechRecordsService];
