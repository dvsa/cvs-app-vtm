import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { FormNodeOption, FormNodeWidth } from '@forms/services/dynamic-form.types';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-generate-batch-numbers',
  templateUrl: './generate-batch-numbers.component.html'
})
export class GenerateBatchNumbersComponent implements OnInit {
  form = new FormGroup({
    applicationId: new FormControl(null, [Validators.required]),
    generateNumber: new FormControl(null, [Validators.required])
  });

  options: FormNodeOption<boolean>[] = [
    { value: true, label: 'Yes' },
    { value: false, label: 'No' }
  ];

  constructor(private trs: TechnicalRecordService, private router: Router, private route: ActivatedRoute, private errorService: GlobalErrorService) {}

  ngOnInit() {
    this.trs.editableVehicleTechRecord$.pipe(take(1)).subscribe(vehicle => {
      if (!vehicle) {
        this.router.navigate(['..'], { relativeTo: this.route });
      }
    });
  }

  get width() {
    return FormNodeWidth;
  }

  continue() {
    if (this.form.invalid) {
      const errors: GlobalError[] = [];
      DynamicFormService.validate(this.form, errors);
      this.errorService.setErrors(errors);
      return;
    }

    this.errorService.clearErrors();

    this.trs.setApplicationId(this.form.get('applicationId')?.value);
    this.trs.setGenerateNumberFlag(this.form.get('generateNumber')?.value);
    this.router.navigate(['..', 'add-batch'], { relativeTo: this.route });
  }
}
