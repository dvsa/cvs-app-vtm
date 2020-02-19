import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { AdrComponent } from '@app/technical-record/adr/adr.component';

@Component({
  selector: 'vtm-memo-edit',
  templateUrl: './memo-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MemoEditComponent extends AdrComponent implements OnInit {
  adrForm: FormGroup;
  displayOptions;

  @Input() hasMemosApplied: boolean;

  ngOnInit() {
    this.adrForm = super.setUp();
    this.displayOptions = super.radioOptions();

    this.adrForm.addControl('memosApply', this.fb.control(this.hasMemosApplied));
  }

  unsorted(): number {
    return super.unsorted();
  }
}
