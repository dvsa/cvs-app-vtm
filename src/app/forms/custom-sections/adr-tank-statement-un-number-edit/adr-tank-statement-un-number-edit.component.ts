import {
  Component, OnDestroy, OnInit,
  inject,
} from '@angular/core';
import { FormArray, Validators } from '@angular/forms';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { CustomFormControl } from '@forms/services/dynamic-form.types';
import _ from 'lodash';
import {
  ReplaySubject,
  skip,
  takeUntil,
} from 'rxjs';
import { CustomFormControlComponent } from '../custom-form-control/custom-form-control.component';

@Component({
  selector: 'app-adr-tank-statement-un-number',
  templateUrl: './adr-tank-statement-un-number-edit.component.html',
  styleUrls: ['./adr-tank-statement-un-number-edit.component.scss'],
})
export class AdrTankStatementUnNumberEditComponent extends CustomFormControlComponent implements OnInit, OnDestroy {
  checked = false;
  submitted = false;
  destroy$ = new ReplaySubject<boolean>(1);
  formArray = new FormArray<CustomFormControl>([]);
  globalErrorService = inject(GlobalErrorService);

  ngOnInit() {
    this.formArray.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((changes) => this.onFormChange(changes));
    this.globalErrorService.errors$.pipe(skip(1), takeUntil(this.destroy$)).subscribe((errors) => this.onFormSubmitted(errors));
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  override ngAfterContentInit(): void {
    super.ngAfterContentInit();
    this.buildFormArray();

  }

  buildFormArray() {
    const value = this.form?.get(this.name)?.value;
    const values = Array.isArray(value) && value.length ? value : [''];
    values.forEach((unNumber: string) => this.addControl(unNumber));
  }

  canAddControl() {
    return !(this.formArray.length && !this.formArray.at(-1).value);
  }

  addControl(value: string | null = null) {
    if (!this.control) return;

    // Prevent adding new controls, whilst previous ones are empty
    if (!this.canAddControl()) {
      this.control.markAsTouched();
      this.formArray.markAllAsTouched();
      return;
    }

    const control = new CustomFormControl({ ...this.control.meta }, value);
    control.addValidators(Validators.maxLength(1500));

    // If this is a subsequent UN Number, then it is required, and must be filled in, or removed.
    if (this.formArray.length > 0) {
      const firstUnNumber = this.formArray.at(0);
      if (!firstUnNumber.hasValidator(Validators.required)) firstUnNumber.addValidators(Validators.required);
      control.addValidators(Validators.required);
      control.meta.validators = undefined;
    }

    this.formArray.push(control);
    this.updateControls();
  }

  removeControl(index: number) {
    if (this.formArray.length < 2) return;
    this.formArray.removeAt(index);
    this.updateControls();

    if (this.formArray.length === 1) {
      this.formArray.at(0).meta.customErrorMessage = undefined;
      this.formArray.at(0).removeValidators(Validators.required);
    }
  }

  updateControls() {
    this.formArray.controls.forEach((control, index) => {
      // Make all UN NUmbers labels reflect their position in form array
      control.meta.customId = `${this.control?.meta.name}_${index + 1}`;
      control.meta.customErrorMessage = control.invalid && control.hasError('maxlength')
        ? `UN number ${index + 1} must be less than or equal to 1500 characters`
        : `UN number ${index + 1} is required or remove UN number ${index + 1}`;
    });
  }

  onFormChange(changes: (string | null)[] | null) {
    this.control?.patchValue(changes, { emitModelToViewChange: true });
    this.updateControls();
  }

  onFormSubmitted(globalErrors: GlobalError[]) {
    this.submitted = true;

    // If ANY UN Numbers are invalid, loop through them and add to global errors, but avoid adding duplicates
    if (this.formArray.invalid) {
      const firstCtrl = this.formArray.at(0);
      const customErrorMessage = this.control?.meta.customErrorMessage;

      const formErrors = this.formArray.controls
        .filter((control) => control.invalid)
        .map((control) => ({ error: control.meta.customErrorMessage as string, anchorLink: control.meta.customId }));

      const allErrors = _.chain(globalErrors)
        .filter((error) => !(error.error === customErrorMessage && (firstCtrl.valid || !firstCtrl.hasError(customErrorMessage))))
        .concat(formErrors)
        .uniqBy((error) => error.error);

      if (!allErrors.isEqualWith(globalErrors).value()) {
        this.globalErrorService.setErrors(allErrors.value());
      }
    }
  }
}
