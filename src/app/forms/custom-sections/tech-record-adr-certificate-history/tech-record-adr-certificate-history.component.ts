import {
  Component, inject, Input,
} from '@angular/core';
import {
  TechRecordType,
} from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { ADRCertificateDetails } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/hgv/complete';
import {
  map, Observable, Subject, takeUntil,
} from 'rxjs';
import { RouterService } from '@services/router/router.service';
import { FeatureToggleService } from '@services/feature-toggle-service/feature-toggle-service';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { AdrService } from '@services/adr/adr.service';
import { ViewportScroller } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Roles } from '@models/roles.enum';
import { CustomFormControlComponent } from '@forms/custom-sections/custom-form-control/custom-form-control.component';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'app-tech-record-adr-certificate-history',
  templateUrl: './tech-record-adr-certificate-history.html',
  styleUrls: ['./tech-record-adr-certificate-history.scss'],
})
export class TechRecordAdrCertificateHistoryComponent extends CustomFormControlComponent {
  @Input() currentTechRecord?: TechRecordType<'hgv' | 'lgv' | 'trl'>;
  isEditing = false;
  isADREnabled = false;
  private destroy$ = new Subject<void>();
  routerService = inject(RouterService);
  featureToggleService = inject(FeatureToggleService);
  globalErrorService = inject(GlobalErrorService);
  adrService = inject(AdrService);
  viewportScroller = inject(ViewportScroller);
  router = inject(Router);
  route = inject(ActivatedRoute);
  pageStart?: number;
  pageEnd?: number;

  ngOnInit() {
    this.isEditing$.pipe(takeUntil(this.destroy$)).subscribe((editing) => {
      this.isEditing = editing;
    });
    this.isADREnabled = this.featureToggleService.isFeatureEnabled('adrToggle');
  }

  get roles(): typeof Roles {
    return Roles;
  }

  get isEditing$(): Observable<boolean> {
    return this.routerService.getRouteDataProperty$('isEditing').pipe(map((isEditing) => !!isEditing));
  }

  get sortedCertificates(): ADRCertificateDetails[] | undefined {
    return cloneDeep(this.currentTechRecord?.techRecord_adrPassCertificateDetails)?.sort((a, b) =>
      a.generatedTimestamp && b.generatedTimestamp ? new Date(b.generatedTimestamp).getTime() - new Date(a.generatedTimestamp).getTime() : 0);
  }

  get adrCertificateHistory(): ADRCertificateDetails[] {
    return this.sortedCertificates?.slice(this.pageStart, this.pageEnd) || [];
  }

  trackByFn(i: number, tr: ADRCertificateDetails) {
    return tr.generatedTimestamp;
  }

  get numberOfADRCertificates(): number {
    return this.sortedCertificates?.length || 0;
  }

  getFileName(certificate: ADRCertificateDetails) {
    return certificate.certificateId;
  }
  documentParams(certificate: ADRCertificateDetails): Map<string, string> {
    return new Map([['fileName', this.getFileName(certificate)]]);
  }

  get isArchived(): boolean {
    return this.currentTechRecord?.techRecord_statusCode === 'archived';
  }

  showTable(): boolean {
    return this.isADREnabled && !this.isEditing && this.numberOfADRCertificates > 0 && !this.isArchived;
  }

  validateADRDetailsAndNavigate(): void {
    this.globalErrorService.clearErrors();
    if (this.currentTechRecord) {
      if (!this.adrService.carriesDangerousGoods(this.currentTechRecord)) {
        this.viewportScroller.scrollToPosition([0, 0]);
        this.globalErrorService.addError(
          { error: 'This vehicle is not able to carry dangerous goods, add ADR details to the technical record to generate a certificate.' },
        );
        return;
      }
    }

    void this.router.navigate(['adr-certificate'], { relativeTo: this.route });
  }

  handlePaginationChange({ start, end }: { start: number; end: number }) {
    this.pageStart = start;
    this.pageEnd = end;
    this.cdr.detectChanges();
  }
}
