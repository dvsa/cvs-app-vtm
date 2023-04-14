import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { FormNodeOption } from '@forms/services/dynamic-form.types';
import { Roles } from '@models/roles.enum';
import { setSpinnerState } from '@store/spinner/actions/spinner.actions';

@Component({
  selector: 'app-reference-data',
  templateUrl: './reference-data.component.html'
})
export class ReferenceDataComponent {
  store: any;
  constructor(public globalErrorService: GlobalErrorService, private route: ActivatedRoute, private router: Router) {}
  references: Array<FormNodeOption<string>> = [{ label: 'Country of registration', value: 'Country' }];

  public get roles() {
    return Roles;
  }

  async handleSubmit() {
    this.router.navigate(['../reference-data/data-type-list'], { relativeTo: this.route });
  }

  cancel() {
    this.globalErrorService.clearErrors();
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
