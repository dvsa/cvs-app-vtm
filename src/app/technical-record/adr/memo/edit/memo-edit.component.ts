import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

import { AdrComponent } from '@app/technical-record/adr/adr.component';
import { ValidationState, STATUS } from '../../adr-validation.mapper';
import { tap, takeUntil } from 'rxjs/operators';

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

  ngOnInit() {
    this.adrForm = super.setUp();
    this.displayOptions = super.radioOptions();
    this.memoValidationState$ = this.validationMapper.getVehicleTypeState();

    this.adrForm.addControl('memosApply', this.fb.control(this.hasMemosApplied));
    this.handleFormChanges();
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
