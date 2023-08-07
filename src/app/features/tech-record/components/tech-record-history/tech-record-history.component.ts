import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { StatusCodes, TechRecordModel, V3TechRecordModel, VehicleTechRecordModel } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { getBySystemNumber, selectTechRecordHistory } from '@store/technical-records';
import { Observable, take } from 'rxjs';

@Component({
  selector: 'app-tech-record-history',
  templateUrl: './tech-record-history.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./tech-record-history.component.scss']
})
export class TechRecordHistoryComponent implements OnInit {
  @Input() currentTechRecord!: V3TechRecordModel;
  recordHistory$?: Observable<V3TechRecordModel[] | undefined>;
  recordHistory?: V3TechRecordModel[];

  pageStart?: number;
  pageEnd?: number;

  constructor(private cdr: ChangeDetectorRef, private techRecordService: TechnicalRecordService, private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(getBySystemNumber({ systemNumber: this.currentTechRecord.systemNumber }));
    this.recordHistory$ = this.store.select(selectTechRecordHistory);
    this.recordHistory$.subscribe(records => (this.recordHistory = records));
  }

  //TODO: implement a new way of getting tech records
  get techRecords() {
    return this.recordHistory?.slice(this.pageStart, this.pageEnd) ?? [];
  }

  get numberOfRecords(): number {
    return this.recordHistory?.length || 0;
  }

  convertToUnix(date: Date): number {
    return new Date(date).getTime();
  }

  handlePaginationChange({ start, end }: { start: number; end: number }) {
    this.pageStart = start;
    this.pageEnd = end;
    this.cdr.detectChanges();
  }

  trackByFn(i: number, tr: V3TechRecordModel) {
    return tr.techRecord_createdAt;
  }

  summaryLinkUrl(techRecord: V3TechRecordModel) {
    switch (techRecord.techRecord_statusCode) {
      case StatusCodes.PROVISIONAL:
        return `/tech-records/${this.currentTechRecord.systemNumber}/${techRecord.createdTimestamp}/provisional`;
      case StatusCodes.ARCHIVED:
        return `/tech-records/${this.currentTechRecord.systemNumber}/${techRecord.createdTimestamp}/historic/`;
      default:
        return `/tech-records/${this.currentTechRecord.systemNumber}/${techRecord.createdTimestamp}`;
    }
  }
}
