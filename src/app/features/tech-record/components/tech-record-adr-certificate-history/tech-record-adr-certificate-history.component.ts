import { Component, Input } from '@angular/core';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { ADRCertificateDetails } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/hgv/complete';
import { V3TechRecordModel } from '@models/vehicle-tech-record.model';

@Component({
  selector: 'app-tech-record-adr-certificate-history',
  templateUrl: './tech-record-adr-certificate-history.html',
  styleUrls: ['./tech-record-adr-certificate-history.scss'],
})
export class TechRecordAdrCertificateHistoryComponent {
  @Input() currentTechRecord?: V3TechRecordModel;

  getAdrCertificateHistory(): ADRCertificateDetails[] {
    const adrTechRecordType = this.currentTechRecord as TechRecordType<'hgv' | 'lgv' | 'trl'>;
    return adrTechRecordType.techRecord_adrPassCertificateDetails || [];
  }

  isAdrVehicleType() {
    return this.currentTechRecord?.techRecord_vehicleType === 'hgv'
      || this.currentTechRecord?.techRecord_vehicleType === 'lgv'
      || this.currentTechRecord?.techRecord_vehicleType === 'trl';
  }

  isArchived(): boolean {
    return this.currentTechRecord?.techRecord_statusCode === 'archived';
  }

  showTable(): boolean {
    return this.isAdrVehicleType() && this.getAdrCertificateHistory().length > 0 && !this.isArchived();
  }
}
