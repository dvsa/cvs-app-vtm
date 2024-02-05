import { ChangeDetectorRef, Component, Inject, Injector } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { CustomFormControlComponent } from '@forms/custom-sections/custom-form-control/custom-form-control.component';
import { Store } from '@ngrx/store';
import { State } from '@store/index';
import { generateADRCertificate } from '@store/technical-records';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-adr-generate-cert-test',
  templateUrl: './adr-generate-cert-test.component.html',
  styleUrls: ['./adr-generate-cert-test.component.scss'],
})
export class AdrGenerateCertTestComponent extends CustomFormControlComponent {
  systemNumber?: string;
  createdTimestamp?: string;
  private globalErrorService = Inject(GlobalErrorService);
  private route = Inject(ActivatedRoute);
  private store = Inject(Store<State>);

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params: { [x: string]: string | undefined; }) => {
      this.systemNumber = params['systemNumber'];
      this.createdTimestamp = params['createdTimestamp'];
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  handleSubmit(): void {
    this.globalErrorService.clearErrors();

    this.store.dispatch(generateADRCertificate(
      {
        systemNumber: this.systemNumber ?? '',
        createdTimestamp: this.createdTimestamp ?? '',
        certificateType: 'PASS',
      },
    ));
  }
}
