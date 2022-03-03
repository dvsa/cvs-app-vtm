import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

import { AdrComponent } from '@app/technical-record/adr/adr.component';
import { ValidationState, STATUS } from '../../adr-validation.mapper';
import { tap, takeUntil } from 'rxjs/operators';
import { BOOLEAN_RADIO_OPTIONS } from '@app/technical-record/technical-record.constants';

@Component({
  selector: 'vtm-memo-edit',
  templateUrl: './memo-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MemoEditComponent extends AdrComponent implements OnInit {
  adrForm: FormGroup;
  displayOptions;
  showMemoEdit = true;
  memoValidationState$: Observable<ValidationState>;

  @Input() hasMemosApplied: boolean;
  @Input() vehicleType: string;

  ngOnInit() {
    this.adrForm = super.setUp();
    this.displayOptions = BOOLEAN_RADIO_OPTIONS;
    this.memoValidationState$ = this.validationMapper.getCurrentState();

    this.adrForm.addControl('memosApply', this.fb.control(this.hasMemosApplied));
    this.handleFormChanges();

    if (this.vehicleType) {
      this.validationMapper.vehicleTypeSelected(this.vehicleType);
    }
  }

  unsorted(): number {
    return super.unsorted();
  }

  handleFormChanges() {
    this.memoValidationState$
      .pipe(
        tap(({ memoEdit }) => {
          if (memoEdit === STATUS.HIDDEN) {
            this.showMemoEdit = false;
            this.adrForm.get('memosApply').reset();
          } else {
            this.showMemoEdit = true;
          }

          this.detectChange.markForCheck();
        }),
        takeUntil(this.onDestroy$)
      )
      .subscribe();
  }
}
