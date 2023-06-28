import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ReferenceDataAdminColumn } from '@models/reference-data.model';
import { Store, select } from '@ngrx/store';
import { ReferenceDataState, fetchReferenceDataByKeySearch, selectSearchReturn } from '@store/reference-data';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-reference-data-amend-history',
  templateUrl: './reference-data-amend-history.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReferenceDataAmendHistoryComponent implements OnInit {
  @Input() type: string = '';
  @Input() key: string = '';
  @Input() title: string = '';
  @Input() columns: ReferenceDataAdminColumn[] = [];

  pageStart?: number;
  pageEnd?: number;

  constructor(private cdr: ChangeDetectorRef, private store: Store<ReferenceDataState>) {}

  ngOnInit(): void {
    // load the audit history
    // @ts-ignore
    this.store.dispatch(fetchReferenceDataByKeySearch({ resourceType: this.type + '#AUDIT', resourceKey: decodeURIComponent(this.key) }));
  }

  get history$(): Observable<any[]> {
    // @ts-ignore
    return this.store.pipe(select(selectSearchReturn((this.type + '#AUDIT') as ReferenceDataResourceTypeAudit)));
  }

  get numberOfRecords$(): Observable<number> {
    return this.history$.pipe(map(items => items?.length ?? 0));
  }

  get paginatedItems$(): Observable<any[]> {
    return this.history$.pipe(map(items => items?.slice(this.pageStart, this.pageEnd) ?? []));
  }

  handlePaginationChange({ start, end }: { start: number; end: number }) {
    this.pageStart = start;
    this.pageEnd = end;
    this.cdr.detectChanges();
  }
}
