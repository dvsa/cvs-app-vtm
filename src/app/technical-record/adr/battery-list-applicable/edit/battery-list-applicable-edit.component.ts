import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

import { AdrComponent } from '@app/technical-record/adr/adr.component';
import { AdrDetails } from '@app/models/adr-details';
import { tap, takeUntil } from 'rxjs/operators';
import { ValidationState, STATUS } from '../../adr-validation.mapper';

@Component({
  selector: 'vtm-battery-list-applicable-edit',
  templateUrl: './battery-list-applicable-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BatteryListApplicableEditComponent extends AdrComponent implements OnInit {
  options;
  adrForm: FormGroup;
  showBatteryListSection = true;
  batterListValidationState$: Observable<ValidationState>;

  @Input() adrDetails: AdrDetails;

  ngOnInit() {
    this.adrForm = super.setUp();
    this.options = super.radioOptions();
    this.batterListValidationState$ = this.validationMapper.getVehicleTypeState();

    this.adrForm.addControl(
      'listStatementApplicable',
      this.fb.control(this.adrDetails.listStatementApplicable)
    );

    this.adrForm.addControl(
      'batteryListNumber',
      this.fb.control(this.adrDetails.batteryListNumber)
    );

    this.handleFormChanges();
  }

  handleFormChanges() {
    this.listStatementApplicableChanges();
    this.vehicleTypeChangesForBatteryList();
  }

  listStatementApplicableChanges() {
    this.adrForm
      .get('listStatementApplicable')
      .valueChanges.pipe(
        tap((value) => {
          const batteryListRefNum = this.adrForm.get('batteryListNumber') as FormControl;

          if (!value) {
            batteryListRefNum.reset();
            batteryListRefNum.clearValidators();
            batteryListRefNum.setErrors(null);
          } else {
            batteryListRefNum.setValidators([Validators.required]);
          }
        }),
        takeUntil(this.onDestroy$)
      )
      .subscribe();
  }

  vehicleTypeChangesForBatteryList() {
    this.batterListValidationState$
      .pipe(
        tap(({ batteryListApplicableEdit }) => {
          if (batteryListApplicableEdit === STATUS.HIDDEN) {
            this.showBatteryListSection = false;
            this.adrForm.get('listStatementApplicable').reset();
          } else {
            this.showBatteryListSection = true;
          }
          this.detectChange.markForCheck();
        }),
        takeUntil(this.onDestroy$)
      )
      .subscribe();
  }

  unsorted(): number {
    return super.unsorted();
  }
}
