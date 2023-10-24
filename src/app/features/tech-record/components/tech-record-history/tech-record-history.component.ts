import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit,
} from '@angular/core';
import { TechRecordSearchSchema } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/search';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { V3TechRecordModel } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { getBySystemNumber, selectTechRecordHistory } from '@store/technical-records';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-tech-record-history',
  templateUrl: './tech-record-history.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./tech-record-history.component.scss'],
})
export class TechRecordHistoryComponent implements OnInit {
  @Input() currentTechRecord?: V3TechRecordModel;

  pageStart?: number;
  pageEnd?: number;

  constructor(private cdr: ChangeDetectorRef, private store: Store) {}

  ngOnInit(): void {
    if (this.currentTechRecord) {
      this.store.dispatch(getBySystemNumber({ systemNumber: (this.currentTechRecord as TechRecordType<'get'>)?.systemNumber }));
    }
  }

  get techRecordHistory$() {
    return this.store.select(selectTechRecordHistory);
  }

  get techRecordHistoryPage$(): Observable<TechRecordSearchSchema[]> {
    return this.techRecordHistory$?.pipe(map((records) => records?.slice(this.pageStart, this.pageEnd) ?? []));
  }

  get numberOfRecords$(): Observable<number> {
    return this.techRecordHistory$?.pipe(map((records) => records?.length ?? 0));
  }

  convertToUnix(date: Date): number {
    return new Date(date).getTime();
  }

  handlePaginationChange({ start, end }: { start: number; end: number }) {
    this.pageStart = start;
    this.pageEnd = end;
    this.cdr.detectChanges();
  }

  trackByFn(i: number, tr: TechRecordSearchSchema) {
    return tr.createdTimestamp;
  }

  summaryLinkUrl(searchResult: TechRecordSearchSchema) {
    return `/tech-records/${searchResult.systemNumber}/${searchResult.createdTimestamp}`;
  }

  get currentTimeStamp() {
    return (this.currentTechRecord as TechRecordType<'get'>).createdTimestamp;
  }
}
