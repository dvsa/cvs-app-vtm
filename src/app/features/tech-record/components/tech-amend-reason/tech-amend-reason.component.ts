import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CustomFormControl, CustomFormGroup, FormNodeOption, FormNodeTypes } from '@forms/services/dynamic-form.types';

@Component({
  selector: 'app-tech-amend-reason',
  templateUrl: './tech-amend-reason.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TechAmendReasonComponent {
  private routes: Record<number, string> = { 1: 'correcting-an-error', 2: 'notifiable-alteration-needed' };

  reasons: Array<FormNodeOption<number>> = [
    { label: 'Correcting an error', value: 1, hint: 'Amend the current technical record' },
    { label: 'Notifiable alteration needed', value: 2, hint: 'Create a new provisional technical record' }
  ];

  form: CustomFormGroup;

  constructor(private router: Router, private route: ActivatedRoute) {
    this.form = new CustomFormGroup(
      { name: 'reasonForAmend', type: FormNodeTypes.GROUP },
      {
        reason: new CustomFormControl({ name: 'reason', type: FormNodeTypes.CONTROL }, 2, [Validators.required])
      }
    );
  }

  handleSubmit(): void {
    const reason: number = this.form.get('reason')?.value;

    if (this.form.valid && reason) {
      this.router.navigate([this.routes[reason]], { relativeTo: this.route });
    }
  }
}
