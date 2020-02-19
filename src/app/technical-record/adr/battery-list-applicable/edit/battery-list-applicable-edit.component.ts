import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { AdrComponent } from '@app/technical-record/adr/adr.component';
import { AdrDetails } from '@app/models/adr-details';
import { tap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'vtm-battery-list-applicable-edit',
  templateUrl: './battery-list-applicable-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BatteryListApplicableEditComponent extends AdrComponent implements OnInit {
  options;
  adrForm: FormGroup;

  @Input() adrDetails: AdrDetails;

  ngOnInit() {
    this.adrForm = super.setUp();
    this.options = super.radioOptions();

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
    this.adrForm
      .get('listStatementApplicable')
      .valueChanges.pipe(
        tap((value) => {
          const batteryListCtrl = this.adrForm.get('batteryListNumber') as FormControl;

          if (!value) {
            batteryListCtrl.reset();
            batteryListCtrl.clearValidators();
          } else {
            batteryListCtrl.setValidators([Validators.required]);
          }
        }),
        takeUntil(this.onDestroy$)
      )
      .subscribe();
  }

  unsorted(): number {
    return super.unsorted();
  }
}
