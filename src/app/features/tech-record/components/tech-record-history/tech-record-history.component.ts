import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { StatusCodes, V3TechRecordModel } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { getBySystemNumber, selectTechRecordHistory } from '@store/technical-records';
import { Observable, Subject, map } from 'rxjs';

@Component({
  selector: 'app-tech-record-history',
  templateUrl: './tech-record-history.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./tech-record-history.component.scss']
})
export class TechRecordHistoryComponent implements OnInit {
  @Input() currentTechRecord?: V3TechRecordModel;

  private destroy$ = new Subject<void>();

  pageStart?: number;
  pageEnd?: number;

  constructor(private cdr: ChangeDetectorRef, private store: Store) {}

  ngOnInit(): void {
    if (this.currentTechRecord) {
      this.store.dispatch(getBySystemNumber({ systemNumber: this.currentTechRecord?.systemNumber }));
    }
  }

  get techRecordHistory$() {
    return this.store.select(selectTechRecordHistory);
  }

  get techRecords$() {
    return this.techRecordHistory$?.pipe(map(records => records?.slice(this.pageStart, this.pageEnd) ?? []));
  }

  get numberOfRecords$(): Observable<number> {
    return this.techRecordHistory$?.pipe(map(records => records?.length ?? 0));
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
        return `/tech-records/${this.currentTechRecord?.systemNumber}/${techRecord.createdTimestamp}/provisional`;
      case StatusCodes.ARCHIVED:
        return `/tech-records/${this.currentTechRecord?.systemNumber}/${techRecord.createdTimestamp}/historic/`;
      default:
        return `/tech-records/${this.currentTechRecord?.systemNumber}/${techRecord.createdTimestamp}`;
    }
  }
}
