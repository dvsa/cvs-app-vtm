import { Component, OnInit, inject } from '@angular/core';
import { FormArray, Validators } from '@angular/forms';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { CustomFormControl } from '@forms/services/dynamic-form.types';
import {
  ReplaySubject, skip,
  takeUntil,
} from 'rxjs';
import { CustomFormControlComponent } from '../custom-form-control/custom-form-control.component';

@Component({
  selector: 'app-adr-tank-statement-un-number',
  templateUrl: './adr-tank-statement-un-number-edit.component.html',
  styleUrls: ['./adr-tank-statement-un-number-edit.component.scss'],
})
export class AdrTankStatementUnNumberEditComponent extends CustomFormControlComponent implements OnInit {
  checked = false;
  submitted = false;
  destroy$ = new ReplaySubject<boolean>(1);
  formArray = new FormArray<CustomFormControl>([]);
  globalErrorService = inject(GlobalErrorService);

  ngOnInit() {
    this.formArray.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((changes) => this.onFormChange(changes));
    this.globalErrorService.errors$.pipe(skip(1), takeUntil(this.destroy$)).subscribe((errors) => this.onFormSubmitted(errors));
  }

  override ngAfterContentInit(): void {
    super.ngAfterContentInit();
    if (this.form && this.control) {
      const value = this.form.get(this.name)?.value;
      const values = Array.isArray(value) && value.length ? value : [null];
      values.forEach((unNumber: string) => this.addControl(unNumber));
    }
  }

  canAddControl() {
    return !(this.formArray.length && !this.formArray.at(-1).value);
  }

  addControl(value = '') {
    if (!this.control) return;
    if (!this.canAddControl()) return;

    const num = this.formArray.length + 1;
    const control = new CustomFormControl({ ...this.control.meta, customId: `${this.control.meta.name}_${num}` }, value);
    control.addValidators(Validators.maxLength(1500));

    // If this is a subsequent UN Number, then it is required, and must be filled in, or removed.
    if (this.formArray.length > 0) {
      control.meta.validators = undefined;
      control.meta.customErrorMessage = `UN Number ${num} is required or remove UN Number ${num}`;
      control.addValidators(Validators.required);
    }

    this.formArray.push(control);
  }

  removeControl(index: number) {
    if (this.formArray.length < 2) return;
    this.formArray.removeAt(index);
  }

  onFormChange(changes: (string | null)[] | null) {
    this.control?.patchValue(changes, { emitModelToViewChange: true });
  }

  onFormSubmitted(errors: GlobalError[]) {
    this.submitted = true;

    // If the form has been submitted and any subsequent UN Numbers have been left empty, add to global errors
    if (this.formArray.length > 1 && this.formArray.at(-1).invalid) {
      const { meta } = this.formArray.at(-1);
      const errorMessage = meta.customErrorMessage as string;
      if (!errors.find((error) => error.error === errorMessage)) {
        this.globalErrorService.addError({ error: errorMessage, anchorLink: meta.customId });
      }
    }
  }
}
