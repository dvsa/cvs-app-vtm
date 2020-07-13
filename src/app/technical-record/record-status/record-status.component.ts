import {
  Component,
  ChangeDetectionStrategy,
  Input,
  OnChanges,
  SimpleChanges,
  EventEmitter,
  Output
} from '@angular/core';

import { TechRecord } from '@app/models/tech-record.model';
import { TechRecordHelperService } from '../tech-record-helper.service';
import { PANEL_TITLE } from '@app/app.enums';

@Component({
  selector: 'vtm-record-status',
  templateUrl: './record-status.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecordStatusComponent implements OnChanges {
  @Input() activeRecord: TechRecord;
  @Input() editState: boolean;
  @Output() scrollToSection = new EventEmitter<Object>();

  titleOfTechHistory: string = PANEL_TITLE.TECHNICAL_RECORD_HISTORY;
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

  emitPanelTitle() {
    this.scrollToSection.emit({ title: this.titleOfTechHistory });
  }
}
