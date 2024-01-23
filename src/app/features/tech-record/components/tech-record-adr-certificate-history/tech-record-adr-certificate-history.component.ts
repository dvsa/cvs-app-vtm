import { Component, Input } from '@angular/core';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { ADRCertificateDetails } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/hgv/complete';
import {
  map, Observable, Subject, takeUntil,
} from 'rxjs';
import { RouterService } from '@services/router/router.service';

@Component({
  selector: 'app-tech-record-adr-certificate-history',
  templateUrl: './tech-record-adr-certificate-history.html',
  styleUrls: ['./tech-record-adr-certificate-history.scss'],
})
export class TechRecordAdrCertificateHistoryComponent {
  @Input() currentTechRecord?: TechRecordType<'hgv' | 'lgv' | 'trl'>;
  isEditing = false;
  private destroy$ = new Subject<void>();

  constructor(
    private routerService: RouterService,
  ) { }

  ngOnInit() {
    this.isEditing$.pipe(takeUntil(this.destroy$)).subscribe((editing) => {
      this.isEditing = editing;
    });
  }

  get isEditing$(): Observable<boolean> {
    return this.routerService.getRouteDataProperty$('isEditing').pipe(map((isEditing) => !!isEditing));
  }

  getAdrCertificateHistory(): ADRCertificateDetails[] {
    return this.currentTechRecord?.techRecord_adrPassCertificateDetails || [];
  }

  getFileName(certificate: ADRCertificateDetails) {
    return certificate.certificateId;
  }
  documentParams(certificate: ADRCertificateDetails): Map<string, string> {
    return new Map([['fileName', this.getFileName(certificate)]]);
  }

  isArchived(): boolean {
    return this.currentTechRecord?.techRecord_statusCode === 'archived';
  }

  showTable(): boolean {
    return !this.isEditing && this.getAdrCertificateHistory().length > 0 && !this.isArchived();
  }
}
