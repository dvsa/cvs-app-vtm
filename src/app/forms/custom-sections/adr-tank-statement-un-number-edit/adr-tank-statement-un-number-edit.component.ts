import { Component, OnInit, inject } from '@angular/core';
import { FormArray, Validators } from '@angular/forms';
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
    this.globalErrorService.errors$.pipe(skip(1), takeUntil(this.destroy$)).subscribe(() => this.onFormSubmitted());
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
    const control = new CustomFormControl(this.control.meta, value);
    control.addValidators(Validators.maxLength(1500));
    this.formArray.push(control);
  }

  removeControl(index: number) {
    if (this.formArray.length < 2) return;
    this.formArray.removeAt(index);
  }

  onFormChange(changes: (string | null)[] | null) {
    this.control?.patchValue(changes, { emitModelToViewChange: true });
  }

  onFormSubmitted() {
    this.submitted = true;
  }
}
