import { Component, OnInit, inject } from '@angular/core';
import { FormArray, Validators } from '@angular/forms';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { CustomFormControl } from '@forms/services/dynamic-form.types';
import { ReplaySubject, skip, takeUntil } from 'rxjs';
import { CustomFormControlComponent } from '../custom-form-control/custom-form-control.component';

@Component({
  selector: 'app-adr-tank-statement-un-number',
  templateUrl: './adr-tank-statement-un-number.component.html',
  styleUrls: ['./adr-tank-statement-un-number.component.scss'],
})
export class AdrTankStatementUnNumberComponent extends CustomFormControlComponent implements OnInit {
  submitted = false;
  destroy$ = new ReplaySubject<boolean>(1);
  formArray = new FormArray<CustomFormControl>([]);
  globalErrorService = inject(GlobalErrorService);

  ngOnInit() {
    this.formArray.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((changes) => this.onFormChange(changes));
    this.globalErrorService.errors$.pipe(skip(1)).subscribe(() => this.onFormSubmitted());
  }

  override ngAfterContentInit(): void {
    super.ngAfterContentInit();
    const { form, control } = this;

    if (!form) return;
    if (!control) return;

    const value = form.get(this.name)?.value;
    const values = Array.isArray(value) && value.length ? value : [null];
    values.forEach((unNumber: string) => this.addControl(unNumber));
  }

  addControl(value = '') {
    if (!this.control) return;
    const control = new CustomFormControl(this.control.meta, value);
    control.addValidators(Validators.maxLength(1500));
    this.formArray.push(control);
  }

  onFormChange(changes: (string | null)[] | null) {
    this.control?.patchValue(changes, { emitModelToViewChange: true });
  }

  onFormSubmitted() {
    this.submitted = true;
  }
}
