import { TechRecord } from './techRecord';
import { TechRecordArchiveAndProvisionalPayloadMsUserDetails } from './techRecordArchiveAndProvisionalPayloadMsUserDetails';

export interface TechRecordArchiveAndProvisionalPayload { 
    msUserDetails?: TechRecordArchiveAndProvisionalPayloadMsUserDetails;
    techRecord?: TechRecord;
}