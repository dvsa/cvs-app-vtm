import { Component, OnInit, inject } from '@angular/core';
import { FormArray } from '@angular/forms';
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

  addControl() {
    if (!this.control) return;
    this.formArray.push(new CustomFormControl(this.control.meta));
  }

  ngOnInit() {
    this.formArray.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((changes) => {
      this.control?.patchValue(changes, { emitModelToViewChange: true });
    });

    this.globalErrorService.errors$.pipe(skip(1)).subscribe(() => {
      this.submitted = true;
    });
  }

  override ngAfterContentInit(): void {
    super.ngAfterContentInit();
    this.addControl();
  }
}
