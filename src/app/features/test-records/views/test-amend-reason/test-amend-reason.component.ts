import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomFormControl, FormNodeOption, FormNodeTypes } from '@forms/services/dynamic-form.types';

@Component({
  selector: 'app-test-amend-reason',
  templateUrl: './test-amend-reason.component.html',
  styleUrls: ['./test-amend-reason.component.scss']
})
export class TestAmendReasonComponent {
  private routes: Record<number, string> = { 1: 'incorrect-test-type', 2: 'amend-test-details' };

  reasons: Array<FormNodeOption<number>> = [
    { label: 'The test type is incorrect', value: 1 },
    { label: 'The test details are incorrecnt', value: 2, hint: 'Change test location, assessor, test details, defects, and results.' }
  ];

  form = new FormGroup({
    reason: new CustomFormControl({ name: 'reason', type: FormNodeTypes.CONTROL }, 2, [Validators.required])
  });

  constructor(private router: Router, private route: ActivatedRoute) {}

  handleSubmit() {
    const reason: number = this.form.get('reason')?.value;

    if (this.form.valid && reason) {
      this.router.navigate([this.routes[reason]], { relativeTo: this.route });
    }
  }
}
