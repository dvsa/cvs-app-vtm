import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  SimpleChanges,
  EventEmitter,
  Output
} from '@angular/core';

import { VehicleTechRecordModel } from '@app/models/vehicle-tech-record.model';
import { TechRecord } from '@app/models/tech-record.model';

@Component({
  selector: 'vtm-tech-rec-history',
  templateUrl: './tech-rec-history.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TechRecHistoryComponent implements OnInit {
  @Input() vehicleRecord: VehicleTechRecordModel;
  @Input() focusedRecord: TechRecord;
  @Output() onViewRecord = new EventEmitter<TechRecord>();

  techRecords: TechRecord[];

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    const { focusedRecord, vehicleRecord } = changes;
    if (focusedRecord && vehicleRecord) {
      this.techRecords = this.vehicleRecord.techRecord;
    }
  }

  ngOnInit() {}

  hideLinkForSelectedRecord(current, active) {
    return !(
      current.statusCode === active.statusCode &&
      this.getDateNumber(current.createdAt) === this.getDateNumber(active.createdAt)
    );
  }

  getDateNumber(strDate: string) {
    return new Date(strDate).getTime();
  }

  onViewTechRecord(techRecord: TechRecord) {
    this.onViewRecord.emit(techRecord);
    this.scrollToTop();
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }
}
