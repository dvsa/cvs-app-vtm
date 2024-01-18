import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import {
  CustomFormControl, FormNodeOption, FormNodeTypes, FormNodeWidth,
} from '@forms/services/dynamic-form.types';
import { UserService } from '@services/user-service/user-service';
import { ADRCertificateTypes } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/adrCertificateTypes.enum.js';
import { Subject, takeUntil, take } from 'rxjs';
import { Store } from '@ngrx/store';
import { State } from '@store/index';
import { generateADRCertificate, generateADRCertificateSuccess } from '@store/technical-records';
import { Actions, ofType } from '@ngrx/effects';

@Component({
  selector: 'app-adr-generate-certificate',
  templateUrl: './adr-generate-certificate.component.html',
  styleUrls: ['./adr-generate-certificate.component.scss'],
})
export class AdrGenerateCertificateComponent implements OnInit, OnDestroy {
  systemNumber?: string;
  createdTimestamp?: string;

  form = new FormGroup({
    certificateType: new CustomFormControl({
      name: 'certificateType', label: 'Select certificate type', type: FormNodeTypes.CONTROL,
    }, '', [Validators.required]),
  });

  private destroy$ = new Subject<void>();

  constructor(
    private actions$: Actions,
    private globalErrorService: GlobalErrorService,
    private route: ActivatedRoute,
    private router: Router,
    public userService: UserService,
    private store: Store<State>,
  ) {}

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.systemNumber = params['systemNumber'];
      this.createdTimestamp = params['createdTimestamp'];
    });
    this.actions$.pipe(ofType(generateADRCertificateSuccess), take(1)).subscribe(() => {
      this.navigateBack();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get width(): FormNodeWidth {
    return FormNodeWidth.L;
  }

  get certificateTypes(): Array<FormNodeOption<string>> {
    return [
      { label: 'New ADR Certificate', value: ADRCertificateTypes.PASS },
      { label: 'Replacement ADR Certificate', value: ADRCertificateTypes.REPLACEMENT },

    ];
  }

  navigateBack() {
    this.globalErrorService.clearErrors();
    void this.router.navigate(['..'], { relativeTo: this.route });
  }

  handleSubmit(): void {
    this.globalErrorService.clearErrors();
    if (!this.form.value.certificateType) {
      return this.globalErrorService.addError({ error: 'ADR Certificate Type is required', anchorLink: 'certificateType' });
    }
    this.store.dispatch(generateADRCertificate(
      {
        systemNumber: this.systemNumber ?? '', createdTimestamp: this.createdTimestamp ?? '', certificateType: this.form.value.certificateType,
      },
    ));
  }
}
