import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { CustomFormControl, CustomFormGroup, FormNodeOption, FormNodeTypes } from '@forms/services/dynamic-form.types';


@Component({
  selector: 'app-tech-amend-reason',
  templateUrl: './tech-amend-reason.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TechAmendReasonComponent {
  reasons: Array<FormNodeOption<string>> = [
    { label: 'Correcting an error', value: 'correcting-an-error', hint: 'Amend the current technical record' },
    { label: 'Notifiable alteration needed', value: 'notifiable-alteration-needed', hint: 'Create a new provisional technical record' }
  ];

  form: CustomFormGroup;

  constructor(private errorService: GlobalErrorService, private route: ActivatedRoute, private router: Router) {
    this.errorService.clearErrors();

    this.form = new CustomFormGroup(
      { name: 'reasonForAmend', type: FormNodeTypes.GROUP },
      { reason: new CustomFormControl({ name: 'reason', type: FormNodeTypes.CONTROL }, 2, [Validators.required]) }
    );
  }









  handleSubmit(): void {
    const reason: string = this.form.get('reason')?.value;

    // TODO: historic technical records may not be valid
    if (this.form.valid && reason) {
      this.router.navigate([`../${reason}`], { relativeTo: this.route });
    }
  }
}
