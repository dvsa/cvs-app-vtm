import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import {
	ReferenceDataAdminColumn,
	ReferenceDataModelBase,
	ReferenceDataResourceType,
} from '@models/reference-data.model';
import { Store, select } from '@ngrx/store';
import { ReferenceDataState, fetchReferenceDataByKeySearch, selectSearchReturn } from '@store/reference-data';
import { Observable, map } from 'rxjs';

@Component({
	selector: 'app-reference-data-amend-history',
	templateUrl: './reference-data-amend-history.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReferenceDataAmendHistoryComponent implements OnInit {
	@Input() type = '';
	@Input() key = '';
	@Input() title = '';
	@Input() columns: ReferenceDataAdminColumn[] = [];

	pageStart?: number;
	pageEnd?: number;

	constructor(
		private cdr: ChangeDetectorRef,
		private store: Store<ReferenceDataState>
	) {}

	ngOnInit(): void {
		// load the audit history
		this.store.dispatch(
			fetchReferenceDataByKeySearch({
				resourceType: `${this.type}#AUDIT` as ReferenceDataResourceType,
				resourceKey: `${decodeURIComponent(this.key)}#`,
			})
		);
	}

	get history$(): Observable<ReferenceDataModelBase[] | undefined> {
		return this.store.pipe(select(selectSearchReturn(`${this.type}#AUDIT` as ReferenceDataResourceType)));
	}

	get numberOfRecords$(): Observable<number> {
		return this.history$.pipe(map((items) => items?.length ?? 0));
	}

	get paginatedItems$() {
		return this.history$.pipe(map((items) => items?.slice(this.pageStart, this.pageEnd) ?? []));
	}

	handlePaginationChange({ start, end }: { start: number; end: number }) {
		this.pageStart = start;
		this.pageEnd = end;
		this.cdr.detectChanges();
	}
}
