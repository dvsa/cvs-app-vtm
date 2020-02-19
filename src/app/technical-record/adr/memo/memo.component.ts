import { Component, ChangeDetectionStrategy, Input, OnChanges } from '@angular/core';

import { AdrDetails } from '@app/models/adr-details';
import { MEMOS } from '@app/app.enums';

@Component({
  selector: 'vtm-memo',
  templateUrl: './memo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MemoComponent implements OnChanges {
  isMemosApplied: boolean;

  @Input() edit: boolean;
  @Input() adrDetails: AdrDetails;

  constructor() {}

  ngOnChanges(): void {
    this.isMemosApplied = this.getMemoApplied(this.adrDetails.memosApply);
  }

  getMemoApplied(memosApply: string[]): boolean {
    if (memosApply) {
      return memosApply.some(
        (value) => MEMOS.MEMOSAPPLY_CODE === this.mapMemoApplyToCodes(value)
      );
    }
  }

  mapMemoApplyToCodes(value: string): string {
    if (value) {
      return value
        .toLowerCase()
        .trim()
        .replace(/ /gi, '');
    }
  }
}
