import {
  Component,
  ChangeDetectionStrategy,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';

import { TechRecord } from '@app/models/tech-record.model';
import { TechRecordHelperService } from '../tech-record-helper.service';

@Component({
  selector: 'vtm-record-status',
  templateUrl: './record-status.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecordStatusComponent implements OnChanges {
  @Input() activeRecord: TechRecord;
  @Input() editState: boolean;

  recordCompleteness: string;

  constructor(private techRecHelper: TechRecordHelperService) {}

  ngOnChanges(changes: SimpleChanges): void {
    const { activeRecord } = changes;

    if (activeRecord) {
      this.recordCompleteness = this.techRecHelper.getCompletenessInfoByKey(
        this.activeRecord.recordCompleteness
      );
    }
  }
}
