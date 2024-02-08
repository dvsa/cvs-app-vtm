import {
  Component,
  inject,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ADRCertificateDetails } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/trl/complete';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { TechRecordGETHGV, TechRecordGETTRL } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb-vehicle-type';
import { CustomFormControlComponent } from '@forms/custom-sections/custom-form-control/custom-form-control.component';
import { Store } from '@ngrx/store';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { State } from '@store/index';
import { generateADRCertificate, generateContingencyADRCertificate } from '@store/technical-records';
import { Subject, take, takeUntil } from 'rxjs';

@Component({
  selector: 'app-adr-generate-cert-test',
  templateUrl: './adr-generate-cert-test.component.html',
  styleUrls: ['./adr-generate-cert-test.component.scss'],
})
export class AdrGenerateCertTestComponent extends CustomFormControlComponent {
  systemNumber?: string;
  createdTimestamp?: string;
  route = inject(ActivatedRoute);
  store = inject(Store<State>);
  techRecordService = inject(TechnicalRecordService);

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.techRecordService.techRecord$.pipe(takeUntil(this.destroy$)).subscribe((record) => {
      this.systemNumber = (record as TechRecordGETHGV).systemNumber;
      this.createdTimestamp = (record as TechRecordGETHGV).createdTimestamp;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get lastCertificateDate() {
    let sortedTests: ADRCertificateDetails[] | undefined;
    this.techRecordService.techRecord$.pipe(take(1)).subscribe((record) => {
      sortedTests = (record as TechRecordGETHGV | TechRecordGETTRL).techRecord_adrPassCertificateDetails?.sort((a, b) =>
        a.generatedTimestamp && b.generatedTimestamp ? new Date(b.generatedTimestamp).getTime() - new Date(a.generatedTimestamp).getTime() : 0);
    });
    return sortedTests
      ? `an ADR certificate was last generated on ${new Date(sortedTests[0].generatedTimestamp).toLocaleDateString('en-UK')}`
      : 'there are no previous ADR certificates for this vehicle';
  }

  handleSubmit(): void {
    if (this.store) {
      this.store.dispatch(generateContingencyADRCertificate(
        {
          systemNumber: this.systemNumber ?? '',
          createdTimestamp: this.createdTimestamp ?? '',
          certificateType: 'PASS',
        },
      ));
    }
  }
}
